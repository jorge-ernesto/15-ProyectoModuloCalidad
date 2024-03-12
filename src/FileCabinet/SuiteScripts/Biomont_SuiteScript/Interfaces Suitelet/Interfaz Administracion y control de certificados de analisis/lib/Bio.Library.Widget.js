/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 */
define(['./Bio.Library.Search', './Bio.Library.Helper', 'N'],

    function (objSearch, objHelper, N) {

        const { log } = N;
        const { serverWidget } = N.ui;

        const DATA = {
            'clientScriptModulePath': {
                'suiteletReport': './../Bio.Client.ControlCertificados.js',
                'suiteletDetail': './../Bio.Client.ControlCertificados.Det.js',
            }
        }

        /****************** Suitelet Report ******************/
        function createFormReport() {
            // Crear formulario
            let form = serverWidget.createForm({
                title: `Administración y control de certificados de análisis`,
                hideNavbar: false
            })

            // Asociar ClientScript al formulario
            form.clientScriptModulePath = DATA.clientScriptModulePath.suiteletReport;

            // Mostrar botones
            // form.addSubmitButton({
            //     label: 'Consultar'
            // });
            form.addButton({
                id: 'custpage_button_obtener_certificados_analisis',
                label: 'Obtener certificados',
                functionName: 'getColaInspeccion()'
            });

            // Mostrar SubPestañas
            form.addSubtab({
                id: 'custpage_subtab',
                label: 'Lista de certificados'
            });

            /******************  Filtros ******************/
            // Mostrar Grupo de Campos
            form.addFieldGroup({
                id: 'custpage_group',
                label: 'Filtros',
                tab: 'custpage_subtab'
            });

            // Articulos
            let fieldItem = form.addField({
                id: 'custpage_field_filter_item',
                label: 'Artículos',
                type: 'select',
                source: 'item',
                container: 'custpage_group'
            });
            fieldItem.updateBreakType({ breakType: 'STARTCOL' })

            // Tipos de disparadores
            let fieldTriggerType = form.addField({
                id: 'custpage_field_filter_trigger_type',
                label: 'Tipos de disparadores',
                type: 'select',
                // source: 'customlist_qm_trigger_type',
                container: 'custpage_group'
            });
            fieldTriggerType.updateBreakType({ breakType: 'STARTCOL' })
            setFieldReport(fieldTriggerType, 'fieldTriggerType');

            // Estados
            let fieldStatus = form.addField({
                id: 'custpage_field_filter_status',
                label: 'Estados',
                type: 'select',
                // source: 'customlist_qm_inspection_outcomes',
                container: 'custpage_group'
            });
            fieldStatus.updateBreakType({ breakType: 'STARTCOL' })
            setFieldReport(fieldStatus, 'fieldInspectionOutcomes');

            return { form, fieldItem, fieldTriggerType, fieldStatus }
        }

        function setFieldReport(field, name) {
            // Obtener datos por search
            let dataList = [];

            if (name == 'fieldTriggerType') {
                dataList = objSearch.getTriggerTypeList();
            } else if (name == 'fieldInspectionOutcomes') {
                dataList = objSearch.getInspectionOutcomesList();
            }

            field.addSelectOption({
                value: '',
                text: ''
            });

            // Setear los datos obtenidos manualmente al campo supervisor personalizado
            dataList.forEach((element, i) => {
                field.addSelectOption({
                    value: element.id,
                    text: element.name
                })
            })
        }

        function createSublist(form, dataColaInspeccion) {
            // Tipo de sublista
            sublistType = serverWidget.SublistType.LIST;

            // Agregar sublista
            let sublist = form.addSublist({
                id: 'custpage_sublist_reporte_lista_certificados',
                type: sublistType, // serverWidget.SublistType.LIST, serverWidget.SublistType.STATICLIST
                label: 'Lista de certificados',
                tab: 'custpage_subtab'
            });

            // Setear cabecera a sublista
            sublist.addField({ id: 'custpage_id_interno', type: serverWidget.FieldType.INTEGER, label: 'ID interno' });
            sublist.addField({ id: 'custpage_editar', type: serverWidget.FieldType.TEXT, label: 'Editar' });
            sublist.addField({ id: 'custpage_especificacion', type: serverWidget.FieldType.TEXT, label: 'Especificacion' });
            sublist.addField({ id: 'custpage_articulo', type: serverWidget.FieldType.TEXT, label: 'Articulo' });
            sublist.addField({ id: 'custpage_linea', type: serverWidget.FieldType.TEXT, label: 'Linea' });
            sublist.addField({ id: 'custpage_tipo_producto', type: serverWidget.FieldType.TEXT, label: 'Tipo Producto' });
            sublist.addField({ id: 'custpage_transaccion_principal', type: serverWidget.FieldType.TEXT, label: 'Transaccion Principal' });
            sublist.addField({ id: 'custpage_estado', type: serverWidget.FieldType.TEXT, label: 'Estado' });
            sublist.addField({ id: 'custpage_ubicacion', type: serverWidget.FieldType.TEXT, label: 'Ubicacion' });
            sublist.addField({ id: 'custpage_transaccion_inventario', type: serverWidget.FieldType.TEXT, label: 'Transaccion Inventario' });
            sublist.addField({ id: 'custpage_numero_linea_transaccion', type: serverWidget.FieldType.TEXT, label: 'Numero<br /> Linea<br /> Transaccion' });
            sublist.addField({ id: 'custpage_tipo_disparador', type: serverWidget.FieldType.TEXT, label: 'Tipo Disparador' });

            // Setear los datos obtenidos a sublista
            dataColaInspeccion.forEach((element, i) => {
                let { suitelet } = objHelper.getUrlSuiteletDetail(element.cola_inspeccion.id);

                if (element.cola_inspeccion.id) {
                    sublist.setSublistValue({ id: 'custpage_id_interno', line: i, value: element.cola_inspeccion.id });
                }
                if (element.cola_inspeccion.id) {
                    sublist.setSublistValue({ id: 'custpage_editar', line: i, value: `<a href="${suitelet}" target="_blank">Editar</a>` });
                }
                if (element.especificacion.nombre) {
                    sublist.setSublistValue({ id: 'custpage_especificacion', line: i, value: element.especificacion.nombre });
                }
                if (element.articulo.nombre) {
                    sublist.setSublistValue({ id: 'custpage_articulo', line: i, value: element.articulo.nombre });
                }
                if (element.linea.nombre) {
                    sublist.setSublistValue({ id: 'custpage_linea', line: i, value: element.linea.nombre });
                }
                if (element.tipo_producto.nombre) {
                    sublist.setSublistValue({ id: 'custpage_tipo_producto', line: i, value: element.tipo_producto.nombre });
                }
                if (element.transaccion_principal.nombre) {
                    sublist.setSublistValue({ id: 'custpage_transaccion_principal', line: i, value: element.transaccion_principal.nombre });
                }
                if (element.estado.nombre) {
                    sublist.setSublistValue({ id: 'custpage_estado', line: i, value: element.estado.nombre });
                }
                if (element.ubicacion.nombre) {
                    sublist.setSublistValue({ id: 'custpage_ubicacion', line: i, value: element.ubicacion.nombre });
                }
                if (element.transaccion_inventario.nombre) {
                    sublist.setSublistValue({ id: 'custpage_transaccion_inventario', line: i, value: element.transaccion_inventario.nombre });
                }
                if (element.numero_linea_transaccion) {
                    sublist.setSublistValue({ id: 'custpage_numero_linea_transaccion', line: i, value: element.numero_linea_transaccion });
                }
                if (element.tipo_disparador.nombre) {
                    sublist.setSublistValue({ id: 'custpage_tipo_disparador', line: i, value: element.tipo_disparador.nombre });
                }
            });
        }

        /****************** Suitelet Detail ******************/
        function createFormDetail(dataCertificacionAnalisis) {
            // Crear formulario
            let form = serverWidget.createForm({
                title: `Administración y control de certificado de análisis`,
                hideNavbar: false
            })

            // Asociar ClientScript al formulario
            form.clientScriptModulePath = DATA.clientScriptModulePath.suiteletDetail;

            // Mostrar botones
            form.addSubmitButton({
                label: 'Guardar'
            });
            form.addButton({
                id: 'custpage_button_firmar_certificado_analista',
                label: 'Firma revisado por',
                functionName: 'firmaRevisadoPor()'
            });
            form.addButton({
                id: 'custpage_button_firmar_certificado_jcalidad',
                label: 'Firma aprobado por',
                functionName: 'firmaAprobadoPor()'
            });
            form.addButton({
                id: 'custpage_button_descargar_pdf',
                label: 'PDF',
                functionName: 'descargarPDF()'
            });

            // Mostrar SubPestañas
            form.addSubtab({
                id: 'custpage_subtab',
                label: 'Detalle de certificado'
            });

            // Mostrar SubPestañas
            form.addSubtab({
                id: 'custpage_subtab_datcal',
                label: 'Datos de calidad'
            });

            /****************** Datos ******************/
            if (true) {
                // Mostrar Grupo de Campos
                form.addFieldGroup({
                    id: 'custpage_group_dat',
                    label: 'Datos',
                    tab: 'custpage_subtab'
                });

                // Cola Inspeccion ID interno
                var fieldColaInspeccionIdInterno = form.addField({
                    id: 'custpage_field_cola_inspeccion_id_interno',
                    label: 'ID interno',
                    type: 'text',
                    container: 'custpage_group_dat'
                });
                fieldColaInspeccionIdInterno.updateBreakType({ breakType: 'STARTCOL' })
                fieldColaInspeccionIdInterno.updateDisplayType({ displayType: 'INLINE' });

                // Especificacion
                var fieldEspecificacion = form.addField({
                    id: 'custpage_field_especificacion',
                    label: 'Especificacion',
                    type: 'text',
                    container: 'custpage_group_dat'
                });
                fieldEspecificacion.updateBreakType({ breakType: 'STARTROW' })
                fieldEspecificacion.updateDisplayType({ displayType: 'INLINE' });

                // Articulo
                var fieldArticulo = form.addField({
                    id: 'custpage_field_articulo',
                    label: 'Articulo',
                    type: 'select',
                    source: 'item',
                    container: 'custpage_group_dat'
                });
                fieldArticulo.updateBreakType({ breakType: 'STARTROW' })
                fieldArticulo.updateDisplayType({ displayType: 'INLINE' });

                // Linea
                var fieldLinea = form.addField({
                    id: 'custpage_field_linea',
                    label: 'Linea',
                    type: 'text',
                    container: 'custpage_group_dat'
                });
                fieldLinea.updateBreakType({ breakType: 'STARTCOL' })
                fieldLinea.updateDisplayType({ displayType: 'INLINE' });

                // Tipo Producto
                var fieldTipoProducto = form.addField({
                    id: 'custpage_field_tipo_producto',
                    label: 'Tipo Producto',
                    type: 'text',
                    container: 'custpage_group_dat'
                });
                fieldTipoProducto.updateBreakType({ breakType: 'STARTROW' })
                fieldTipoProducto.updateDisplayType({ displayType: 'INLINE' });

                // Transaccion Principal
                var fieldTransaccionPrincipal = form.addField({
                    id: 'custpage_field_transaccion_principal',
                    label: 'Transaccion Principal',
                    type: 'select',
                    source: 'transaction',
                    container: 'custpage_group_dat'
                });
                fieldTransaccionPrincipal.updateBreakType({ breakType: 'STARTROW' })
                fieldTransaccionPrincipal.updateDisplayType({ displayType: 'INLINE' });

                // Estado
                var fieldEstado = form.addField({
                    id: 'custpage_field_estado',
                    label: 'Estado',
                    type: 'text',
                    container: 'custpage_group_dat'
                });
                fieldEstado.updateBreakType({ breakType: 'STARTCOL' })
                fieldEstado.updateDisplayType({ displayType: 'INLINE' });

                // Ubicacion
                var fieldUbicacion = form.addField({
                    id: 'custpage_field_ubicacion',
                    label: 'Ubicacion',
                    type: 'text',
                    container: 'custpage_group_dat'
                });
                fieldUbicacion.updateBreakType({ breakType: 'STARTROW' })
                fieldUbicacion.updateDisplayType({ displayType: 'INLINE' });

                // Transaccion Inventario
                var fieldTransaccionInventario = form.addField({
                    id: 'custpage_field_transaccion_inventario',
                    label: 'Transaccion Inventario',
                    type: 'select',
                    source: 'transaction',
                    container: 'custpage_group_dat'
                });
                fieldTransaccionInventario.updateBreakType({ breakType: 'STARTROW' })
                fieldTransaccionInventario.updateDisplayType({ displayType: 'INLINE' });

                // Número Linea Transaccion
                var fieldNumeroLineaTransaccion = form.addField({
                    id: 'custpage_field_numero_linea_transaccion',
                    label: 'Numero Linea Transaccion',
                    type: 'text',
                    container: 'custpage_group_dat'
                });
                fieldNumeroLineaTransaccion.updateBreakType({ breakType: 'STARTCOL' })
                fieldNumeroLineaTransaccion.updateDisplayType({ displayType: 'INLINE' });

                // Tipo Disparador
                var fieldTipoDisparador = form.addField({
                    id: 'custpage_field_tipo_disparador',
                    label: 'Tipo Disparador',
                    type: 'text',
                    container: 'custpage_group_dat'
                });
                fieldTipoDisparador.updateBreakType({ breakType: 'STARTROW' })
                fieldTipoDisparador.updateDisplayType({ displayType: 'INLINE' });
            }

            /****************** Datos a actualizar ******************/
            if (true) {
                // Mostrar Grupo de Campos
                form.addFieldGroup({
                    id: 'custpage_group_datact',
                    label: 'Datos a actualizar',
                    tab: 'custpage_subtab'
                });

                // Numéro de Técnica
                var fieldNumeroTecnica = form.addField({
                    id: 'custpage_field_numero_tecnica',
                    label: 'Número de Técnica',
                    type: 'text',
                    container: 'custpage_group_datact'
                });
                fieldNumeroTecnica.updateBreakType({ breakType: 'STARTCOL' })

                // Fabricante
                var fieldFabricante = form.addField({
                    id: 'custpage_field_fabricante',
                    label: 'Fabricante',
                    type: 'text',
                    container: 'custpage_group_datact'
                });
                fieldFabricante.updateBreakType({ breakType: 'STARTROW' })

                // Fecha de Fabricación
                var fieldFechaFabricacion = form.addField({
                    id: 'custpage_field_fecha_fabricacion',
                    label: 'Fecha de fabricación',
                    type: 'date',
                    container: 'custpage_group_datact'
                });
                fieldFechaFabricacion.updateBreakType({ breakType: 'STARTROW' })

                // Fecha de Análisis
                var fieldFechaAnalisis = form.addField({
                    id: 'custpage_field_fecha_analisis',
                    label: 'Fecha de Análisis',
                    type: 'date',
                    container: 'custpage_group_datact'
                });
                fieldFechaAnalisis.updateBreakType({ breakType: 'STARTROW' })

                // Fecha de Reanálisis
                var fieldFechaReanalisis = form.addField({
                    id: 'custpage_field_fecha_reanalisis',
                    label: 'Fecha de Renálisis',
                    type: 'date',
                    container: 'custpage_group_datact'
                });
                fieldFechaReanalisis.updateBreakType({ breakType: 'STARTROW' })
            }

            /****************** Datos firma ******************/
            if (true) {
                // Mostrar Grupo de Campos
                form.addFieldGroup({
                    id: 'custpage_group_datfir',
                    label: 'Datos firma',
                    tab: 'custpage_subtab'
                });

                // Usuario Firma Revisado Por
                var fieldUsuarioFirma_RevisadoPor = form.addField({
                    id: 'custpage_field_usuariofirma_revisadopor',
                    label: 'Usuario Firma (Revisado Por)',
                    type: 'select',
                    source: 'employee',
                    container: 'custpage_group_datfir'
                });
                fieldUsuarioFirma_RevisadoPor.updateBreakType({ breakType: 'STARTCOL' })
                fieldUsuarioFirma_RevisadoPor.updateDisplayType({ displayType: 'INLINE' });

                // Fecha Firma Revisado Por
                var fieldFechaFirma_RevisadoPor = form.addField({
                    id: 'custpage_field_fechafirma_revisadopor',
                    label: 'Fecha Firma (Revisado Por)',
                    type: 'text',
                    container: 'custpage_group_datfir'
                });
                fieldFechaFirma_RevisadoPor.updateBreakType({ breakType: 'STARTROW' })
                fieldFechaFirma_RevisadoPor.updateDisplayType({ displayType: 'INLINE' });

                // Usuario Firma Aprobado Por
                var fieldUsuarioFirma_AprobadoPor = form.addField({
                    id: 'custpage_field_usuariofirma_aprobadopor',
                    label: 'Usuario Firma (Aprobado Por)',
                    type: 'select',
                    source: 'employee',
                    container: 'custpage_group_datfir'
                });
                fieldUsuarioFirma_AprobadoPor.updateBreakType({ breakType: 'STARTCOL' })
                fieldUsuarioFirma_AprobadoPor.updateDisplayType({ displayType: 'INLINE' });

                // Fecha Firma Aprobado Por
                var fieldFechaFirma_AprobadoPor = form.addField({
                    id: 'custpage_field_fechafirma_aprobadopor',
                    label: 'Fecha Firma (Aprobado Por)',
                    type: 'text',
                    container: 'custpage_group_datfir'
                });
                fieldFechaFirma_AprobadoPor.updateBreakType({ breakType: 'STARTROW' })
                fieldFechaFirma_AprobadoPor.updateDisplayType({ displayType: 'INLINE' });

                // Observaciones
                var fieldObservaciones = form.addField({
                    id: 'custpage_field_observaciones',
                    label: 'Observaciones',
                    type: 'textarea',
                    container: 'custpage_group_datfir'
                });
                fieldObservaciones.updateBreakType({ breakType: 'STARTCOL' })
            }

            if (true) {

                // Tipo de sublista
                sublistType = serverWidget.SublistType.LIST;

                // Agregar sublista
                let sublist = form.addSublist({
                    id: 'custpage_sublist_reporte_lista_certificados',
                    type: sublistType, // serverWidget.SublistType.LIST, serverWidget.SublistType.STATICLIST
                    label: 'Lista de certificados',
                    tab: 'custpage_subtab_datcal'
                });

                // Setear cabecera a sublista
                sublist.addField({ id: 'custpage_id_interno', type: serverWidget.FieldType.INTEGER, label: 'ID interno' });
                sublist.addField({ id: 'custpage_editar', type: serverWidget.FieldType.TEXT, label: 'Editar' });
                sublist.addField({ id: 'custpage_especificacion', type: serverWidget.FieldType.TEXT, label: 'Especificacion' });
                sublist.addField({ id: 'custpage_articulo', type: serverWidget.FieldType.TEXT, label: 'Articulo' });
                sublist.addField({ id: 'custpage_linea', type: serverWidget.FieldType.TEXT, label: 'Linea' });
                sublist.addField({ id: 'custpage_tipo_producto', type: serverWidget.FieldType.TEXT, label: 'Tipo Producto' });
                sublist.addField({ id: 'custpage_transaccion_principal', type: serverWidget.FieldType.TEXT, label: 'Transaccion Principal' });
                sublist.addField({ id: 'custpage_estado', type: serverWidget.FieldType.TEXT, label: 'Estado' });
                sublist.addField({ id: 'custpage_ubicacion', type: serverWidget.FieldType.TEXT, label: 'Ubicacion' });
                sublist.addField({ id: 'custpage_transaccion_inventario', type: serverWidget.FieldType.TEXT, label: 'Transaccion Inventario' });
                sublist.addField({ id: 'custpage_numero_linea_transaccion', type: serverWidget.FieldType.TEXT, label: 'Numero<br /> Linea<br /> Transaccion' });
                sublist.addField({ id: 'custpage_tipo_disparador', type: serverWidget.FieldType.TEXT, label: 'Tipo Disparador' });
            }

            return {
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
            }
        }

        return { createFormReport, createSublist, createFormDetail }

    });