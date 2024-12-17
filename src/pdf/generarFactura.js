import pdfMake from "pdfmake/build/pdfmake";
import { vfs } from "pdfmake/build/vfs_fonts";
import Logo from "../assets/logo.png";  

pdfMake.vfs = vfs;

const convertirImagenABase64 = async (url) => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
};

const generarFacturaPDF = async (factura) => {
  const logoBase64 = await convertirImagenABase64(Logo);

  if (!logoBase64) {
    console.error("Error: La imagen no se ha cargado correctamente.");
    return;
  }

  const precioUnidad = factura.valor && !isNaN(factura.valor) ? factura.valor.toFixed(2) : "0.00";
  const precioTotal = factura.precioTotal && !isNaN(factura.precioTotal) ? factura.precioTotal.toFixed(2) : "0.00";

  const docDefinition = {
    background: [
      {
        canvas: [
          { type: "rect", x: 0, y: 0, w: 595, h: 842, color: "#F4F4F4" },
        ],
      },
    ],
    content: [
      {
        columns: [
          {
            text: "Factura de Venta",
            style: "header",
            width: "50%",
            alignment: "left", 
          },
          {
            image: logoBase64,  
            width: 100, 
            alignment: "right", 
          },
        ],
        margin: [0, 0, 0, 10], 
      },

      {
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 0,
            x2: 515,
            y2: 0,
            lineWidth: 2,
            color: "#007BFF",
          },
        ],
        margin: [0, 0, 0, 10],
      },

      {
        columns: [
          {
            width: "50%",
            text: `Número de Factura: ${factura.numeroFactura}`,
            style: "subheader",
          },
          {
            width: "50%",
            text: `Fecha de Entrada: ${factura.fechaEntrada || "N/A"}`,
            style: "subheader",
            alignment: "right",
          },
        ],
      },
      {
        text: `Fecha de Salida: ${factura.fechaSalida || "N/A"}`,
        style: "subheader",
        alignment: "right",
      },

      { text: "\n" },

      { text: "DETALLE DEL EQUIPO", style: "sectionTitle" },
      {
        table: {
          widths: ["25%", "25%", "25%", "25%"],
          body: [
            [
              { text: "Equipo", style: "tableHeader" },
              { text: "Referencia", style: "tableHeader" },
              { text: "Marca", style: "tableHeader" },
              { text: "Serial", style: "tableHeader" },
            ],
            [
              factura.equipo || "N/A",
              factura.referencia || "N/A",
              factura.marca || "N/A",
              factura.serial || "N/A",
            ],
          ],
        },
        layout: {
          fillColor: (rowIndex) => (rowIndex % 2 === 0 ? "#E9ECEF" : null),
        },
      },

      { text: "\n" },

      { text: "CANTIDAD Y DESCRIPCIÓN", style: "sectionTitle" },
      {
        table: {
          widths: ["50%", "50%"],
          body: [
            [
              { text: "Cantidad", style: "tableHeader" },
              { text: "Descripción", style: "tableHeader" },
            ],
            [factura.cantidad || 0, factura.descripcion || "N/A"],
          ],
        },
        layout: {
          fillColor: (rowIndex) => (rowIndex % 2 === 0 ? "#E9ECEF" : null),
        },
      },

      { text: "\n" },

      { text: "ESTADO Y OBSERVACIONES", style: "sectionTitle" },
      {
        table: {
          widths: ["50%", "50%"],
          body: [
            [
              { text: "Estado", style: "tableHeader" },
              { text: "Observaciones", style: "tableHeader" },
            ],
            [factura.estado || "N/A", factura.observaciones || "N/A"],
          ],
        },
        layout: {
          fillColor: (rowIndex) => (rowIndex % 2 === 0 ? "#E9ECEF" : null),
        },
      },

      { text: "\n" },

      { text: "PÓLIZA Y PRECIOS", style: "sectionTitle" },
      {
        table: {
          widths: ["33%", "33%", "33%"],
          body: [
            [
              { text: "Póliza", style: "tableHeader" },
              { text: "Precio Unidad", style: "tableHeader" },
              { text: "Precio Total", style: "tableHeader" },
            ],
            [
              factura.poliza || "N/A",
              `$${precioUnidad}`,
              `$${precioTotal}`,
            ],
          ],
        },
        layout: {
          fillColor: (rowIndex) => (rowIndex % 2 === 0 ? "#E9ECEF" : null),
        },
      },
    ],
    styles: {
      header: {
        fontSize: 20,
        bold: true,
        color: "#007BFF",
        margin: [0, 0, 0, 20],
      },
      subheader: {
        fontSize: 10,
        color: "#343A40",
        margin: [0, 5, 0, 5],
      },
      sectionTitle: {
        fontSize: 12,
        bold: true,
        color: "#495057",
        margin: [0, 10, 0, 10],
      },
      tableHeader: {
        bold: true,
        fontSize: 10,
        color: "#FFFFFF",
        fillColor: "#007BFF",
        alignment: "center",
      },
    },
    defaultStyle: {
      fontSize: 9,
      color: "#495057",
    },
  };

  pdfMake
    .createPdf(docDefinition)
    .download(`Factura_${factura.numero_factura}.pdf`);
};

export default generarFacturaPDF;
