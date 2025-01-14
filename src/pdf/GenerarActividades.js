import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.vfs;

export default function generarActividades(data) {
  const docDefinition = {
    content: [
      { text: "Reporte de Actividades", style: "header" },
      {
        table: {
          widths: ["100%"],
          body: [
            [{ text: "Actividad", style: "tableHeader" }],
            ...data.map((actividad) => [
              actividad.descripcion || "Descripción no disponible",
            ]), // Cambié esto para acceder correctamente a las actividades
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

