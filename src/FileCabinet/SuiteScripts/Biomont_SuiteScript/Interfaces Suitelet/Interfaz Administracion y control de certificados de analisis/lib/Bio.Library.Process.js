/**
 * @NApiVersion 2.1
 */
define(['./Bio.Library.Helper', 'N'],

    function (objHelper, N) {

        function getDataMP_PDFDetalle_Agrupada(dataMP_PDFDetalle, dataMP_PDFDetalle_RecepcionArticulo) {

            // Recorrer Datos de calidad
            dataMP_PDFDetalle.forEach((value, key) => {

                // Recorrer Transaccion - Recepción de artículo
                dataMP_PDFDetalle_RecepcionArticulo.forEach((value_, key_) => {

                    // Validar los lotes
                    if (value.numero_lote == value_.det_inv_lote_nombre) {
                        dataMP_PDFDetalle[key]['fecha_lote'] = dataMP_PDFDetalle[key]['fecha_lote'] || []; // Validar si encontrara mas de una fecha
                        dataMP_PDFDetalle[key]['fecha_lote'].push(value_.det_inv_fecha_caducidad);
                    }
                })
            });

            // Obtener data en formato agrupado
            let dataAgrupada = {}; // * Audit: Util, manejo de JSON

            dataMP_PDFDetalle.forEach(element => {

                // Obtener variables
                let numero_lote = element.numero_lote;

                // Agrupar data
                dataAgrupada[numero_lote] = dataAgrupada[numero_lote] || [];
                dataAgrupada[numero_lote].push(element);

                // Otra forma
                // dataAgrupada[numero_lote] ??= [];
                // dataAgrupada[numero_lote] = element;
            });

            return dataAgrupada;
        }

        return { getDataMP_PDFDetalle_Agrupada }

    });
