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
                status = status?.split('|'); // 'PROCESS_SAVE' -> ['PROCESS_SAVE']

                // Obtener datos por search - Cola de inspeccion
                let dataColaInspeccion = objSearch.getDataColaInspeccion('', '', '', id);

                // Obtener datos por record - Cola de inspeccion
                let dataColaInspeccion_ = record.load({ type: 'customrecord_qm_queue', id: id });

                // Obtener datos por search - Datos de calidad
                let cola_inspeccion_id = dataColaInspeccion_.getValue('id');
                let transaccion_inv_id = dataColaInspeccion_.getValue('custrecord_qm_queue_transaction_inv');
                let articulo_id = dataColaInspeccion_.getValue('custrecord_qm_queue_item');
                let numero_linea_transaccion = dataColaInspeccion_.getValue('custrecord_qm_queue_line');
                let tipo_pdf = '-'; // No es necesario buscar la fecha de caducidad en el suitelet detalle de certificado
                let dataDatosCalidad = objSearch.getData_PDFDetalle_Completa_MPMEMV_PT(tipo_pdf, cola_inspeccion_id, transaccion_inv_id, articulo_id, numero_linea_transaccion);

                // Obtener datos por seach - Datos previos de inspección
                let dataDatosPreviosInspeccion = objSearch.getData_PDFDetalle_DatosPreviosInspeccion(cola_inspeccion_id);

                // Obtener datos por seach - Datos de ISO 2859-1 2009
                let dataDatosIso2859 = objSearch.getData_PDFDetalle_DatosISO2859(cola_inspeccion_id);

                // Debug
                // objHelper.error_log('id', id);
                // objHelper.error_log('dataColaInspeccion', dataColaInspeccion);
                // objHelper.error_log('dataDatosCalidad', dataDatosCalidad);
                // objHelper.error_log('dataDatosPreviosInspeccion', dataDatosPreviosInspeccion);
                // objHelper.error_log('dataDatosIso2859', dataDatosIso2859);

                // Crear formulario
                let {
                    form,
                    // Datos
                    fieldColaInspeccionIdInterno,
                    fieldEspecificacion,
                    fieldArticulo,
                    fieldLineaIdInterno,
                    fieldTipoProductoIdInterno,
                    fieldLinea,
                    fieldTipoProducto,
                    fieldTransaccionPrincipal,
                    fieldEstado,
                    fieldUbicacion,
                    fieldTransaccionInventario,
                    fieldNumeroLineaTransaccion,
                    fieldTipoDisparador,
                    // Datos a actualizar
                    // MP
                    fieldNumeroTecnica,
                    fieldFabricante,
                    fieldFechaAnalisis,
                    // ME_MV
                    fieldTipoEmbalajePrimario,
                    fieldTipoEmbalajeSecundario,
                    fieldCantidadInspeccionada,
                    fieldCantidadMuestreada,
                    fieldNivelInspeccionIso2859,
                    // PT
                    fieldFormaFarmaceutica,
                    fieldProcedencia,
                    fieldNumeroAnalisis,
                    fieldPresentacion,
                    // Datos firma
                    fieldUsuarioFirma_RevisadoPor,
                    fieldFechaFirma_RevisadoPor,
                    fieldUsuarioFirma_AprobadoPor,
                    fieldFechaFirma_AprobadoPor,
                    fieldObservaciones
                } = objWidget.createFormDetail(dataColaInspeccion, dataDatosCalidad, dataDatosPreviosInspeccion, dataDatosIso2859);

                // Si hubo una redireccion a este mismo suitelet
                if (status?.includes('PROCESS_SAVE')) {
                    form.addPageInitMessage({
                        type: message.Type.INFORMATION,
                        message: `Se guardo el registro correctamente`,
                        duration: 25000 // 25 segundos
                    });
                } else if (status?.includes('PROCESS_SIGNATURE')) {
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
                fieldLineaIdInterno.defaultValue = dataColaInspeccion[0].linea.id;
                fieldTipoProductoIdInterno.defaultValue = dataColaInspeccion[0].tipo_producto.id;
                fieldLinea.defaultValue = dataColaInspeccion[0].linea.nombre;
                fieldTipoProducto.defaultValue = dataColaInspeccion[0].tipo_producto.nombre;
                fieldTransaccionPrincipal.defaultValue = dataColaInspeccion[0].transaccion_principal.id;
                fieldEstado.defaultValue = dataColaInspeccion[0].estado.id;
                fieldUbicacion.defaultValue = dataColaInspeccion[0].ubicacion.nombre;
                fieldTransaccionInventario.defaultValue = dataColaInspeccion[0].transaccion_inventario.id;
                fieldNumeroLineaTransaccion.defaultValue = dataColaInspeccion[0].numero_linea_transaccion;
                fieldTipoDisparador.defaultValue = dataColaInspeccion[0].tipo_disparador.nombre;

                // Datos a actualizar
                // MP
                fieldNumeroTecnica.defaultValue = dataColaInspeccion_.getValue('custrecord_bio_qm_queue_num_tecnica');
                fieldFabricante.defaultValue = dataColaInspeccion_.getValue('custrecord_bio_qm_queue_fabricante');
                fieldFechaAnalisis.defaultValue = dataColaInspeccion_.getText('custrecord_bio_qm_queue_fecha_analisis');
                // ME_MV
                fieldTipoEmbalajePrimario.defaultValue = dataColaInspeccion_.getValue('custrecord_bio_qm_queue_tip_emb_pri');
                fieldTipoEmbalajeSecundario.defaultValue = dataColaInspeccion_.getValue('custrecord_bio_qm_queue_tip_emb_sec');
                fieldCantidadInspeccionada.defaultValue = dataColaInspeccion_.getText('custrecord_bio_qm_queue_cant_insp');
                fieldCantidadMuestreada.defaultValue = dataColaInspeccion_.getValue('custrecord_bio_qm_queue_cant_mues');
                fieldNivelInspeccionIso2859.defaultValue = dataColaInspeccion_.getText('custrecord_bio_qm_queue_niv_ins_iso_2859');
                // PT
                fieldFormaFarmaceutica.defaultValue = dataColaInspeccion_.getValue('custrecord_bio_qm_queue_pharma_form');
                fieldProcedencia.defaultValue = dataColaInspeccion_.getValue('custrecord_bio_qm_queue_procedencia');
                fieldNumeroAnalisis.defaultValue = dataColaInspeccion_.getValue('custrecord_bio_qm_queue_num_analisis');
                fieldPresentacion.defaultValue = dataColaInspeccion_.getValue('custrecord_bio_qm_queue_presentacion');

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
                let estado = scriptContext.request.parameters['custpage_field_estado'];

                // Datos a actualizar
                // MP
                let numero_tecnica = scriptContext.request.parameters['custpage_field_numero_tecnica'];
                let fabricante = scriptContext.request.parameters['custpage_field_fabricante'];
                let fecha_analisis = scriptContext.request.parameters['custpage_field_fecha_analisis'];
                // ME_MV
                let tipo_embalaje_primario = scriptContext.request.parameters['custpage_field_tipo_embalaje_primario'];
                let tipo_embalaje_secundario = scriptContext.request.parameters['custpage_field_tipo_embalaje_secundario'];
                let cantidad_inspeccionada = scriptContext.request.parameters['custpage_field_cantidad_inspeccionada'];
                let cantidad_muestreada = scriptContext.request.parameters['custpage_field_cantidad_muestreada'];
                let nivel_inspeccion_iso_2859 = scriptContext.request.parameters['custpage_field_nivel_inspeccion_iso_2859'];
                // PT
                let forma_farmaceutica = scriptContext.request.parameters['custpage_field_forma_farmaceutica'];
                let procedencia = scriptContext.request.parameters['custpage_field_procedencia'];
                let numero_analisis = scriptContext.request.parameters['custpage_field_numero_analisis'];
                let presentacion = scriptContext.request.parameters['custpage_field_presentacion'];

                // Datos firma
                let observaciones = scriptContext.request.parameters['custpage_field_observaciones'];

                // Datos previos de inspeccion
                let texto_previos_inspeccion = scriptContext.request.parameters['custpage_sublist_reporte_lista_datos_previos_inspecciondata'];
                let array_previos_inspeccion = texto_previos_inspeccion.split("\u0002").map(item => item.split("\u0001"));
                objSearch.deleteListaDatosPreviosInspeccion(cola_inspeccion_id_interno);
                objSearch.createListaDatosPreviosInspeccion(cola_inspeccion_id_interno, array_previos_inspeccion);

                // Datos de ISO 2859-1 2009
                let texto_iso_2859_1_2009 = scriptContext.request.parameters['custpage_sublist_reporte_lista_datos_iso_2859_1_2009data'];
                let array_iso_2859_1_2009 = texto_iso_2859_1_2009.split("\u0002").map(item => item.split("\u0001"));
                objSearch.deleteListaDatosISO2859(cola_inspeccion_id_interno);
                objSearch.createListaDatosISO2859(cola_inspeccion_id_interno, array_iso_2859_1_2009);

                // Test
                // let texto = "1\u00012\u00013\u00014\u00015\u00026\u00017\u00018\u00019\u000110"
                // let array = texto.split("\u0002").map(item => item.split("\u0001"));

                // Debug
                // objHelper.error_log('', { texto_previos_inspeccion, texto_iso_2859_1_2009 });

                /****************** Actualizar Certificados de Análisis ******************/
                // Datos
                let colaInspeccionRecord = record.load({ type: 'customrecord_qm_queue', id: cola_inspeccion_id_interno });
                colaInspeccionRecord.setValue('custrecord_qm_queue_status', estado);

                // Datos a actualizar
                // MP
                colaInspeccionRecord.setValue('custrecord_bio_qm_queue_num_tecnica', numero_tecnica);
                colaInspeccionRecord.setValue('custrecord_bio_qm_queue_fabricante', fabricante);
                colaInspeccionRecord.setText('custrecord_bio_qm_queue_fecha_analisis', fecha_analisis);
                // ME_MV
                colaInspeccionRecord.setValue('custrecord_bio_qm_queue_tip_emb_pri', tipo_embalaje_primario);
                colaInspeccionRecord.setValue('custrecord_bio_qm_queue_tip_emb_sec', tipo_embalaje_secundario);
                colaInspeccionRecord.setValue('custrecord_bio_qm_queue_cant_insp', cantidad_inspeccionada);
                colaInspeccionRecord.setValue('custrecord_bio_qm_queue_cant_mues', cantidad_muestreada);
                colaInspeccionRecord.setValue('custrecord_bio_qm_queue_niv_ins_iso_2859', nivel_inspeccion_iso_2859);
                // PT
                colaInspeccionRecord.setValue('custrecord_bio_qm_queue_pharma_form', forma_farmaceutica);
                colaInspeccionRecord.setValue('custrecord_bio_qm_queue_procedencia', procedencia);
                colaInspeccionRecord.setValue('custrecord_bio_qm_queue_num_analisis', numero_analisis);
                colaInspeccionRecord.setValue('custrecord_bio_qm_queue_presentacion', presentacion);

                // Datos firma
                colaInspeccionRecord.setValue('custrecord_bio_qm_queue_observaciones', observaciones);

                let colaInspeccionId = colaInspeccionRecord.save();
                let _status = '';

                if (colaInspeccionId) {
                    _status = 'PROCESS_SAVE';
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
