import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { AccesorioEntity } from "../../domain/entities/Accesorio";
import { CotizacionResult } from "../../domain/services/FlowEngine";

interface AccesorioSeleccionado {
  accesorio: AccesorioEntity;
  cantidad: number;
  subtotal: number;
}

export const generateCotizacionPDF = async (
  cotizacion: CotizacionResult,
  flujoTitle: string,
  faseTitle: string,
  labelUnidades: string = "Animales",
  accesoriosSeleccionados: AccesorioSeleccionado[] = [],
) => {
  const currentDate = new Date().toLocaleDateString("es-MX", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const cantidadUnidades = cotizacion.cantidadAnimales;
  const totalConAccesorios =
    cotizacion.costoTotal +
    accesoriosSeleccionados.reduce((sum, item) => sum + item.subtotal, 0);

  const logoSvg = `
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="6" fill="#d93d27"/>
      <path d="M7 12L10 15L17 8" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;

  const generarTablaAccesorios = () => {
    if (accesoriosSeleccionados.length === 0) {
      return "";
    }

    let filas = "";
    accesoriosSeleccionados.forEach((item, index) => {
      filas += `
        <tr>
          <td>${item.accesorio.nombre}</td>
          <td>${item.cantidad}</td>
          <td>$${item.accesorio.precio.toFixed(2)}</td>
          <td>$${item.subtotal.toFixed(2)}</td>
        </tr>
      `;
    });

    return `
      <div class="section-title" style="color:#059669; margin-top:30px;">Accesorios Seleccionados</div>
      <table class="specs-table">
        <thead>
          <tr>
            <th width="40%">Accesorio</th>
            <th width="15%">Cantidad</th>
            <th width="20%">Precio Unitario</th>
            <th width="25%">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${filas}
        </tbody>
        <tfoot>
          <tr style="background:#f0f9ff;">
            <td colspan="3" style="text-align:right; font-weight:bold; padding:12px;">Subtotal Accesorios:</td>
            <td style="font-weight:bold; color:#059669;">$${accesoriosSeleccionados.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
    `;
  };

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
          line-height: 1.4;
          padding: 25px;
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
          margin-bottom: 20px;
          padding-bottom: 15px;
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
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          color: #d93d27;
          margin-bottom: 8px;
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
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px; }
        .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 15px; }

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
          padding: 16px;
          border-radius: 10px;
          margin-bottom: 15px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .hero-info h2 { font-size: 18px; margin-bottom: 4px; font-weight: 800; }
        .hero-info p { font-size: 11px; opacity: 0.8; max-width: 350px; }

        .hero-price { text-align: right; }
        .hero-price .price-label { font-size: 10px; opacity: 0.7; text-transform: uppercase; }
        .hero-price .price-val { font-size: 22px; font-weight: 700; color: #4ade80; }

        /* Specs Table */
        .specs-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 15px;
        }
        .specs-table th {
          text-align: left;
          font-size: 10px;
          color: #6b7280;
          text-transform: uppercase;
          padding: 6px 10px;
          border-bottom: 1px solid #e5e7eb;
          background: #f9fafb;
        }
        .specs-table td {
          font-size: 12px;
          font-weight: 600;
          padding: 8px 10px;
          border-bottom: 1px solid #f3f4f6;
        }

        /* Total Section */
        .total-section {
          background: #fff1f2;
          border: 1px solid #fecdd3;
          border-radius: 10px;
          padding: 16px;
          margin-top: 15px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 12px;
        }

        .summary-row.final {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid #fda4af;
          align-items: flex-end;
        }

        .total-label { font-size: 10px; text-transform: uppercase; color: #9f1239; font-weight: 700; }
        .total-amount { font-size: 28px; font-weight: 900; color: #d93d27; line-height: 1; }

        /* Note */
        .technical-note {
          margin-top: 15px;
          padding: 10px;
          background: #eff6ff;
          border-left: 3px solid #3b82f6;
          border-radius: 4px;
          font-size: 10px;
          color: #1e40af;
        }

        /* Footer */
        .footer {
          margin-top: 20px;
          text-align: center;
          font-size: 9px;
          color: #9ca3af;
          border-top: 1px solid #f3f4f6;
          padding-top: 10px;
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
              <td>${cotizacion.plan?.consumoPorAnimalKg || "-"} kg</td>
              <td>${cotizacion.plan?.nombre || "N/A"}</td>
            </tr>
          </tbody>
        </table>

        ${generarTablaAccesorios()}

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
              ${
                accesoriosSeleccionados.length > 0
                  ? `
                <div class="summary-row">
                  <span style="color:#6b7280;">Costo total alimento</span>
                  <strong>$${cotizacion.costoTotal.toFixed(2)}</strong>
                </div>
                <div class="summary-row">
                  <span style="color:#6b7280;">Costo accesorios</span>
                  <strong>$${accesoriosSeleccionados.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2)}</strong>
                </div>
              `
                  : ""
              }
            </div>

            <div style="text-align: right;">
              <div class="total-label">Presupuesto Total Estimado</div>
              <div class="total-amount">$${totalConAccesorios.toFixed(2)}</div>
              <div style="font-size: 10px; color: #9f1239; margin-top: 5px;">Moneda Nacional (MXN)</div>
            </div>
          </div>
        </div>

        <div class="technical-note">
          <strong>Nota Técnica:</strong> ${cotizacion.plan?.descripcion || "Consulte a su distribuidor para recomendaciones específicas de alimentación."}
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
        mimeType: "application/pdf",
        dialogTitle: `Cotización ${cotizacion.producto.nombre}`,
        UTI: "com.adobe.pdf",
      });
    } else {
      console.log("Sharing no soportado en este dispositivo");
    }

    return { success: true, uri };
  } catch (error) {
    console.error("Error generando PDF:", error);
    return { success: false, error };
  }
};

export const generateTicket = async (
  cotizacion: CotizacionResult,
  accesoriosSeleccionados: AccesorioSeleccionado[] = [],
) => {
  const currentDate = new Date().toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const currentTime = new Date().toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const totalConAccesorios =
    cotizacion.costoTotal +
    accesoriosSeleccionados.reduce((sum, item) => sum + item.subtotal, 0);

  const ticketNumber = Math.floor(Math.random() * 900000) + 100000;

  let itemsHtml = `
    <tr>
      <td class="item-name">${cotizacion.producto.nombre}</td>
      <td class="item-qty">${cotizacion.bultosNecesarios}</td>
      <td class="item-price">$${cotizacion.producto.precioBulto.toFixed(2)}</td>
      <td class="item-total">$${cotizacion.costoTotal.toFixed(2)}</td>
    </tr>
  `;

  accesoriosSeleccionados.forEach((item) => {
    itemsHtml += `
      <tr>
        <td class="item-name">${item.accesorio.nombre}</td>
        <td class="item-qty">${item.cantidad}</td>
        <td class="item-price">$${item.accesorio.precio.toFixed(2)}</td>
        <td class="item-total">$${item.subtotal.toFixed(2)}</td>
      </tr>
    `;
  });

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Ticket</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Courier+Prime&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          font-family: 'Courier Prime', 'Courier New', monospace;
          font-size: 12px;
          width: 80mm;
          padding: 10px;
          background: #fff;
        }

        .ticket {
          width: 100%;
        }

        .header {
          text-align: center;
          border-bottom: 1px dashed #000;
          padding-bottom: 10px;
          margin-bottom: 10px;
        }

        .store-name {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 5px;
        }

        .store-info {
          font-size: 10px;
          color: #333;
        }

        .ticket-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          font-size: 10px;
        }

        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 10px;
        }

        .items-table th {
          text-align: left;
          font-size: 10px;
          border-bottom: 1px solid #000;
          padding: 3px 0;
        }

        .items-table td {
          padding: 5px 0;
          font-size: 11px;
          border-bottom: 1px dotted #ccc;
        }

        .item-name { width: 40%; }
        .item-qty { width: 15%; text-align: center; }
        .item-price { width: 20%; text-align: right; }
        .item-total { width: 25%; text-align: right; font-weight: bold; }

        .totals {
          border-top: 1px dashed #000;
          padding-top: 10px;
          margin-top: 5px;
        }

        .total-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
        }

        .grand-total {
          font-size: 16px;
          font-weight: bold;
          border-top: 2px solid #000;
          border-bottom: 2px solid #000;
          padding: 8px 0;
          margin-top: 5px;
        }

        .footer {
          text-align: center;
          margin-top: 15px;
          padding-top: 10px;
          border-top: 1px dashed #000;
          font-size: 10px;
        }

        .barcode {
          text-align: center;
          margin: 10px 0;
          font-size: 8px;
          letter-spacing: 2px;
        }

        .thank-you {
          font-size: 12px;
          font-weight: bold;
          margin-top: 10px;
        }
      </style>
    </head>
    <body>
      <div class="ticket">
        <div class="header">
          <div class="store-name">ASESOR PORCINO</div>
          <div class="store-info">Soluciones Nutricionales</div>
          <div class="store-info">Tel: (951) 228-0730</div>
        </div>

        <div class="ticket-info">
          <span>Fecha: ${currentDate}</span>
          <span>Hora: ${currentTime}</span>
        </div>
        <div class="ticket-info">
          <span>Ticket: #${ticketNumber}</span>
        </div>

        <table class="items-table">
          <thead>
            <tr>
              <th>PRODUCTO</th>
              <th style="text-align:center">CANT</th>
              <th style="text-align:right">P.UNIT</th>
              <th style="text-align:right">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div class="totals">
          <div class="total-row">
            <span>Subtotal:</span>
            <span>$${cotizacion.costoTotal.toFixed(2)}</span>
          </div>
          ${accesoriosSeleccionados.length > 0 ? `
          <div class="total-row">
            <span>Accesorios:</span>
            <span>$${accesoriosSeleccionados.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2)}</span>
          </div>
          ` : ''}
          <div class="total-row grand-total">
            <span>TOTAL:</span>
            <span>$${totalConAccesorios.toFixed(2)}</span>
          </div>
        </div>

        <div class="footer">
          <div class="barcode">||||| ${ticketNumber} |||||</div>
          <div class="thank-you">¡GRACIAS POR SU COMPRA!</div>
          <div style="margin-top:5px">Conserve este ticket</div>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const { uri } = await Print.printToFileAsync({
      html,
      width: 226, // 80mm en puntos (aprox)
      height: 800,
    });

    const isAvailable = await Sharing.isAvailableAsync();

    if (isAvailable) {
      await Sharing.shareAsync(uri, {
        mimeType: "application/pdf",
        dialogTitle: "Ticket de compra",
        UTI: "com.adobe.pdf",
      });
    }

    return { success: true, uri };
  } catch (error) {
    console.error("Error generando ticket:", error);
    return { success: false, error };
  }
};
