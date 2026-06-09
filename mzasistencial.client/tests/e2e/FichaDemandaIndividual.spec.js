import { test, expect } from '@playwright/test';

// Utilidad para mockear la respuesta de la demanda
const mockDemanda = async (page, customData = {}) => {
  if (customData.authMock) {
    await page.addInitScript((auth) => {
      const payload = btoa(JSON.stringify({ exp: Date.now() / 1000 + 3600 }));
      const token = `fake.${payload}.sig`;
      localStorage.setItem('UsuarioActual', JSON.stringify({ token, usuarioId: 1, ...auth }));
    }, customData.authMock);
  }

  await page.route('**/api/ListaDemandas/*', async route => {
    const defaultData = {
      demandaId: 100,
      tipoId: 2, // 2 = Individual
      estadoId: 1, // Pendiente de Respuesta
      estado: 'Pendiente de Respuesta',
      fechaSolicitud: new Date().toISOString(),
      mutuaId: 100,
      subSolicitudes: [],
      authMock: { perfilId: 1, mutuaId: 100 } // Por defecto perfil admin
    };
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ...defaultData, ...customData })
    });
  });
};

test.describe('Ficha Gestión Demanda Individual - Plan de Pruebas', () => {

  test.beforeEach(async ({ page }) => {
    // Inject fake token to bypass PrivateRoute
    await page.addInitScript(() => {
      const payload = btoa(JSON.stringify({ exp: Date.now() / 1000 + 3600 }));
      const token = `fake.${payload}.sig`;
      localStorage.setItem('UsuarioActual', JSON.stringify({ token, usuarioId: 1, perfilId: 1 }));
    });
  });

  test('PR-01 — Nueva demanda queda en Pendiente', async ({ page }) => {
    await mockDemanda(page, { estadoId: 1, estado: 'Pendiente de Respuesta' });
    await page.goto('/admin/OfertaDemanda/GestionDemanda/ficha/100'); 
    
    // Verificar estado
    await expect(page.locator('input[value="Pendiente de Respuesta"]')).toBeVisible();
    
    // Botones visibles: Imprimir, Salir, (Anular por ser admin). Aceptar solo si hay oferta. Adjuntar.
    await expect(page.getByRole('button', { name: /Imprimir Ficha/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Salir/i })).toBeVisible();
    
    // Rechazar Citación NO aparece todavía
    await expect(page.getByRole('button', { name: /Rechazar cita/i })).toBeHidden();
  });

  test('PR-02 — Desierta por tiempo', async ({ page }) => {
    await mockDemanda(page, { estadoId: 8, estado: 'Desierta' });
    await page.goto('/admin/OfertaDemanda/GestionDemanda/ficha/100');

    await expect(page.locator('input[value="Desierta"]')).toBeVisible();
    await expect(page.getByRole('button', { name: /Rechazar cita/i })).toBeHidden();
    await expect(page.getByRole('button', { name: /Confirmar Cita/i })).toBeHidden();
  });

  test('PR-03 — Caducada por tiempo', async ({ page }) => {
    await mockDemanda(page, { estadoId: 7, estado: 'Caducada' });
    await page.goto('/admin/OfertaDemanda/GestionDemanda/ficha/100');

    await expect(page.locator('input[value="Caducada"]')).toBeVisible();
    await expect(page.getByRole('button', { name: /Rechazar cita/i })).toBeHidden();
    await expect(page.getByRole('button', { name: /Anular/i })).toBeHidden(); // Estado final
  });

  test('PR-04, PR-05, PR-06 — Flujo de aceptación', async ({ page }) => {
    await mockDemanda(page, { 
      estadoId: 1, 
      subSolicitudes: [
        { subSolId: 1, estadoId: 2, mutuaOfertante: 'Mutua A' }, // Con oferta
        { subSolId: 2, estadoId: 1, mutuaOfertante: 'Mutua B' }  // Sin oferta
      ] 
    });
    await page.goto('/admin/OfertaDemanda/GestionDemanda/ficha/100');

    // PR-05: Intentar aceptar sin seleccionar
    const btnConfirmar = page.getByRole('button', { name: /Confirmar Cita/i });
    await expect(btnConfirmar).toBeDisabled();

    // PR-06: Intentar aceptar una subsolicitud sin oferta (estado 1)
    // Nuestro código oculta el radio button para estadoId=1 (PR-26), por lo que solo hay 1 radio (nth 0).
    await expect(page.locator('input[type="radio"]')).toHaveCount(1);
    
    // PR-04: Aceptar una con oferta
    await page.locator('input[type="radio"]').nth(0).check();
    await expect(btnConfirmar).toBeEnabled();
  });

  test('PR-07 — Pre-selección automática de la subsolicitud confirmada', async ({ page }) => {
    await mockDemanda(page, { 
      estadoId: 3, 
      estado: 'Concesión Confirmada',
      subSolicitudes: [
        { subSolId: 1, estadoId: 3, mutuaOfertante: 'Mutua A' }
      ] 
    });
    await page.goto('/admin/OfertaDemanda/GestionDemanda/ficha/100');

    // Debe estar seleccionada y el botón Aceptar no debe estar
    await expect(page.locator('input[type="radio"]').first()).toBeChecked();
    await expect(page.getByRole('button', { name: /Confirmar Cita/i })).toBeHidden();
  });

  test('PR-10, PR-11 — Rechazar cita', async ({ page }) => {
    // PR-10
    await mockDemanda(page, { estadoId: 3, estado: 'Concesión Confirmada' });
    await page.goto('/admin/OfertaDemanda/GestionDemanda/ficha/100');
    await expect(page.getByRole('button', { name: /Rechazar cita/i })).toBeVisible();

    // PR-11
    await mockDemanda(page, { estadoId: 5, estado: 'Consumida' });
    await page.goto('/admin/OfertaDemanda/GestionDemanda/ficha/100');
    await expect(page.getByRole('button', { name: /Rechazar cita/i })).toBeHidden();
  });

  test('PR-13 a PR-16 — Flujo de anulación según perfil', async ({ page }) => {
    // PR-13 Admin ve Anular
    await mockDemanda(page, { estadoId: 1, authMock: { perfilId: 1 } });
    await page.goto('/admin/OfertaDemanda/GestionDemanda/ficha/100');
    await expect(page.getByRole('button', { name: /Anular/i })).toBeVisible();

    // PR-14 Mutua (perfil 2) ve anular en propia demanda estado 1
    await mockDemanda(page, { estadoId: 1, mutuaId: 200, authMock: { perfilId: 2, mutuaId: 200 } });
    await page.goto('/admin/OfertaDemanda/GestionDemanda/ficha/100');
    await expect(page.getByRole('button', { name: /Anular/i })).toBeVisible();

    // PR-15 Mutua no ve anular en demanda ajena
    await mockDemanda(page, { estadoId: 1, mutuaId: 300, authMock: { perfilId: 2, mutuaId: 200 } });
    await page.goto('/admin/OfertaDemanda/GestionDemanda/ficha/100');
    await expect(page.getByRole('button', { name: /Anular/i })).toBeHidden();

    // PR-16 Perfil 3 no ve anular
    await mockDemanda(page, { estadoId: 1, authMock: { perfilId: 3 } });
    await page.goto('/admin/OfertaDemanda/GestionDemanda/ficha/100');
    await expect(page.getByRole('button', { name: /Anular/i })).toBeHidden();
  });


  test('PR-12 — Rechazar sin introducir motivo', async ({ page }) => {
    await mockDemanda(page, { estadoId: 3 });
    await page.goto('/admin/OfertaDemanda/GestionDemanda/ficha/100');
    
    await page.getByRole('button', { name: /Rechazar cita/i }).click();
    
    // Dejar motivo vacío y confirmar
    await page.getByRole('button', { name: /Confirmar Rechazo/i }).click();
    
    // El modal no se cierra y muestra alerta
    await expect(page.getByText('El motivo es obligatorio')).toBeVisible();
  });

  test('PR-17, PR-18 — Adjuntar documentos (Validaciones UI)', async ({ page }) => {
    await mockDemanda(page, { estadoId: 1 });
    await page.goto('/admin/OfertaDemanda/GestionDemanda/ficha/100');
    
    await page.getByRole('button', { name: /Adjuntar/i }).click();

    // Crear archivo falso .txt usando setInputFiles (Playwright API)
    await page.locator('input[type="file"]').setInputFiles({
      name: 'documento.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('hello')
    });
    
    // Verifica validación (DevExtreme toast message)
    await expect(page.locator('.dx-toast-message').filter({ hasText: 'El tipo de archivo no está permitido' })).toBeVisible();

    // Crear PDF válido
    await page.locator('input[type="file"]').setInputFiles({
      name: 'valido.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('pdfcontent')
    });
    
    // Mock de carga
    await page.route('**/api/ListaDemandas/100/documentos', async route => {
      await route.fulfill({ status: 200, body: '{}' });
    });

    await page.getByRole('button', { name: /Guardar/i }).click();
    await expect(page.getByText('Documento adjuntado correctamente')).toBeVisible();
  });

  test('PR-24 — Visualización condicional Motivo Rechazo', async ({ page }) => {
    // Activa
    await mockDemanda(page, { estadoId: 1 });
    await page.goto('/admin/OfertaDemanda/GestionDemanda/ficha/100');
    await expect(page.getByText('Motivo Rechazo', { exact: true })).toBeHidden();

    // Rechazada
    await mockDemanda(page, { estadoId: 6, motivoRechazo: 'Motivo de prueba XYZ' });
    await page.goto('/admin/OfertaDemanda/GestionDemanda/ficha/100');
    
    const inputRechazo = page.locator('.ficha-field').filter({ hasText: 'Motivo Rechazo' }).locator('input');
    await expect(inputRechazo).toHaveValue('Motivo de prueba XYZ');
  });

  test('PR-25, PR-26 — Visualización del grid', async ({ page }) => {
    // Ficha Anual (TipoId=1)
    await mockDemanda(page, { tipoId: 1 });
    await page.goto('/admin/OfertaDemanda/GestionDemanda/ficha/100');
    await expect(page.getByText('Subsolicitudes')).toBeHidden();

    // Ficha Individual (TipoId=2) -> Radio button no aparece si estadoId=1 (PR-26)
    await mockDemanda(page, { 
      tipoId: 2, 
      subSolicitudes: [{ subSolId: 1, estadoId: 1, mutuaOfertante: 'TestMutua' }] 
    });
    await page.goto('/admin/OfertaDemanda/GestionDemanda/ficha/100');
    await expect(page.getByText('Subsolicitudes')).toBeVisible();
    await expect(page.locator('input[type="radio"]')).toBeHidden();
  });

  test('PR-27 — Botón Salir actualiza FechaRevision', async ({ page }) => {
    let updateRevisionCalled = false;
    await page.route('**/api/ListaDemandas/100/revision', async route => {
      updateRevisionCalled = true;
      await route.fulfill({ status: 200, body: '{}' });
    });

    await mockDemanda(page, { estadoId: 1 });
    await page.goto('/admin/OfertaDemanda/GestionDemanda/ficha/100');
    
    await page.getByRole('button', { name: /Salir/i }).click();
    
    // Verify route navigation or API call happened
    expect(updateRevisionCalled).toBe(true);
  });
});
