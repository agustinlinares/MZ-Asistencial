import { test, expect } from '@playwright/test';

// Utilidad para mockear la respuesta de las citaciones recibidas (grid)
const mockGridCitaciones = async (page, citacionesArray = []) => {
  await page.route('**/api/citaciones/recibidas/*', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: citacionesArray, totalCount: citacionesArray.length })
    });
  });
};

const mockCitacionData = (customData = {}) => ({
  CitacionId: 100,
  DemandaId: 50,
  MutuaSolicitante: 'Mutua Solicitante Test',
  MutuaOfertante: 'Mutua Ofertante Test',
  Especialidad: 'Cardiologia',
  Servicio: 'Consulta',
  EstadoId: 1,
  Estado: 'Pendiente de Respuesta',
  FechaAltaSolicitud: new Date().toISOString(),
  Necesidad: 'Prueba E2E',
  Ene: 0, Feb: 0, Mar: 0, Abr: 0, May: 0, Jun: 0, Jul: 0, Ago: 0, Sep: 0, Oct: 0, Nov: 0, Diciembre: 0,
  ...customData
});

test.describe('Ficha Gestión Reserva (Citaciones) - Plan de Pruebas', () => {

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    // Inject fake token
    await page.addInitScript(() => {
      const payload = btoa(JSON.stringify({ exp: Date.now() / 1000 + 3600 }));
      const token = `fake.${payload}.sig`;
      localStorage.setItem('UsuarioActual', JSON.stringify({ token, usuarioId: 1, perfilId: 1, mutuaId: 100 }));
    });
    // Mock documentos e historial por defecto
    await page.route('**/documentos', route => route.fulfill({ status: 200, body: '[]' }));
    await page.route('**/historial', route => route.fulfill({ status: 200, body: '[]' }));
  });

  const abrirFicha = async (page, citacion) => {
    await mockGridCitaciones(page, [citacion]);
    await page.goto('/admin/GestionReserva/ConcederCitacion');
    // Esperar a que el grid haya renderizado la fila
    await expect(page.locator('.dx-data-row').first()).toContainText(citacion.MutuaSolicitante);
    
    // El dblclick de Playwright suele fallar en DevExtreme si hay scroll porque los headers fijos interceptan el ratón.
    // Al forzar el contenedor a scrollear o clickando con cuidado, lo evitamos.
    // También usamos dblclick() de playwright normal porque dispatchEvent nativo no lo pilla DevExtreme.
    const celda = page.locator('.dx-data-row').first().locator('td[aria-colindex="3"]');
    await celda.scrollIntoViewIfNeeded();
    await celda.dblclick();

    // Esperar a que la ficha se abra
    await expect(page.locator('.ficha-modal-title')).toBeVisible();
  };

  test('PR-CI-01 — Nueva citación queda en Pendiente de Respuesta', async ({ page }) => {
    await abrirFicha(page, mockCitacionData({ EstadoId: 1, Estado: 'Pendiente de Respuesta' }));
    
    await expect(page.getByRole('button', { name: /Imprimir Ficha/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Salir/i })).toBeVisible();
    
    // Rechazar Citación NO aparece en Pendiente
    await expect(page.getByRole('button', { name: /Rechazar cita/i })).toBeHidden();
  });

  test('PR-CI-02 — Pasa a Desierta tras 96 horas sin respuesta', async ({ page }) => {
    await abrirFicha(page, mockCitacionData({ EstadoId: 4, Estado: 'Desierta' }));
    await expect(page.getByRole('button', { name: /Rechazar cita/i })).toBeHidden();
    await expect(page.getByRole('button', { name: /Guardar/i })).toBeHidden();
  });

  test('PR-CI-03 — Pasa a Caducada tras más de 1 mes', async ({ page }) => {
    await abrirFicha(page, mockCitacionData({ EstadoId: 7, Estado: 'Caducadas' }));
    await expect(page.getByRole('button', { name: /Rechazar cita/i })).toBeHidden();
    await expect(page.getByRole('button', { name: /Guardar/i })).toBeHidden();
  });

  test('PR-CI-04 y PR-CI-05 — Flujo de aceptación', async ({ page }) => {
    // PR-CI-04
    await abrirFicha(page, mockCitacionData({ EstadoId: 1, Estado: 'Pendiente de Respuesta' }));
    
    // Simular elegir 'Sí' en Conceder y pulsar Guardar
    await page.getByText('Sí', { exact: true }).click();

    let updateCalled = false;
    await page.route('**/api/citaciones/100/estado*', async route => {
      updateCalled = true;
      await route.fulfill({ status: 200, body: 'true' });
    });

    await page.getByRole('button', { name: /Guardar/i }).click();
    expect(updateCalled).toBe(true);

    // PR-CI-05 Confirmada
    await abrirFicha(page, mockCitacionData({ EstadoId: 2, Estado: 'Concesión Confirmada' }));
    await expect(page.getByRole('button', { name: /Rechazar cita/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Guardar/i })).toBeHidden();
  });

  test('PR-CI-06 a PR-CI-08 — Rechazo de citación', async ({ page }) => {
    // PR-CI-08
    await abrirFicha(page, mockCitacionData({ EstadoId: 1 }));
    await expect(page.getByRole('button', { name: /Rechazar cita/i })).toBeHidden();

    // PR-CI-06 Rechazar
    await abrirFicha(page, mockCitacionData({ EstadoId: 2, Estado: 'Concesión Confirmada' }));
    
    // Playwright maneja los window.prompt con dialog
    page.once('dialog', async dialog => {
      expect(dialog.message()).toContain('motivo del rechazo');
      await dialog.accept('No tenemos capacidad este mes'); // PR-CI-06 (Con motivo)
    });

    let rechazoCalled = false;
    await page.route('**/api/citaciones/100/rechazar*', async route => {
      rechazoCalled = true;
      await route.fulfill({ status: 200, body: 'true' });
    });

    await page.getByRole('button', { name: /Rechazar cita/i }).click();
    expect(rechazoCalled).toBe(true);
  });

  test('PR-CI-07 — Rechazar sin introducir motivo', async ({ page }) => {
    await abrirFicha(page, mockCitacionData({ EstadoId: 2, Estado: 'Concesión Confirmada' }));
    
    page.once('dialog', async dialog => {
      await dialog.accept(''); // Motivo vacío
    });

    let rechazoCalled = false;
    await page.route('**/api/citaciones/100/rechazar*', async route => {
      rechazoCalled = true;
      await route.fulfill({ status: 200, body: 'true' });
    });

    await page.getByRole('button', { name: /Rechazar cita/i }).click();
    expect(rechazoCalled).toBe(false); // No se debe haber llamado a la API
  });

  test('PR-CI-09 a PR-CI-11 — Bloqueos en estados finales', async ({ page }) => {
    // PR-CI-09 Consumida
    await abrirFicha(page, mockCitacionData({ EstadoId: 5, Estado: 'Consumidas' }));
    await expect(page.getByRole('button', { name: /Rechazar cita/i })).toBeHidden();
    
    // PR-CI-11 Rechazada
    await abrirFicha(page, mockCitacionData({ EstadoId: 6, Estado: 'Rechazada' }));
    await expect(page.getByRole('button', { name: /Rechazar cita/i })).toBeHidden();
  });

  test('PR-CI-14 — Color salmón en citaciones rechazadas en el listado', async ({ page }) => {
    const citaciones = [
      mockCitacionData({ CitacionId: 101, EstadoId: 1, Estado: 'Pendiente de Respuesta' }),
      mockCitacionData({ CitacionId: 102, EstadoId: 6, Estado: 'Rechazada' })
    ];
    await mockGridCitaciones(page, citaciones);
    await page.goto('/admin/GestionReserva/ConcederCitacion');
    
    // Verificamos que la fila de la citación 102 tiene el color de fondo salmón mediante el atributo style
    const filaRechazada = page.locator('.dx-data-row').nth(1);
    await expect(filaRechazada).toHaveAttribute('style', /background-color:\s*(rgb\(255, 235, 238\)|#ffebee)/i);
  });
});
