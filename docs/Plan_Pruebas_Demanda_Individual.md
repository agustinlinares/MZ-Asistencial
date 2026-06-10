# Plan de pruebas — Ficha Gestión Demanda Individual

## 1. Flujo principal — creación y estados

- [ ] **PR-01 — Nueva demanda queda en Pendiente**
  - Crear una demanda individual
  - Verificar que aparece en el listado con estado "Pendiente de Respuesta"
  - Verificar que los botones visibles son solo Imprimir, Adjuntar y Salir
  - Verificar que Aceptar y Rechazar Citación NO aparecen todavía

- [ ] **PR-02 — Desierta por tiempo (96 horas)**
  - Crear una demanda y dejarla sin respuesta más de 96 horas (o manipular la fecha en BD para simular)
  - Verificar que el estado cambia automáticamente a Desierta
  - Abrir la ficha y verificar que el botón Rechazar Citación no aparece
  - Intentar aceptarla manualmente y verificar que el sistema lo impide

- [ ] **PR-03 — Caducada por tiempo (más de 1 mes)**
  - Crear una demanda y dejarla sin respuesta más de 1 mes (o manipular fecha)
  - Verificar que el estado cambia a Caducada
  - Abrir la ficha y verificar que Rechazar Citación no aparece
  - Verificar que ninguna acción está disponible salvo Imprimir, Adjuntar y Salir

## 2. Flujo de aceptación

- [ ] **PR-04 — Aceptar una subsolicitud correctamente**
  - Tener una demanda con al menos una subsolicitud en estado "Pendiente de confirmar" (con oferta asignada)
  - Seleccionar esa subsolicitud en el grid
  - Pulsar Aceptar
  - Verificar que la subsolicitud seleccionada pasa a estado Confirmada
  - Verificar que todas las demás subsolicitudes pasan a estado Rechazada
  - Verificar que la demanda principal pasa a estado "Concesión Confirmada"
  - Verificar que el botón Rechazar Citación aparece ahora habilitado
  - Verificar que el botón Aceptar desaparece (ya hay FechaConfirmacion)

- [ ] **PR-05 — Intentar aceptar sin seleccionar subsolicitud**
  - Tener una demanda con subsolicitudes disponibles
  - Pulsar Aceptar sin seleccionar ninguna fila del grid
  - Verificar que aparece el mensaje de error "Tiene que seleccionar una solicitud"
  - Verificar que no se modifica ningún estado en BD

- [ ] **PR-06 — Intentar aceptar una subsolicitud sin oferta asignada**
  - Seleccionar en el grid una subsolicitud que no tiene oferta (estado 1)
  - Pulsar Aceptar
  - Verificar que aparece el mensaje "Tiene que seleccionar una solicitud con una oferta asignada"
  - Verificar que no se modifica ningún estado

- [ ] **PR-07 — Pre-selección automática de la subsolicitud confirmada**
  - Tener una demanda ya confirmada (una subsolicitud en estado 3)
  - Abrir la ficha
  - Verificar que el grid ya tiene pre-seleccionada la subsolicitud confirmada al cargar
  - Verificar que el botón Aceptar no aparece

## 3. Emails tras la aceptación

- [ ] **PR-08 — Email de confirmación a la mutua aceptada**
  - Completar el flujo de PR-04
  - Verificar que la mutua cuya oferta fue aceptada recibe un email con asunto que incluye "Confirmación Asignación"
  - Verificar que el email contiene la tabla con los meses de demanda y la tabla con los meses de la oferta aceptada
  - Verificar que el texto dice que la mutua solicitante ha aceptado la asignación

- [ ] **PR-09 — Emails de rechazo a las mutuas no elegidas**
  - Completar el flujo de PR-04 con al menos 2 subsolicitudes con oferta asignada
  - Verificar que cada mutua rechazada recibe un email con asunto "Rechazo Asignación"
  - Verificar que el texto indica que las plazas vuelven a estar disponibles
  - Verificar que NO reciben el email de confirmación

## 4. Flujo de rechazo de citación

- [ ] **PR-10 — Rechazar cita en estado Concesión Confirmada**
  - Tener una demanda en estado "Concesión Confirmada" (estado 3)
  - Verificar que el botón Rechazar Citación está visible
  - Pulsarlo
  - Verificar que abre la pantalla FichaRechazarOferta
  - Completar el motivo y confirmar
  - Verificar que la demanda pasa a estado Rechazada (estado 6)
  - Verificar que la fila aparece en color salmón en el listado
  - Verificar que se envía el email de alerta

- [ ] **PR-11 — Rechazar cita no disponible en estados finales**
  - Abrir una demanda en estado Consumida
  - Verificar que el botón Rechazar Citación no aparece
  - Repetir con estado Rechazada (estado 6)
  - Repetir con estado Caducada
  - Repetir con estado Desierta

- [ ] **PR-12 — Rechazar sin introducir motivo**
  - Llegar a la pantalla FichaRechazarOferta
  - Intentar confirmar sin escribir el motivo
  - Verificar que el sistema no permite continuar y muestra validación

## 5. Flujo de anulación

- [ ] **PR-13 — Anular demanda con perfil administrador (perfil 1)**
  - Tener una demanda en cualquier estado activo
  - Acceder con perfil 1
  - Verificar que el botón Anular está visible siempre
  - Pulsar Anular, verificar que abre FichaAnulacionDemanda con los datos de la demanda
  - Confirmar la anulación
  - Verificar que la demanda y todas sus subsolicitudes pasan a estado 9

- [ ] **PR-14 — Anular demanda con perfil mutua (perfil 2) — caso permitido**
  - Acceder con perfil 2 a una demanda que pertenece a la propia mutua del usuario
  - Verificar que el botón Anular solo está visible si el estado es 1 o 4
  - Completar la anulación y verificar que el estado cambia a 9

- [ ] **PR-15 — Anular demanda con perfil mutua — caso bloqueado**
  - Acceder con perfil 2 a una demanda de otra mutua
  - Verificar que el botón Anular no aparece
  - Acceder a una demanda propia pero en estado 3 (confirmada)
  - Verificar que el botón Anular tampoco aparece

- [ ] **PR-16 — Botón Anular oculto para resto de perfiles**
  - Acceder con un perfil distinto a 1 y 2
  - Abrir cualquier demanda
  - Verificar que el botón Anular no aparece en ningún caso

## 6. Adjuntar documentos

- [ ] **PR-17 — Subir un documento válido**
  - Abrir FichaDocumentosDemandaIndividual desde el botón Adjuntar
  - Seleccionar un fichero PDF de menos de 55MB
  - Pulsar Guardar
  - Verificar que el documento aparece en el grid de documentos de la ficha principal
  - Verificar que el fichero existe físicamente en el servidor en la ruta configurada
  - Verificar que el nombre en servidor tiene el formato `{id}_{nombreOriginal}`

- [ ] **PR-18 — Intentar subir extensión no permitida**
  - Seleccionar un fichero con extensión no permitida (por ejemplo .exe o .mp4)
  - Verificar que el sistema muestra el mensaje de tipo de archivo no permitido
  - Verificar que no se guarda nada en BD ni en disco

- [ ] **PR-19 — Intentar subir fichero con extensión válida pero contenido incorrecto**
  - Renombrar un ejecutable como .pdf
  - Intentar subirlo
  - Verificar que la validación binaria lo rechaza con el mensaje de tipo no permitido

- [ ] **PR-20 — Superar el límite de 55MB**
  - Intentar subir un fichero mayor de 55MB con extensión válida
  - Verificar que el sistema lo rechaza antes de procesarlo

- [ ] **PR-21 — Descargar un documento adjunto**
  - Tener al menos un documento en el grid
  - Hacer clic en la fila
  - Verificar que se descarga el fichero correcto

## 7. Control de acceso a la ficha

- [ ] **PR-22 — Acceso de perfil 2 solo a sus demandas**
  - Acceder con perfil 2 e intentar abrir directamente (por URL) una demanda de otra mutua
  - Verificar que el sistema redirige a la pantalla de acceso denegado

- [ ] **PR-23 — Acceso sin sesión activa**
  - Intentar acceder a la ficha sin sesión iniciada
  - Verificar que redirige al login

## 8. Visualización condicional de campos

- [ ] **PR-24 — Campo Motivo Rechazo solo visible cuando procede**
  - Abrir una demanda que NO está en estado Rechazada
  - Verificar que el campo Motivo Rechazo no aparece
  - Abrir una demanda en estado Rechazada
  - Verificar que el campo aparece con el motivo relleno

- [ ] **PR-25 — Grid subsolicitudes solo visible en demandas individuales**
  - Abrir una demanda de tipo anual (Tipo_id = 1)
  - Verificar que el grid de subsolicitudes no aparece
  - Abrir una demanda de tipo individual (Tipo_id = 2)
  - Verificar que el grid sí aparece

- [ ] **PR-26 — Columna Acciones del grid se oculta cuando corresponde**
  - En el grid de subsolicitudes, localizar una fila sin oferta asignada
  - Verificar que la columna Acciones está oculta en esa fila
  - Localizar una fila cuya oferta ya fue aceptada por otra vía
  - Verificar que la columna Acciones también está oculta

## 9. Botón Salir — actualización de FechaRevision

- [ ] **PR-27 — Salir actualiza la fecha de revisión**
  - Abrir una demanda y anotar la FechaRevision actual en BD
  - Pulsar Salir
  - Verificar en BD que FechaRevision se ha actualizado con la fecha y hora actuales

---

## Matriz resumen de estados y botones visibles

| Estado | Aceptar | Anular | Rechazar cita | Imprimir | Adjuntar | Salir |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| Pendiente (1) | ✅ (si hay oferta) | Según perfil | ❌ | ✅ | ✅ | ✅ |
| Confirmada (3) | ❌ | Según perfil | ✅ | ✅ | ✅ | ✅ |
| Consumida | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Rechazada (6) | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Caducada | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Desierta | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Anulada (9) | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
