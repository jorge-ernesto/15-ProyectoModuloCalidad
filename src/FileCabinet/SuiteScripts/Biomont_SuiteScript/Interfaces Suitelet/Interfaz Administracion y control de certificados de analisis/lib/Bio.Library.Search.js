/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 */
define(['./Bio.Library.Helper', 'N'],

    function (objHelper, N) {

        const { log, search, record } = N;

        function getDataActivosFijos(assettype = '', subsidiary = [''], classification = '', numero_activo_alternativo = '', nombre = '', estado_accion = '', id_interno = '') {

            // Declarar variables
            let resultTransaction = [];

            // Declarar search
            let searchObject = {
                type: 'customrecord_ncfar_asset',
                columns: [
                    search.createColumn({
                        name: "internalid",
                        sort: search.Sort.DESC,
                        label: "ID interno"
                    }),
                    search.createColumn({ name: "name", label: "ID" }),
                    search.createColumn({ name: "altname", label: "Nombre" }),
                    search.createColumn({ name: "custrecord_assetsourcetrn", label: "Transacción principal" }),
                    search.createColumn({ name: "custrecord_assettype", label: "Tipo de activo" }),
                    search.createColumn({ name: "custrecord_assetdescr", label: "Descripción de activo" }),
                    search.createColumn({ name: "custrecord_assetsupplier", label: "Proveedor" }),
                    search.createColumn({ name: "custrecord_assetpurchasedate", label: "Fecha de compra" }),
                    search.createColumn({ name: "custrecord_assetcost", label: "Costo original del activo" }),
                    search.createColumn({ name: "custrecord_assetstatus", label: "Estado de activo" }),
                    search.createColumn({ name: "custrecord_assetclass", label: "Clase" }),
                    search.createColumn({ name: "custrecord_assetalternateno", label: "Número de activo alternativo" }),
                    search.createColumn({ name: "custrecord_bio_can_fac_obt_can_act_fij", label: "Cantidad Factura" }),
                    search.createColumn({ name: "custrecord_assetcaretaker", label: "Usuario (Depositorio)" }),
                    search.createColumn({ name: "custrecord_assetpurchaseorder", label: "Orden de compra" }),
                    search.createColumn({ name: "custrecord_bio_est_proc_con_act_fij", label: "Estado Proceso (Administración y control de activos)" }),
                    search.createColumn({ name: "custrecord_bio_est_acc_con_act_fij", label: "Estado Acción (Administración y control de activos)" }),
                ],
                filters: [
                    ["custrecord_assetstatus", "noneof", "4"] // En el listado, no traer los activos fijos con Estado de Activo "Enajenado"
                ]
            };

            /****************** Filtros por defecto ******************/
            // Filtro de tipo de activo
            if (assettype != '') {
                if (searchObject.filters.length > 0) {
                    searchObject.filters.push('AND');
                }
                searchObject.filters.push(["custrecord_assettype", "anyof", assettype]);
            }

            // Filtro de subsidiary
            if (Array.isArray(subsidiary) && subsidiary[0] != '') {
                if (searchObject.filters.length > 0) {
                    searchObject.filters.push('AND');
                }
                searchObject.filters.push(["custrecord_assetsubsidiary", "anyof"].concat(subsidiary));
            }

            /****************** Filtros adicionales ******************/
            // Filtro de clases
            if (classification != '') {
                if (searchObject.filters.length > 0) {
                    searchObject.filters.push('AND');
                }
                searchObject.filters.push(["custrecord_assetclass", "anyof", classification]);
            }

            // Filtro de número de activo alternativo
            if (numero_activo_alternativo != '') {
                if (searchObject.filters.length > 0) {
                    searchObject.filters.push('AND');
                }
                searchObject.filters.push(["custrecord_assetalternateno", "contains", numero_activo_alternativo]);
            }

            // Filtro de nombre
            if (nombre != '') {
                if (searchObject.filters.length > 0) {
                    searchObject.filters.push('AND');
                }
                searchObject.filters.push(["name", "contains", nombre]);
            }

            // Filtro de estado accion
            if (estado_accion != '') {
                if (searchObject.filters.length > 0) {
                    searchObject.filters.push('AND');
                }
                searchObject.filters.push(["custrecord_bio_est_acc_con_act_fij", "anyof", estado_accion]);
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
            // objHelper.error_log('', 'getDataActivosFijos');
            // objHelper.error_log('', count);

            // Recorrer search - con mas de 4000 registros
            let pageData = searchContext.runPaged({ pageSize: 1000 }); // El minimo de registros que se puede traer por pagina es 50, pondremos 1000 para que en el caso existan 4500 registros, hayan 5 paginas como maximo y no me consuma mucha memoria

            pageData.pageRanges.forEach(function (pageRange) {
                var myPage = pageData.fetch({ index: pageRange.index });
                myPage.data.forEach((row) => {
                    // Obtener informacion
                    let { columns } = row;
                    let activo_fijo_id_interno = row.getValue(columns[0]);
                    let activo_id = row.getValue(columns[1]);
                    let activo_nombre = row.getValue(columns[2]);
                    let factura_compra_id_interno = row.getValue(columns[3]);
                    let factura_compra = row.getText(columns[3]);
                    let tipo_activo_id = row.getValue(columns[4]);
                    let tipo_activo_nombre = row.getText(columns[4]);
                    let descripcion_activo = row.getValue(columns[5]);
                    let proveedor = row.getValue(columns[6]);
                    let fecha_compra = row.getValue(columns[7]);
                    let costo_original = row.getValue(columns[8]);
                    let estado_activo_id_interno = row.getValue(columns[9]);
                    let estado_activo = row.getText(columns[9]);
                    let centro_costo_id_interno = row.getValue(columns[10]);
                    let centro_costo = row.getText(columns[10]);
                    let numero_activo_alternativo = row.getValue(columns[11]);
                    let cantidad_factura = row.getValue(columns[12]);
                    let usuario_depositario_id_interno = row.getValue(columns[13]);
                    let usuario_depositario = row.getText(columns[13]);
                    let orden_compra_id_interno = row.getValue(columns[14]);
                    let orden_compra = row.getText(columns[14]);
                    let estado_proceso_id_interno = row.getValue(columns[15]);
                    let estado_proceso = row.getText(columns[15]);
                    let estado_accion_id_interno = row.getValue(columns[16]);
                    let estado_accion = row.getText(columns[16]);

                    // Insertar informacion en array
                    resultTransaction.push({
                        activo_fijo: { id_interno: activo_fijo_id_interno, id: activo_id, nombre: activo_nombre },
                        factura_compra: { id: factura_compra_id_interno, numero_documento: factura_compra },
                        tipo_activo: { id: tipo_activo_id, nombre: tipo_activo_nombre },
                        descripcion_activo: descripcion_activo,
                        proveedor: proveedor,
                        fecha_compra: fecha_compra,
                        costo_original: costo_original,
                        estado_activo: { id: estado_activo_id_interno, nombre: estado_activo },
                        centro_costo: { id: centro_costo_id_interno, nombre: centro_costo },
                        numero_activo_alternativo: numero_activo_alternativo,
                        cantidad_factura: cantidad_factura,
                        usuario_depositario: { id: usuario_depositario_id_interno, nombre: usuario_depositario },
                        orden_compra: { id: orden_compra_id_interno, numero_documento: orden_compra },
                        estado_proceso: { id: estado_proceso_id_interno, nombre: estado_proceso },
                        estado_accion: { id: estado_accion_id_interno, nombre: estado_accion },
                    });
                });
            });

            // objHelper.error_log('getDataActivosFijos', resultTransaction);
            return resultTransaction;
        }

        function getDataConf_CentroCostoEmpleado() {

            // Declarar variables
            let resultTransaction = [];

            // Declarar search
            let searchObject = {
                type: 'customrecord_bio_conf_cencos_emp',
                columns: [
                    search.createColumn({ name: "internalid", label: "ID INTERNO" }),
                    search.createColumn({ name: "custrecord_bio_centro_costo_confccemp", label: "Centro Costo" }),
                    search.createColumn({ name: "custrecord_bio_empleado_confccemp", label: "Empleado" }),
                    search.createColumn({ name: "custrecord_bio_estado_accion_confccemp", label: "Estado Acción" })
                ]
            };

            // Crear search
            let searchContext = search.create(searchObject);

            // Cantidad de registros en search
            // let count = searchContext.runPaged().count;
            // log.debug('', 'getDataConf_CentroCosto_Empleado');
            // log.debug('', count);

            // Recorrer search
            searchContext.run().each(node => {
                // Obtener informacion
                let columns = node.columns;
                let id_interno = node.getValue(columns[0]); // ID INTERNO
                let centro_costo = node.getValue(columns[1]); // CENTRO DE COSTO
                let centro_costo_nombre = node.getText(columns[1]); // CENTRO DE COSTO
                let empleado = node.getValue(columns[2]); // EMPLEADO
                let empleado_nombre = node.getText(columns[2]); // EMPLEADO
                let estado_accion = node.getValue(columns[3]); // ESTADO ACCION
                let estado_accion_nombre = node.getText(columns[3]); // ESTADO ACCION

                // Insertar informacion en array
                resultTransaction.push({
                    id_interno: id_interno,
                    centro_costo: { id: centro_costo, nombre: centro_costo_nombre },
                    empleado: { id: empleado, nombre: empleado_nombre },
                    estado_accion: { id: estado_accion, nombre: estado_accion_nombre }
                });

                return true; // La funcion each debes indicarle si quieres que siga iterando o no
            })

            // objHelper.error_log('getDataConf_CentroCosto_Empleado', resultTransaction);
            return resultTransaction;
        }

        function getUsersByTipoAccionCentroCosto(activo_fijo_id_interno) {

            // Declarar variables
            let usersBaja = {
                usersId: [], // Anterior Centro de Costo
                usersId_: [] // Nuevo Centro de Costo
            }
            let usersTransferencia = {
                usersId: [], // Anterior Centro de Costo
                usersId_: [] // Nuevo Centro de Costo
            }

            // Obtener datos por search
            let dataConf_CentroCosto_Empleado = getDataConf_CentroCostoEmpleado();

            // Obtener datos por record
            let fixedAsset = record.load({ type: 'customrecord_ncfar_asset', id: activo_fijo_id_interno });

            // Recorrer configuracion Centro de Costo - Empleado - Tipo de Accion
            dataConf_CentroCosto_Empleado.forEach(element => {

                // * BAJA
                if (element.estado_accion.id == 2) {

                    // Usuarios del Anterior Centro de Costo
                    if (element.centro_costo.id == fixedAsset.getValue('custrecord_assetclass')) {
                        usersBaja.usersId.push(Number(element.empleado.id));
                    }

                    // Usuarios del Nuevo Centro de Costo
                    if (element.centro_costo.id == fixedAsset.getValue('custrecord_bio_nue_cc_con_act_fij')) {
                        usersBaja.usersId_.push(Number(element.empleado.id));
                    }
                }

                // * TRANSFERENCIA
                if (element.estado_accion.id == 3) {

                    // Usuarios del Anterior Centro de Costo
                    if (element.centro_costo.id == fixedAsset.getValue('custrecord_assetclass')) {
                        usersTransferencia.usersId.push(Number(element.empleado.id));
                    }

                    // Usuarios del Nuevo Centro de Costo
                    if (element.centro_costo.id == fixedAsset.getValue('custrecord_bio_nue_cc_con_act_fij')) {
                        usersTransferencia.usersId_.push(Number(element.empleado.id));
                    }
                }
            });

            return { usersBaja, usersTransferencia }
        }

        // Suitelet Report
        function getAssetTypeList() {

            // Array donde guardaremos la informacion
            let result = [];

            // Crear search
            let searchContext = search.create({
                type: 'customrecord_ncfar_assettype',
                columns: ['internalid', 'name']
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

        function getClassList() {

            // Array donde guardaremos la informacion
            let result = [];

            // Crear search
            let searchContext = search.create({
                type: 'classification',
                columns: ['internalid', 'name']
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

        function getEstadoAccionList() {

            // Array donde guardaremos la informacion
            let result = [];

            // Crear search
            let searchContext = search.create({
                type: 'customlist_bio_lis_est_acc_con_act',
                columns: ['internalid', 'name']
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
        function getEstadoBienList() {

            // Array donde guardaremos la informacion
            let result = [];

            // Crear search
            let searchContext = search.create({
                type: 'customlist_bio_lis_est_bien_con_act',
                columns: [
                    search.createColumn({
                        name: "internalid",
                        sort: search.Sort.ASC,
                    }),
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

        function getMotivoBajaList() {

            // Array donde guardaremos la informacion
            let result = [];

            // Crear search
            let searchContext = search.create({
                type: 'customlist_bio_lis_mot_baja_con_act',
                columns: [
                    search.createColumn({
                        name: "internalid",
                        sort: search.Sort.ASC,
                    }),
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

        return { getDataActivosFijos, getUsersByTipoAccionCentroCosto, getAssetTypeList, getClassList, getEstadoAccionList, getEstadoBienList, getMotivoBajaList }

    });
