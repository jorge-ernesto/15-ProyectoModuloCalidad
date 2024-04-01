// Notas del archivo:
// - Secuencia de comando:
//      - Biomont SL Con. Cert. Det. Des. Arc. (customscript_bio_sl_con_cert_det_des_arc)

/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['./lib/Bio.Library.Search', './lib/Bio.Library.Helper', 'N'],

    function (objSearch, objHelper, N) {

        const { log, file, render, encode, record } = N;

        /******************/

        // Crear PDF
        function createPDF(tipo_pdf, cola_inspeccion_id, cola_inspeccion_data) {
            // Nombre del archivo
            let typeRep = 'reporteCertificadoAnalisis';
            let titleDocument = 'Reporte Certificado de Análisis'

            // Determinar tipo de pdf
            // Template del archivo
            let templatePdf = null;
            if (tipo_pdf == 'MP')
                templatePdf = 'pdfreport_certificado_mp';
            else if (tipo_pdf == 'ME_MV')
                templatePdf = 'pdfreport_certificado_me_mv';
            else if (tipo_pdf == 'PT')
                templatePdf = 'pdfreport_certificado_pt';

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

        function getData(tipo_pdf, cola_inspeccion_id, articulo_id, numero_linea_transaccion) {
            // Obtener el record de la cola de inspeccion
            var colaInspeccionRecord = record.load({
                type: 'customrecord_qm_queue',
                id: cola_inspeccion_id
            });

            // Obtener data
            let transaccion_inv_id = colaInspeccionRecord.getValue('custrecord_qm_queue_transaction_inv');

            // Obtener data
            let data_PDFCabecera = [];
            let data_PDFDetalle = [];
            let data_PDFDetalle_DatosPreviosInspeccion = [];
            let data_PDFDetalle_DatosISO2859 = [];

            // Determinar tipo de pdf
            if (tipo_pdf == 'MP' || tipo_pdf == 'ME_MV')
                data_PDFCabecera = objSearch.getData_PDFCabecera_MPMEMV(cola_inspeccion_id, articulo_id, numero_linea_transaccion);
            else if (tipo_pdf == 'PT')
                data_PDFCabecera = objSearch.getData_PDFCabecera_PT(cola_inspeccion_id, articulo_id, numero_linea_transaccion);

            if (tipo_pdf == 'MP' || tipo_pdf == 'ME_MV') {
                data_PDFDetalle = objSearch.getData_PDFDetalle_Completa_MPMEMV_PT(tipo_pdf, cola_inspeccion_id, transaccion_inv_id, articulo_id, numero_linea_transaccion);
                data_PDFDetalle_DatosPreviosInspeccion = objSearch.getData_PDFDetalle_DatosPreviosInspeccion(cola_inspeccion_id, transaccion_inv_id, articulo_id, numero_linea_transaccion);
                data_PDFDetalle_DatosISO2859 = objSearch.getData_PDFDetalle_DatosISO2859(cola_inspeccion_id, transaccion_inv_id, articulo_id, numero_linea_transaccion);
            } else if (tipo_pdf == 'PT') {
                data_PDFDetalle = objSearch.getData_PDFDetalle_Completa_MPMEMV_PT(tipo_pdf, cola_inspeccion_id, transaccion_inv_id, articulo_id, numero_linea_transaccion);
            }

            // Debug
            // objHelper.error_log('data', { tipo_pdf, data_PDFCabecera, data_PDFDetalle });

            // Obtener data
            let data = {
                data_PDFCabecera: objHelper.convertObjectValuesToStrings(data_PDFCabecera),
                data_PDFDetalle: objHelper.convertObjectValuesToStrings(data_PDFDetalle),
                data_PDFDetalle_DatosPreviosInspeccion: objHelper.convertObjectValuesToStrings(data_PDFDetalle_DatosPreviosInspeccion),
                data_PDFDetalle_DatosISO2859: objHelper.convertObjectValuesToStrings(data_PDFDetalle_DatosISO2859)
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
                let tipo_pdf = scriptContext.request.parameters['_tipo_pdf'];

                // objHelper.error_log('data', { cola_inspeccion_id, articulo_id, numero_linea_transaccion })

                if (button == 'pdf') {

                    // Obtener datos
                    let cola_inspeccion_data = getData(tipo_pdf, cola_inspeccion_id, articulo_id, numero_linea_transaccion);

                    // Crear PDF
                    let { pdfFile } = createPDF(tipo_pdf, cola_inspeccion_id, cola_inspeccion_data);

                    // Descargar PDF
                    scriptContext.response.writeFile({
                        file: pdfFile
                    });
                }
            }
        }

        return { onRequest }

    });
