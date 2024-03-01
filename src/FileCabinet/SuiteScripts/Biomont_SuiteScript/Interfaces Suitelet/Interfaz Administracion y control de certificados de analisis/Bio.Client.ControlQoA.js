/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N'],

    function (N) {

        const { currentRecord, url } = N;

        const scriptId = 'customscript_bio_sl_control_fixed_assets';
        const deployId = 'customdeploy_bio_sl_control_fixed_assets';

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

            // document.getElementById('custpage_field_class_popup_link')?.remove();
            // document.getElementById('custpage_field_estado_proceso_popup_new')?.remove();
            // document.getElementById('custpage_field_estado_proceso_popup_link')?.remove();

            // Agregar atributo a enlace "Orden de Compra"
            document.querySelector('#custpage_field_orden_compra_displayval a')?.setAttribute("target", "_blank");
        }

        function getFixedAssets() {

            // Obtener el currentRecord
            // En una funcion personalizada, no viene ningun currenRecord, entonces debemos usar el modulo base
            // currentRecord.get(), recupera el mismo currentRecord que tiene cada funcion estandar
            let recordContext = currentRecord.get();

            // Recuperar valores de los campos
            let assettype = recordContext.getValue('custpage_field_filter_assettype');
            let subsidiary = recordContext.getValue('custpage_field_filter_subsidiary');
            let classification = recordContext.getValue('custpage_field_filter_class');
            let numero_activo_alternativo = recordContext.getValue('custpage_field_filter_numero_activo_alternativo');
            let nombre = recordContext.getValue('custpage_field_filter_nombre');
            let estado_accion = recordContext.getValue('custpage_field_filter_estado_accion');

            // Debug
            // console.log('debug', { assettype, subsidiary });
            // return;

            // Obtener url del Suitelet mediante ID del Script y ID del Despliegue
            let suitelet = url.resolveScript({
                deploymentId: deployId,
                scriptId: scriptId,
                params: {
                    _button: 'consultar',
                    _assettype: assettype,
                    _subsidiary: subsidiary.join('|'), // ['1','2'] -> '1|2'
                    _classification: classification,
                    _numero_activo_alternativo: numero_activo_alternativo,
                    _nombre: nombre,
                    _estado_accion: estado_accion
                }
            })

            // Evitar que aparezca el mensaje 'Estas seguro que deseas salir de la pantalla'
            setWindowChanged(window, false);

            // Redirigir a la url
            window.location.href = suitelet;
        }

        return {
            pageInit: pageInit,
            getFixedAssets: getFixedAssets
        };

    });
