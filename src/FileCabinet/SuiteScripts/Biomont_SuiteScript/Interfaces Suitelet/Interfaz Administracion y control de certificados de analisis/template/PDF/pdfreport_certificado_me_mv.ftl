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
                border-collapse: collapse;
            }

            .tbody {
                border-collapse: collapse; /* Asegura que los bordes de las celdas se fusionen correctamente */
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

        <table width="100%" class="fs9 border-collapse" cellpadding="4">
            <thead>
                <tr>
                    <th colspan="1" class="bold" align="center" style="vertical-align: middle;">
                        <img src='https://www.biomont.com.pe/storage/img/logo.png'></img>
                        Laboratorios Biomont S.A.
                    </th>
                    <th colspan="3" class="fs15 bold" align="center" style="vertical-align: middle;">
                        CERTIFICADO DE ANALISIS DE MATERIALES DE<br />EMPAQUE Y ENVASE
                    </th>
                    <th colspan="1" class="bold" width="56" style="vertical-align: middle;">
                        Código: F-CC.008<br />
                        Versión: 04<br />
                        Vigente desde: <br />27/02/2024
                    </th>
                </tr>
                <tr>
                    <th colspan="5"></th>
                </tr>

                <!-- COLA DE INSPECCION -->
                <tr>
                    <th colspan="1"><b>CÓDIGO:</b></th>
                    <th colspan="1">${params.cola_inspeccion_data.data_PDFCabecera[0].articulo_itemid}</th>
                    <th colspan="1"><b>N. ANÁLISIS:</b></th>
                    <th colspan="1">${params.cola_inspeccion_data.data_PDFCabecera[0].num_analisis}</th>
                    <th colspan="1"></th>
                </tr>
                <tr>
                    <th colspan="1"><b>MATERIA PRIMA:</b></th>
                    <th colspan="1">${params.cola_inspeccion_data.data_PDFCabecera[0].articulo_displayname}</th>
                    <th colspan="1"><b>TIPO DE EMBALAJE PRIMARIO:</b></th>
                    <th colspan="1">${params.cola_inspeccion_data.data_PDFCabecera[0].tipo_embalaje_primario}</th>
                    <th colspan="1"></th>
                </tr>
                <tr>
                    <th colspan="1"><b>PROVEEDOR:</b></th>
                    <th colspan="1">${params.cola_inspeccion_data.data_PDFCabecera[0].proveedor_nombre}</th>
                    <th colspan="1"><b>TIPO DE EMBALAJE SECUNDARIO:</b></th>
                    <th colspan="1">${params.cola_inspeccion_data.data_PDFCabecera[0].tipo_embalaje_secundario}</th>
                    <th colspan="1"></th>
                </tr>
                <tr>
                    <th colspan="1"><b>FECHA INGRESO:</b></th>
                    <th colspan="1">${params.cola_inspeccion_data.data_PDFCabecera[0].fecha_recepcion}</th>
                    <th colspan="1"><b>CANTIDAD INGRESADA:</b></th>
                    <th colspan="1">${params.cola_inspeccion_data.data_PDFCabecera[0].cantidad_recepcion}</th>
                    <th colspan="1"></th>
                </tr>
                <tr>
                    <th colspan="1"><b>FECHA ANALISIS:</b></th>
                    <th colspan="1">${params.cola_inspeccion_data.data_PDFCabecera[0].fecha_analisis}</th>
                    <th colspan="1"><b>CANTIDAD INSPECCIONADA:</b></th>
                    <th colspan="1">${params.cola_inspeccion_data.data_PDFCabecera[0].cantidad_inspeccionada}</th>
                    <th colspan="1"></th>
                </tr>
                <tr>
                    <th colspan="1"><b>NIVEL DE INSPECCION<br /> NORMA TECNICA PERUANA<br /> ISO 2859-1 2009:</b></th>
                    <th colspan="1">${params.cola_inspeccion_data.data_PDFCabecera[0].nivel_inspeccion_iso_2859}</th>
                    <th colspan="1"><b>CANTIDAD MUESTREADA:</b></th>
                    <th colspan="1">${params.cola_inspeccion_data.data_PDFCabecera[0].cantidad_muestreada}</th>
                    <th colspan="1"></th>
                </tr>
                <tr>
                    <th colspan="5"></th>
                </tr>
            </thead>
        </table>

        <!-- DATOS PREVIOS DE INSPECCION -->
        <table width="100%" class="fs9 border-collapse tbody" cellpadding="4">
            <tbody>
                <tr>
                    <td colspan="3"><b>INSPECCION</b></td>
                    <td colspan="2"><b>ESTADO</b></td>
                </tr>
                <#list params.cola_inspeccion_data.data_PDFDetalle_DatosPreviosInspeccion as datosprevinsp>
                    <tr>
                        <td colspan="3">${datosprevinsp.inspeccion}</td>
                        <td colspan="2">${datosprevinsp.estado_pdf}</td>
                    </tr>
                </#list>
            </tbody>
        </table>

        <!-- DATOS DE CALIDAD -->
        <#list params.cola_inspeccion_data.data_PDFDetalle as keylot, lotes>
            Lote: ${keylot}<br />
            Fecha Expiracion: ${lotes[0]['fecha_caducidad'][0]}

            <table width="100%" class="fs9 border-collapse tbody" cellpadding="4">
                <tbody>
                    <!-- DATOS DE CALIDAD -->
                    <tr>
                        <td colspan="2"><b>ENSAYOS</b></td>
                        <td colspan="2"><b>ESPECIFICACIONES</b></td>
                        <td colspan="1"><b>RESULTADOS</b></td>
                    </tr>
                    <#list lotes as datoscalidad>
                        <tr>
                            <td colspan="2">${datoscalidad.inspeccion_nombre}</td>
                            <td colspan="2">${datoscalidad.descripcion_inspeccion}</td>
                            <td colspan="1">${datoscalidad.valor_inspeccion}</td>
                        </tr>
                    </#list>
                    <tr>
                        <td style="border: 0" colspan="5"><b>Método de Análisis:</b> Técnica Propia</td>
                    </tr>

                    <!-- DATOS DE ISO 2859-1 2009 -->
                    <#assign mostrar_cabecera_datosISO2859 = true>
                    <#assign mostrar_pie_datosISO2859 = false>

                    <#list params.cola_inspeccion_data.data_PDFDetalle_DatosISO2859 as datosiso>
                        <#if (datosiso.lote == keylot)>
                            <#if mostrar_cabecera_datosISO2859 == true>
                                <tr>
                                    <td colspan="1"><b>LOTES</b></td>
                                    <td colspan="1"><b>AQL</b></td>
                                    <td colspan="1"><b>MAX. ACEPTABLE</b></td>
                                    <td colspan="1"><b>CANTIDAD ENCONTRADA</b></td>
                                    <td colspan="1"><b>DEFECTO<br />ENCONTRADO</b></td>
                                </tr>
                                <#assign mostrar_cabecera_datosISO2859 = false>
                                <#assign mostrar_pie_datosISO2859 = true>
                            </#if>
                            <tr>
                                <td colspan="1">${datosiso.lote}</td>
                                <td colspan="1">${datosiso.aql}</td>
                                <td colspan="1">${datosiso.max_aceptable}</td>
                                <td colspan="1">${datosiso.cantidad_encontrada}</td>
                                <td colspan="1">${datosiso.defecto_encontrado}</td>
                            </tr>
                        </#if>
                    </#list>
                    <#if mostrar_pie_datosISO2859 == true>
                        <tr>
                            <td style="border: 0" colspan="5"><b>Referencia Norma Técnica Peruana ISO 2859-1 2009</b></td>
                        </tr>
                    </#if>
                </tbody>
            </table>
        </#list>

        <!-- COLA DE INSPECCION -->
        <#assign observaciones = params.cola_inspeccion_data.data_PDFCabecera[0].observaciones>
        <#assign usuariofirma_revisadopor = params.cola_inspeccion_data.data_PDFCabecera[0].usuariofirma_revisadopor>
        <#assign fechafirma_revisadopor = params.cola_inspeccion_data.data_PDFCabecera[0].fechafirma_revisadopor>
        <#assign usuariofirma_aprobadopor = params.cola_inspeccion_data.data_PDFCabecera[0].usuariofirma_aprobadopor>
        <#assign fechafirma_aprobadopor = params.cola_inspeccion_data.data_PDFCabecera[0].fechafirma_aprobadopor>

        <span class="fs12">Observaciones: ${observaciones}</span>
        <table width="100%" class="fs12 border-collapse" cellpadding="1">
            <tbody>
                <tr>
                    <td colspan="2" align="center" style="vertical-align: middle;"><b>${usuariofirma_revisadopor}<br />${fechafirma_revisadopor}</b></td>
                    <th colspan="1"></th>
                    <td colspan="2" align="center" style="vertical-align: middle;"><b>${usuariofirma_aprobadopor}<br />${fechafirma_aprobadopor}</b></td>
                </tr>
                <tr>
                    <td colspan="2" align="center" style="vertical-align: middle;"><b/>______________________________<b/></td>
                    <th colspan="1"></th>
                    <td colspan="2" align="center" style="vertical-align: middle;"><b/>______________________________<b/></td>
                </tr>
                <tr>
                    <td colspan="2" align="center" style="vertical-align: middle;"><b>REVISADO POR</b></td>
                    <th colspan="1"></th>
                    <td colspan="2" align="center" style="vertical-align: middle;"><b>APROBADO POR</b></td>
                </tr>
            </tbody>
        </table>

    </body>
</pdf>