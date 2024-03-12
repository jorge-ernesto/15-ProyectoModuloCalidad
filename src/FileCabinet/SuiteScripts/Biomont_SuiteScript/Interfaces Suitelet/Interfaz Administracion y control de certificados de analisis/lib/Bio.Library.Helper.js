
/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 */
define(['N'],

    function (N) {

        const { log, runtime, email, url } = N;

        const scriptId = 'customscript_bio_sl_control_cert_det';
        const deployId = 'customdeploy_bio_sl_control_cert_det';

        /******************/

        function getUser() {
            let user = runtime.getCurrentUser();
            return { user };
        }

        function error_log(title, data) {
            throw `${title} -- ${JSON.stringify(data)}`;
        }

        function email_log(title, data) {
            let user = runtime.getCurrentUser();
            email.send({
                author: user.id,
                recipients: user.id,
                subject: title,
                body: `<pre>${JSON.stringify(data)}</pre>`,
            })
        }

        /******************/

        function getUrlSuiteletDetail(id) {

            // Obtener url del Suitelet mediante ID del Script y ID del Despliegue
            let suitelet = url.resolveScript({
                deploymentId: deployId,
                scriptId: scriptId,
                params: {
                    _id: id
                }
            })

            return { suitelet };
        }

        return { getUser, error_log, email_log, getUrlSuiteletDetail }

    });
