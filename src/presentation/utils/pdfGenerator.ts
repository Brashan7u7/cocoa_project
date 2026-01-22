import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { CotizacionResult } from '../../domain/services/FlowEngine';

export const generateCotizacionPDF = async (
  cotizacion: CotizacionResult,
  flujoTitle: string,
  faseTitle: string,
  labelUnidades: string = 'Animales'
) => {
  const currentDate = new Date().toLocaleDateString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const cantidadUnidades = cotizacion.cantidadAnimales;

  const logoSvg = `
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="6" fill="#d93d27"/>
      <path d="M7 12L10 15L17 8" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Cotización - ${cotizacion.producto.nombre}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          font-family: 'Inter', -apple-system, Helvetica, Arial, sans-serif;
          color: #111827;
          line-height: 1.5;
          padding: 40px;
          background: #fff;
        }

        /* Layout */
        .container {
          max-width: 800px;
          margin: 0 auto;
        }

        /* Header */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 2px solid #f3f4f6;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .brand-text h1 { font-size: 20px; font-weight: 800; color: #111827; letter-spacing: -0.5px; }
        .brand-text p { font-size: 12px; color: #6b7280; font-weight: 500; text-transform: uppercase; }

        .meta-data { text-align: right; }
        .meta-label { font-size: 10px; color: #9ca3af; text-transform: uppercase; font-weight: 600; }
        .meta-value { font-size: 14px; font-weight: 600; color: #374151; }

        /* Titles */
        .section-title {
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase;
          color: #d93d27;
          margin-bottom: 12px;
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .section-title::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e5e7eb;
        }

        /* Grid Layouts */
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
        .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 30px; }

        /* Cards / Boxes */
        .card {
          background: #f9fafb;
          border-radius: 8px;
          padding: 16px;
          border: 1px solid #e5e7eb;
        }

        .label { font-size: 11px; color: #6b7280; margin-bottom: 4px; font-weight: 500; }
        .value { font-size: 16px; font-weight: 700; color: #111827; }
        .value.highlight { color: #d93d27; }

        /* Product Highlight */
        .product-hero {
          background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
          color: white;
          padding: 24px;
          border-radius: 12px;
          margin-bottom: 30px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .hero-info h2 { font-size: 24px; margin-bottom: 8px; font-weight: 800; }
        .hero-info p { font-size: 14px; opacity: 0.8; max-width: 400px; }

        .hero-price { text-align: right; }
        .hero-price .price-label { font-size: 12px; opacity: 0.7; text-transform: uppercase; }
        .hero-price .price-val { font-size: 28px; font-weight: 700; color: #4ade80; }

        /* Specs Table */
        .specs-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        .specs-table th { text-align: left; font-size: 11px; color: #6b7280; text-transform: uppercase; padding-bottom: 8px; border-bottom: 1px solid #e5e7eb; }
        .specs-table td { font-size: 14px; font-weight: 600; padding: 12px 0; border-bottom: 1px solid #f3f4f6; }

        /* Total Section */
        .total-section {
          background: #fff1f2;
          border: 1px solid #fecdd3;
          border-radius: 12px;
          padding: 24px;
          margin-top: 20px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          font-size: 14px;
        }

        .summary-row.final {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #fda4af;
          align-items: flex-end;
        }

        .total-label { font-size: 12px; text-transform: uppercase; color: #9f1239; font-weight: 700; }
        .total-amount { font-size: 36px; font-weight: 900; color: #d93d27; line-height: 1; }

        /* Note */
        .technical-note {
          margin-top: 30px;
          padding: 12px;
          background: #eff6ff;
          border-left: 4px solid #3b82f6;
          border-radius: 4px;
          font-size: 12px;
          color: #1e40af;
        }

        /* Footer */
        .footer {
          margin-top: 60px;
          text-align: center;
          font-size: 10px;
          color: #9ca3af;
          border-top: 1px solid #f3f4f6;
          padding-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">

        <div class="header">
          <div class="brand">
            ${logoSvg}
            <div class="brand-text">
              <h1>AsesorPorcino</h1>
              <p>Soluciones Nutricionales</p>
            </div>
          </div>
          <div class="meta-data">
            <div class="meta-label">Fecha de Emisión</div>
            <div class="meta-value">${currentDate}</div>
          </div>
        </div>

        <div class="section-title">Detalles del Proyecto</div>
        <div class="grid-3">
          <div class="card">
            <div class="label">Flujo</div>
            <div class="value">${flujoTitle}</div>
          </div>
          <div class="card">
            <div class="label">Fase</div>
            <div class="value">${faseTitle}</div>
          </div>
          <div class="card">
            <div class="label">Población</div>
            <!-- ========== ACTUALIZADO: Usar cantidadUnidades ========== -->
            <div class="value highlight">${cantidadUnidades} ${labelUnidades}</div>
          </div>
        </div>

        <div class="section-title">Producto Seleccionado</div>
        <div class="product-hero">
          <div class="hero-info">
            <h2>${cotizacion.producto.nombre}</h2>
            <p>${cotizacion.producto.descripcion}</p>
          </div>
          <div class="hero-price">
            <div class="price-label">Precio Unitario</div>
            <div class="price-val">$${cotizacion.producto.precioBulto.toFixed(2)}</div>
          </div>
        </div>

        <table class="specs-table">
          <thead>
            <tr>
              <th width="30%">Presentación</th>
              <th width="30%">Consumo por Unidad</th>
              <th width="40%">Plan Alimenticio</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${cotizacion.producto.presentacionKg} kg / bulto</td>
              <td>${cotizacion.plan?.consumoPorAnimalKg || '-'} kg</td>
              <td>${cotizacion.plan?.nombre || 'N/A'}</td>
            </tr>
          </tbody>
        </table>

        <div class="total-section">
          <div class="section-title" style="color:#9f1239; border-color:#fda4af;">Desglose de Costos</div>

          <div class="grid-2">
            <div>
              <div class="summary-row">
                <span style="color:#6b7280;">Requerimiento total de alimento</span>
                <strong>${cotizacion.consumoTotalKg.toFixed(1)} kg</strong>
              </div>
              <div class="summary-row">
                <span style="color:#6b7280;">Total bultos requeridos</span>
                <strong>${cotizacion.bultosNecesarios} pzas</strong>
              </div>
              <div class="summary-row">
                <span style="color:#6b7280;">Inversión por unidad</span>
                <strong>$${cotizacion.costoPorAnimal.toFixed(2)}</strong>
              </div>
            </div>

            <div style="text-align: right;">
              <div class="total-label">Presupuesto Total Estimado</div>
              <div class="total-amount">$${cotizacion.costoTotal.toFixed(2)}</div>
              <div style="font-size: 10px; color: #9f1239; margin-top: 5px;">Moneda Nacional (MXN)</div>
            </div>
          </div>
        </div>

        <div class="technical-note">
          <strong>Nota Técnica:</strong> ${cotizacion.plan?.descripcion || 'Consulte a su distribuidor para recomendaciones específicas de alimentación.'}
        </div>

        <div class="footer">
          <p>Este documento es una estimación generada automáticamente por AsesorPorcino App.</p>
          <p>Los precios pueden variar sin previo aviso. Consulte a su distribuidor para confirmar disponibilidad.</p>
        </div>

      </div>
    </body>
    </html>
  `;

  try {
    const { uri } = await Print.printToFileAsync({ html });


    const isAvailable = await Sharing.isAvailableAsync();

    if (isAvailable) {
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: `Cotización ${cotizacion.producto.nombre}`,
        UTI: 'com.adobe.pdf',
      });
    } else {
      console.log("Sharing no soportado en este dispositivo");

    }

    return { success: true, uri };
  } catch (error) {
    console.error('Error generando PDF:', error);
    return { success: false, error };
  }
};
