import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.vfs;

export default function generarStock(data) {
  // Verifica si los datos están disponibles y son un array
  if (!Array.isArray(data) || data.length === 0) {
    console.error("El data de stock no es válido o está vacío.");
    return pdfMake.createPdf({
      content: [{ text: "No hay datos disponibles para el reporte de stock.", style: "header" }],
    });
  }

  // Crea las filas de la tabla dinámicamente
  const tableBody = [
    // Encabezados de la tabla
    [
      { text: "Equipo", style: "tableHeader" },
      { text: "Marca", style: "tableHeader" },
      { text: "Cantidad", style: "tableHeader" },
      { text: "Estado", style: "tableHeader" },
    ],
    // Filas de datos
    ...data.map((item) => [
      item.equipo || "N/A",
      item.marca || "N/A",
      item.cantidad || 0,
      item.estado || "N/A",
    ]),
  ];

  const docDefinition = {
    content: [
      { text: "Reporte de Stock", style: "header" },
      {
        table: {
          widths: ["25%", "25%", "25%", "25%"],
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
        marginBottom: 10,
      },
      tableHeader: {
        bold: true,
        fillColor: "#eeeeee",
        fontSize: 12,
        alignment: "center",
      },
    },
  };

  // Devuelve el PDF generado
  return pdfMake.createPdf(docDefinition);
}
