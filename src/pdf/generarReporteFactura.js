import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.vfs;

export default function generarReporteFactura(data) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.error("Datos inválidos para generar el reporte de factura:", data);
    return null; 
  }

  const tableBody = [
    [
      { text: "Métricas", style: "tableHeader" },
      { text: "Valor", style: "tableHeader" },
    ],
  ];

  data.forEach((factura) => {
    tableBody.push([
      "Producto", factura.producto || "N/A",
    ]);
    tableBody.push([
      "Cantidad", factura.cantidad || "N/A",
    ]);
    tableBody.push([
      "Fecha salida", factura.fecha_salida || "N/A",
    ]);
    tableBody.push([
      "Total", factura.total || "N/A",
    ]);
    tableBody.push([
      "No. Factura", factura.numero_factura || "N/A",
    ]);
  });

  const docDefinition = {
    content: [
      { text: "Reporte de Factura", style: "header" },
      {
        table: {
          widths: ["50%", "50%"],
          body: tableBody,
        },
        layout: "lightHorizontalLines",
      },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        alignment: "center",
      },
      tableHeader: {
        bold: true,
        fillColor: "#eeeeee",
        fontSize: 12,
      },
    },
  };

  return pdfMake.createPdf(docDefinition);
}
