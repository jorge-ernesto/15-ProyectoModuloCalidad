// Notas del archivo:
// - Secuencia de comando:
//      - Biomont SL Control Certificados Det. (customscript_bio_sl_control_cert_det)

/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['./lib/Bio.Library.Search', './lib/Bio.Library.Widget', './lib/Bio.Library.Helper', 'N'],

    function (objSearch, objWidget, objHelper, N) {

        const { log, record, redirect, runtime } = N;
        const { message } = N.ui;

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

                // Obtener datos por url
                let id = scriptContext.request.parameters['_id'];
                let status = scriptContext.request.parameters['_status'];
                status = status?.split('|'); // 'SAVE' -> ['SAVE']

                // Obtener datos por search
                let dataColaInspeccion = objSearch.getDataColaInspeccion('', '', '', id);

                // Obtener datos por record
                let dataColaInspeccion_ = record.load({ type: 'customrecord_qm_queue', id: id });

                // Debug
                // objHelper.error_log('id', id);
                // objHelper.error_log('dataColaInspeccion', dataColaInspeccion);

                // Crear formulario
                let {
                    form,
                    // Datos
                    fieldColaInspeccionIdInterno,
                    fieldEspecificacion,
                    fieldArticulo,
                    fieldLinea,
                    fieldTipoProducto,
                    fieldTransaccionPrincipal,
                    fieldEstado,
                    fieldUbicacion,
                    fieldTransaccionInventario,
                    fieldNumeroLineaTransaccion,
                    fieldTipoDisparador,
                    // Datos a actualizar
                    fieldNumeroTecnica,
                    fieldFabricante,
                    fieldFechaFabricacion,
                    fieldFechaAnalisis,
                    fieldFechaReanalisis,
                    // Datos firma
                    fieldUsuarioFirma_RevisadoPor,
                    fieldFechaFirma_RevisadoPor,
                    fieldUsuarioFirma_AprobadoPor,
                    fieldFechaFirma_AprobadoPor,
                    fieldObservaciones
                } = objWidget.createFormDetail(dataColaInspeccion);

                if (status?.includes('SAVE')) {
                    form.addPageInitMessage({
                        type: message.Type.INFORMATION,
                        message: `Se guardo el registro correctamente`,
                        duration: 25000 // 25 segundos
                    });
                }

                if (status?.includes('PROCESS_SIGNATURE')) {
                    form.addPageInitMessage({
                        type: message.Type.INFORMATION,
                        message: `Se firmo correctamente`,
                        duration: 25000 // 25 segundos
                    });
                }

                // /****************** Setear datos al formulario ******************/
                // Datos
                fieldColaInspeccionIdInterno.defaultValue = dataColaInspeccion[0].cola_inspeccion.id;
                fieldEspecificacion.defaultValue = dataColaInspeccion[0].especificacion.nombre;
                fieldArticulo.defaultValue = dataColaInspeccion[0].articulo.id;
                fieldLinea.defaultValue = dataColaInspeccion[0].linea.nombre;
                fieldTipoProducto.defaultValue = dataColaInspeccion[0].tipo_producto.nombre;
                fieldTransaccionPrincipal.defaultValue = dataColaInspeccion[0].transaccion_principal.id;
                fieldEstado.defaultValue = dataColaInspeccion[0].estado.nombre;
                fieldUbicacion.defaultValue = dataColaInspeccion[0].ubicacion.nombre;
                fieldTransaccionInventario.defaultValue = dataColaInspeccion[0].transaccion_inventario.id;
                fieldNumeroLineaTransaccion.defaultValue = dataColaInspeccion[0].numero_linea_transaccion;
                fieldTipoDisparador.defaultValue = dataColaInspeccion[0].tipo_disparador.nombre;

                // Datos a actualizar
                fieldNumeroTecnica.defaultValue = dataColaInspeccion_.getValue('custrecord_bio_qm_queue_num_tecnica');
                fieldFabricante.defaultValue = dataColaInspeccion_.getValue('custrecord_bio_qm_queue_fabricante');
                fieldFechaFabricacion.defaultValue = dataColaInspeccion_.getText('custrecord_bio_qm_queue_fec_fabricacion');
                fieldFechaAnalisis.defaultValue = dataColaInspeccion_.getText('custrecord_bio_qm_queue_fecha_analisis');
                fieldFechaReanalisis.defaultValue = dataColaInspeccion_.getText('custrecord_bio_qm_queue_fecha_reanalisis');

                // Datos firma
                fieldUsuarioFirma_RevisadoPor.defaultValue = dataColaInspeccion_.getValue('custrecord_bio_qm_queue_usufir_revpor');
                fieldFechaFirma_RevisadoPor.defaultValue = dataColaInspeccion_.getValue('custrecord_bio_qm_queue_fecfir_revpor');
                fieldUsuarioFirma_AprobadoPor.defaultValue = dataColaInspeccion_.getValue('custrecord_bio_qm_queue_usufir_aprpor');
                fieldFechaFirma_AprobadoPor.defaultValue = dataColaInspeccion_.getValue('custrecord_bio_qm_queue_fecfir_aprpor');
                fieldObservaciones.defaultValue = dataColaInspeccion_.getValue('custrecord_bio_qm_queue_observaciones');

                /***************** Renderizar formulario *****************/
                scriptContext.response.writePage(form);
            } else { // POST
                /****************** Recibir parametros por POST ******************/
                // Datos
                let cola_inspeccion_id_interno = scriptContext.request.parameters['custpage_field_cola_inspeccion_id_interno'];

                // Datos a actualizar
                let numero_tecnica = scriptContext.request.parameters['custpage_field_numero_tecnica'];
                let fabricante = scriptContext.request.parameters['custpage_field_fabricante'];
                let fecha_fabricacion = scriptContext.request.parameters['custpage_field_fecha_fabricacion'];
                let fecha_analisis = scriptContext.request.parameters['custpage_field_fecha_analisis'];
                let fecha_reanalisis = scriptContext.request.parameters['custpage_field_fecha_reanalisis'];

                // Datos firma
                let observaciones = scriptContext.request.parameters['custpage_field_observaciones'];

                /****************** Actualizar Certificados de Análisis ******************/
                // Datos
                let colaInspeccionRecord = record.load({ type: 'customrecord_qm_queue', id: cola_inspeccion_id_interno });

                // Datos a actualizar
                colaInspeccionRecord.setValue('custrecord_bio_qm_queue_num_tecnica', numero_tecnica);
                colaInspeccionRecord.setValue('custrecord_bio_qm_queue_fabricante', fabricante);
                colaInspeccionRecord.setText('custrecord_bio_qm_queue_fec_fabricacion', fecha_fabricacion);
                colaInspeccionRecord.setText('custrecord_bio_qm_queue_fecha_analisis', fecha_analisis);
                colaInspeccionRecord.setText('custrecord_bio_qm_queue_fecha_reanalisis', fecha_reanalisis);

                // Datos firma
                colaInspeccionRecord.setValue('custrecord_bio_qm_queue_observaciones', observaciones);

                let colaInspeccionId = colaInspeccionRecord.save();
                let _status = '';

                if (colaInspeccionId) {
                    _status = 'SAVE';
                }

                /****************** Redirigir a este mismo Suitelet (Redirigir a si mismo) ******************/
                redirect.toSuitelet({
                    scriptId: runtime.getCurrentScript().id,
                    deploymentId: runtime.getCurrentScript().deploymentId,
                    parameters: {
                        '_id': cola_inspeccion_id_interno,
                        '_status': _status
                    }
                });
            }
        }

        return { onRequest }

    });
