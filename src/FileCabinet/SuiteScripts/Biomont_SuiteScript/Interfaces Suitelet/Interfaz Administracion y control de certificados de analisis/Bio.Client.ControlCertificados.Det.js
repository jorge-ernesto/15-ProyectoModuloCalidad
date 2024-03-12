/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N'],

    function (N) {

        const { log, currentRecord, url, https, http } = N;

        const scriptId = 'customscript_bio_sl_api_control_cert_det';
        const deployId = 'customdeploy_bio_sl_api_control_cert_det';

        const scriptDownloadId = 'customscript_bio_sl_con_cert_det_des_arc';
        const deployDownloadId = 'customdeploy_bio_sl_con_cert_det_des_arc';

        /******************/

        /**
         * Function to be executed after page is initialized.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
         *
         * @since 2015.2
         */
        function pageInit(scriptContext) {

        }

        /******************/

        function loadSweetAlertLibrary() {
            return new Promise(function (resolve, reject) {
                var sweetAlertScript = document.createElement('script');
                sweetAlertScript.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
                sweetAlertScript.onload = resolve;
                document.head.appendChild(sweetAlertScript);
            });
        }

        function getUrlSuitelet() {

            // Obtener url del Suitelet mediante ID del Script y ID del Despliegue
            let suitelet = url.resolveScript({
                deploymentId: deployId,
                scriptId: scriptId
            });

            return suitelet;
        }

        function sendRequestWrapper(method) {

            // Cargar Sweet Alert
            loadSweetAlertLibrary().then(function () {

                // Ejecutar confirmacion
                Swal.fire({
                    title: "¿Está seguro?",
                    text: "¡Debe confirmar la acción!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Enviar"
                }).then((result) => {
                    if (result.isConfirmed) {

                        // Ejecutar peticion
                        let responseData = sendRequest(method);
                        refreshPage(responseData);
                    }
                });
            });
        }

        function sendRequest(method) {

            // Obtener el id interno del record cola de inspeccion
            let recordContext = currentRecord.get();
            let cola_inspeccion_id = recordContext.getValue('custpage_field_cola_inspeccion_id_interno');

            // Obtener url del Suitelet mediante ID del Script y ID del Despliegue
            let suitelet = getUrlSuitelet();

            // Solicitud HTTP
            let response = https.post({
                url: suitelet,
                body: JSON.stringify({
                    _method: method,
                    _cola_inspeccion_id: cola_inspeccion_id
                })
            });
            let responseData = JSON.parse(response.body);
            console.log(responseData);

            return responseData;
        }

        function refreshPage(responseData) {

            // Evitar que aparezca el mensaje 'Estas seguro que deseas salir de la pantalla'
            setWindowChanged(window, false);

            // Redirigir a la url
            window.location.href = responseData.urlSuitelet;
        }

        /******************/

        function firmaRevisadoPor() {

            sendRequestWrapper('firmaRevisadoPor');
        }

        function firmaAprobadoPor() {

            sendRequestWrapper('firmaAprobadoPor');
        }

        function descargarPDF() {

            // Obtener el id interno del record proyecto
            let recordContext = currentRecord.get();
            let cola_inspeccion_id = recordContext.getValue('custpage_field_cola_inspeccion_id_interno');
            let articulo_id = recordContext.getValue('custpage_field_articulo');
            let numero_linea_transacccion = recordContext.getValue('custpage_field_numero_linea_transaccion');

            // Determinar tipo de pdf
            let linea_id = recordContext.getValue('custpage_field_linea_id_interno');
            let tipo_producto_id = recordContext.getValue('custpage_field_tipo_producto_id_interno');
            let tipo_pdf = null;

            if (linea_id == 5) // MATERIA PRIMA
                tipo_pdf = 'MP';
            else if (linea_id == 7 || linea_id == 8) // MATERIAL DE EMPAQUE, MATERIAL DE ENVASADO
                tipo_pdf = 'ME_MV';
            else if (tipo_producto_id == 16) // PRODUCTO TERMINADO
                tipo_pdf = 'PT';

            // Debug
            console.log({ cola_inspeccion_id, articulo_id, numero_linea_transacccion, linea_id, tipo_producto_id, tipo_pdf });

            // Obtener url del Suitelet mediante ID del Script y ID del Despliegue
            let suitelet = url.resolveScript({
                deploymentId: deployDownloadId,
                scriptId: scriptDownloadId,
                params: {
                    _button: 'pdf',
                    _cola_inspeccion_id: cola_inspeccion_id,
                    _articulo_id: articulo_id,
                    _numero_linea_transaccion: numero_linea_transacccion,
                    _tipo_pdf: tipo_pdf
                }
            });

            // Evitar que aparezca el mensaje 'Estas seguro que deseas salir de la pantalla'
            setWindowChanged(window, false);

            // Abrir url
            window.open(suitelet);
        }

        return {
            pageInit: pageInit,
            firmaRevisadoPor: firmaRevisadoPor,
            firmaAprobadoPor: firmaAprobadoPor,
            descargarPDF: descargarPDF
        };

    });
