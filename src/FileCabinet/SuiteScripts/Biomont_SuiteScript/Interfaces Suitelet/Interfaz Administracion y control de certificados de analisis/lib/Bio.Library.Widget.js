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
        function createFormDetail(dataColaInspeccion, dataDatosCalidad, dataDatosPreviosInspeccion, dataDatosIso2859) {
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
                id: 'custpage_subtab_2',
                label: 'Datos de calidad'
            });

            // Mostrar SubPestañas
            form.addSubtab({
                id: 'custpage_subtab_3',
                label: 'Datos previos de inspección'
            });

            // Mostrar SubPestañas
            form.addSubtab({
                id: 'custpage_subtab_4',
                label: 'Datos de ISO 2859-1 2009'
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

                // Linea ID interno
                var fieldLineaIdInterno = form.addField({
                    id: 'custpage_field_linea_id_interno',
                    label: 'Linea ID interno',
                    type: 'text',
                    container: 'custpage_group_dat'
                });
                fieldLineaIdInterno.updateBreakType({ breakType: 'STARTROW' })
                fieldLineaIdInterno.updateDisplayType({ displayType: 'HIDDEN' });

                // Tipo Producto ID interno
                var fieldTipoProductoIdInterno = form.addField({
                    id: 'custpage_field_tipo_producto_id_interno',
                    label: 'Tipo Producto ID interno',
                    type: 'select',
                    source: 'customlist1055',
                    container: 'custpage_group_dat'
                });
                fieldTipoProductoIdInterno.updateBreakType({ breakType: 'STARTROW' })
                fieldTipoProductoIdInterno.updateDisplayType({ displayType: 'HIDDEN' });

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
                    type: 'select',
                    // source: 'customlist_qm_inspection_outcomes',
                    container: 'custpage_group_dat'
                });
                fieldEstado.updateBreakType({ breakType: 'STARTCOL' })
                setFieldReport(fieldEstado, 'fieldInspectionOutcomes');

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

                // MP
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

                // Fecha de Análisis
                var fieldFechaAnalisis = form.addField({
                    id: 'custpage_field_fecha_analisis',
                    label: 'Fecha de Análisis',
                    type: 'date',
                    container: 'custpage_group_datact'
                });
                fieldFechaAnalisis.updateBreakType({ breakType: 'STARTROW' })

                // ME_MV
                // Tipo Embalaje Primario
                var fieldTipoEmbalajePrimario = form.addField({
                    id: 'custpage_field_tipo_embalaje_primario',
                    label: 'Tipo Embalaje Primario',
                    type: 'text',
                    container: 'custpage_group_datact'
                });
                fieldTipoEmbalajePrimario.updateBreakType({ breakType: 'STARTCOL' })

                // Tipo Embalaje Secundario
                var fieldTipoEmbalajeSecundario = form.addField({
                    id: 'custpage_field_tipo_embalaje_secundario',
                    label: 'Tipo Embalaje Secundario',
                    type: 'text',
                    container: 'custpage_group_datact'
                });
                fieldTipoEmbalajeSecundario.updateBreakType({ breakType: 'STARTROW' })

                // Cantidad Inspeccionada
                var fieldCantidadInspeccionada = form.addField({
                    id: 'custpage_field_cantidad_inspeccionada',
                    label: 'Cantidad Inspeccionada',
                    type: 'text',
                    container: 'custpage_group_datact'
                });
                fieldCantidadInspeccionada.updateBreakType({ breakType: 'STARTROW' })

                // Cantidad Muestreada
                var fieldCantidadMuestreada = form.addField({
                    id: 'custpage_field_cantidad_muestreada',
                    label: 'Cantidad Muestreada',
                    type: 'text',
                    container: 'custpage_group_datact'
                });
                fieldCantidadMuestreada.updateBreakType({ breakType: 'STARTROW' })

                // Nivel de Inspeccion Norma Tecnica Peruana ISO 2859-1 2009
                var fieldNivelInspeccionIso2859 = form.addField({
                    id: 'custpage_field_nivel_inspeccion_iso_2859',
                    label: 'Nivel de Inspeccion Norma Tecnica Peruana ISO 2859-1 2009',
                    type: 'text',
                    container: 'custpage_group_datact'
                });
                fieldNivelInspeccionIso2859.updateBreakType({ breakType: 'STARTROW' })

                // PT
                // Forma farmaceutica
                var fieldFormaFarmaceutica = form.addField({
                    id: 'custpage_field_forma_farmaceutica',
                    label: 'Forma farmaceutica',
                    type: 'select',
                    source: 'customlist_qm_queue_pharma_form_list',
                    container: 'custpage_group_datact'
                });
                fieldFormaFarmaceutica.updateBreakType({ breakType: 'STARTCOL' })

                // Procedencia
                var fieldProcedencia = form.addField({
                    id: 'custpage_field_procedencia',
                    label: 'Procedencia',
                    type: 'text',
                    container: 'custpage_group_datact'
                });
                fieldProcedencia.updateBreakType({ breakType: 'STARTROW' })

                // Numéro de Análisis
                var fieldNumeroAnalisis = form.addField({
                    id: 'custpage_field_numero_analisis',
                    label: 'Número de Análisis',
                    type: 'text',
                    container: 'custpage_group_datact'
                });
                fieldNumeroAnalisis.updateBreakType({ breakType: 'STARTROW' })

                // Presentación
                var fieldPresentacion = form.addField({
                    id: 'custpage_field_presentacion',
                    label: 'Presentación',
                    type: 'textarea',
                    container: 'custpage_group_datact'
                });
                fieldPresentacion.updateBreakType({ breakType: 'STARTROW' })
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

            /****************** Datos de calidad ******************/
            if (true) {

                // Tipo de sublista
                sublistType = serverWidget.SublistType.LIST;

                // Agregar sublista
                let sublist = form.addSublist({
                    id: 'custpage_sublist_reporte_lista_datos_calidad',
                    type: sublistType, // serverWidget.SublistType.LIST, serverWidget.SublistType.STATICLIST
                    label: 'Lista de datos de calidad',
                    tab: 'custpage_subtab_2'
                });

                // Setear cabecera a sublista
                sublist.addField({ id: 'custpage_lotes', type: serverWidget.FieldType.TEXT, label: 'Lotes' });
                sublist.addField({ id: 'custpage_secuencia', type: serverWidget.FieldType.TEXT, label: 'Secuencia' });
                sublist.addField({ id: 'custpage_ensayos', type: serverWidget.FieldType.TEXT, label: 'Ensayos' });
                sublist.addField({ id: 'custpage_ensayos_mostrar', type: serverWidget.FieldType.TEXT, label: 'Ensayos Mostrar' });
                sublist.addField({ id: 'custpage_especificaciones', type: serverWidget.FieldType.TEXT, label: 'Especificaciones' });
                sublist.addField({ id: 'custpage_campos', type: serverWidget.FieldType.TEXT, label: 'Campos' });
                sublist.addField({ id: 'custpage_instrucciones', type: serverWidget.FieldType.TEXT, label: 'Instrucciones' });
                sublist.addField({ id: 'custpage_resultados', type: serverWidget.FieldType.TEXT, label: 'Resultados' });
                sublist.addField({ id: 'custpage_estado', type: serverWidget.FieldType.TEXT, label: 'Estado' });

                // Setear los datos obtenidos a sublista
                let contador = 0;
                Object.values(dataDatosCalidad).forEach((lotes, keylot) => {
                    lotes.forEach((element, i) => {
                        if (element.numero_lote) {
                            sublist.setSublistValue({ id: 'custpage_lotes', line: contador, value: element.numero_lote });
                        }
                        if (element.secuencia) {
                            sublist.setSublistValue({ id: 'custpage_secuencia', line: contador, value: element.secuencia });
                        }
                        if (element.inspeccion_nombre) {
                            sublist.setSublistValue({ id: 'custpage_ensayos', line: contador, value: element.inspeccion_nombre });
                        }
                        if (element.inspeccion_nombre_mostrar) {
                            sublist.setSublistValue({ id: 'custpage_ensayos_mostrar', line: contador, value: element.inspeccion_nombre_mostrar });
                        }
                        if (element.descripcion_inspeccion) {
                            sublist.setSublistValue({ id: 'custpage_especificaciones', line: contador, value: element.descripcion_inspeccion });
                        }
                        if (element.campo_inspeccion_nombre) {
                            sublist.setSublistValue({ id: 'custpage_campos', line: contador, value: element.campo_inspeccion_nombre });
                        }
                        if (element.instrucciones) {
                            sublist.setSublistValue({ id: 'custpage_instrucciones', line: contador, value: element.instrucciones });
                        }
                        if (element.valor_inspeccion) { // || element.unidad_medida
                            sublist.setSublistValue({ id: 'custpage_resultados', line: contador, value: `${element.valor_inspeccion} ${element.unidad_medida}` });
                        }
                        if (element.estado) {
                            sublist.setSublistValue({ id: 'custpage_estado', line: contador, value: `${element.estado}` });
                        }
                        contador++
                    });
                });
            }

            /****************** Datos previos de inspeccion ******************/
            if (true) {

                // Tipo de sublista
                sublistType = serverWidget.SublistType.INLINEEDITOR;

                // Agregar sublista
                let sublist = form.addSublist({
                    id: 'custpage_sublist_reporte_lista_datos_previos_inspeccion',
                    type: sublistType, // serverWidget.SublistType.LIST, serverWidget.SublistType.STATICLIST
                    label: 'Lista de datos previos de inspección',
                    tab: 'custpage_subtab_3'
                });

                // Mostrar botones
                sublist.addButton({
                    id: 'custpage_button_cargar_datos_previos_inspeccion',
                    label: 'Cargar datos previos de inspección',
                    functionName: 'cargarDatosPreviosInspeccion()'
                });

                // Setear cabecera a sublista
                sublist.addField({ id: 'custpage_id_interno', type: serverWidget.FieldType.TEXT, label: 'ID interno', displayType: 'HIDDEN' });
                sublist.addField({ id: 'custpage_lotes', type: serverWidget.FieldType.TEXT, label: 'Lotes' });
                sublist.addField({ id: 'custpage_inspeccion', type: serverWidget.FieldType.TEXT, label: 'Inspección' });
                sublist.addField({ id: 'custpage_estado', type: serverWidget.FieldType.CHECKBOX, label: 'Estado' });

                // Setear propiedades a sublista
                sublist.getField({ id: 'custpage_id_interno' }).updateDisplayType({ displayType: 'HIDDEN' });
                sublist.getField({ id: 'custpage_lotes' }).isMandatory = true;
                sublist.getField({ id: 'custpage_inspeccion' }).isMandatory = true;

                // Setear los datos obtenidos a sublista
                dataDatosPreviosInspeccion.forEach((element, i) => {
                    if (element.cola_inspeccion_id_interno) {
                        sublist.setSublistValue({ id: 'custpage_id_interno', line: i, value: element.cola_inspeccion_id_interno });
                    }
                    if (element.lote) {
                        sublist.setSublistValue({ id: 'custpage_lotes', line: i, value: element.lote });
                    }
                    if (element.inspeccion) {
                        sublist.setSublistValue({ id: 'custpage_inspeccion', line: i, value: element.inspeccion });
                    }
                    if (element.estado_sublist) {
                        sublist.setSublistValue({ id: 'custpage_estado', line: i, value: element.estado_sublist });
                    }
                });
            }

            /****************** Datos de ISO 2859-1 2009 ******************/
            if (true) {

                // Tipo de sublista
                sublistType = serverWidget.SublistType.INLINEEDITOR;

                // Agregar sublista
                let sublist = form.addSublist({
                    id: 'custpage_sublist_reporte_lista_datos_iso_2859_1_2009',
                    type: sublistType, // serverWidget.SublistType.LIST, serverWidget.SublistType.STATICLIST
                    label: 'Lista de ISO 2859-1 2009',
                    tab: 'custpage_subtab_4'
                });

                // Setear cabecera a sublista
                sublist.addField({ id: 'custpage_id_interno', type: serverWidget.FieldType.TEXT, label: 'ID interno', displayType: 'HIDDEN' });
                sublist.addField({ id: 'custpage_lotes', type: serverWidget.FieldType.TEXT, label: 'Lotes' });
                sublist.addField({ id: 'custpage_aql', type: serverWidget.FieldType.TEXT, label: 'AQL' });
                sublist.addField({ id: 'custpage_max_aceptable', type: serverWidget.FieldType.TEXT, label: 'Max. Aceptable' });
                sublist.addField({ id: 'custpage_cant_encontrada', type: serverWidget.FieldType.TEXT, label: 'Cantidad Encontrada' });
                sublist.addField({ id: 'custpage_def_encontrado', type: serverWidget.FieldType.TEXT, label: 'Defecto Encontrado' });

                // Setear propiedades a sublista
                sublist.getField({ id: 'custpage_id_interno' }).updateDisplayType({ displayType: 'HIDDEN' });
                sublist.getField({ id: 'custpage_lotes' }).isMandatory = true;
                sublist.getField({ id: 'custpage_aql' }).isMandatory = true;

                // Setear los datos obtenidos a sublista
                dataDatosIso2859.forEach((element, i) => {
                    if (element.cola_inspeccion_id_interno) {
                        sublist.setSublistValue({ id: 'custpage_id_interno', line: i, value: element.cola_inspeccion_id_interno });
                    }
                    if (element.lote) {
                        sublist.setSublistValue({ id: 'custpage_lotes', line: i, value: element.lote });
                    }
                    if (element.aql) {
                        sublist.setSublistValue({ id: 'custpage_aql', line: i, value: element.aql });
                    }
                    if (element.max_aceptable) {
                        sublist.setSublistValue({ id: 'custpage_max_aceptable', line: i, value: element.max_aceptable });
                    }
                    if (element.cantidad_encontrada) {
                        sublist.setSublistValue({ id: 'custpage_cant_encontrada', line: i, value: element.cantidad_encontrada });
                    }
                    if (element.defecto_encontrado) {
                        sublist.setSublistValue({ id: 'custpage_def_encontrado', line: i, value: element.defecto_encontrado });
                    }
                });
            }

            return {
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
            }
        }

        return { createFormReport, createSublist, createFormDetail }

    });