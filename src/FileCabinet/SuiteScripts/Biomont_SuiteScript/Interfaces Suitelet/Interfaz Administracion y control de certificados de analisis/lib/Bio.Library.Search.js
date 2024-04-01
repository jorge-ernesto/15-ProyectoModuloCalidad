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
                    let estado_nombre_mostrar = [1, 2, 3].includes(Number(estado_id_interno)) ? estado_nombre.toUpperCase() : 'RECHAZADO';
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
                        estado: { id: estado_id_interno, nombre: estado_nombre, nombre_mostrar: estado_nombre_mostrar },
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
        function deleteListaDatosPreviosInspeccion(cola_inspeccion_id) {
            let searchObj = search.create({
                type: 'customrecord_bio_qm_prev_insp_data',
                filters: [
                    ['custrecord_bio_qm_prev_insp_colins', 'is', cola_inspeccion_id]
                ]
            });

            searchObj.run().each(function (result) {
                let recordId = result.id;
                // console.log('deleteListaDatosPreviosInspeccion', recordId);
                // log.debug('deleteListaDatosPreviosInspeccion', recordId);

                record.delete({
                    type: 'customrecord_bio_qm_prev_insp_data',
                    id: recordId
                });

                return true; // Continuar con la búsqueda
            });

            return true;
        }

        function createListaDatosPreviosInspeccion(cola_inspeccion_id, array_previos_inspeccion) {
            array_previos_inspeccion.forEach(element => {
                // console.log('createListaDatosPreviosInspeccion', element);
                // log.debug('createListaDatosPreviosInspeccion', element);

                // Validar campos obligatorios: Inspección
                if (element[1] && element[2]) {

                    // Validar valores para checkbox
                    element[3] = element[3] == 'T' ? true : false;

                    let newRecord = record.create({ type: 'customrecord_bio_qm_prev_insp_data' });
                    newRecord.setValue('custrecord_bio_qm_prev_insp_colins', cola_inspeccion_id);
                    newRecord.setValue('custrecord_bio_qm_prev_insp_lote', element[1]);
                    newRecord.setValue('custrecord_bio_qm_prev_insp_insp', element[2]);
                    newRecord.setValue('custrecord_bio_qm_prev_insp_est', element[3]);

                    let recordId = newRecord.save();
                }
            });
        }

        function deleteListaDatosISO2859(cola_inspeccion_id) {
            let searchObj = search.create({
                type: 'customrecord_bio_qm_iso_2859_1_2009_data',
                filters: [
                    ['custrecord_bio_qm_iso_2859_1_2009_colins', 'is', cola_inspeccion_id]
                ]
            });

            searchObj.run().each(function (result) {
                let recordId = result.id;
                // console.log('deleteListaDatosISO2859', recordId);
                // log.debug('deleteListaDatosISO2859', recordId);

                record.delete({
                    type: 'customrecord_bio_qm_iso_2859_1_2009_data',
                    id: recordId
                });

                return true; // Continuar con la búsqueda
            });

            return true;
        }

        function createListaDatosISO2859(cola_inspeccion_id, array_iso_2859_1_2009) {
            array_iso_2859_1_2009.forEach(element => {
                // console.log('createListaDatosISO2859', element);
                // log.debug('createListaDatosISO2859', element);

                // Validar campos obligatorios: Lotes, AQL
                if (element[1] && element[2]) {

                    let newRecord = record.create({ type: 'customrecord_bio_qm_iso_2859_1_2009_data' });
                    newRecord.setValue('custrecord_bio_qm_iso_2859_1_2009_colins', cola_inspeccion_id);
                    newRecord.setValue('custrecord_bio_qm_iso_2859_1_2009_lote', element[1]);
                    newRecord.setValue('custrecord_bio_qm_iso_2859_1_2009_aql', element[2]);
                    newRecord.setValue('custrecord_bio_qm_iso_2859_1_2009_maxace', element[3]);
                    newRecord.setValue('custrecord_bio_qm_iso_2859_1_2009_canenc', element[4]);
                    newRecord.setValue('custrecord_bio_qm_iso_2859_1_2009_defenc', element[5]);

                    let recordId = newRecord.save();
                }
            });
        }

        // Suitelet Detail Download File
        // Cabecera
        function getData_PDFCabecera_MPMEMV(cola_inspeccion_id, articulo_id, numero_linea_transaccion) {

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
                        name: "quantity",
                        join: "CUSTRECORD_QM_QUEUE_TRANSACTION_INV",
                        label: "Cantidad Recepción"
                    }),
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
                    search.createColumn({ name: "custrecord_qm_queue_status", label: "Estado" }),
                    // search.createColumn({
                    //     name: "formulahtml",
                    //     formula: "'<span style=\"background-color: red;\">*</span>'",
                    //     label: "Fórmula (HTML)"
                    // }),
                    // MP
                    search.createColumn({ name: "custrecord_bio_qm_queue_num_tecnica", label: "Numéro de Técnica" }),
                    search.createColumn({ name: "custrecord_bio_qm_queue_fabricante", label: "Fabricante" }),
                    search.createColumn({ name: "custrecord_bio_qm_queue_fecha_analisis", label: "Fecha de Análisis" }),
                    // ME_MV
                    search.createColumn({ name: "custrecord_bio_qm_queue_tip_emb_pri", label: "Tipo de Embalaje Primario" }),
                    search.createColumn({ name: "custrecord_bio_qm_queue_tip_emb_sec", label: "Tipo de Embalaje Secundario" }),
                    search.createColumn({ name: "custrecord_bio_qm_queue_cant_insp", label: "Cantidad Inspeccionada" }),
                    search.createColumn({ name: "custrecord_bio_qm_queue_cant_mues", label: "Cantidad Muestreada" }),
                    search.createColumn({ name: "custrecord_bio_qm_queue_niv_ins_iso_2859", label: "Nivel de Inspeccion Norma Tecnica Peruana ISO 2859-1 2009" }),
                    // Firma
                    search.createColumn({ name: "custrecord_bio_qm_queue_usufir_revpor", label: "Usuario Firma (Revisado Por)" }),
                    search.createColumn({ name: "custrecord_bio_qm_queue_fecfir_revpor", label: "Fecha Firma (Revisado Por)" }),
                    search.createColumn({ name: "custrecord_bio_qm_queue_usufir_aprpor", label: "Usuario Firma (Aprobado Por)" }),
                    search.createColumn({ name: "custrecord_bio_qm_queue_fecfir_aprpor", label: "Fecha Firma (Aprobado Por)" }),
                    search.createColumn({ name: "custrecord_bio_qm_queue_observaciones", label: "Observaciones" })
                ],
                filters: [
                    ["custrecord_qm_queue_transaction_inv.mainline", "is", "F"],
                    "AND",
                    ["custrecord_qm_queue_item.custitem3", "anyof", "5", "8", "7"]
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
            // objHelper.error_log('', 'getData_PDFCabecera_MPMEMV');
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
                    let cantidad_recepcion = row.getValue(columns[6]);
                    let fecha_recepcion = row.getValue(columns[7]);
                    let ns_tipo_documento_id_interno = row.getValue(columns[8]);
                    let ns_tipo_documento_nombre = row.getText(columns[8]);
                    let ns_serie = row.getValue(columns[9]);
                    let ns_numero_correlativo = row.getValue(columns[10]);
                    let num_analisis = row.getValue(columns[11]);
                    let estado_id_interno = row.getValue(columns[12]);
                    let estado_nombre = row.getText(columns[12]);
                    let estado_nombre_mostrar = [1, 2, 3].includes(Number(estado_id_interno)) ? estado_nombre.toUpperCase() : 'RECHAZADO';
                    // MP
                    let num_tecnica = row.getValue(columns[13]);
                    let fabricante = row.getValue(columns[14]);
                    let fecha_analisis = row.getValue(columns[15]);
                    // ME_MV
                    let tipo_embalaje_primario = row.getValue(columns[16]);
                    let tipo_embalaje_secundario = row.getValue(columns[17]);
                    let cantidad_inspeccionada = row.getValue(columns[18]);
                    let cantidad_muestreada = row.getValue(columns[19]);
                    let nivel_inspeccion_iso_2859 = row.getValue(columns[20]);
                    // Firma
                    let usuariofirma_revisadopor = row.getText(columns[21]);
                    let fechafirma_revisadopor = row.getValue(columns[22]);
                    let usuariofirma_aprobadopor = row.getText(columns[23]);
                    let fechafirma_aprobadopor = row.getValue(columns[24]);
                    let observaciones = row.getValue(columns[25]);

                    // Insertar informacion en array
                    resultTransaction.push({
                        cola_inspeccion_id_interno,
                        transaccion_inventario_id_interno,
                        numero_linea_transaccion,
                        articulo_itemid,
                        articulo_displayname,
                        proveedor_id_interno,
                        proveedor_nombre,
                        cantidad_recepcion,
                        fecha_recepcion,
                        ns_tipo_documento_id_interno,
                        ns_tipo_documento_nombre,
                        ns_serie,
                        ns_numero_correlativo,
                        num_analisis,
                        estado_id_interno,
                        estado_nombre,
                        estado_nombre_mostrar,
                        // MP
                        num_tecnica,
                        fabricante,
                        fecha_analisis,
                        // ME_MV
                        tipo_embalaje_primario,
                        tipo_embalaje_secundario,
                        cantidad_inspeccionada,
                        cantidad_muestreada,
                        nivel_inspeccion_iso_2859,
                        // Firma
                        usuariofirma_revisadopor,
                        fechafirma_revisadopor,
                        usuariofirma_aprobadopor,
                        fechafirma_aprobadopor,
                        observaciones
                    });
                });
            });

            // objHelper.error_log('getData_PDFCabecera_MPMEMV', resultTransaction);
            return resultTransaction;
        }

        function getData_PDFCabecera_PT(cola_inspeccion_id, articulo_id, numero_linea_transaccion) {

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
                    search.createColumn({
                        name: "custitem14",
                        join: "CUSTRECORD_QM_QUEUE_ITEM",
                        label: "Artículo : Producto Bulk"
                    }),
                    search.createColumn({
                        name: "custbody126",
                        join: "CUSTRECORD_QM_QUEUE_TRANSACTION",
                        label: "BIO_CAM_FECHA_INICIO_PRODUCCION_OT"
                    }),
                    search.createColumn({
                        name: "custbodybio_cam_lote",
                        join: "CUSTRECORD_QM_QUEUE_TRANSACTION_INV",
                        label: "LOTE"
                    }),
                    search.createColumn({
                        name: "custbodybio_cam_fechacaducidad",
                        join: "CUSTRECORD_QM_QUEUE_TRANSACTION_INV",
                        label: "BIO_CAM_OP_FECHA_CADUCIDAD"
                    }),
                    search.createColumn({ name: "custrecord_qm_queue_status", label: "Estado" }),
                    // search.createColumn({
                    //     name: "formulahtml",
                    //     formula: "'<span style=\"background-color: red;\">*</span>'",
                    //     label: "Fórmula (HTML)"
                    // }),
                    // MP
                    search.createColumn({ name: "custrecord_bio_qm_queue_num_tecnica", label: "Numéro de Técnica" }),
                    search.createColumn({ name: "custrecord_bio_qm_queue_fabricante", label: "Fabricante" }),
                    search.createColumn({ name: "custrecord_bio_qm_queue_fecha_analisis", label: "Fecha de Análisis" }),
                    // ME_MV
                    search.createColumn({ name: "custrecord_bio_qm_queue_tip_emb_pri", label: "Tipo de Embalaje Primario" }),
                    search.createColumn({ name: "custrecord_bio_qm_queue_tip_emb_sec", label: "Tipo de Embalaje Secundario" }),
                    search.createColumn({ name: "custrecord_bio_qm_queue_cant_insp", label: "Cantidad Inspeccionada" }),
                    search.createColumn({ name: "custrecord_bio_qm_queue_cant_mues", label: "Cantidad Muestreada" }),
                    search.createColumn({ name: "custrecord_bio_qm_queue_niv_ins_iso_2859", label: "Nivel de Inspeccion Norma Tecnica Peruana ISO 2859-1 2009" }),
                    // PT
                    search.createColumn({ name: "custrecord_bio_qm_queue_pharma_form", label: "Forma farmaceutica" }),
                    search.createColumn({ name: "custrecord_bio_qm_queue_procedencia", label: "Procedencia" }),
                    search.createColumn({ name: "custrecord_bio_qm_queue_num_analisis", label: "Número de Análisis" }),
                    search.createColumn({ name: "custrecord_bio_qm_queue_presentacion", label: "Presentación" }),
                    // Firma
                    search.createColumn({ name: "custrecord_bio_qm_queue_usufir_revpor", label: "Usuario Firma (Revisado Por)" }),
                    search.createColumn({ name: "custrecord_bio_qm_queue_fecfir_revpor", label: "Fecha Firma (Revisado Por)" }),
                    search.createColumn({ name: "custrecord_bio_qm_queue_usufir_aprpor", label: "Usuario Firma (Aprobado Por)" }),
                    search.createColumn({ name: "custrecord_bio_qm_queue_fecfir_aprpor", label: "Fecha Firma (Aprobado Por)" }),
                    search.createColumn({ name: "custrecord_bio_qm_queue_observaciones", label: "Observaciones" })
                ],
                filters: [
                    ["custrecord_qm_queue_transaction_inv.mainline", "is", "F"],
                    "AND",
                    ["custrecord_qm_queue_transaction.mainline", "is", "T"],
                    "AND",
                    ["custrecord_qm_queue_item.custitem7", "anyof", "16"]
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
            // objHelper.error_log('', 'getData_PDFCabecera_PT');
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
                    let articulo_producto_bulk = row.getValue(columns[5]);
                    let fecha_inicio_produccion_ot = row.getValue(columns[6]);
                    let lote_finot = row.getValue(columns[7]);
                    let fecha_caducidad_finot = row.getValue(columns[8]);
                    let estado_id_interno = row.getValue(columns[9]);
                    let estado_nombre = row.getText(columns[9]);
                    let estado_nombre_mostrar = [1, 2, 3].includes(Number(estado_id_interno)) ? estado_nombre.toUpperCase() : 'RECHAZADO';
                    // MP
                    let num_tecnica = row.getValue(columns[10]);
                    let fabricante = row.getValue(columns[11]);
                    let fecha_analisis = row.getValue(columns[12]);
                    // ME_MV
                    let tipo_embalaje_primario = row.getValue(columns[13]);
                    let tipo_embalaje_secundario = row.getValue(columns[14]);
                    let cantidad_inspeccionada = row.getValue(columns[15]);
                    let cantidad_muestreada = row.getValue(columns[16]);
                    let nivel_inspeccion_iso_2859 = row.getValue(columns[17]);
                    // PT
                    let forma_farmaceutica_id_intenro = row.getValue(columns[18]);
                    let forma_farmaceutica_nombre = row.getText(columns[18]);
                    let procedencia = row.getValue(columns[19]);
                    let num_analisis = row.getValue(columns[20]);
                    let presentacion = row.getValue(columns[21]);
                    // Firma
                    let usuariofirma_revisadopor = row.getText(columns[22]);
                    let fechafirma_revisadopor = row.getValue(columns[23]);
                    let usuariofirma_aprobadopor = row.getText(columns[24]);
                    let fechafirma_aprobadopor = row.getValue(columns[25]);
                    let observaciones = row.getValue(columns[26]);

                    // Procesar informacion
                    fecha_inicio_produccion_ot = fecha_inicio_produccion_ot ? fecha_inicio_produccion_ot.split('/')[1] + '-' + fecha_inicio_produccion_ot.split('/')[2] : '';
                    fecha_caducidad_finot = fecha_caducidad_finot ? fecha_caducidad_finot.split('/')[1] + '-' + fecha_caducidad_finot.split('/')[2] : '';

                    // Insertar informacion en array
                    resultTransaction.push({
                        cola_inspeccion_id_interno,
                        transaccion_inventario_id_interno,
                        numero_linea_transaccion,
                        articulo_itemid,
                        articulo_displayname,
                        articulo_producto_bulk,
                        fecha_inicio_produccion_ot,
                        lote_finot,
                        fecha_caducidad_finot,
                        estado_id_interno,
                        estado_nombre,
                        estado_nombre_mostrar,
                        // MP
                        num_tecnica,
                        fabricante,
                        fecha_analisis,
                        // ME_MV
                        tipo_embalaje_primario,
                        tipo_embalaje_secundario,
                        cantidad_inspeccionada,
                        cantidad_muestreada,
                        nivel_inspeccion_iso_2859,
                        // PT
                        forma_farmaceutica_id_intenro,
                        forma_farmaceutica_nombre,
                        procedencia,
                        num_analisis,
                        presentacion,
                        // Firma
                        usuariofirma_revisadopor,
                        fechafirma_revisadopor,
                        usuariofirma_aprobadopor,
                        fechafirma_aprobadopor,
                        observaciones
                    });
                });
            });

            // objHelper.error_log('getData_PDFCabecera_PT', resultTransaction);
            return resultTransaction;
        }

        // Detalle
        function getData_PDFDetalle(cola_inspeccion_id) {

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
                    search.createColumn({
                        name: "custrecord_bio_qm_inspection_nom_mos",
                        join: "CUSTRECORD_QM_QUALITY_DATA_INSPECTION",
                        label: "Nombre a mostrar"
                    }),
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
            // objHelper.error_log('', 'getData_PDFDetalle');
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
                    let inspeccion_nombre_mostrar = row.getValue(columns[3]);
                    let descripcion_inspeccion = row.getValue(columns[4]);
                    let estado = row.getText(columns[5]);
                    let secuencia = row.getValue(columns[6]);
                    let id_control = row.getValue(columns[7]);
                    let numero_lote = row.getValue(columns[8]);
                    let campo_inspeccion_id_interno = row.getValue(columns[9]);
                    let campo_inspeccion_nombre = row.getText(columns[9]);
                    let instrucciones = row.getValue(columns[10]);
                    let valor_inspeccion = row.getValue(columns[11]);

                    // Procesar informacion
                    numero_lote = numero_lote.trim()

                    // Insertar informacion en array
                    resultTransaction.push({
                        id_interno,
                        registro_principal_cola_inspeccion,
                        inspeccion_id_interno,
                        inspeccion_nombre,
                        inspeccion_nombre_mostrar,
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

            // objHelper.error_log('getData_PDFDetalle', resultTransaction);
            return resultTransaction;
        }

        function getData_PDFDetalle_ListaCamposInspeccionCalidad(data_PDFDetalle) {

            // Filtro de ID Interno de Lista de campos de inspección de calidad
            let id_interno = ["@NONE@"];
            if (Object.keys(data_PDFDetalle).length > 0) {
                id_interno = [];
                data_PDFDetalle.forEach(element => {
                    id_interno.push(element.campo_inspeccion_id_interno)
                });
            }

            // Declarar variables
            let resultTransaction = [];

            // Declarar search
            let searchObject = {
                type: 'customrecord_qm_inspection_fields',
                columns: [
                    search.createColumn({
                        name: "internalid",
                        sort: search.Sort.ASC,
                        label: "ID interno"
                    }),
                    search.createColumn({ name: "name", label: "Nombre" }),
                    search.createColumn({ name: "custrecord_qm_field_data_type", label: "Tipo de datos" }),
                    search.createColumn({ name: "custrecord_qm_field_summary_field", label: "Campo Resumen de muestreo" }),
                    search.createColumn({ name: "custrecord_qm_field_coa_field", label: "Campo de certificado de análisis (CoA)" }),
                    search.createColumn({ name: "custrecord_bio_qm_field_coa_uni_med", label: "Unidad de medida" })
                ],
                filters: [
                    ["internalid", "anyof"].concat(id_interno)
                ]
            };

            // Crear search
            let searchContext = search.create(searchObject);

            // Cantidad de registros en search
            // let count = searchContext.runPaged().count;
            // objHelper.error_log('', 'getData_PDFDetalle_ListaCamposInspeccionCalidad');
            // objHelper.error_log('', count);

            // Recorrer search - con mas de 4000 registros
            let pageData = searchContext.runPaged({ pageSize: 1000 }); // El minimo de registros que se puede traer por pagina es 50, pondremos 1000 para que en el caso existan 4500 registros, hayan 5 paginas como maximo y no me consuma mucha memoria

            pageData.pageRanges.forEach(function (pageRange) {
                var myPage = pageData.fetch({ index: pageRange.index });
                myPage.data.forEach((row) => {
                    // Obtener informacion
                    let { columns } = row;
                    let id_interno = row.getValue(columns[0]);
                    let nombre = row.getValue(columns[1]);
                    let unidad_medida = row.getValue(columns[5]);

                    // Insertar informacion en array
                    resultTransaction.push({
                        id_interno,
                        nombre,
                        unidad_medida
                    });
                });
            });

            // objHelper.error_log('getData_PDFDetalle_ListaCamposInspeccionCalidad', resultTransaction);
            return resultTransaction;
        }

        function getData_PDFDetalle_RecepcionArticulo_MPMEMV(transaccion_inv_id, articulo_id, numero_linea_transaccion) {

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
                    ["item.custitem3", "anyof", "5", "8", "7"]
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
            // objHelper.error_log('', 'getData_PDFDetalle_RecepcionArticulo_MPMEMV');
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

                    // Procesar informacion
                    det_inv_lote_nombre = det_inv_lote_nombre.trim()

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

            // objHelper.error_log('getData_PDFDetalle_RecepcionArticulo_MPMEMV', resultTransaction);
            return resultTransaction;
        }

        function getData_PDFDetalle_FinalizacionOrdenProduccion_PT(transaccion_inv_id, articulo_id, numero_linea_transaccion) {

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
                    ["mainline", "is", "T"],
                    "AND",
                    ["type", "anyof", "WOCompl"],
                ]
            };

            // Filtro de certificado de analisis
            if (transaccion_inv_id != '') {
                if (searchObject.filters.length > 0) {
                    searchObject.filters.push('AND');
                }
                searchObject.filters.push(["internalid", "anyof", transaccion_inv_id]);
            }

            // Crear search
            let searchContext = search.create(searchObject);

            // Cantidad de registros en search
            // let count = searchContext.runPaged().count;
            // objHelper.error_log('', 'getData_PDFDetalle_FinalizacionOrdenProduccion_PT');
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

                    // Procesar informacion
                    det_inv_lote_nombre = det_inv_lote_nombre.trim()

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

            // objHelper.error_log('getData_PDFDetalle_FinalizacionOrdenProduccion_PT', resultTransaction);
            return resultTransaction;
        }

        function getData_PDFDetalle_Completa_MPMEMV_PT(tipo_pdf, cola_inspeccion_id, transaccion_inv_id, articulo_id, numero_linea_transaccion) {

            // Declarar variables
            let data_PDFDetalle = [];
            let data_PDFDetalle_ListaCamposInspeccionCalidad = [];
            let data_PDFDetalle_TransaccionInventario = []; // Puede ser Recepción Articulo o Finalización de Orden de Producción

            // Obtener data
            data_PDFDetalle = getData_PDFDetalle(cola_inspeccion_id);
            data_PDFDetalle_ListaCamposInspeccionCalidad = getData_PDFDetalle_ListaCamposInspeccionCalidad(data_PDFDetalle);

            // Determinar tipo de pdf
            if (tipo_pdf == 'MP' || tipo_pdf == 'ME_MV')
                data_PDFDetalle_TransaccionInventario = getData_PDFDetalle_RecepcionArticulo_MPMEMV(transaccion_inv_id, articulo_id, numero_linea_transaccion);
            else if (tipo_pdf == 'PT')
                data_PDFDetalle_TransaccionInventario = getData_PDFDetalle_FinalizacionOrdenProduccion_PT(transaccion_inv_id, articulo_id, numero_linea_transaccion);

            /******************/

            // Recorrer Datos de calidad
            data_PDFDetalle.forEach((value, key) => {

                data_PDFDetalle[key]['unidad_medida'] = '';

                // Recorrer Lista de campos de inspección de calidad
                data_PDFDetalle_ListaCamposInspeccionCalidad.forEach((value_, key_) => {

                    // Validar los id interno
                    if (value.campo_inspeccion_id_interno == value_.id_interno) {

                        // Obtener Unidad de Medida de Lista de campos de inspección de calidad
                        data_PDFDetalle[key]['unidad_medida'] = value_.unidad_medida;
                    }
                });
            });

            /******************/

            // Recorrer Datos de calidad
            data_PDFDetalle.forEach((value, key) => {

                data_PDFDetalle[key]['fecha_caducidad'] = data_PDFDetalle[key]['fecha_caducidad'] || []; // Validar si encontrara mas de una fecha

                // Recorrer Transaccion - Recepción de artículo (Detalle de inventario)
                data_PDFDetalle_TransaccionInventario.forEach((value_, key_) => {

                    // Validar los lotes
                    if (value.numero_lote == value_.det_inv_lote_nombre) {

                        // Obtener Fecha de Caducidad por Lote de Detalle de Inventario
                        data_PDFDetalle[key]['fecha_caducidad'] = data_PDFDetalle[key]['fecha_caducidad'] || []; // Validar si encontrara mas de una fecha
                        data_PDFDetalle[key]['fecha_caducidad'].push(value_.det_inv_fecha_caducidad);
                    }
                })
            });

            /******************/

            // Obtener data en formato agrupado
            let dataAgrupada = {}; // * Audit: Util, manejo de JSON

            data_PDFDetalle.forEach(element => {

                // Obtener variables
                let numero_lote = element.numero_lote;

                // Agrupar data
                dataAgrupada[numero_lote] = dataAgrupada[numero_lote] || [];
                dataAgrupada[numero_lote].push(element);

                // Otra forma
                // dataAgrupada[numero_lote] ??= [];
                // dataAgrupada[numero_lote] = element;
            });

            // objHelper.error_log('getData_PDFDetalle_Completa_MPMEMV_PT', dataAgrupada);
            return dataAgrupada;
        }

        // Suitelet Detail Download File - Others
        function getData_PDFDetalle_DatosPreviosInspeccion(cola_inspeccion_id) {

            // Declarar variables
            let resultTransaction = [];

            // Declarar search
            let searchObject = {
                type: 'customrecord_bio_qm_prev_insp_data',
                columns: [
                    'custrecord_bio_qm_prev_insp_colins',
                    'custrecord_bio_qm_prev_insp_lote',
                    'custrecord_bio_qm_prev_insp_insp',
                    'custrecord_bio_qm_prev_insp_est'
                ],
                filters: [
                    ['custrecord_bio_qm_prev_insp_colins', 'is', cola_inspeccion_id]
                ]
            };

            // Crear search
            let searchContext = search.create(searchObject);

            // Cantidad de registros en search
            // let count = searchContext.runPaged().count;
            // objHelper.error_log('', 'getData_PDFDetalle_DatosPreviosInspeccion');
            // objHelper.error_log('', count);

            // Recorrer search - con mas de 4000 registros
            let pageData = searchContext.runPaged({ pageSize: 1000 }); // El minimo de registros que se puede traer por pagina es 50, pondremos 1000 para que en el caso existan 4500 registros, hayan 5 paginas como maximo y no me consuma mucha memoria

            pageData.pageRanges.forEach(function (pageRange) {
                var myPage = pageData.fetch({ index: pageRange.index });
                myPage.data.forEach((row) => {
                    // Obtener informacion
                    let { columns } = row;
                    let cola_inspeccion_id_interno = row.getValue(columns[0]);
                    let lote = row.getValue(columns[1]);
                    let inspeccion = row.getValue(columns[2]);
                    let estado = row.getValue(columns[3]);

                    // Validar valores para checkbox
                    estado_sublist = estado == true ? 'T' : 'F';
                    estado_pdf = estado == true ? 'Conforme' : '';

                    // Insertar informacion en array
                    resultTransaction.push({
                        cola_inspeccion_id_interno,
                        lote,
                        inspeccion,
                        estado,
                        estado_sublist,
                        estado_pdf
                    });
                });
            });

            // objHelper.error_log('getData_PDFDetalle_DatosPreviosInspeccion', resultTransaction);
            return resultTransaction;
        }

        function getData_PDFDetalle_DatosISO2859(cola_inspeccion_id) {

            // Declarar variables
            let resultTransaction = [];

            // Declarar search
            let searchObject = {
                type: 'customrecord_bio_qm_iso_2859_1_2009_data',
                columns: [
                    'custrecord_bio_qm_iso_2859_1_2009_colins',
                    'custrecord_bio_qm_iso_2859_1_2009_lote',
                    'custrecord_bio_qm_iso_2859_1_2009_aql',
                    'custrecord_bio_qm_iso_2859_1_2009_maxace',
                    'custrecord_bio_qm_iso_2859_1_2009_canenc',
                    'custrecord_bio_qm_iso_2859_1_2009_defenc'
                ],
                filters: [
                    ['custrecord_bio_qm_iso_2859_1_2009_colins', 'is', cola_inspeccion_id]
                ]
            };

            // Crear search
            let searchContext = search.create(searchObject);

            // Cantidad de registros en search
            // let count = searchContext.runPaged().count;
            // objHelper.error_log('', 'getData_PDFDetalle_DatosISO2859');
            // objHelper.error_log('', count);

            // Recorrer search - con mas de 4000 registros
            let pageData = searchContext.runPaged({ pageSize: 1000 }); // El minimo de registros que se puede traer por pagina es 50, pondremos 1000 para que en el caso existan 4500 registros, hayan 5 paginas como maximo y no me consuma mucha memoria

            pageData.pageRanges.forEach(function (pageRange) {
                var myPage = pageData.fetch({ index: pageRange.index });
                myPage.data.forEach((row) => {
                    // Obtener informacion
                    let { columns } = row;
                    let cola_inspeccion_id_interno = row.getValue(columns[0]);
                    let lote = row.getValue(columns[1]);
                    let aql = row.getValue(columns[2]);
                    let max_aceptable = row.getValue(columns[3]);
                    let cantidad_encontrada = row.getValue(columns[4]);
                    let defecto_encontrado = row.getValue(columns[5]);

                    // Procesar informacion
                    lote = lote.trim()

                    // Insertar informacion en array
                    resultTransaction.push({
                        cola_inspeccion_id_interno,
                        lote,
                        aql,
                        max_aceptable,
                        cantidad_encontrada,
                        defecto_encontrado
                    });
                });
            });

            // objHelper.error_log('getData_PDFDetalle_DatosISO2859', resultTransaction);
            return resultTransaction;
        }

        return {
            getDataColaInspeccion,
            getTriggerTypeList,
            getInspectionOutcomesList,
            deleteListaDatosPreviosInspeccion,
            createListaDatosPreviosInspeccion,
            deleteListaDatosISO2859,
            createListaDatosISO2859,
            getData_PDFCabecera_MPMEMV,
            getData_PDFCabecera_PT,
            getData_PDFDetalle,
            getData_PDFDetalle_RecepcionArticulo_MPMEMV,
            getData_PDFDetalle_FinalizacionOrdenProduccion_PT,
            getData_PDFDetalle_Completa_MPMEMV_PT,
            getData_PDFDetalle_DatosPreviosInspeccion,
            getData_PDFDetalle_DatosISO2859
        }

    });
