/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 */
define(['./Bio.Library.Helper', 'N'],

    function (objHelper, N) {

        const { log, search, record } = N;

        function getDataColaInspeccion(item = '', triggerType = '', status = '', id_interno = '') {

            // Declarar variables
            let resultTransaction = [];

            // Declarar search
            let searchObject = {
                type: 'customrecord_qm_queue',
                columns: [
                    search.createColumn({
                        name: "internalid",
                        sort: search.Sort.ASC,
                        label: "ID interno"
                    }),
                    search.createColumn({ name: "custrecord_qm_queue_spec", label: "Especificación" }),
                    search.createColumn({ name: "custrecord_qm_queue_item", label: "Artículo" }),
                    search.createColumn({ name: "custrecord_qm_queue_transaction", label: "Transacción principal" }),
                    search.createColumn({ name: "custrecord_qm_queue_status", label: "Estado" }),
                    search.createColumn({ name: "custrecord_qm_queue_location", label: "Ubicación" }),
                    search.createColumn({ name: "custrecord_qm_queue_transaction_inv", label: "Transacción de inventario" }),
                    search.createColumn({ name: "custrecord_qm_queue_line", label: "Número de línea de transacción" }),
                    search.createColumn({ name: "custrecord_qm_queue_trigger", label: "Tipo de disparador" }),
                    // search.createColumn({
                    //     name: "formulahtml",
                    //     formula: "'<span style=\"background-color: red;\">*</span>'",
                    //     label: "Fórmula (HTML)"
                    // }),
                    search.createColumn({
                        name: "custitem3",
                        join: "CUSTRECORD_QM_QUEUE_ITEM",
                        label: "BIO_CAM_LINEA"
                    }),
                    search.createColumn({
                        name: "custitem7",
                        join: "CUSTRECORD_QM_QUEUE_ITEM",
                        label: "BIO_CAM_TIPOPRODUCTO_ARTICULO"
                    })
                ],
                filters: [
                    ["isinactive", "any", ""]
                ]
            };

            // Filtro de articulos
            if (item != '') {
                if (searchObject.filters.length > 0) {
                    searchObject.filters.push('AND');
                }
                searchObject.filters.push(["custrecord_qm_queue_item", "anyof", item]);
            }

            // Filtro de tipos de disparadores
            if (triggerType != '') {
                if (searchObject.filters.length > 0) {
                    searchObject.filters.push('AND');
                }
                searchObject.filters.push(["custrecord_qm_queue_trigger", "anyof", triggerType]);
            }

            // Filtro de estados
            if (status != '') {
                if (searchObject.filters.length > 0) {
                    searchObject.filters.push('AND');
                }
                searchObject.filters.push(["custrecord_qm_queue_status", "anyof", status]);
            }

            // Filtro de id interno
            if (id_interno != '') {
                if (searchObject.filters.length > 0) {
                    searchObject.filters.push('AND');
                }
                searchObject.filters.push(["internalid", "anyof", id_interno]);
            }

            // Crear search
            let searchContext = search.create(searchObject);

            // Cantidad de registros en search
            // let count = searchContext.runPaged().count;
            // objHelper.error_log('', 'getDataCertificacionesAnalisis');
            // objHelper.error_log('', count);

            // Recorrer search - con mas de 4000 registros
            let pageData = searchContext.runPaged({ pageSize: 1000 }); // El minimo de registros que se puede traer por pagina es 50, pondremos 1000 para que en el caso existan 4500 registros, hayan 5 paginas como maximo y no me consuma mucha memoria

            pageData.pageRanges.forEach(function (pageRange) {
                var myPage = pageData.fetch({ index: pageRange.index });
                myPage.data.forEach((row) => {
                    // Obtener informacion
                    let { columns } = row;
                    let id_interno = row.getValue(columns[0]);
                    let especificacion_id_interno = row.getValue(columns[1]);
                    let especificacion_nombre = row.getText(columns[1]);
                    let articulo_id_interno = row.getValue(columns[2]);
                    let articulo_nombre = row.getText(columns[2]);
                    let transaccion_principal_id_interno = row.getValue(columns[3]);
                    let transaccion_principal_nombre = row.getText(columns[3]);
                    let estado_id_interno = row.getValue(columns[4]);
                    let estado_nombre = row.getText(columns[4]);
                    let ubicacion_id_interno = row.getValue(columns[5]);
                    let ubicacion_nombre = row.getText(columns[5]);
                    let transaccion_inventario_id_interno = row.getValue(columns[6]);
                    let transaccion_inventario_nombre = row.getText(columns[6]);
                    let numero_linea_transaccion = row.getValue(columns[7]);
                    let tipo_disparador_id_interno = row.getValue(columns[8]);
                    let tipo_disparador_nombre = row.getText(columns[8]);
                    let linea_id_interno = row.getValue(columns[9]);
                    let linea_nombre = row.getText(columns[9]);
                    let tipo_producto_id_interno = row.getValue(columns[10]);
                    let tipo_producto_nombre = row.getText(columns[10]);

                    // Insertar informacion en array
                    resultTransaction.push({
                        cola_inspeccion: { id: id_interno },
                        especificacion: { id: especificacion_id_interno, nombre: especificacion_nombre },
                        articulo: { id: articulo_id_interno, nombre: articulo_nombre },
                        transaccion_principal: { id: transaccion_principal_id_interno, nombre: transaccion_principal_nombre },
                        estado: { id: estado_id_interno, nombre: estado_nombre },
                        ubicacion: { id: ubicacion_id_interno, nombre: ubicacion_nombre },
                        transaccion_inventario: { id: transaccion_inventario_id_interno, nombre: transaccion_inventario_nombre },
                        numero_linea_transaccion: numero_linea_transaccion,
                        tipo_disparador: { id: tipo_disparador_id_interno, nombre: tipo_disparador_nombre },
                        linea: { id: linea_id_interno, nombre: linea_nombre },
                        tipo_producto: { id: tipo_producto_id_interno, nombre: tipo_producto_nombre }
                    });
                });
            });

            // objHelper.error_log('getDataCertificacionesAnalisis', resultTransaction);
            return resultTransaction;
        }

        // Suitelet Report
        function getTriggerTypeList() {

            // Array donde guardaremos la informacion
            let result = [];

            // Crear search
            let searchContext = search.create({
                type: 'customlist_qm_trigger_type',
                columns: [
                    { name: 'internalid', sort: search.Sort.ASC },
                    'name'
                ]
            });

            // Recorrer search
            searchContext.run().each(node => {

                // Obtener informacion
                let columns = node.columns;
                let id = node.getValue(columns[0]);
                let name = node.getValue(columns[1]);

                // Insertar informacion en array
                result.push({
                    id: id,
                    name: name
                })

                // La funcion each debes indicarle si quieres que siga iterando o no
                return true;
            })

            // Retornar array
            return result;
        }

        function getInspectionOutcomesList() {

            // Array donde guardaremos la informacion
            let result = [];

            // Crear search
            let searchContext = search.create({
                type: 'customlist_qm_inspection_outcomes',
                columns: [
                    { name: 'internalid', sort: search.Sort.ASC },
                    'name'
                ]
            });

            // Recorrer search
            searchContext.run().each(node => {

                // Obtener informacion
                let columns = node.columns;
                let id = node.getValue(columns[0]);
                let name = node.getValue(columns[1]);

                // Insertar informacion en array
                result.push({
                    id: id,
                    name: name
                })

                // La funcion each debes indicarle si quieres que siga iterando o no
                return true;
            })

            // Retornar array
            return result;
        }

        // Suitelet Detail

        // Suitelet Detail Download File
        function getDataMP_PDFCabecera(cola_inspeccion_id, articulo_id, numero_linea_transaccion) {

            // Declarar variables
            let resultTransaction = [];

            // Declarar search
            let searchObject = {
                type: 'customrecord_qm_queue',
                columns: [
                    search.createColumn({
                        name: "internalid",
                        sort: search.Sort.ASC,
                        label: "Cola de inspección : ID interno"
                    }),
                    search.createColumn({
                        name: "internalid",
                        join: "CUSTRECORD_QM_QUEUE_TRANSACTION_INV",
                        label: "Transacción de inventario : ID interno"
                    }),
                    search.createColumn({
                        name: "line",
                        join: "CUSTRECORD_QM_QUEUE_TRANSACTION_INV",
                        label: "Transacción de inventario : ID de línea"
                    }),
                    search.createColumn({
                        name: "itemid",
                        join: "CUSTRECORD_QM_QUEUE_ITEM",
                        label: "Artículo : Código del Artículo"
                    }),
                    search.createColumn({
                        name: "displayname",
                        join: "CUSTRECORD_QM_QUEUE_ITEM",
                        label: "Artículo : Descripción del Artículo"
                    }),
                    search.createColumn({ name: "custrecord_qm_queue_vendor", label: "Proveedor de QM" }),
                    search.createColumn({
                        name: "trandate",
                        join: "CUSTRECORD_QM_QUEUE_TRANSACTION_INV",
                        label: "Fecha Recepción"
                    }),
                    search.createColumn({
                        name: "custbody_ns_document_type",
                        join: "CUSTRECORD_QM_QUEUE_TRANSACTION_INV",
                        label: "NS Tipo de Documento"
                    }),
                    search.createColumn({
                        name: "custbody_ns_serie_cxp",
                        join: "CUSTRECORD_QM_QUEUE_TRANSACTION_INV",
                        label: "NS Serie CxP"
                    }),
                    search.createColumn({
                        name: "custbody_ns_num_correlativo",
                        join: "CUSTRECORD_QM_QUEUE_TRANSACTION_INV",
                        label: "NS Numero Correlativo"
                    }),
                    search.createColumn({
                        name: "custcol12",
                        join: "CUSTRECORD_QM_QUEUE_TRANSACTION_INV",
                        label: "BIO_CAM_REC_NUM_ANALISIS"
                    }),
                    // search.createColumn({
                    //     name: "formulahtml",
                    //     formula: "'<span style=\"background-color: red;\">*</span>'",
                    //     label: "Fórmula (HTML)"
                    // }),
                    search.createColumn({ name: "custrecord_bio_qm_queue_num_tecnica", label: "Numéro de Técnica" }),
                    search.createColumn({ name: "custrecord_bio_qm_queue_fabricante", label: "Fabricante" }),
                    search.createColumn({ name: "custrecord_bio_qm_queue_fec_fabricacion", label: "Fecha de Fabricación" }),
                    search.createColumn({ name: "custrecord_bio_qm_queue_fecha_analisis", label: "Fecha de Análisis" }),
                    search.createColumn({ name: "custrecord_bio_qm_queue_fecha_reanalisis", label: "Fecha de Reanálisis" }),
                    search.createColumn({ name: "custrecord_bio_qm_queue_usufir_revpor", label: "Usuario Firma (Revisado Por)" }),
                    search.createColumn({ name: "custrecord_bio_qm_queue_fecfir_revpor", label: "Fecha Firma (Revisado Por)" }),
                    search.createColumn({ name: "custrecord_bio_qm_queue_usufir_aprpor", label: "Usuario Firma (Aprobado Por)" }),
                    search.createColumn({ name: "custrecord_bio_qm_queue_fecfir_aprpor", label: "Fecha Firma (Aprobado Por)" }),
                    search.createColumn({ name: "custrecord_bio_qm_queue_observaciones", label: "Observaciones" }),
                ],
                filters: [
                    ["custrecord_qm_queue_transaction_inv.mainline", "is", "F"],
                    "AND",
                    ["custrecord_qm_queue_item.custitem3", "anyof", "5"]
                ]
            };

            // Filtro de certificado de analisis
            if (cola_inspeccion_id != '') {
                if (searchObject.filters.length > 0) {
                    searchObject.filters.push('AND');
                }
                searchObject.filters.push(["internalid", "anyof", cola_inspeccion_id]);
            }

            // Filtro de articulo
            if (articulo_id != '') {
                if (searchObject.filters.length > 0) {
                    searchObject.filters.push('AND');
                }
                searchObject.filters.push(["custrecord_qm_queue_transaction_inv.item", "anyof", articulo_id]);
            }

            // Filtro de numero de linea de transaccion
            if (numero_linea_transaccion != '') {
                if (searchObject.filters.length > 0) {
                    searchObject.filters.push('AND');
                }
                searchObject.filters.push(["custrecord_qm_queue_transaction_inv.line", "equalto", numero_linea_transaccion]);
            }

            // Crear search
            let searchContext = search.create(searchObject);

            // Cantidad de registros en search
            // let count = searchContext.runPaged().count;
            // objHelper.error_log('', 'getDataPDFCabecera_MateriaPrima');
            // objHelper.error_log('', count);

            // Recorrer search - con mas de 4000 registros
            let pageData = searchContext.runPaged({ pageSize: 1000 }); // El minimo de registros que se puede traer por pagina es 50, pondremos 1000 para que en el caso existan 4500 registros, hayan 5 paginas como maximo y no me consuma mucha memoria

            pageData.pageRanges.forEach(function (pageRange) {
                var myPage = pageData.fetch({ index: pageRange.index });
                myPage.data.forEach((row) => {
                    // Obtener informacion
                    let { columns } = row;
                    let cola_inspeccion_id_interno = row.getValue(columns[0]);
                    let transaccion_inventario_id_interno = row.getValue(columns[1]);
                    let numero_linea_transaccion = row.getValue(columns[2]);
                    let articulo_itemid = row.getValue(columns[3]);
                    let articulo_displayname = row.getValue(columns[4]);
                    let proveedor_id_interno = row.getValue(columns[5]);
                    let proveedor_nombre = row.getText(columns[5]);
                    let fecha_recepcion = row.getValue(columns[6]);
                    let ns_tipo_documento_id_interno = row.getValue(columns[7]);
                    let ns_tipo_documento_nombre = row.getText(columns[7]);
                    let ns_serie = row.getValue(columns[8]);
                    let ns_numero_correlativo = row.getValue(columns[9]);
                    let num_analisis = row.getValue(columns[10]);
                    let num_tecnica = row.getValue(columns[11]);
                    let fabricante = row.getValue(columns[12]);
                    let fecha_fabricacion = row.getValue(columns[13]);
                    let fecha_analisis = row.getValue(columns[14]);
                    let fecha_reanalisis = row.getValue(columns[15]);
                    let usuariofirma_revisadopor = row.getText(columns[16])
                    let fechafirma_revisadopor = row.getValue(columns[17])
                    let usuariofirma_aprobadopor = row.getText(columns[18])
                    let fechafirma_aprobadopor = row.getValue(columns[19])
                    let observaciones = row.getValue(columns[20])

                    // Insertar informacion en array
                    resultTransaction.push({
                        cola_inspeccion_id_interno,
                        transaccion_inventario_id_interno,
                        numero_linea_transaccion,
                        articulo_itemid,
                        articulo_displayname,
                        proveedor_id_interno,
                        proveedor_nombre,
                        fecha_recepcion,
                        ns_tipo_documento_id_interno,
                        ns_tipo_documento_nombre,
                        ns_serie,
                        ns_numero_correlativo,
                        num_analisis,
                        num_tecnica,
                        fabricante,
                        fecha_fabricacion,
                        fecha_analisis,
                        fecha_reanalisis,
                        usuariofirma_revisadopor,
                        fechafirma_revisadopor,
                        usuariofirma_aprobadopor,
                        fechafirma_aprobadopor,
                        observaciones
                    });
                });
            });

            // objHelper.error_log('getDataPDFCabecera_MateriaPrima', resultTransaction);
            return resultTransaction;
        }

        function getDataMP_PDFDetalle(cola_inspeccion_id) {

            // Declarar variables
            let resultTransaction = [];

            // Declarar search
            let searchObject = {
                type: 'customrecord_qm_quality_data',
                columns: [
                    search.createColumn({ name: "internalid", label: "ID interno" }),
                    search.createColumn({
                        name: "custrecord_qm_quality_data_queue",
                        sort: search.Sort.ASC,
                        label: "Registro principal de cola de inspección"
                    }),
                    search.createColumn({ name: "custrecord_qm_quality_data_inspection", label: "Inspección" }),
                    search.createColumn({ name: "custrecord_qm_quality_data_description", label: "Descripción de inspección" }),
                    search.createColumn({ name: "custrecord_qm_quality_data_status", label: "Estado" }),
                    search.createColumn({
                        name: "custrecord_qm_quality_data_sequence",
                        sort: search.Sort.ASC,
                        label: "Secuencia"
                    }),
                    search.createColumn({
                        name: "custrecord_qm_quality_data_controlid",
                        sort: search.Sort.ASC,
                        label: "ID de control"
                    }),
                    search.createColumn({ name: "custrecord_qm_quality_data_lotnumber", label: "Número de lote" }),
                    search.createColumn({
                        name: "custrecord_qm_quality_detail_field",
                        join: "CUSTRECORD_QM_QUALITY_DETAIL_PARENT",
                        label: "Campo de inspección"
                    }),
                    search.createColumn({
                        name: "custrecord_qm_quality_detail_text",
                        join: "CUSTRECORD_QM_QUALITY_DETAIL_PARENT",
                        label: "Instrucciones"
                    }),
                    search.createColumn({
                        name: "custrecord_qm_quality_detail_value",
                        join: "CUSTRECORD_QM_QUALITY_DETAIL_PARENT",
                        label: "Valor de inspección"
                    })
                ],
                filters: [
                    ["custrecord_qm_quality_data_queue", "anyof", cola_inspeccion_id],
                    "AND",
                    ["custrecord_qm_quality_detail_parent.custrecord_qm_quality_detail_field", "noneof", "1", "2"]
                ]
            };

            // Crear search
            let searchContext = search.create(searchObject);

            // Cantidad de registros en search
            // let count = searchContext.runPaged().count;
            // objHelper.error_log('', 'getDataMP_PDFDetalle');
            // objHelper.error_log('', count);

            // Recorrer search - con mas de 4000 registros
            let pageData = searchContext.runPaged({ pageSize: 1000 }); // El minimo de registros que se puede traer por pagina es 50, pondremos 1000 para que en el caso existan 4500 registros, hayan 5 paginas como maximo y no me consuma mucha memoria

            pageData.pageRanges.forEach(function (pageRange) {
                var myPage = pageData.fetch({ index: pageRange.index });
                myPage.data.forEach((row) => {
                    // Obtener informacion
                    let { columns } = row;
                    let id_interno = row.getValue(columns[0]);
                    let registro_principal_cola_inspeccion = row.getValue(columns[1]);
                    let inspeccion_id_interno = row.getValue(columns[2]);
                    let inspeccion_nombre = row.getText(columns[2]);
                    let descripcion_inspeccion = row.getValue(columns[3]);
                    let estado = row.getText(columns[4]);
                    let secuencia = row.getValue(columns[5]);
                    let id_control = row.getValue(columns[6]);
                    let numero_lote = row.getValue(columns[7]);
                    let campo_inspeccion_id_interno = row.getValue(columns[8]);
                    let campo_inspeccion_nombre = row.getText(columns[8]);
                    let instrucciones = row.getValue(columns[9]);
                    let valor_inspeccion = row.getValue(columns[10]);

                    // Insertar informacion en array
                    resultTransaction.push({
                        id_interno,
                        registro_principal_cola_inspeccion,
                        inspeccion_id_interno,
                        inspeccion_nombre,
                        descripcion_inspeccion,
                        estado,
                        secuencia,
                        id_control,
                        numero_lote,
                        campo_inspeccion_id_interno,
                        campo_inspeccion_nombre,
                        instrucciones,
                        valor_inspeccion
                    });
                });
            });

            // objHelper.error_log('getDataMP_PDFDetalle', resultTransaction);
            return resultTransaction;
        }

        function getDataMP_PDFDetalle_RecepcionArticulo(transaccion_inv_id, articulo_id, numero_linea_transaccion) {

            // Declarar variables
            let resultTransaction = [];

            // Declarar search
            let searchObject = {
                type: 'transaction',
                columns: [
                    search.createColumn({ name: "internalid", label: "Recepción de artículo : ID interno" }),
                    search.createColumn({ name: "line", label: "Recepción de artículo : ID de línea" }),
                    search.createColumn({
                        name: "internalid",
                        join: "inventoryDetail",
                        sort: search.Sort.ASC,
                        label: "ID interno"
                    }),
                    search.createColumn({
                        name: "inventorynumber",
                        join: "inventoryDetail",
                        sort: search.Sort.ASC,
                        label: "Número"
                    }),
                    search.createColumn({
                        name: "expirationdate",
                        join: "inventoryDetail",
                        label: "Fecha de caducidad"
                    })
                ],
                filters: [
                    ["mainline", "is", "F"],
                    "AND",
                    ["type", "anyof", "ItemRcpt"],
                    "AND",
                    ["item.custitem3", "anyof", "5"]
                ]
            };

            // Filtro de certificado de analisis
            if (transaccion_inv_id != '') {
                if (searchObject.filters.length > 0) {
                    searchObject.filters.push('AND');
                }
                searchObject.filters.push(["internalid", "anyof", transaccion_inv_id]);
            }

            // Filtro de articulo
            if (articulo_id != '') {
                if (searchObject.filters.length > 0) {
                    searchObject.filters.push('AND');
                }
                searchObject.filters.push(["item", "anyof", articulo_id]);
            }

            // Filtro de numero de linea de transaccion
            if (numero_linea_transaccion != '') {
                if (searchObject.filters.length > 0) {
                    searchObject.filters.push('AND');
                }
                searchObject.filters.push(["line", "equalto", numero_linea_transaccion]);
            }

            // Crear search
            let searchContext = search.create(searchObject);

            // Cantidad de registros en search
            // let count = searchContext.runPaged().count;
            // objHelper.error_log('', 'getDataMP_PDFDetalle_RecepcionDetalleInventario');
            // objHelper.error_log('', count);

            // Recorrer search - con mas de 4000 registros
            let pageData = searchContext.runPaged({ pageSize: 1000 }); // El minimo de registros que se puede traer por pagina es 50, pondremos 1000 para que en el caso existan 4500 registros, hayan 5 paginas como maximo y no me consuma mucha memoria

            pageData.pageRanges.forEach(function (pageRange) {
                var myPage = pageData.fetch({ index: pageRange.index });
                myPage.data.forEach((row) => {
                    // Obtener informacion
                    let { columns } = row;
                    let recepcion_articulo_id_interno = row.getValue(columns[0]);
                    let numero_linea_transaccion = row.getValue(columns[1]);
                    let det_inv_id_interno = row.getValue(columns[2]);
                    let det_inv_lote_id_interno = row.getValue(columns[3]);
                    let det_inv_lote_nombre = row.getText(columns[3]);
                    let det_inv_fecha_caducidad = row.getValue(columns[4]);

                    // Insertar informacion en array
                    resultTransaction.push({
                        recepcion_articulo_id_interno,
                        numero_linea_transaccion,
                        det_inv_id_interno,
                        det_inv_lote_id_interno,
                        det_inv_lote_nombre,
                        det_inv_fecha_caducidad
                    });
                });
            });

            // objHelper.error_log('getDataMP_PDFDetalle_RecepcionDetalleInventario', resultTransaction);
            return resultTransaction;
        }

        return { getDataColaInspeccion, getTriggerTypeList, getInspectionOutcomesList, getDataMP_PDFCabecera, getDataMP_PDFDetalle, getDataMP_PDFDetalle_RecepcionArticulo }

    });
