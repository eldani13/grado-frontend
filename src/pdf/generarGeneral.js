import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default function generarGeneral(reportData) {
  const docDefinition = {
    content: [
      { text: "Reporte General", style: "header" },
      {
        table: {
          widths: ["50%", "50%"],
          body: [
            [{ text: "Métricas", style: "tableHeader" }, { text: "Valor", style: "tableHeader" }],
            ["Total Categorías", reportData.total_categorias || "N/A"],
            ["Total Productos", reportData.total_productos || "N/A"],
            ["Total Facturas", reportData.total_facturas || "N/A"],
            ["Ventas Totales", reportData.ventas_totales || "N/A"],
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
