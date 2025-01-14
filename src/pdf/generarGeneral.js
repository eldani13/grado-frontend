import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.vfs;

export default function generarGeneral(data) {
  const docDefinition = {
    content: [
      { text: "Reporte General", style: "header" },
      {
        table: {
          widths: ["50%", "50%"],
          body: [
            [
              { text: "Métricas", style: "tableHeader" },
              { text: "Valor", style: "tableHeader" },
            ],
            ["Total Categorías", data.datos.total_categorias || "N/A"],
            ["Total Productos", data.datos.total_productos || "N/A"],
            ["Total Facturas", data.datos.total_facturas || "N/A"],
            ["Ventas Totales", data.datos.ventas_totales || "N/A"],
            ["Actividades", data.datos.total_actividades || "N/A"],
            ["Stock", data.datos.stock_total_disponible || "N/A"],
            ["Mantenimientos", data.datos.total_mantenimientos || "N/A"],
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
