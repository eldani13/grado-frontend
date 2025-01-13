import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.vfs;

export default function generarStock(data) {
  const docDefinition = {
    content: [
      { text: "Reporte de Factura", style: "header" },
      {
        table: {
          widths: ["50%", "50%"],
          body: [
            [
              { text: "Métricas", style: "tableHeader" },
              { text: "Valor", style: "tableHeader" },
            ],
            ["Equipo", data.datos.producto__equipo || "N/A"],
            ["Cantidad", data.datos.cantidad || "N/A"],
            ["Fecha salida", data.datos.fecha_salida || "N/A"],
            ["Total", data.datos.total || "N/A"],
            ["No. Factura", data.datos.numero_factura || "N/A"],
          ],
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
