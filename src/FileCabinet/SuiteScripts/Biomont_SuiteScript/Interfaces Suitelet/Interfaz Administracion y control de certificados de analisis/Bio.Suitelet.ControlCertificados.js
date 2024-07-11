// Notas del archivo:
// - Secuencia de comando:
//      - Biomont SL Control Certificados (customscript_bio_sl_control_cert)

/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['./lib/Bio.Library.Search', './lib/Bio.Library.Widget', './lib/Bio.Library.Helper', 'N'],

    function (objSearch, objWidget, objHelper, N) {

        const { log } = N;

        /******************/

        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        function onRequest(scriptContext) {

            if (scriptContext.request.method == 'GET') {

                // Crear formulario
                let { form, fieldItem, fieldTriggerType, fieldStatus } = objWidget.createFormReport();

                // Obtener datos por url
                let button = scriptContext.request.parameters['_button'];
                let item = scriptContext.request.parameters['_item'];
                let triggerType = scriptContext.request.parameters['_triggerType'];
                let status = scriptContext.request.parameters['_status'];

                if (button == 'consultar') {

                    // Debug
                    // objHelper.error_log('debug', { item, triggerType, status });

                    // Setear datos al formulario
                    fieldItem.defaultValue = item;
                    fieldTriggerType.defaultValue = triggerType;
                    fieldStatus.defaultValue = status;

                    // Obtener datos por search
                    let dataColaInspeccion = objSearch.getDataColaInspeccion(item, triggerType, status);

                    // Debug
                    // objHelper.error_log('dataColaInspeccion', dataColaInspeccion);

                    // Crear sublista
                    objWidget.createSublist(form, dataColaInspeccion);
                }

                // Renderizar formulario
                scriptContext.response.writePage(form);
            } else { // POST

                // Recuperar valores de los campos
                // Debug
                // Redirigir a este mismo Suitelet (Redirigir a si mismo)
            }
        }

        return { onRequest }

    });
