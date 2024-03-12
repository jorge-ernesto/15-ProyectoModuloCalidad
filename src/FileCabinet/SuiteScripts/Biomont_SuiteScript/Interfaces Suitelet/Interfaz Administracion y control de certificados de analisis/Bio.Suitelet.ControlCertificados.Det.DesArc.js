// Notas del archivo:
// - Secuencia de comando:
//      - Biomont SL Con. Cert. Det. Des. Arc. (customscript_bio_sl_con_cert_det_des_arc)

/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['./lib/Bio.Library.Search', './lib/Bio.Library.Process', './lib/Bio.Library.Helper', 'N'],

    function (objSearch, objProcess, objHelper, N) {

        const { log, file, render, encode, record } = N;

        /******************/

        // Crear PDF
        function createPDF(cola_inspeccion_id, cola_inspeccion_data) {
            // Nombre del archivo
            let typeRep = 'reporteCertificadoAnalisis';
            let titleDocument = 'Reporte Certificado de Análisis'

            // Template del archivo
            let templatePdf =  'pdfreport_cert_analisis_mp';

            // Crear PDF - Contenido dinamico
            let pdfContent = file.load(`./template/PDF/${templatePdf}.ftl`).getContents();
            let rendererPDF = render.create();
            rendererPDF.templateContent = pdfContent;

            // Enviar datos a PDF
            rendererPDF.addCustomDataSource({
                format: render.DataSource.OBJECT,
                alias: "input",
                data: {
                    data: JSON.stringify({
                        name: titleDocument,
                        cola_inspeccion_id: cola_inspeccion_id,
                        cola_inspeccion_data: cola_inspeccion_data,
                        img: 'https://www.biomont.com.pe/storage/img/logo.png'
                    })
                }
            });

            // Crear PDF
            let pdfFile = rendererPDF.renderAsPdf();

            // Reescribir datos de PDF
            pdfFile.name = `biomont_${typeRep}.pdf`;

            return { pdfFile };
        }

        function getData(cola_inspeccion_id, articulo_id, numero_linea_transaccion) {
            // Obtener el record de la cola de inspeccion
            var colaInspeccionRecord = record.load({
                type: 'customrecord_qm_queue',
                id: cola_inspeccion_id
            });

            // Obtener datos
            let transaccion_inv_id = colaInspeccionRecord.getValue('custrecord_qm_queue_transaction_inv');

            // Obtener data MP
            let dataMP_PDFCabecera = objSearch.getDataMP_PDFCabecera(cola_inspeccion_id, articulo_id, numero_linea_transaccion)
            let dataMP_PDFDetalle = objSearch.getDataMP_PDFDetalle(cola_inspeccion_id)
            let dataMP_PDFDetalle_RecepcionArticulo = objSearch.getDataMP_PDFDetalle_RecepcionArticulo(transaccion_inv_id, articulo_id, numero_linea_transaccion)
            let dataMP_PDFDetalle_Agrupada = objProcess.getDataMP_PDFDetalle_Agrupada(dataMP_PDFDetalle, dataMP_PDFDetalle_RecepcionArticulo);

            // Debug
            // objHelper.error_log('dataMP', { dataMP_PDFCabecera, dataMP_PDFDetalle, dataMP_PDFDetalle_RecepcionArticulo, dataMP_PDFDetalle_Agrupada });

            // Obtener data
            let data = {
                dataMP_PDFCabecera: dataMP_PDFCabecera,
                dataMP_PDFDetalle_Agrupada: dataMP_PDFDetalle_Agrupada,
            }

            return data;
        }

        /******************/

        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        function onRequest(scriptContext) {
            // log.debug('method', scriptContext.request.method);
            // log.debug('parameteres', scriptContext.request.parameters);

            if (scriptContext.request.method == 'GET') {
                // Obtener datos por url
                let button = scriptContext.request.parameters['_button'];
                let cola_inspeccion_id = scriptContext.request.parameters['_cola_inspeccion_id'];
                let articulo_id = scriptContext.request.parameters['_articulo_id'];
                let numero_linea_transaccion = scriptContext.request.parameters['_numero_linea_transaccion'];

                // objHelper.error_log('data', { cola_inspeccion_id, articulo_id, numero_linea_transaccion })

                if (button == 'pdf') {

                    // Obtener datos
                    let cola_inspeccion_data = getData(cola_inspeccion_id, articulo_id, numero_linea_transaccion);

                    // Crear PDF
                    let { pdfFile } = createPDF(cola_inspeccion_id, cola_inspeccion_data);

                    // Descargar PDF
                    scriptContext.response.writeFile({
                        file: pdfFile
                    });
                }
            }
        }

        return { onRequest }

    });
