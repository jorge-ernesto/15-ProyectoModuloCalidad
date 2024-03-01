// Notas del archivo:
// - Secuencia de comando:B
//      - Biomont SL Control Fixed Assets Detail (customscript_bio_sl_con_fixed_assets_det)

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
                status = status?.split('|'); // 'SAVE|SEND_EMAIL_BAJA|SEND_EMAIL_TRANSFERENCIA' -> ['SAVE','SEND_EMAIL_BAJA','SEND_EMAIL_TRANSFERENCIA']

                // Obtener datos por search
                let dataActivoFijo = objSearch.getDataActivosFijos([''], [''], '', '', '', '', id);

                // Obtener datos por record
                let dataActivoFijo_ = record.load({ type: 'customrecord_ncfar_asset', id: id });

                // Debug
                // objHelper.error_log('id', id);
                // objHelper.error_log('dataActivosFijo', dataActivoFijo);

                // Crear formulario
                let {
                    form,
                    // IDs internos
                    fieldActivoFijoIdInterno,
                    fieldEstadoAccionIdInterno,
                    fieldClaseIdInterno,
                    // Activo fijo
                    fieldEstadoAccion,
                    // Datos del proveedor
                    fieldProveedor,
                    fieldOrdenCompra,
                    fieldFechaCompra,
                    fieldTransaccion,
                    fieldCostoOriginal,
                    fieldNumeroActivoAlternativo,
                    fieldCantidadFactura,
                    fieldNumeroGuia,
                    // Datos del bien
                    fieldTipoActivo,
                    fieldActivoFijo,
                    fieldDescripcion,
                    fieldEstadoActivo,
                    fieldClase,
                    fieldMarca,
                    fieldModelo,
                    fieldFechaActivacion,
                    fieldSerie,
                    fieldUsuarioDepositario,
                    fieldUbicacion,
                    fieldEstadoBien,
                    fieldDetalleUso,
                    // Baja de activo
                    fieldMotivoBaja,
                    fieldDetalleBaja,
                    fieldAnteriorClase_Baja,
                    fieldUsuarioFirma_AnteriorClase_Baja,
                    fieldFechaFirma_AnteriorClase_Baja,
                    botonAnteriorClase_Baja,
                    fieldArchivoBaja,
                    // Transferencia de activo
                    fieldAnteriorClase_Transferencia,
                    fieldUsuarioFirma_AnteriorClase_Transferencia,
                    fieldFechaFirma_AnteriorClase_Transferencia,
                    botonAnteriorClase_Transferencia,
                    fieldNuevaClase_Transferencia,
                    fieldUsuarioFirma_NuevaClase_Transferencia,
                    fieldFechaFirma_NuevaClase_Transferencia,
                    botonNuevaClase_Transferencia,
                    fieldNuevaUbicacion,
                    fieldNuevoUsuarioDepositario
                } = objWidget.createFormDetail(dataActivoFijo);

                if (status?.includes('SAVE')) {
                    form.addPageInitMessage({
                        type: message.Type.CONFIRMATION,
                        message: `Se guardo el registro correctamente`,
                        duration: 25000 // 25 segundos
                    });
                }

                if (status?.includes('SEND_EMAIL_BAJA') || status?.includes('SEND_EMAIL_TRANSFERENCIA')) {
                    form.addPageInitMessage({
                        type: message.Type.INFORMATION,
                        message: `Se notifico a los jefes de area por email`,
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

                /****************** Setear datos al formulario ******************/
                // IDs Internos
                fieldActivoFijoIdInterno.defaultValue = dataActivoFijo[0].activo_fijo.id_interno;
                fieldEstadoAccionIdInterno.defaultValue = dataActivoFijo[0].estado_accion.id;
                fieldClaseIdInterno.defaultValue = dataActivoFijo[0].centro_costo.id;

                // Activo fijo
                fieldEstadoAccion.defaultValue = dataActivoFijo[0].estado_accion.id; // Editable

                // Datos del proveedor
                fieldProveedor.defaultValue = dataActivoFijo[0].proveedor;
                fieldOrdenCompra.defaultValue = dataActivoFijo[0].orden_compra.id;
                fieldFechaCompra.defaultValue = dataActivoFijo[0].fecha_compra;
                fieldTransaccion.defaultValue = dataActivoFijo[0].factura_compra.numero_documento;
                fieldCostoOriginal.defaultValue = dataActivoFijo[0].costo_original;
                fieldNumeroActivoAlternativo.defaultValue = dataActivoFijo[0].numero_activo_alternativo;
                fieldCantidadFactura.defaultValue = dataActivoFijo[0].cantidad_factura;
                fieldNumeroGuia.defaultValue = dataActivoFijo_.getValue('custrecord_bio_num_guia_con_act_fij'); // Editable

                // Datos del bien
                fieldTipoActivo.defaultValue = dataActivoFijo[0].tipo_activo.nombre;
                fieldActivoFijo.defaultValue = dataActivoFijo[0].activo_fijo.id + ' ' + dataActivoFijo[0].activo_fijo.nombre
                fieldDescripcion.defaultValue = dataActivoFijo[0].descripcion_activo;
                fieldEstadoActivo.defaultValue = dataActivoFijo[0].estado_activo.nombre;
                fieldClase.defaultValue = dataActivoFijo[0].centro_costo.nombre;
                fieldMarca.defaultValue = dataActivoFijo_.getValue('custrecord_bio_marca_con_act_fij'); // Editable
                fieldModelo.defaultValue = dataActivoFijo_.getValue('custrecord_bio_modelo_con_act_fij'); // Editable
                fieldFechaActivacion.defaultValue = dataActivoFijo_.getValue('custrecord_assetdeprstartdate'); // Editable // INFORMACION CAMPO EXISTENTE
                fieldSerie.defaultValue = dataActivoFijo_.getValue('custrecord_assetserialno'); // Editable // INFORMACION CAMPO EXISTENTE
                fieldUsuarioDepositario.defaultValue = dataActivoFijo_.getValue('custrecord_assetcaretaker'); // Editable // INFORMACION CAMPO EXISTENTE
                fieldUbicacion.defaultValue = dataActivoFijo_.getValue('custrecord_bio_ubicacion_con_act_fij'); // Editable
                fieldEstadoBien.defaultValue = dataActivoFijo_.getValue('custrecord_bio_est_bien_con_act_fij'); // Editable
                fieldDetalleUso.defaultValue = dataActivoFijo_.getValue('custrecord_bio_det_uso_con_act_fij'); // Editable

                // Baja de activo
                fieldMotivoBaja.defaultValue = dataActivoFijo_.getValue('custrecord_bio_mot_baja_con_act_fij'); // Editable
                fieldDetalleBaja.defaultValue = dataActivoFijo_.getValue('custrecord_bio_det_baja_con_act_fij'); // Editable
                fieldAnteriorClase_Baja.defaultValue = dataActivoFijo[0].centro_costo.nombre;
                fieldUsuarioFirma_AnteriorClase_Baja.defaultValue = dataActivoFijo_.getValue('custrecord_bio_usufir_baja_con_act'); // Editable
                fieldFechaFirma_AnteriorClase_Baja.defaultValue = dataActivoFijo_.getValue('custrecord_bio_fecfir_baja_con_act'); // Editable

                // Transferencia de activo
                fieldAnteriorClase_Transferencia.defaultValue = dataActivoFijo[0].centro_costo.nombre;
                fieldUsuarioFirma_AnteriorClase_Transferencia.defaultValue = dataActivoFijo_.getValue('custrecord_bio_usufirantcc_trans_con_act'); // Editable
                fieldFechaFirma_AnteriorClase_Transferencia.defaultValue = dataActivoFijo_.getValue('custrecord_bio_fecfirantcc_trans_con_act'); // Editable
                fieldNuevaClase_Transferencia.defaultValue = dataActivoFijo_.getValue('custrecord_bio_nue_cc_con_act_fij'); // Editable
                fieldUsuarioFirma_NuevaClase_Transferencia.defaultValue = dataActivoFijo_.getValue('custrecord_bio_usufirnuecc_trans_con_act'); // Editable
                fieldFechaFirma_NuevaClase_Transferencia.defaultValue = dataActivoFijo_.getValue('custrecord_bio_fecfirnuecc_trans_con_act'); // Editable
                fieldNuevaUbicacion.defaultValue = dataActivoFijo_.getValue('custrecord_bio_nue_ubicacion_con_act_fij'); // Editable
                fieldNuevoUsuarioDepositario.defaultValue = dataActivoFijo_.getValue('custrecord_bio_nue_usu_depo_con_act_fij'); // Editable

                /***************** Habilitar buttons *****************/
                // Obtener usuarios para enviar correo
                let { usersBaja, usersTransferencia } = objSearch.getUsersByTipoAccionCentroCosto(dataActivoFijo[0].activo_fijo.id_interno);

                // Obtener usuario logueado
                let { user } = objHelper.getUser();

                // Debug
                // objHelper.error_log('debug', { usersBaja, usersTransferencia, user });

                // * BAJA
                if (dataActivoFijo[0].estado_accion.id == 2) {

                    // Usuarios del Anterior Centro de Costo
                    if (usersBaja.usersId.includes(Number(user.id))) {
                        botonAnteriorClase_Baja.updateDisplayType({ displayType: 'NORMAL' });
                    }
                }

                // * TRANSFERENCIA
                if (dataActivoFijo[0].estado_accion.id == 3) {

                    // Usuarios del Anterior Centro de Costo
                    if (usersTransferencia.usersId.includes(Number(user.id))) {
                        botonAnteriorClase_Transferencia.updateDisplayType({ displayType: 'NORMAL' });
                    }

                    // Usuarios del Nuevo Centro de Costo
                    if (usersTransferencia.usersId_.includes(Number(user.id))) {
                        botonNuevaClase_Transferencia.updateDisplayType({ displayType: 'NORMAL' });
                    }
                }

                /***************** Renderizar formulario *****************/
                scriptContext.response.writePage(form);
            } else { // POST
                /****************** Recibir parametros por POST ******************/
                // IDs Internos
                let activo_fijo_id_interno = scriptContext.request.parameters['custpage_field_activo_fijo_id_interno'];

                // Activo fijo
                let estado_accion = scriptContext.request.parameters['custpage_field_estado_accion'];
                let estado_proceso = 2;

                // Datos del proveedor
                let numero_guia = scriptContext.request.parameters['custpage_field_numero_guia'];

                // Datos del bien
                let marca = scriptContext.request.parameters['custpage_field_marca'];
                let modelo = scriptContext.request.parameters['custpage_field_modelo'];
                let fecha_activacion = scriptContext.request.parameters['custpage_field_fecha_activacion']; // ACTUALIZA CAMPO EXISTENTE
                let nserie = scriptContext.request.parameters['custpage_field_nserie']; // ACTUALIZA CAMPO EXISTENTE
                let usuario_depositario = scriptContext.request.parameters['custpage_field_usuario_depositario']; // ACTUALIZA CAMPO EXISTENTE
                let ubicacion = scriptContext.request.parameters['custpage_field_ubicacion'];
                let estado_bien = scriptContext.request.parameters['custpage_field_estado_bien'];
                let detalle_uso = scriptContext.request.parameters['custpage_field_detalle_uso'];

                // Baja de activo
                let motivo_baja = scriptContext.request.parameters['custpage_field_motivo_baja'];
                let detalle_baja = scriptContext.request.parameters['custpage_field_detalle_baja'];
                let usuariofirma_anteriorclase_baja = scriptContext.request.parameters['custpage_field_usuariofirma_anteriorclase_baja'];
                let fechafirma_anteriorclase_baja = scriptContext.request.parameters['custpage_field_fechafirma_anteriorclase_baja'];
                let archivo_baja = scriptContext.request.files.custpage_field_archivo_baja;

                // Transferencia de activo
                let usuariofirma_anteriorclase_transferencia = scriptContext.request.parameters['custpage_field_usuariofirma_anteriorclase_transferencia'];
                let fechafirma_anteriorclase_transferencia = scriptContext.request.parameters['custpage_field_fechafirma_anteriorclase_transferencia'];
                let nuevaclase_transferencia = scriptContext.request.parameters['custpage_field_nuevaclase_transferencia'];
                let usuariofirma_nuevaclase_transferencia = scriptContext.request.parameters['custpage_field_usuariofirma_nuevaclase_transferencia'];
                let fechafirma_nuevaclase_transferencia = scriptContext.request.parameters['custpage_field_fechafirma_nuevaclase_transferencia'];
                let nueva_ubicacion = scriptContext.request.parameters['custpage_field_nueva_ubicacion'];
                let nuevo_usuario_depositario = scriptContext.request.parameters['custpage_field_nuevo_usuario_depositario'];

                /****************** Actualizar Activos Fijos ******************/
                // IDs Internos
                let activoFijoRecord = record.load({ type: 'customrecord_ncfar_asset', id: activo_fijo_id_interno });

                // Activo fijo
                activoFijoRecord.setValue('custrecord_bio_est_acc_con_act_fij', estado_accion);
                activoFijoRecord.setValue('custrecord_bio_est_proc_con_act_fij', estado_proceso);

                // * ALTA
                if (estado_accion == 1) {
                    // Datos del proveedor
                    activoFijoRecord.setValue('custrecord_bio_num_guia_con_act_fij', numero_guia);

                    // Datos del bien
                    activoFijoRecord.setValue('custrecord_bio_marca_con_act_fij', marca);
                    activoFijoRecord.setValue('custrecord_bio_modelo_con_act_fij', modelo);
                    if (activoFijoRecord.getValue('custrecord_assetstatus') == 6 || activoFijoRecord.getText('custrecord_assetstatus') == 'Nuevo') activoFijoRecord.setText('custrecord_assetdeprstartdate', fecha_activacion); // ACTUALIZA CAMPO EXISTENTE // Solo guarda "Fecha de Activación" cuando el "Estado Activo" es "Nuevo"
                    activoFijoRecord.setValue('custrecord_assetserialno', nserie); // ACTUALIZA CAMPO EXISTENTE
                    activoFijoRecord.setValue('custrecord_assetcaretaker', usuario_depositario); // ACTUALIZA CAMPO EXISTENTE
                    activoFijoRecord.setValue('custrecord_bio_ubicacion_con_act_fij', ubicacion);
                    activoFijoRecord.setValue('custrecord_bio_est_bien_con_act_fij', estado_bien);
                    activoFijoRecord.setValue('custrecord_bio_det_uso_con_act_fij', detalle_uso);
                }

                // * BAJA
                if (estado_accion == 2) {
                    // Baja de activo
                    activoFijoRecord.setValue('custrecord_bio_mot_baja_con_act_fij', motivo_baja);
                    activoFijoRecord.setValue('custrecord_bio_det_baja_con_act_fij', detalle_baja);
                    activoFijoRecord.setValue('custrecord_bio_usufir_baja_con_act', usuariofirma_anteriorclase_baja);
                    activoFijoRecord.setValue('custrecord_bio_fecfir_baja_con_act', fechafirma_anteriorclase_baja);
                }

                // * TRANSFERENCIA
                if (estado_accion == 3) {
                    // Transferencia de activo
                    activoFijoRecord.setValue('custrecord_bio_usufirantcc_trans_con_act', usuariofirma_anteriorclase_transferencia);
                    activoFijoRecord.setValue('custrecord_bio_fecfirantcc_trans_con_act', fechafirma_anteriorclase_transferencia);
                    activoFijoRecord.setValue('custrecord_bio_nue_cc_con_act_fij', nuevaclase_transferencia);
                    activoFijoRecord.setValue('custrecord_bio_usufirnuecc_trans_con_act', usuariofirma_nuevaclase_transferencia);
                    activoFijoRecord.setValue('custrecord_bio_fecfirnuecc_trans_con_act', fechafirma_nuevaclase_transferencia);
                    activoFijoRecord.setValue('custrecord_bio_nue_ubicacion_con_act_fij', nueva_ubicacion);
                    activoFijoRecord.setValue('custrecord_bio_nue_usu_depo_con_act_fij', nuevo_usuario_depositario);
                }

                let activoFijoId = activoFijoRecord.save();
                let _status = '';

                if (activoFijoId) {
                    _status = 'SAVE';
                }

                /****************** Subir archivo ******************/
                // Validar que se guardo la informacion correctamente
                if (activoFijoId) {
                    if (archivo_baja) {

                        // Obtener datos del archivo
                        let tipo_archivo = archivo_baja.fileType;
                        let nombre_archivo = archivo_baja.name;

                        // Debug
                        // objHelper.error_log('debug', { tipo_archivo, nombre_archivo });

                        // Validar tipo de archivo
                        if (tipo_archivo == 'PDF' || tipo_archivo == 'MISCBINARY') {

                            // Validar que archivo termine en ".pdf", ".xls" o ".xlsx"
                            if ([".pdf", ".xls", ".xlsx"].some(extension => nombre_archivo.toLowerCase().endsWith(extension))) {

                                // Guardar archivo
                                archivo_baja.folder = 46304; // Carpeta "BAJA DE ACTIVOS FIJOS"
                                archivo_baja.name = objHelper.getNameFile(nombre_archivo);
                                let archivo_baja_id = archivo_baja.save();

                                // Adjuntar archivo al activo fijo
                                var id = record.attach({
                                    record: {
                                        type: 'file',
                                        id: archivo_baja_id
                                    },
                                    to: {
                                        type: 'customrecord_ncfar_asset',
                                        id: activo_fijo_id_interno
                                    }
                                });

                                _status += '|SAVE_FILE';
                            }
                        }
                    }
                }

                /****************** Enviar email ******************/
                // Validar que se guardo la informacion correctamente
                if (activoFijoId) {

                    // Obtener usuarios para enviar correo
                    let { usersBaja, usersTransferencia } = objSearch.getUsersByTipoAccionCentroCosto(activo_fijo_id_interno);

                    // Debug
                    // objHelper.error_log('debug', { usersBaja, usersTransferencia });

                    // * BAJA
                    if (estado_accion == 2) {

                        // Se encontraron usuarios del Anterior Centro de Costo
                        if (Object.keys(usersBaja.usersId).length > 0) {
                            objHelper.sendEmailBaja(usersBaja.usersId, activoFijoRecord);
                            _status += '|SEND_EMAIL_BAJA'
                        }
                    }

                    // * TRANSFERENCIA
                    if (estado_accion == 3) {

                        usersTransferencia.usersId = usersTransferencia.usersId.concat(usersTransferencia.usersId_);

                        // Se encontraron usuarios del Anterior Centro de Costo o Nuevo Centro de Costo
                        if (Object.keys(usersTransferencia.usersId).length > 0) {
                            objHelper.sendEmailTransferencia(usersTransferencia.usersId, activoFijoRecord);
                            _status += '|SEND_EMAIL_TRANSFERENCIA'
                        }
                    }
                }

                /****************** Redirigir a este mismo Suitelet (Redirigir a si mismo) ******************/
                redirect.toSuitelet({
                    scriptId: runtime.getCurrentScript().id,
                    deploymentId: runtime.getCurrentScript().deploymentId,
                    parameters: {
                        '_id': activo_fijo_id_interno,
                        '_status': _status
                    }
                });
            }
        }

        return { onRequest }

    });
