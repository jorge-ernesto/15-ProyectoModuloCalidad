/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N'],

    function (N) {

        const { log, currentRecord, url } = N;

        const scriptId = 'customscript_bio_sl_control_cert';
        const deployId = 'customdeploy_bio_sl_control_cert';

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

        function getColaInspeccion() {

            // Obtener el currentRecord
            // En una funcion personalizada, no viene ningun currenRecord, entonces debemos usar el modulo base
            // currentRecord.get(), recupera el mismo currentRecord que tiene cada funcion estandar
            let recordContext = currentRecord.get();

            // Recuperar valores de los campos
            let item = recordContext.getValue('custpage_field_filter_item');
            let triggerType = recordContext.getValue('custpage_field_filter_trigger_type');
            let status = recordContext.getValue('custpage_field_filter_status');

            // Debug
            // console.log('debug', { item, triggerType, status });
            // return;

            // Obtener url del Suitelet mediante ID del Script y ID del Despliegue
            let suitelet = url.resolveScript({
                deploymentId: deployId,
                scriptId: scriptId,
                params: {
                    _button: 'consultar',
                    _item: item,
                    _triggerType: triggerType,
                    _status: status
                }
            })

            // Evitar que aparezca el mensaje 'Estas seguro que deseas salir de la pantalla'
            setWindowChanged(window, false);

            // Redirigir a la url
            window.location.href = suitelet;
        }

        return {
            pageInit: pageInit,
            getColaInspeccion: getColaInspeccion
        };

    });
