<#assign params = input.data?eval>
<?xml version="1.0"?>
<!DOCTYPE pdf PUBLIC "-//big.faceless.org//report" "report-1.1.dtd">
<pdf>
    <head>
        <style>
            body {
                font-family: sans-serif;
            }

            .bold {
                font-weight: bold;
            }

            .center {
                text-align: center;
                margin: 0 auto;
            }

            .left {
                text-align: left;
            }

            .pb1 {
                padding-bottom: 1px;
            }

            .fs18 {
                font-size: 18px;
            }

            .fs15 {
                font-size: 15px;
            }

            .fs12 {
                font-size: 12px;
            }

            .fs10 {
                font-size: 10px;
            }

            .fs9 {
                font-size: 9px;
            }

            .fs8 {
                font-size: 8px;
            }

            .fs7 {
                font-size: 7px;
            }

            .border-collapse {
                border-collapse: collapse; /* Asegura que los bordes de las celdas se fusionen correctamente */
            }

            .tbody {
                border-collapse: collapse;
                width: 100%;
            }

            .tbody th,
            .tbody td {
                border: 0.1mm solid #000000;
                text-align: center;
                padding: 3px;
            }

            img {
                width: 120px;
                height: 40px;
            }
        </style>

        <macrolist>
            <macro id="nlfooter">

                <table width="100%" class="fs9 border-collapse">
                    <tfoot>
                        <tr>
                            <td colspan="5" align="right">Página <pagenumber/> / <totalpages/></td>
                        </tr>
                    </tfoot>
                </table>

            </macro>
        </macrolist>
    </head>

    <body size="A4" footer="nlfooter">

        <!-- <img src='https://www.biomont.com.pe/storage/img/logo.png'></img> -->

        <table width="100%" class="fs9 border-collapse" cellpadding="3">
            <thead>
                <tr>
                    <th colspan="1" class="bold" align="center" valign="middle">
                        <img src='https://www.biomont.com.pe/storage/img/logo.png'></img>
                        Laboratorios Biomont S.A.
                    </th>
                    <th colspan="3" class="fs15 bold" align="center" valign="middle">
                        CERTIFICADO DE ANALISIS DE MATERIAS PRIMAS
                    </th>
                    <th colspan="1" class="bold" width="70" valign="middle">
                        Código: F-AC.009<br />
                        Versión: 10<br />
                        Vigente desde:<br />
                        27/12/2023
                    </th>
                </tr>
                <tr>
                    <th colspan="5"></th>
                </tr>
            </thead>
        </table>

        <!-- COLA DE INSPECCION -->
        <table width="100%" class="fs9 border-collapse" cellpadding="3">
            <tr>
                <th colspan="1"><b>CÓDIGO:</b></th>
                <th colspan="1" align="left">${params.cola_inspeccion_data.data_PDFCabecera[0].articulo_itemid}</th>
                <th colspan="1"><b>N. DOCUMENTO:</b></th>
                <th colspan="2" align="left">${params.cola_inspeccion_data.data_PDFCabecera[0].ns_tipo_documento_nombre} ${params.cola_inspeccion_data.data_PDFCabecera[0].ns_serie} ${params.cola_inspeccion_data.data_PDFCabecera[0].ns_numero_correlativo}</th>
                <#--  <th colspan="1"></th>  -->
            </tr>
            <tr>
                <th colspan="1"><b>MATERIA PRIMA:</b></th>
                <th colspan="1" align="left">${params.cola_inspeccion_data.data_PDFCabecera[0].articulo_displayname}</th>
                <th colspan="1"><b>N. ANÁLISIS:</b></th>
                <th colspan="1" align="left">${params.cola_inspeccion_data.data_PDFCabecera[0].num_analisis}</th>
                <th colspan="1"></th>
            </tr>
            <tr>
                <th colspan="1"><b>N. TÉCNICA:</b></th>
                <th colspan="1" align="left">${params.cola_inspeccion_data.data_PDFCabecera[0].num_tecnica}</th>
                <th colspan="1"><b>FABRICANTE:</b></th>
                <th colspan="1" align="left">${params.cola_inspeccion_data.data_PDFCabecera[0].fabricante}</th>
                <th colspan="1"></th>
            </tr>
            <tr>
                <th colspan="1"><b>PROVEEDOR:</b></th>
                <th colspan="1" align="left">${params.cola_inspeccion_data.data_PDFCabecera[0].proveedor_nombre}</th>
                <th colspan="1"><b>FECHA ANÁLISIS:</b></th>
                <th colspan="1" align="left">${params.cola_inspeccion_data.data_PDFCabecera[0].fecha_analisis}</th>
                <th colspan="1"></th>
            </tr>
            <tr>
                <th colspan="1"><b>FECHA INGRESO:</b></th>
                <th colspan="1" align="left">${params.cola_inspeccion_data.data_PDFCabecera[0].fecha_recepcion}</th>
                <th colspan="1"></th>
                <th colspan="1"></th>
                <th colspan="1"></th>
            </tr>
            <#--
            <tr>
                <th colspan="5"></th>
            </tr>
            -->
        </table>

        <!-- DATOS DE CALIDAD -->
        <#list params.cola_inspeccion_data.data_PDFDetalle as keylot, lotes>
            <span class="fs10">Lote: ${keylot}</span><br />
            <span class="fs10">Fecha Expiracion: ${lotes[0]['fecha_caducidad'][0]}</span>

            <table width="100%" class="fs9 border-collapse tbody" cellpadding="3">
                <tbody>
                    <tr>
                        <td colspan="2"><b>ENSAYOS</b></td>
                        <td colspan="2"><b>ESPECIFICACIONES</b></td>
                        <td colspan="1"><b>RESULTADOS</b></td>
                    </tr>
                    <#list lotes as datoscalidad>
                        <tr>
                            <td colspan="2">${datoscalidad.inspeccion_nombre_mostrar}</td>
                            <td colspan="2">${datoscalidad.descripcion_inspeccion}</td>
                            <td colspan="1"><#if datoscalidad.valor_inspeccion?has_content>${datoscalidad.valor_inspeccion} ${datoscalidad.unidad_medida}</#if></td>
                        </tr>
                    </#list>
                </tbody>
            </table>
        </#list>

        <!-- COLA DE INSPECCION -->
        <#assign observaciones = params.cola_inspeccion_data.data_PDFCabecera[0].observaciones>
        <#assign estado_nombre_mostrar = params.cola_inspeccion_data.data_PDFCabecera[0].estado_nombre_mostrar>
        <#assign usuariofirma_revisadopor = params.cola_inspeccion_data.data_PDFCabecera[0].usuariofirma_revisadopor>
        <#assign fechafirma_revisadopor = params.cola_inspeccion_data.data_PDFCabecera[0].fechafirma_revisadopor>
        <#assign usuariofirma_aprobadopor = params.cola_inspeccion_data.data_PDFCabecera[0].usuariofirma_aprobadopor>
        <#assign fechafirma_aprobadopor = params.cola_inspeccion_data.data_PDFCabecera[0].fechafirma_aprobadopor>

        <span class="fs10">Observaciones: ${observaciones?replace("\n", "<br/>")}</span><br />
        <span class="fs10">Estado: ${estado_nombre_mostrar}</span>
        <table width="100%" class="fs12 border-collapse" cellpadding="1">
            <tbody>
                <tr>
                    <td colspan="2" align="center" valign="middle"><b>${usuariofirma_revisadopor}<br />${fechafirma_revisadopor}</b></td>
                    <th colspan="1"></th>
                    <td colspan="2" align="center" valign="middle"><b>${usuariofirma_aprobadopor}<br />${fechafirma_aprobadopor}</b></td>
                </tr>
                <tr>
                    <td colspan="2" align="center" valign="middle"><b/>______________________<b/></td>
                    <th colspan="1"></th>
                    <td colspan="2" align="center" valign="middle"><b/>______________________<b/></td>
                </tr>
                <tr>
                    <td colspan="2" align="center" valign="middle"><b>REVISADO POR</b></td>
                    <th colspan="1"></th>
                    <td colspan="2" align="center" valign="middle"><b>APROBADO POR</b></td>
                </tr>
            </tbody>
        </table>

    </body>
</pdf>