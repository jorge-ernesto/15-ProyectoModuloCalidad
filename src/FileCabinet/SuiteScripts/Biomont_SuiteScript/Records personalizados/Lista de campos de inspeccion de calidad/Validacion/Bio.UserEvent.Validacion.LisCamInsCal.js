// Notas del archivo:
// - Secuencia de comando:
//      - Biomont UE Validacion LisCamInsCal (customscript_bio_ue_val_liscaminscal)
// - Registro:
//      - Lista de campos de inspección de calidad (customrecord_qm_inspection_fields)

/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N'],

    function (N) {

        const { search } = N;

        /******************/

        /**
         * Defines the function definition that is executed before record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        function beforeSubmit(context) {

            // Nuevo registro
            var campo = context.newRecord
            var id = campo.getValue('id');
            var name = campo.getValue('name').trim();

            // Setear el nombre con trim
            campo.setValue('name', name)

            // Filtro de ID Interno
            if (!id) {
                id = '@NONE@'
            }

            // Buscar registro
            // Crear una búsqueda para obtener los registros
            var searchObj = search.create({
                type: 'customrecord_qm_inspection_fields',
                columns: [],
                filters: [
                    ['name', 'is', name],
                    'AND',
                    ['internalid', 'noneof', id]
                ]
            });

            var codigoExistente = false;

            // Ejecutar la búsqueda y recorrer los resultados
            searchObj.run().each((result) => {
                // Verificar result
                log.debug('result', result)

                // Si se encuentra al menos un registro, establece 'codigoExistente' en verdadero y detén la búsqueda
                codigoExistente = true;

                // Detener la búsqueda
                return false;
            });

            // Verifica si el código ya existe
            if (codigoExistente) {
                throw new Error('El nombre ya existe en un registro existente.');
            }
        }

        return { beforeSubmit };

    });
