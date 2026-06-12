using MZAsistencial.Server.Data;
using MZAsistencial.Server.DTOs;
using MZAsistencial.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace MZAsistencial.Server.Services
{
    public class DashboardService
    {
        private readonly MZAsistencialContext _context;

        public DashboardService(MZAsistencialContext context)
        {
            _context = context;
        }

        // ─────────────────────────────────────────────────────────────────
        // REGIÓN: LIQUIDACIONES (datos reales de los ICG)
        // ─────────────────────────────────────────────────────────────────

        /// <summary>
        /// Devuelve 4 filas de liquidación para Centros Propios:
        /// 0 - Gastos de Personal         (Cap1 — cambio normativo 2020)
        /// 1 - Gastos Bienes y Servicios  (Cap2)
        /// 2 - Gastos Financieros         (Cap3)
        /// 3 - Amortizaciones             (Cuenta68)
        /// </summary>
        public async Task<List<DashboardItemDTO>> GetLiquidacionCentrosPropiosAsync(int? anio, int? mutuaId)
        {
            // Cap1: cambio normativo 2020 — años anteriores usan vista distinta
            decimal cap1;
            if (anio.HasValue && anio.Value < 2020)
            {
                var q = _context.VwPropiosCapitulo1Anteriors.AsQueryable();
                if (anio.HasValue)                          q = q.Where(x => x.Año == anio.Value);
                if (mutuaId.HasValue && mutuaId.Value != 0) q = q.Where(x => x.MutuaId == mutuaId.Value);
                cap1 = await q.SumAsync(x => x.Respuesta) ?? 0;
            }
            else
            {
                var q = _context.VwPropiosCapitulo1s.AsQueryable();
                if (anio.HasValue)                          q = q.Where(x => x.Año == anio.Value);
                if (mutuaId.HasValue && mutuaId.Value != 0) q = q.Where(x => x.MutuaId == mutuaId.Value);
                cap1 = await q.SumAsync(x => x.Respuesta) ?? 0;
            }

            // Cap2 — Gastos Bienes y Servicios
            var qCap2 = _context.VwPropiosCapitulo2s.AsQueryable();
            if (anio.HasValue)                          qCap2 = qCap2.Where(x => x.Año == anio.Value);
            if (mutuaId.HasValue && mutuaId.Value != 0) qCap2 = qCap2.Where(x => x.MutuaId == mutuaId.Value);
            var cap2 = await qCap2.SumAsync(x => x.Respuesta) ?? 0;

            // Cap3 — Gastos Financieros
            var qCap3 = _context.VwPropiosCapitulo3s.AsQueryable();
            if (anio.HasValue)                          qCap3 = qCap3.Where(x => x.Año == anio.Value);
            if (mutuaId.HasValue && mutuaId.Value != 0) qCap3 = qCap3.Where(x => x.MutuaId == mutuaId.Value);
            var cap3 = await qCap3.SumAsync(x => x.Respuesta) ?? 0;

            // Cuenta68 — Amortizaciones
            var qCuenta68 = _context.VwPropiosCuenta68s.AsQueryable();
            if (anio.HasValue)                          qCuenta68 = qCuenta68.Where(x => x.Año == anio.Value);
            if (mutuaId.HasValue && mutuaId.Value != 0) qCuenta68 = qCuenta68.Where(x => x.MutuaId == mutuaId.Value);
            var cuenta68 = await qCuenta68.SumAsync(x => x.Respuesta) ?? 0;

            return new List<DashboardItemDTO>
            {
                new() { Titulo = "Gastos de Personal",         Respuesta = cap1     },
                new() { Titulo = "Gastos Bienes y Servicios",  Respuesta = cap2     },
                new() { Titulo = "Gastos Financieros",         Respuesta = cap3     },
                new() { Titulo = "Amortizaciones",             Respuesta = cuenta68 },
            };
        }

        /// <summary>
        /// Devuelve 4 filas de liquidación para Conciertos:
        /// 0 - Artículo 25
        /// 1 - Aplicación 258.1
        /// 2 - Aplicación 258.2
        /// 3 - Resto del Artículo 25
        /// </summary>
        public async Task<List<DashboardItemDTO>> GetLiquidacionConciertosAsync(int? anio, int? mutuaId)
        {
            var qArt25 = _context.VwConciertosArticulo25s.AsQueryable();
            if (anio.HasValue)                          qArt25 = qArt25.Where(x => x.Año == anio.Value);
            if (mutuaId.HasValue && mutuaId.Value != 0) qArt25 = qArt25.Where(x => x.MutuaId == mutuaId.Value);
            var art25 = await qArt25.SumAsync(x => x.Respuesta) ?? 0;

            var qArt2581 = _context.VwConciertosArticulo2581s.AsQueryable();
            if (anio.HasValue)                          qArt2581 = qArt2581.Where(x => x.Año == anio.Value);
            if (mutuaId.HasValue && mutuaId.Value != 0) qArt2581 = qArt2581.Where(x => x.MutuaId == mutuaId.Value);
            var art2581 = await qArt2581.SumAsync(x => x.Respuesta) ?? 0;

            var qArt2582 = _context.VwConciertosArticulo2582s.AsQueryable();
            if (anio.HasValue)                          qArt2582 = qArt2582.Where(x => x.Año == anio.Value);
            if (mutuaId.HasValue && mutuaId.Value != 0) qArt2582 = qArt2582.Where(x => x.MutuaId == mutuaId.Value);
            var art2582 = await qArt2582.SumAsync(x => x.Respuesta) ?? 0;

            var qResto = _context.VwConciertosArticulo25Restos.AsQueryable();
            if (anio.HasValue)                          qResto = qResto.Where(x => x.Año == anio.Value);
            if (mutuaId.HasValue && mutuaId.Value != 0) qResto = qResto.Where(x => x.MutuaId == mutuaId.Value);
            var art25Resto = await qResto.SumAsync(x => x.Respuesta) ?? 0;

            return new List<DashboardItemDTO>
            {
                new() { Titulo = "Artículo 25",       Respuesta = art25      },
                new() { Titulo = "Aplicación 258.1",  Respuesta = art2581    },
                new() { Titulo = "Aplicación 258.2",  Respuesta = art2582    },
                new() { Titulo = "Resto Artículo 25", Respuesta = art25Resto },
            };
        }

        /// <summary>
        /// Devuelve 3 filas de liquidación para Otros Conceptos:
        /// 0 - Inversiones Nuevas         (Art62)
        /// 1 - Inversiones Reposición     (Art63)
        /// 2 - Ingresos Prestación Serv.  (Art32)
        /// </summary>
        public async Task<List<DashboardItemDTO>> GetLiquidacionOtrosConceptosAsync(int? anio, int? mutuaId)
        {
            var qArt62 = _context.VwPropiosArticulo62s.AsQueryable();
            if (anio.HasValue)                          qArt62 = qArt62.Where(x => x.Año == anio.Value);
            if (mutuaId.HasValue && mutuaId.Value != 0) qArt62 = qArt62.Where(x => x.MutuaId == mutuaId.Value);
            var art62 = await qArt62.SumAsync(x => x.Respuesta) ?? 0;

            var qArt63 = _context.VwPropiosArticulo63s.AsQueryable();
            if (anio.HasValue)                          qArt63 = qArt63.Where(x => x.Año == anio.Value);
            if (mutuaId.HasValue && mutuaId.Value != 0) qArt63 = qArt63.Where(x => x.MutuaId == mutuaId.Value);
            var art63 = await qArt63.SumAsync(x => x.Respuesta) ?? 0;

            var qArt32 = _context.VwPropiosArticulo32s.AsQueryable();
            if (anio.HasValue)                          qArt32 = qArt32.Where(x => x.Año == anio.Value);
            if (mutuaId.HasValue && mutuaId.Value != 0) qArt32 = qArt32.Where(x => x.MutuaId == mutuaId.Value);
            var art32 = await qArt32.SumAsync(x => x.Respuesta) ?? 0;

            return new List<DashboardItemDTO>
            {
                new() { Titulo = "Inversiones Nuevas",             Respuesta = art62 },
                new() { Titulo = "Inversiones Reposición",         Respuesta = art63 },
                new() { Titulo = "Ingresos Prestación Servicios",  Respuesta = art32 },
            };
        }

        // ─────────────────────────────────────────────────────────────────
        // REGIÓN: PRESUPUESTOS (datos declarados en MutuasPresupuesto)
        // NOTA: Año en MutuasPresupuesto es string → se compara como string
        // ─────────────────────────────────────────────────────────────────

        /// <summary>
        /// Devuelve 4 filas de presupuesto para Centros Propios:
        /// 0 - Gastos de Personal         (PresupuestoCapitulo1Propio)
        /// 1 - Gastos Bienes y Servicios  (PresupuestoCapitulo2Propio)
        /// 2 - Gastos Financieros         (PresupuestoGastosFinancieros)
        /// 3 - Amortizaciones             (PresupuestoCapitulo3Propio)
        /// </summary>
        public async Task<List<DashboardItemDTO>> GetPresupuestoCentrosPropiosAsync(int? anio, int? mutuaId)
        {
            var q = BuildPresupuestoQuery(anio, mutuaId);

            var cap1   = (decimal)(await q.SumAsync(x => x.PresupuestoCapitulo1Propio)   ?? 0);
            var cap2   = (decimal)(await q.SumAsync(x => x.PresupuestoCapitulo2Propio)   ?? 0);
            var gastos = (decimal)(await q.SumAsync(x => x.PresupuestoGastosFinancieros) ?? 0);
            var cap3   = (decimal)(await q.SumAsync(x => x.PresupuestoCapitulo3Propio)   ?? 0);

            return new List<DashboardItemDTO>
            {
                new() { Titulo = "Gastos de Personal",         Respuesta = cap1   },
                new() { Titulo = "Gastos Bienes y Servicios",  Respuesta = cap2   },
                new() { Titulo = "Gastos Financieros",         Respuesta = gastos },
                new() { Titulo = "Amortizaciones",             Respuesta = cap3   },
            };
        }

        /// <summary>
        /// Devuelve 4 filas de presupuesto para Conciertos:
        /// 0 - Artículo 25       (PresupuestoCapitulo1Concertado)
        /// 1 - Aplicación 258.1  (PresupuestoArticulo2581)
        /// 2 - Aplicación 258.2  (PresupuestoArticulo2582)
        /// 3 - Resto Art. 25     (PresupuestoArticulo25Resto)
        /// </summary>
        public async Task<List<DashboardItemDTO>> GetPresupuestoConciertosAsync(int? anio, int? mutuaId)
        {
            var q = BuildPresupuestoQuery(anio, mutuaId);

            var art25      = (decimal)(await q.SumAsync(x => x.PresupuestoCapitulo1Concertado) ?? 0);
            var art2581    = (decimal)(await q.SumAsync(x => x.PresupuestoArticulo2581)        ?? 0);
            var art2582    = (decimal)(await q.SumAsync(x => x.PresupuestoArticulo2582)        ?? 0);
            var art25Resto = (decimal)(await q.SumAsync(x => x.PresupuestoArticulo25Resto)     ?? 0);

            return new List<DashboardItemDTO>
            {
                new() { Titulo = "Artículo 25",       Respuesta = art25      },
                new() { Titulo = "Aplicación 258.1",  Respuesta = art2581    },
                new() { Titulo = "Aplicación 258.2",  Respuesta = art2582    },
                new() { Titulo = "Resto Artículo 25", Respuesta = art25Resto },
            };
        }

        /// <summary>
        /// Devuelve 3 filas de presupuesto para Otros Conceptos:
        /// 0 - Inversiones Nuevas         (PresupuestoCapitulo4Propio)
        /// 1 - Inversiones Reposición     (PresupuestoCapitulo5Propio)
        /// 2 - Ingresos Prest. Servicios  (PresupuestoCapitulo6Propio)
        /// </summary>
        public async Task<List<DashboardItemDTO>> GetPresupuestoOtrosConceptosAsync(int? anio, int? mutuaId)
        {
            var q = BuildPresupuestoQuery(anio, mutuaId);

            var cap4 = (decimal)(await q.SumAsync(x => x.PresupuestoCapitulo4Propio) ?? 0);
            var cap5 = (decimal)(await q.SumAsync(x => x.PresupuestoCapitulo5Propio) ?? 0);
            var cap6 = (decimal)(await q.SumAsync(x => x.PresupuestoCapitulo6Propio) ?? 0);

            return new List<DashboardItemDTO>
            {
                new() { Titulo = "Inversiones Nuevas",             Respuesta = cap4 },
                new() { Titulo = "Inversiones Reposición",         Respuesta = cap5 },
                new() { Titulo = "Ingresos Prestación Servicios",  Respuesta = cap6 },
            };
        }

        // ─────────────────────────────────────────────────────────────────
        // HELPER PRIVADO
        // ─────────────────────────────────────────────────────────────────

        /// <summary>
        /// Construye la query base de MutuasPresupuesto aplicando filtros opcionales.
        /// Año es string en MutuasPresupuesto → se convierte para comparar.
        /// MutuaId == 0 → sin filtro de mutua (todas las mutuas).
        /// </summary>
        private IQueryable<MutuasPresupuesto> BuildPresupuestoQuery(int? anio, int? mutuaId)
        {
            var query = _context.MutuasPresupuestos.AsQueryable();
            if (anio.HasValue)
                query = query.Where(x => x.Año == anio.Value.ToString());
            if (mutuaId.HasValue && mutuaId.Value != 0)
                query = query.Where(x => x.MutuaId == mutuaId.Value);
            return query;
        }
    }
}
