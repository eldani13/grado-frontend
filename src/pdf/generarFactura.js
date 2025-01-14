  import pdfMake from "pdfmake/build/pdfmake";
  import { vfs } from "pdfmake/build/vfs_fonts";
  import Logo from "../assets/logo1.png";  

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
    const total = factura.total && !isNaN(factura.total) ? factura.total.toFixed(2) : "0.00";

    var docDefinition = {
      content: [
        {
          columns: [
            {
              image: logoBase64,
              width: 150,
            },
            [
              {
                text: 'Factura de Venta',
                color: '#333333',
                width: '*',
                fontSize: 28,
                bold: true,
                alignment: 'right',
                margin: [0, 0, 0, 15],
              },
              {
                stack: [
                  {
                    columns: [
                      {
                        text: 'Factura No.',
                        color: '#aaaaab',
                        bold: true,
                        width: '*',
                        fontSize: 12,
                        alignment: 'right',
                      },
                      {
                        text: `${factura.numero_factura || "N/A"}`,
                        bold: true,
                        color: '#333333',
                        fontSize: 12,
                        alignment: 'right',
                        width: 100,
                      },
                    ],
                  },
                  {
                    columns: [
                      {
                        text: 'Fecha de emision',
                        color: '#aaaaab',
                        bold: true,
                        width: '*',
                        fontSize: 12,
                        alignment: 'right',
                      },
                      {
                        text: `${factura.fecha_salida || "N/A"}`,
                        bold: true,
                        color: '#333333',
                        fontSize: 12,
                        alignment: 'right',
                        width: 100,
                      },
                    ],
                  },
                  {
                    columns: [
                      {
                        text: 'Estado',
                        color: '#aaaaab',
                        bold: true,
                        fontSize: 12,
                        alignment: 'right',
                        width: '*',
                      },
                      {
                        text: 'PAID',
                        bold: true,
                        fontSize: 14,
                        alignment: 'right',
                        color: 'green',
                        width: 100,
                      },
                    ],
                  },
                ],
              },
            ],
          ],
        },
        {
          columns: [
            {
              text: 'Compañia',
              color: '#aaaaab',
              bold: true,
              fontSize: 14,
              alignment: 'left',
              margin: [0, 20, 0, 5],
            },
            {
              text: 'Cliente',
              color: '#aaaaab',
              bold: true,
              fontSize: 14,
              alignment: 'left',
              margin: [0, 20, 0, 5],
            },
          ],
        },
        {
          columns: [
            {
              text: 'CASA PRODUCTORA',
              bold: true,
              color: '#333333',
              alignment: 'left',
            },
            {
              text: `${factura.nombre_cliente || "N/A"}`,
              bold: true,
              color: '#333333',
              alignment: 'left',
            },
          ],
          
        },
        {
          columns: [

            {
              text: 'CASA PRODUCTORA S.A.S.',
              bold: true,
              color: '#333333',
              alignment: 'left',
            },
            {
              text: `${factura.compania_cliente || "N/A"}`,
              bold: true,
              color: '#333333',
              alignment: 'left',
            },
          ],
          
        },
        {
          columns: [
            {
              text: 'Direccion',
              color: '#aaaaab',
              bold: true,
              margin: [0, 7, 0, 3],
            },
            {
              text: 'Direccion',
              color: '#aaaaab',
              bold: true,
              margin: [0, 7, 0, 3],
            },
          ],
        },
        {
          columns: [
            {
              text: 'Cl. 29a #21a-80 \nManga, Cartagena de Indias',
              style: 'invoiceBillingAddress',
            },
            {
              text: `${factura.direccion || "N/A"}\n ${factura.barrio || "N/A"}`,
              style: 'invoiceBillingAddress',
            },
          ],
        },
        '\n\n',
        {
          width: '100%',
          alignment: 'center',
          text: 'Detalles',
          bold: true,
          margin: [0, 10, 0, 10],
          fontSize: 15,
        },
        {
          layout: {
            defaultBorder: false,
            hLineWidth: function(i, node) {
              return 1;
            },
            vLineWidth: function(i, node) {
              return 1;
            },
            hLineColor: function(i, node) {
              if (i === 1 || i === 0) {
                return '#bfdde8';
              }
              return '#eaeaea';
            },
            vLineColor: function(i, node) {
              return '#eaeaea';
            },
            hLineStyle: function(i, node) {
              // if (i === 0 || i === node.table.body.length) {
              return null;
              //}
            },
            // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
            paddingLeft: function(i, node) {
              return 10;
            },
            paddingRight: function(i, node) {
              return 10;
            },
            paddingTop: function(i, node) {
              return 2;
            },
            paddingBottom: function(i, node) {
              return 2;
            },
            fillColor: function(rowIndex, node, columnIndex) {
              return '#fff';
            },
          },
          table: {
            headerRows: 1,
            widths: ['*', "auto", "auto", "auto","auto","auto","auto"],
            body: [
              [
                {
                  text: 'EQUIPO',
                  fillColor: '#eaf2f5',
                  border: [false, true, false, true],
                  margin: [0, 5, 0, 5],
                  textTransform: 'uppercase',
                },
                {
                  text: 'REFERENCIA',
                  border: [false, true, false, true],
                  alignment: 'center',
                  fillColor: '#eaf2f5',
                  margin: [0, 5, 0, 5],
                  textTransform: 'uppercase',
                },
                {
                  text: 'MARCA',
                  fillColor: '#eaf2f5',
                  border: [false, true, false, true],
                  margin: [0, 5, 0, 5],
                  textTransform: 'uppercase',
                },
                {
                  text: 'SERIAL',
                  fillColor: '#eaf2f5',
                  border: [false, true, false, true],
                  margin: [0, 5, 0, 5],
                  textTransform: 'uppercase',
                },
                {
                  text: 'CANTIDAD',
                  border: [false, true, false, true],
                  alignment: 'center',
                  fillColor: '#eaf2f5',
                  margin: [0, 5, 0, 5],
                  textTransform: 'uppercase',
                },
                {
                  text: 'P.UNITARIO',
                  border: [false, true, false, true],
                  alignment: 'center',
                  fillColor: '#eaf2f5',
                  margin: [0, 5, 0, 5],
                  textTransform: 'uppercase',
                },
                {
                  text: 'P.TOTAL',
                  border: [false, true, false, true],
                  alignment: 'center',
                  fillColor: '#eaf2f5',
                  margin: [0, 5, 0, 5],
                  textTransform: 'uppercase',
                },
              ],
              [
                {
                  text: `${factura.equipo || "N/A"}`,
                  border: [false, false, false, true],
                  margin: [0, 5, 0, 5],
                  alignment: 'left',
                },
                {
                  border: [false, false, false, true],
                  text: `${factura.referencia || "N/A"}`,
                  fillColor: '#f5f5f5',
                  alignment: 'right',
                  margin: [0, 5, 0, 5],
                },
                {
                  text: `${factura.marca || "N/A"}`,
                  border: [false, false, false, true],
                  margin: [0, 5, 0, 5],
                  alignment: 'left',
                },
                {
                  border: [false, false, false, true],
                  text: `${factura.serial || "N/A"}`,
                  fillColor: '#f5f5f5',
                  alignment: 'right',
                  margin: [0, 5, 0, 5],
                },
                {
                  border: [false, false, false, true],
                  text: `${factura.cantidad || "N/A"}`,
                  fillColor: '#f5f5f5',
                  alignment: 'right',
                  margin: [0, 5, 0, 5],
                },
                {
                  border: [false, false, false, true],
                  text: `$${precioUnidad}`,
                  fillColor: '#f5f5f5',
                  alignment: 'right',
                  margin: [0, 5, 0, 5],
                },
                {
                  text: `$${total}`,
                  border: [false, false, false, true],
                  margin: [0, 5, 0, 5],
                  alignment: 'left',
                },
              ],

            ],
          },
          
        },
        '\n',
        '\n\n',
        '\n\n',

        {
          layout: {
            defaultBorder: false,
            hLineWidth: function(i, node) {
              return 1;
            },
            vLineWidth: function(i, node) {
              return 1;
            },
            hLineColor: function(i, node) {
              return '#eaeaea';
            },
            vLineColor: function(i, node) {
              return '#eaeaea';
            },
            hLineStyle: function(i, node) {
              // if (i === 0 || i === node.table.body.length) {
              return null;
              //}
            },
            // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
            paddingLeft: function(i, node) {
              return 10;
            },
            paddingRight: function(i, node) {
              return 10;
            },
            paddingTop: function(i, node) {
              return 3;
            },
            paddingBottom: function(i, node) {
              return 3;
            },
            fillColor: function(rowIndex, node, columnIndex) {
              return '#fff';
            },
          },
          table: {
            headerRows: 1,
            widths: ['*', 'auto'],
            body: [
              [
                {
                  text: 'Subtotal de pago',
                  border: [false, true, false, true],
                  alignment: 'right',
                  margin: [0, 5, 0, 5],
                },
                {
                  border: [false, true, false, true],
                  text: `$${total}`,
                  alignment: 'right',
                  fillColor: '#f5f5f5',
                  margin: [0, 5, 0, 5],
                },
              ],
              [
                {
                  text: 'Tarifa del pago',
                  border: [false, false, false, true],
                  alignment: 'right',
                  margin: [0, 5, 0, 5],
                },
                {
                  text: '$0',
                  border: [false, false, false, true],
                  fillColor: '#f5f5f5',
                  alignment: 'right',
                  margin: [0, 5, 0, 5],
                },
              ],
              [
                {
                  text: 'Monto Total',
                  bold: true,
                  fontSize: 20,
                  alignment: 'right',
                  border: [false, false, false, true],
                  margin: [0, 5, 0, 5],
                },
                {
                  text: `$${total}`,
                  bold: true,
                  fontSize: 20,
                  alignment: 'right',
                  border: [false, false, false, true],
                  fillColor: '#f5f5f5',
                  margin: [0, 5, 0, 5],
                },
              ],
            ],
          },
        },
        '\n\n',
        {
          text: 'NOTA',
          style: 'notesTitle',
        },
        {
          text: "Gracias por su compra.\nSi tiene alguna pregunta sobre esta factura, no dude en contactarnos al correo example@example.com o al teléfono +57 123 4567 890.\nHorario de atención: Lunes a Viernes, 9:00 AM - 6:00 PM.\nCASA PRODUCTORA S.A.S - Todos los derechos reservados.",
          style: 'notesText',
        },
        
      ],
      styles: {
        notesTitle: {
          fontSize: 10,
          bold: true,
          margin: [0, 50, 0, 3],
        },
        notesText: {
          fontSize: 10,
        },
      },
      defaultStyle: {
        columnGap: 20,
        //font: 'Quicksand',
      },
    };

    pdfMake
      .createPdf(docDefinition)
      .download(`Factura_${factura.numero_factura}.pdf`);
  };

  export default generarFacturaPDF;
