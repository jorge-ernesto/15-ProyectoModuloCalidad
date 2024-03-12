// Notas del archivo:
// - Secuencia de comando:
//      - Biomont SL API Control Certificados Det. (customscript_bio_sl_api_control_cert_det)

/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['./lib/Bio.Library.Helper', 'N'],

    function (objHelper, N) {

        const { log, record, runtime, format, url } = N;

        const scriptId = 'customscript_bio_sl_control_cert_det';
        const deployId = 'customdeploy_bio_sl_control_cert_det';

        /******************/

        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        function onRequest(scriptContext) {
            // scriptContext.response.setHeader('Content-type', 'application/json');
            // scriptContext.response.write(JSON.stringify(scriptContext));
            // return;

            // log.debug('method', scriptContext.request.method);
            // log.debug('parameters', scriptContext.request.parameters);
            // log.debug('body', scriptContext.body);
            // return;

            if (scriptContext.request.method == 'POST') {

                // Obtener datos enviados por peticion HTTP
                let data = JSON.parse(scriptContext.request.body);
                let method = data._method || null;

                if (method) {

                    // Obtener datos
                    let cola_inspeccion_id = data._cola_inspeccion_id || null;

                    // Obtener el record de cola de inspeccion de calidad
                    let colaInspeccionRecord = cola_inspeccion_id ? record.load({ type: 'customrecord_qm_queue', id: cola_inspeccion_id }) : null;

                    // Obtener el usuario logueado
                    let user = runtime.getCurrentUser();

                    // Obtener fecha y hora actual
                    var now = new Date();
                    var datetime = format.format({ value: now, type: format.Type.DATETIME });

                    // Respuesta
                    let response = {
                        code: '400',
                        status: 'error',
                        method: method
                    };

                    if (method == 'firmaRevisadoPor') {

                        // Setear datos al record
                        colaInspeccionRecord.setValue('custrecord_bio_qm_queue_usufir_revpor', user.id);
                        colaInspeccionRecord.setValue('custrecord_bio_qm_queue_fecfir_revpor', datetime);
                        let colaInspeccionId = colaInspeccionRecord.save();
                        log.debug('', colaInspeccionId);

                        if (colaInspeccionId) {
                            // Obtener url del Suitelet
                            let urlSuitelet = url.resolveScript({
                                deploymentId: deployId,
                                scriptId: scriptId,
                                params: {
                                    _id: cola_inspeccion_id,
                                    _status: 'PROCESS_SIGNATURE'
                                }
                            })

                            // Respuesta
                            response = {
                                code: '200',
                                status: 'success',
                                method: method,
                                colaInspeccionRecord: colaInspeccionRecord,
                                colaInspeccionId: colaInspeccionId,
                                urlSuitelet: urlSuitelet
                            };
                        }
                    } else if (method == 'firmaAprobadoPor') {

                        // Setear datos al record
                        colaInspeccionRecord.setValue('custrecord_bio_qm_queue_usufir_aprpor', user.id);
                        colaInspeccionRecord.setValue('custrecord_bio_qm_queue_fecfir_aprpor', datetime);
                        let colaInspeccionId = colaInspeccionRecord.save();
                        log.debug('', colaInspeccionId);

                        if (colaInspeccionId) {
                            // Obtener url del Suitelet
                            let urlSuitelet = url.resolveScript({
                                deploymentId: deployId,
                                scriptId: scriptId,
                                params: {
                                    _id: cola_inspeccion_id,
                                    _status: 'PROCESS_SIGNATURE'
                                }
                            })

                            // Respuesta
                            response = {
                                code: '200',
                                status: 'success',
                                method: method,
                                colaInspeccionRecord: colaInspeccionRecord,
                                colaInspeccionId: colaInspeccionId,
                                urlSuitelet: urlSuitelet
                            };
                        }
                    }

                    // Respuesta
                    scriptContext.response.setHeader('Content-type', 'application/json');
                    scriptContext.response.write(JSON.stringify(response));
                }
            }
        }

        return { onRequest }

    });
