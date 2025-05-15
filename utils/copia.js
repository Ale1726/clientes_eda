import { graph_chart_bar, graph_chart_bar_productos, 
        graph_chart_apilada, graph_chart_donut, graph_chart_dispersion, 
        graph_chart_histograma, graph_chart_headmap, graph_chart_gan_pro, graph_bar_year_clt,
        graph_area_crec_clt, graph_tree_map, graph_area_crec_clt_insight1, graph_area_crec_clt_insight2,
        graph_area_crec_clt_insight3, graph_area_crec_clt_insight1_mes, graph_area_crec_clt_insight2_mes,
        graph_area_crec_clt_insight3_mes, graph_dispersion_max_min, graph_lolipop_productos, create_table, graph_bar, graph_bar_compara,
        graph_linear_compara_navigator, graph_spline_compara, kpi_seg, graph_dispersion_max_min_2, graph_bar_compartion, createLogDonutChart,
        graphkps2, graph_area_crec_clt_insight, graph_area_crec_clt_insight_mes, graphkpsLineTas, graphkpBarTas, graphkpAreaTas,
        graphkpBarStacked, heatmapAnual, heatmapMensual, graph_spline_annual, graph_spline_monthly, graph_histogram, sincronizacion3Series, createTableProd, CreateGraphBar, createTable, 
        graph_histogram_sifc, graph_spline_annual_sifc, createTableTree, graph_tree_map_busq, 
        createBarChartV2, graph_spline_annual_general,createBarVer, graph_spline_dual_series,
        createChartPieV2, createChartBarComplement, createChartBartV2, createTableV2, createChartBartComparativa, create_headmap,
        createGraphMaxMinV2, createGraphMaxMinV2Sync, createChartBarComplemenGeneral, createSplinV22, graph_scatter_logscale
    } from './graphs.js';

import {toggleSidebar,  toggleDropdown, 
        formatLargeNumber, toggleSubfiltro, 
        aplicarFiltros, toggleDropdown2, createDropdown, inicializarDropdown, createComponentBest
} from './utils.js';


window.toggleSidebar = toggleSidebar
window.toggleDropdown = toggleDropdown
window.formatLargeNumber = formatLargeNumber
window.toggleSubfiltro = toggleSubfiltro
window.aplicarFiltros = aplicarFiltros

window.toggleDropdown2 = toggleDropdown2


let map_meses = {
    0: "Todos",
    1: "Enero",
    2: "Febrero",
    3: "Marzo",
    4: "Abril",
    5: "Mayo",
    6: "Junio",
    7: "Julio",
    8: "Agosto",
    9: "Septiembre",
    10: "Octubre",
    11: "Noviembre",
    12: "Diciembre"
}
/*
window.addEventListener('scroll', () => {
    if (dropdownContainer.style.display === 'block') {
      positionDropdown();
    }
  });
*/
  
const navLinks = document.querySelectorAll(".nav-link");

navLinks.forEach(link => {
    link.addEventListener('click', () => {
       
        // Elimina la clase .active de todos los enlaces
        navLinks.forEach(link => link.classList.remove('active'));
       
        // Agrega la clase .active solo al enlace seleccionado
        link.classList.add('active');
    });
});


function selectYearMount(year, mount, indicadores_año_mes){
    
    const dropdownButtonYear = document.getElementById('dropdown_cards_years');
    dropdownButtonYear.textContent = year;

    const dropdownButtonMount = document.getElementById('dropdown_cards_mes');
    dropdownButtonMount.textContent = map_meses[mount];

    const datos_año_mes = indicadores_año_mes[year][mount]

    document.getElementById("clt_siag_activos").textContent = datos_año_mes.Clientes_Activos || '0';
    document.getElementById("promedio_siag_gar").textContent = datos_año_mes.MeanGarantiasActivas.toLocaleString('en-US') || '0';
    document.getElementById("promedio_siag_monto_gar").textContent = datos_año_mes.MeanMontoGarantizado.toLocaleString('en-US') || '0';
    document.getElementById("promedio_siag_comisiones_cliet").textContent = `${datos_año_mes.MeanComisionesCliente || '0'}%`;
    document.getElementById("num_siag_garantias").textContent = datos_año_mes.NumGarantias.toLocaleString('en-US') || '0';
    document.getElementById("siag_monto_garantizado").textContent = formatLargeNumber(datos_año_mes.TotalMontoGarantizado || '0');
    document.getElementById("siag_ganancia").textContent = formatLargeNumber(datos_año_mes.TotalGanancia || '0');

}


// Función para manejar la selección de año
function selectYear(year, indicadores) {

    // Referencia al botón del dropdown
    const dropdownButton = document.getElementById('dropdown_cards_years');

    // Actualizar el texto del botón con el año seleccionado
    dropdownButton.textContent = year;

    // Acceder a los datos correspondientes al año seleccionado
    const datos_indicadores = indicadores[year];
    
    document.getElementById("clt_siag_activos").textContent = datos_indicadores.Clientes_Activos || '0';
    document.getElementById("promedio_siag_gar").textContent = datos_indicadores.MeanGarantiasActivas.toLocaleString('en-US') || '0';
    document.getElementById("promedio_siag_monto_gar").textContent = datos_indicadores.MeanMontoGarantizado.toLocaleString('en-US') || '0';
    document.getElementById("promedio_siag_comisiones_cliet").textContent = `${datos_indicadores.MeanComisionesCliente || '0'}%`;
    document.getElementById("num_siag_garantias").textContent = datos_indicadores.NumGarantias.toLocaleString('en-US') || '0';
    document.getElementById("siag_monto_garantizado").textContent = formatLargeNumber(datos_indicadores.TotalMontoGarantizado || '0');
    document.getElementById("siag_ganancia").textContent = formatLargeNumber(datos_indicadores.TotalGanancia || '0');

};


function porcentajeDiferencia(lista) {
    // Verifica que haya al menos 3 elementos
    if (lista.length < 3) return null;
  
    const antepenultimo = lista[lista.length - 3];
    const penultimo = lista[lista.length - 2];
    // Evita división por cero
    if (antepenultimo === 0) return null;
  
    const diferencia = ((penultimo - antepenultimo) / penultimo) * 100;
    console.log(diferencia)
    // Redondea a un decimal
    return Math.round(diferencia * 10) / 10;
}

function changeClass(valor, class1, class2) {
    let classChange = '';
    let infoChange = '';

    if (valor < 0) {
        classChange = class1;
        infoChange = `↓ ${valor} %`;
    } else if (valor > 0) {
        classChange = class2;
        infoChange = `↑ ${valor} %`;
    } else if (valor === 0) {
        classChange = class2;
        infoChange = ` ${valor} %`;
    }

    return { classChange, infoChange };
}

document.addEventListener("DOMContentLoaded", function () {

    const pageContent = document.getElementById("page-content");
    const div_body = document.getElementById("container_dinamic")

    function loadPage(pageUrl) {   
        fetch(pageUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
                return response.text();
            })
            .then(data => {
                // Carga el contenido de la pagina
                pageContent.innerHTML = data
                // Version 1 para cargar los datos a la pagina en dashboard
                
                if (pageUrl === "pages/cliente.html"){
                    div_body.className = '';  // Remueve la clase existente
                    div_body.classList.add('contains_dash_board'); // Agrega una nueva clase
                    
                    initializeDashboard_client();
                }
                
                else if (pageUrl === "pages/productos.html") {  
                    div_body.className = ''; // Remueve la clase existente
                    div_body.classList.add('contains_dash_board_product'); // Agrega una nueva clase
                  
                    initializeProductos();
                }
                else if (pageUrl === "pages/datos.html"){
                    div_body.className = '';  // Remueve la clase existente
                    div_body.classList.add('contains_dash_board'); // Agrega una nueva clase
                    initializeDatos();

                } else if (pageUrl){
                    div_body.className = '';  // Remueve la clase existente
                    div_body.classList.add('contains_dash_board'); // Agrega una nueva clase
                }
                
               
            })
            .catch(error => {
                console.error("Error al cargar la página:", error);
                pageContent.innerHTML = `<h1>Error al cargar la página</h1><p>${error.message}</p>`;
            });
    }
    
    function initializeDashboard_client(){
        const cardCltsActivos = document.getElementById("card-clts-activos");
        fetch('http://127.0.0.1:5050/api/data/clients')
        .then(response => response.json())
        .then(data => {
        
            // card total clt
            const kpi1 =  data.data_kpi.Kp1
            //document.getElementById("card-total-clt").textContent = kpis.numero_de_clientes || '';

            //kpi_seg('kpi_seg_cltT', 
            //    [['Persona Fisicas', kpi1.NumCltFis], ['Personas Morales', kpi1.NumCLTMoral]], 
            //    `${kpi1.TotalClts} <br> Clientes`
            //);
             //graph_chart_apilada('chart_bar_apil', categories, seriesFis, seriesMoral)
             

             Highcharts.chart('percent_valor_nulos', {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: 0,
                    plotShadow: false,
                    backgroundColor: 'transparent',

                },
                title: {
                    text: 'Datos<br>Faltantes<br>56.24%',
                    align: 'center',
                    verticalAlign: 'middle',
                    y: 60,
                    style: {
                        fontSize: '1em'
                    }
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.2f}%</b>'
                },
                accessibility: {
                    point: {
                        valueSuffix: '%'
                    }
                },
                exporting: {
                    enabled: false // Desactiva el menú de exportación
                },
                navigation: {
                    buttonOptions: {
                        enabled: false // Oculta el botón del menú
                    }
                },
                plotOptions: {
                    pie: {
                        dataLabels: {
                            enabled: true,
                            distance: 10,
                            style: {
                                fontWeight: '500',
                                color: 'black',
                                fontSize: '12px'
                            }
                        },
                        startAngle: -90,
                        endAngle: 90,
                        center: ['50%', '75%'],
                        size: '120%'
                    }
                },
                series: [{
                    type: 'pie',
                    name: 'Proporción',
                    innerSize: '70%',
                    borderWidth: 2,
                    borderRadius: 2, 
                    data: [
                        { name: 'Información Faltante', y: 56.24, color: '#0D1B2A' },
                        { name: 'Información Completa', y: 100 - 56.24, color: '#778DA9' }
                    ]
                }]
            });
            
            
            // Gráfico bar 
            const data_donut = data.chart_donut;
            const dataPie = data.data_kpi.kp4
            
            
            graph_chart_donut('chart_donut_seg_fis_moral', data_donut, dataPie.allData, dataPie.PF, dataPie.PM )

            console.log(dataPie)
            createLogDonutChart({
                idContainer: 'kpi_system_origen',
                data: dataPie.allData,
                colors: ["#778DA9","#0D1A29", "#3D7FC5", "#346CA8", "#2B5A8B","#193451","#22476E"]
            });
            

    
            
            
            
            // Grafica de barra
            const data_bar = data.chart_bar
            
            graph_chart_bar('bar_chart_seg_pais', data_bar)
            
            
            const dataTale1 = data.dataTabs.table1
            


            //tabla datos
            const table = $('#tabla_seg_pais').DataTable({
                data: dataTale1,
                searching: false,
                paging: false,
                columns: [
                    { data: 'Cliente', title: 'Listado de Clientes en México' },
                ],
                info: false,
                language: {
                    url: 'config/es-MX.json'
                },
                lengthChange: false
            });
            const dataTable2 = data.dataTabs.table2

            $('#tabla_clt_seg').DataTable({
                data: dataTable2,
                searching: false,
                paging: false,
                columns: [
                    { data: 'Cliente', title: 'Listado de Clientes Físicos en México' },
                ],
                info: false,
                language: {
                    url: 'config/es-MX.json'
                },
                lengthChange: false
            });
           
            
            
           
            // Gráfica de barra apilada
            const dataFis  =  data.char_bar_ap.data_fis
            const dataMoral = data.char_bar_ap.data_moral

            const categories = dataFis.map(item => item.name);
            const seriesFis = dataFis.map(item => item.y);
            const seriesMoral = dataMoral.map(item => item.y);

            graph_bar_compartion('chart_bar_apil',seriesFis, 'Persona Físicas', seriesMoral, 'Persona Moral', categories, 
                "Distribución de Personas Físicas y Morales por País", 'Frecuencia', ' clientes')
            
            // Inicialización de los datos
            const edades_fis = data.chart_histogram.edades_fis;
            const tiempo_moral = data.chart_histogram.tiempo_moral;
            
            graph_chart_histograma('chart_his', edades_fis, 'Frecuencia de Edades Clientes Físicos', 'Edades', 'Edades', 'Frecuencia', 'Histograma', 'Dispersión')
            
            graph_chart_dispersion('chart_dispersion', edades_fis)

            document.addEventListener("click", function (event) {
                const target = event.target.closest('input[type="radio"]'); // Verifica si el clic fue en un radio button
                if (!target) return; // Si no es un radio button, no hace nada
        
                const graph = target.name;
                switch (graph) {
                    case 'filterhis':
                        if (target.value === 'fisico') {
                            graph_chart_histograma('chart_his', edades_fis, 'Frecuencia de Edades Clientes Físicos', 'Edades', 'Edades', 'Frecuencia', 'Histograma', 'Dispersión')
                        } else if (target.value === 'moral') {
                            graph_chart_histograma('chart_his', tiempo_moral, 'Frecuencia de Años Constitución', 'Años', 'Años', 'Frecuencia', 'Histograma', 'Dispersión')
                        }
                        break; // Evita que el switch continúe ejecutando otros casos innecesariamente
                    case 'filterdispe':
                        if (target.value === 'fisico') {
                            console.log(target.value)

                        } else if (target.value === 'moral') {
                            console.log(target.value)

                        }
                        break;

                    default:
                        break;
                }
                
            });
            
             
        })
        .catch(error => console.error('Error:', error));
    }

    function initializeDatos(){
        const tableElement = pageContent.querySelector('#tabla');    
        if (tableElement) {
            // Inicializar DataTables con datos de la API
            $(tableElement).DataTable({
                bAutoWidth: false,
                language: {
                   url: 'config/es-MX.json'
                },
                columnDefs: [
                    { width: "2vw", targets: 0, searchable: false },
                    { width: "50vw", targets: 1 },
                    { width: "10vw", targets: 2 }
                ],
                ajax: {
                    url: "http://127.0.0.1:5050/api/clientes", // URL API clientes
                    dataSrc: "" 
                },
                columns: [
                    { data: "id", title: "ID" },
                    { data: "nombre", title: "Nombre Completo o Razón Social" },
                    { data: "fecha", title: "Fecha de Actualización" }
                ]
            });
        }
        const inputSearch = document.getElementById('search-client');
        // Crear contenedor de resultados
        const dropdownContainer = document.createElement('div');
        dropdownContainer.style.position = 'absolute';
        dropdownContainer.style.background = '#fff';
        dropdownContainer.style.border = '1px solid #ccc';
        dropdownContainer.style.zIndex = 1000;
        dropdownContainer.style.width = inputSearch.offsetWidth + 'px';
        dropdownContainer.style.maxHeight = '200px';
        dropdownContainer.style.overflowY = 'auto';
        dropdownContainer.style.display = 'none';
        dropdownContainer.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
        dropdownContainer.style.borderRadius = '4px';
        document.body.appendChild(dropdownContainer); // NOTA: ahora se agrega al body


        function positionDropdown() {
          const rect = inputSearch.getBoundingClientRect();
          dropdownContainer.style.left = rect.left + 'px';
          dropdownContainer.style.top = rect.bottom + window.scrollY + 'px';
          dropdownContainer.style.width = rect.width + 'px';
        }


        let timeout = null;

        inputSearch.addEventListener('input', function () {
          const query = inputSearch.value.trim();
        
          clearTimeout(timeout);
          dropdownContainer.innerHTML = '';
        
          if (query.length < 2) {
            dropdownContainer.style.display = 'none';
            return;
          }
      
        timeout = setTimeout(() => {
            fetch(`http://127.0.0.1:5050/api/filtred_clientes?search=${encodeURIComponent(query)}`)
              .then(response => response.json())
              .then(data => {
                dropdownContainer.innerHTML = '';
                if (data.length === 0) {
                  dropdownContainer.style.display = 'none';
                  return;
                }
                positionDropdown(); // 👈 Posiciona el menú debajo
                dropdownContainer.style.display = 'block';

                data.forEach(item => {
                  const option = document.createElement('div');
                  option.textContent = item.nombre;
                  option.style.padding = '8px';
                  option.style.cursor = 'pointer';
                  option.style.borderBottom = '1px solid #eee';
                
                  option.addEventListener('click', () => {
                    inputSearch.value = item.nombre;
                    dropdownContainer.style.display = 'none';
                
                    fetch(`http://127.0.0.1:5050/api/client_detail?id=${item.id}`)
                      .then(response => response.json())
                      .then(client => {
                        if (client && client.NUMERO_CLIENTE) {
                          document.getElementById("num_cliente").textContent = client.NUMERO_CLIENTE || '';
                          document.getElementById("nombre").textContent = client.NOMBRE_O_RAZON_SOCIAL || '';
                          document.getElementById("status").textContent = client.ESTATUS || '';
                          document.getElementById("tp").textContent = client.TIPO_PERSONA || '';
                          document.getElementById("genero").textContent = client.GENERO || '';
                          document.getElementById("rfc").textContent = client.RFC || '';
                          document.getElementById("curp").textContent = client.CURP || '';
                          document.getElementById("fiel").textContent = client.FIEL || '';
                          document.getElementById("dir").textContent = client.CALLE || '';
                          document.getElementById("tel").textContent = client.TELEFONO || '';
                          document.getElementById("fec_nac").textContent = client.FECHA_NAC_O_CONST || '';
                          document.getElementById("correo").textContent = client.CORREO_ELECTRONICO || '';
                          document.getElementById("rep_legal").textContent = client.REPRESENTANTE_LEGAL || '';
                        } else {
                          console.error('Cliente no encontrado o datos inválidos.');
                        }
                      })
                      .catch(error => {
                        console.error('Error al obtener los detalles del cliente:', error);
                      });
                  });
              
                  dropdownContainer.appendChild(option);
                });
            
                dropdownContainer.style.display = 'block';
              })
              .catch(() => {
                dropdownContainer.style.display = 'none';
              });
          }, 300); // Espera 300ms antes de disparar la búsqueda
        });

document.addEventListener('click', function (e) {
  if (!dropdownContainer.contains(e.target) && e.target !== inputSearch) {
    dropdownContainer.style.display = 'none';
  }
});


        
    }

    function initializeProductos(){
        const container_system = document.getElementById("container_system");
        const links = document.querySelectorAll("#nav-tab_sistemas [data-page]");

        // Cargar la subpágina inicial 
        loadSubPage("pages/subpages/soi.html");
        let tabElement = document.getElementById("nav-soi-tab");

        if (tabElement) {
            new bootstrap.Tab(tabElement).show();
        }

        // Asignar eventos de clic a los enlaces dentro de "nav-tab_sistemas"
        links.forEach(link => {
            link.addEventListener("click", (event) => {
                event.preventDefault(); // Evita el comportamiento predeterminado

                const pageUrl = link.getAttribute("data-page"); // URL de la página a cargar
                loadSubPage(pageUrl);
            });
        });

        // Función para cargar subpáginas dentro de container_system
        function loadSubPage(subPageUrl) {
            fetch(subPageUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Error ${response.status}: ${response.statusText}`);
                    }
                    return response.text();
                })
                .then(html => {
                    container_system.innerHTML = html; // Inserta el contenido de la subpágina
                                   
                    // Verifica qué subpágina se cargó para inicializar lógica específica
                    if (subPageUrl === 'pages/subpages/siag.html'){
                        document.getElementById("name_system").textContent = "SISTEMA INTEGRAL DE ADMINISTRACIÓN DE GARANTÍAS"
                        initializeProductSiag();
                    } 
                    else if (subPageUrl === 'pages/subpages/meca.html') {
                        document.getElementById("name_system").textContent = "SISTEMA DE MERCADO DE CAPITALES"
                        initializeProductMeca();
                    }
                    else if (subPageUrl === 'pages/subpages/sims.html') {
                        document.getElementById("name_system").textContent = "SISTEMA INTEGRAL DE MERCADO SECUNDARIO"
                        initializeProductSims();

                    }
                    else if (subPageUrl === 'pages/subpages/sipe.html') {
                        document.getElementById("name_system").textContent = "SISTEMA DE INVERSIONES Y PRESTAMOS EN EL EXTRANJERO"
                        initializeProductSipe();
    
                    }
                    else if (subPageUrl === 'pages/subpages/sirac.html') {
                        document.getElementById("name_system").textContent = "SISTEMA DE INFORMACIÓN DE RECUPERACIÓN Y ADMINISTRACIÓN DE CARTERA"
                        
                        document.getElementById("personaAmbos").checked = true;
                        document.getElementById("monedaCualquiera").checked = true;
                        document.getElementById("grafPresActAnual").checked = true;
                        document.getElementById("graphPlazoAnual").checked = true;
                        document.getElementById("grafVencAnual").checked = true;
                        document.getElementById("personaAmboshet").checked = true;

                        initializeProductSirac();
                    }
                    else if (subPageUrl === 'pages/subpages/soi.html') {
                        document.getElementById("name_system").textContent = "SISTEMA DE OPERACIONES INTERNACIONALES"
                        initializeProductSoi();
                    }
                    else if (subPageUrl === 'pages/subpages/tas.html') {
                        document.getElementById("name_system").textContent = "SISTEMA DE MERCADO DE DINERO Y CAMBIOS"
                        initializeProductTas();
                        document.getElementById("graphFechaOpeAnual").checked = true;
                        document.getElementById("graphFechaVenAnual").checked = true;
                        document.getElementById("graphFechaPlazoAnual").checked = true;


                    } else if (subPageUrl === 'pages/subpages/sifc.html') {
                        document.getElementById("name_system").textContent = "SISTEMA INTEGRAL FIDUCIARIO Y CUSTODIA"
                        initializeProductSifc();
                    } else if (subPageUrl === 'pages/subpages/ffon.html') {
                        document.getElementById("name_system").textContent = "SISTEMA FLUJO DE FONDOS"

                        const defaultTab = document.querySelector("#menu-ffon-pages button[id='ffon-general']");
                        defaultTab.classList.add("tab-active", "active");
                        
                        let containerDasboard = document.getElementById("dashboard-ffon");
                        loadSubSupPage("pages/subpages/ffon_general.html", containerDasboard);
                        
                        

                        document.addEventListener("click", function(e) {
                            if (e.target && e.target.matches("#menu-ffon-pages button[id^='ffon-']")) {
                                const tabId = e.target.id;
                                const selected = tabId.replace("ffon-", "");
                        
                                // 1. Remueve clases activas de todos los botones
                                document.querySelectorAll("#menu-ffon-pages button[id^='ffon-']").forEach(btn => {
                                    btn.classList.remove("tab-active", "active");
                                    btn.setAttribute("aria-selected", "false");
                                });
                        
                                // 2. Agrega clases activas al botón clicado
                                e.target.classList.add("tab-active", "active");
                                e.target.setAttribute("aria-selected", "true");
                        
                                // 3. Oculta todos los tab panels
                                document.querySelectorAll("[role='tabpanel']").forEach(panel => {
                                    panel.classList.add("hidden");
                                });
                        
                                // 4. Muestra el panel correspondiente
                                const panelToShow = document.getElementById("tab-content-" + selected);
                                if (panelToShow) {
                                    panelToShow.classList.remove("hidden");
                                }
                            }
                        });

                        const links2 = document.querySelectorAll("#menu-ffon-pages [data-page]");
                        
                        links2.forEach(link => {
                            link.addEventListener("click", (event) => {
                                event.preventDefault(); // Evita el comportamiento predeterminado
                                
                                const containerDasboard = document.getElementById("dashboard-ffon");
                                const subSubPageUrl = link.getAttribute("data-page"); // URL de la página a cargar

                                const elementId = link.id
                                loadSubSupPage(subSubPageUrl, containerDasboard, elementId);
                            });
                        });


                       
                    }
                })
                .catch(error => {
                    console.error("Error al cargar la subpágina:", error);
                    container_system.innerHTML = `<h1>Error al cargar la subpágina</h1><p>${error.message}</p>`;
                });
        }

        function loadSubSupPage(subSubPageUrl, containerDashBoard, idSystem) {
            fetch(subSubPageUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Error ${response.status}: ${response.statusText}`);
                    }
                    return response.text();
                })
                .then(html => {
                    containerDashBoard.innerHTML = html; // Inserta el contenido de la subpágina
                                   
                    // Verifica qué subpágina se cargó para inicializar lógica específica
                    if (subSubPageUrl === 'pages/subpages/ffon_general.html'){
                        initializeProductffonGeneral();
                    } 
                    else {
                        initializeProductffonSystem(idSystem)
                    }
                    
                })
                .catch(error => {
                    console.error("Error al cargar la subpágina:", error);
                    containerDashBoard.innerHTML = `<h1>Error al cargar la subpágina</h1><p>${error.message}</p>`;
                });
        }


    }
    
    function initializeProductSiag(){     
        fetch('http://127.0.0.1:5050/api/data/productos/siag')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
    
            
            const dataSeries = data.bar_prod.data_series;  
            const drilldownSeries = data.bar_prod.data_drilldown || []; 
            const data_drilldown_div = data.data_drilldown_div
    
            console.log(data_drilldown_div)
    
            graph_chart_bar_productos('bar_chart_prod_siag', dataSeries, drilldownSeries, data_drilldown_div)
            
    
            const dataHedMapGanacia = data.data_head_maps.ganancias;
    
            const dataHedMapTasaInteres = data.data_head_maps.tasa_interes;
            
            const dataHedMapMontoGarantizado = data.data_head_maps.monto_total;
    
            const dataHedMapNumGarantias =  data.data_head_maps.cantidad_garantias;
            
            // Configuración de los gráficos con sincronización
            graph_chart_headmap('head_map_ganancia', dataHedMapGanacia, 'Distribución de Ganancias por Año y Mes', 'Ganancia');
            
            graph_chart_headmap('head_map_tasa_interes', dataHedMapTasaInteres, 'Distribución de Comisión Promedio por Año y Mes', 'Comisión Promedio');
            
            //Head Map del primer Div
            // Captar el evento de clic en las opciones del dropdown
            document.addEventListener('click', (event) => {
                const target = event.target; // Elemento que disparó el evento
            
                // Verifica si el clic fue en un elemento del dropdown con `data-option`
                if (target.closest('#dropdown-head-map-1 .dropdown-item')) {
                    const option = target.getAttribute('data-option'); // Obtén el valor del atributo
                    console.log(`Opción seleccionada: ${option}`);
                    
                    // Aquí puedes realizar las acciones necesarias según la opción seleccionada
                    if (option === 'Ganancia') {
                        graph_chart_headmap('head_map_ganancia', dataHedMapGanacia, 'Distribución de Ganancias por Año y Mes', 'Ganancia' )
                    } else if (option === 'Tasa Interes') {
                        graph_chart_headmap('head_map_ganancia', dataHedMapTasaInteres, 'Distribución de Comisión Promedio por Año y Mes', 'Comisión Promedio')
                    } else if (option === 'Monto Garantizado') {
                        graph_chart_headmap('head_map_ganancia', dataHedMapMontoGarantizado, 'Distribución de Monto Garantizado por Año y Mes', 'Monto Garantizado')
                    } else if (option === 'Contratación de Garantias') {
                        graph_chart_headmap('head_map_ganancia', dataHedMapNumGarantias, 'Distribución de Contratación de Garantías por Año y Mes', 'Número de Garantías')
                    } else  {
                        console.log("Ninguna")
                    }
                    
                }
            });

            //Head Map del primer Div2
            document.addEventListener('click', (event) => {
                const target = event.target; // Elemento que disparó el evento
            
                // Verifica si el clic fue en un elemento del dropdown con `data-option`
                if (target.closest('#dropdown-head-map-2 .dropdown-item')) {
                    const option = target.getAttribute('data-option'); // Obtén el valor del atributo
                    console.log(`Opción seleccionada: ${option}`);
                
                    // Aquí puedes realizar las acciones necesarias según la opción seleccionada
                    if (option === 'Ganancia') {
                        graph_chart_headmap('head_map_tasa_interes', dataHedMapGanacia, 'Distribución de Ganancias por Año y Mes', 'Ganancia' )
                    } else if (option === 'Tasa Interes') {
                        graph_chart_headmap('head_map_tasa_interes', dataHedMapTasaInteres, 'Distribución de Comisión Promedio por Año y Mes', 'Comisión Promedio')
                    } else if (option === 'Monto Garantizado') {
                        graph_chart_headmap('head_map_tasa_interes', dataHedMapMontoGarantizado, 'Distribución de Monto Garantizado por Año y Mes', 'Monto Garantizado')
                    } else if (option === 'Contratación de Garantias') {
                        graph_chart_headmap('head_map_tasa_interes', dataHedMapNumGarantias, 'Distribución de Contratación de Garantías por Año y Mes', 'Número de Garantías')
                    } else  {
                        console.log("Ninguna")
                    }
                    
                }
            });
    
            const indicadores = data.data_indicadores.indicadores;       
            
            const indicadores_año_mes = data.data_indicadores.indicadores_año_mes;
            
            
            function poblar_dropdown_mes(year){
                const año_mes = Object.keys(indicadores_año_mes[year]).sort((a, b) => a - b)
                año_mes.unshift(0);
                console.log(año_mes)
                const dropdownMenuMount = document.getElementById('dropdown_mes_menu');
                dropdownMenuMount.innerHTML = '';
                
                año_mes.forEach( mes => {
                    const listItem = document.createElement('li');
                    const link = document.createElement('a');
                    link.className = 'dropdown-item';
                    link.id = String(mes)
                    link.href = '#';
                    link.textContent = map_meses[String(mes)];
                    listItem.appendChild(link);
                    dropdownMenuMount.appendChild(listItem);
                })
            }
    
    
            // Obtener los años de los indicadores
            const years = Object.keys(indicadores).sort((a, b) => b - a);
            console.log(years)
    
            // Limpiar el menú desplegable de años
            const dropdownMenuYears = document.getElementById('dropdown_years_menu');
            dropdownMenuYears.innerHTML = '';
        
            // Poblar el menú desplegable con los años
            years.forEach(year => {
                const listItem = document.createElement('li');
                const link = document.createElement('a');
                link.className = 'dropdown-item';
                link.id = year
                link.href = '#';
                link.textContent = year;
                listItem.appendChild(link);
                dropdownMenuYears.appendChild(listItem);
            });
    
            
           // Variables globales para almacenar las selecciones
            let yearSeleccionado = null;
            let mesSeleccionado = null;
    
            document.addEventListener('click', (event) => {
                const target = event.target;
            
                // Verificar selección en dropdown de años
                if (target.closest('#dropdown_years_menu .dropdown-item')) {
                    yearSeleccionado = target.getAttribute('id');
                    console.log(`1 Año seleccionado: ${yearSeleccionado}`);

                    document.getElementById("filtro_clt_activo").innerHTML = `Clientes Activos en ${yearSeleccionado}`;
                    poblar_dropdown_mes(yearSeleccionado)

                    // Ejecuta lógica si ambos están seleccionados
                    if (mesSeleccionado) {
                        console.log(`P0 Se seleccionó el año: ${yearSeleccionado} y el mes: ${mesSeleccionado}`);
                        selectYearMount(yearSeleccionado, mesSeleccionado, indicadores_año_mes)
                        
                        if(mesSeleccionado === 0){  
                            document.getElementById("filtro_clt_activo").innerHTML = `Clientes Activos en ${yearSeleccionado}`;

                        } else{
                            document.getElementById("filtro_clt_activo").innerHTML = `Clientes Activos en ${map_meses[mesSeleccionado]} ${yearSeleccionado}`;

                        }
    
                    } else {
                        console.log(`P1 Solo se seleccionó el año: ${yearSeleccionado}`);
                        selectYear(yearSeleccionado, indicadores);
                    }
                }
            
                // Verificar selección en dropdown de meses
                else if (target.closest('#dropdown_mes_menu .dropdown-item')) {
                    mesSeleccionado = target.getAttribute('id');
                    console.log(`2 Mes seleccionado: ${mesSeleccionado}`);
                
                    // Ejecuta lógica si ambos están seleccionados
                    if (yearSeleccionado) {
                        
                        if (mesSeleccionado === '0'){
                            console.log(`P2 Se seleccionó el año: ${yearSeleccionado} y el mes: ${mesSeleccionado}`);
    
                            selectYear(yearSeleccionado, indicadores);
    
                            document.getElementById('dropdown_cards_mes').textContent = map_meses[mesSeleccionado];
    
                            mesSeleccionado = null;
                            
                            document.getElementById("filtro_clt_activo").innerHTML = `Clientes Activos en ${yearSeleccionado}`;

                        } else {
                            console.log(`P3 Se seleccionó el año: ${yearSeleccionado} y el mes: ${mesSeleccionado}`);
                            
                            selectYearMount(yearSeleccionado, mesSeleccionado, indicadores_año_mes)

                            document.getElementById("filtro_clt_activo").innerHTML = `Clientes Activos en ${map_meses[mesSeleccionado]} ${yearSeleccionado}`;
                            
                        }
                      
                    } else {
                        selectYearMount(2024, mesSeleccionado, indicadores_año_mes)
                        console.log(`3 Solo se seleccionó el mes: ${mesSeleccionado}`);
                        document.getElementById("filtro_clt_activo").innerHTML = `Clientes Activos en ${map_meses[mesSeleccionado]} 2024`;
                    }
                }
            });
    
    
    
            if (indicadores["2024"]) {
                selectYear("2024", indicadores);
                poblar_dropdown_mes(2024)
            } else {
                console.warn("El año 2024 no está disponible en los datos.");
            }
            
            let rawData = data.data_año;
                        
            let ganancias = rawData.map(item => [
                Date.UTC(item[0]), // Año
                item[2] // Ganancias
            ]);
            
            let productos = rawData.map(item => [
                Date.UTC(item[0]), // Año
                item[1] // Productos
            ]);
    
            // Chart Ganancia Productos
            
            graph_chart_gan_pro('anualmente', ganancias, productos)
            
    
            document.addEventListener('click', (event) => {
                const target = event.target; // Elemento que disparó el evento
            
                // Verifica si el clic fue en un elemento del dropdown con `data-option`
                if (target.closest('#dropdown0 .dropdown-item')) {
                    const option = target.getAttribute('data-option'); // Obtén el valor del atributo
                    //console.log(`Opción seleccionada: ${option}`);
            
                    // Aquí puedes realizar las acciones necesarias según la opción seleccionada
                    let rawData, ganancias, productos, filtro;
    
            
                    if (option === 'anualmente') {
                        document.getElementById("title_container_2").textContent = "Relación entre Ganancias y Garantías (Desglose Anual) ";
                        rawData = data.data_año;
                        console.log(rawData)
                        // Convertir a formato compatible con Highcharts
                        ganancias = rawData.map(item => [
                            Date.UTC(item[0]), // Año
                            item[2] // Ganancias
                        ]);
            
                        productos = rawData.map(item => [
                            Date.UTC(item[0]), // Año
                            item[1] // Productos
                        ]);
                        
                        filtro = option;
                        console.log(`Ganancia ${ganancias.lenght}`)
                        console.log(`Productos ${productos.lenght}`)
    
                    } else if (option === 'mensualmente') {
                        document.getElementById("title_container_2").textContent = "Relación entre Ganancias y Garantías (Desglose Mensual) ";
                        rawData = data.data_mes_año;
            
                        // Convertir a formato compatible con Highcharts
                        ganancias = rawData.map(item => [
                            Date.UTC(item[0], item[1] - 1), // Año, Mes (0-indexado)
                            item[2] // Ganancias
                        ]);
            
                        productos = rawData.map(item => [
                            Date.UTC(item[0], item[1] - 1), // Año, Mes (0-indexado)
                            item[3] // Productos
                        ]);
                        filtro = option;
                        console.log(`Ganancia ${ganancias.lenght}`)
                        console.log(`Productos ${productos.lenght}`)
                    }
                    
                    graph_chart_gan_pro(filtro, ganancias, productos)
    
                    
    
                    
                }
            });
            
            const data_year_clt  = data.data_bar_year_clt
            graph_bar_year_clt("container_graph_bar_year_clt", data_year_clt.categorias,data_year_clt.data_bar)
    
            const data_area = data.data_crecimiento_ctls.data;
            console.log("data_areas")
            console.log(data_area)
    
            graph_area_crec_clt('area-chart',  
                                data_area,
                                'Distribución Nuevos Clientes por Año',
                                'Año',
                                'Nuevos Clientes',
                                ' clientes',
                                'Nuevos Clientes'
                                )
    
            const data_tree_map_num_garantias = data.data_tree_map_num_garantias["2024"]
            const data_tree_map_ganancia = data.data_tree_map_ganancia["2024"]
    
            let title  = 'Top 10 Clientes con Mayor Contratación de Garantías' 
            let title2 = 'Top 10 Clientes con Mayores Pagos en Comisiones por Garantías'
            let id_container_1 = 'treemap-container'
            let id_container_2 =  'treemap-container_2'
            const dropdownMenuYearsFilter = document.getElementById('dropdown_years_menu_filter_u');
            
            // Llenar dinamicamente años
            years.forEach(year => {
                const listItem = document.createElement('li'); // Crear el elemento <li>
                const link = document.createElement('a'); // Crear el elemento <a>
            
                // Configurar las propiedades del enlace
                link.className = 'dropdown-item';
                link.id = `year-${year}`; // Mejor práctica: usar un id único
                link.setAttribute('data-option', year); // Usar setAttribute para propiedades personalizadas
                link.textContent = year; // Asignar el texto del año
            
                // Añadir el enlace al elemento <li>
                listItem.appendChild(link);
            
                // Añadir el elemento <li> al menú desplegable
                dropdownMenuYearsFilter.appendChild(listItem);
            });
    
            document.addEventListener('click', (event) => {
                const target = event.target; // Elemento que disparó el evento
            
                // Verifica si el clic fue en un elemento del dropdown con `data-option`
                if (target.closest('#dropdown_years_menu_filter_u .dropdown-item')) {
                    const year = target.getAttribute('data-option'); // Obtén el valor del atributo
                    // Referencia al botón del dropdown
                    const dropdownButton = document.getElementById('dropdown_years_menu_filter_b');
                    // Actualizar el texto del botón con el año seleccionado
                    dropdownButton.textContent = year;
                    //Actualizar grafico
                    let data_filter_garantias = data.data_tree_map_num_garantias[year]
                    graph_tree_map(id_container_1, title + ` ${year}`, data_filter_garantias, 'Garantias')
    
                    let data_filter_ganancias = data.data_tree_map_ganancia[year]
                    graph_tree_map(id_container_2, title2 + ` ${year}`, data_filter_ganancias, 'Ganancia')
    
                }
            });
            
            graph_tree_map(id_container_1, title, data_tree_map_num_garantias, 'Garantias')
            graph_tree_map(id_container_2, title2, data_tree_map_ganancia, 'Ganancia')
    
            const data_table = data.data_table_clientes
            
            $('#id_table_cliente').DataTable({
                data: data_table,
                order:  [[1, "asc"]],
                columns:  [
                    {data: 'CLIENTE', title: 'Cliente'},
                    { data: 'AÑO', title: 'Año' }, // Columna para "cantidad_garantias"
                    { data: 'NUMERO_DE_GARANTIAS', title: 'Número de Garantías' }, // Columna para "ganancia"
                    { data: 'TOTAL_MONTO_GARANTIZADO', title: 'TOTAL MONTO GARANTIZADO' }, // Columna para "intermediarios"
                    { data: 'PROMEDIO_MONTO_GARANTIZADO', title: 'PROMEDIO MONTO GARANTIZADO' }, // Columna para "monto_gar_total"
                    { data: 'PROMEDIO_COMISION', title: 'Promedio Comisión'},
                    { data: 'GANANCIA_AÑO_MES', title: 'Total Comisiones'},
                    { data: 'MONTO_MAXIMO_GARANTIZADO', title: 'Garantía Máxima'},
                    { data: 'MONTO_MINIMO_GARANTIZADO', title: 'Garantía Mínima'}
                ],
                /*columnDefs: [
                    { width: "7vw", targets: 0},
                    { width: "5vw", targets: 1 },
                ],*/
                language: {
                    url: 'config/es-MX.json'
                },
            });
    
        })
        .catch(error => {
            // Manejo de errores
            console.error('Error al obtener los datos:', error);
            
        });
    }
    
    function initializeProductSirac(){
        fetch('http://127.0.0.1:5050/api/data/productos/sirac')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            
            const data_area_chart =  data.data_ten_sirac_contratos;
            const data_area_chart_venc = data.data_ten_sirac_vencimiento_contratos;
            const data_area_plazo_promedio = data.data_ten_plazo_promedio

            const rawDataMesPlazo = data.data_ten_plazo_promedio_mesual;
            
            const dataMesPlazo = rawDataMesPlazo.map(item => [
                Date.UTC(item[0], item[1] - 1), // fecha
                item[2] // cantidad
            ]);

            const rawDataMesContratacion = data.data_ten_sirac_contratos_mensual
            
            const dataMesContratacion = rawDataMesContratacion.map(item => [
                Date.UTC(item[0], item[1] - 1), // fecha
                item[2] // cantidad
            ]);


            const rawDataVencimiento = data.data_ten_sirac_vencimiento_contratos_mensual
            const dataVencimiento = rawDataVencimiento.map(item => [
                Date.UTC(item[0], item[1] - 1), // fecha
                item[2] // cantidad
            ])
        
            graph_area_crec_clt_insight2('graph_area_1',
                data_area_chart,
                'Distribución Contratación de Prestamos Activos',
                'Año',
                'Numero de Prestamos: ',
                ' prestamos',
                'Prestamos',
            ),


            graph_area_crec_clt_insight1('graph_area_2',
                data_area_plazo_promedio,
                'Plazo Promedio (Días) de Prestamos Activos',
                'Año',
                'Plazo',
                ' dias',
                'Plazo',
            )
           
            graph_area_crec_clt_insight3('graph_area_3',
                data_area_chart_venc,
                'Distribución Vencimiento de Prestamos Activos',
                'Año',
                'Numero Prestamos',
                ' prestamos',
                'Prestamos',
            )
            

            const data_media_min_max =  data.data_media_min_max
            
            // Llamar a la función con el ID del contenedor
            graph_dispersion_max_min('table_prestamos', data_media_min_max);

            const data_lolipop = data.data_lolipop
            const productosPorAño = data.data_table_productos

            let columnas = [
                { data: 'PRODUCTO', title: 'Lineas Financieras 2024' }, // Columna para "cantidad_garantias"
                { data: 'CANTIDAD_ANUAL', title: 'Cantidad'}, // Columna para "ganancia"
            ]
            create_table('tabla_productos', productosPorAño[2024], columnas);
            graph_lolipop_productos('graph_productos', data_lolipop, productosPorAño)
            
            const data_crecimiento_productos = data.data_crecimiento_productos
            graph_area_crec_clt('graph_productos2', 
                                data_crecimiento_productos,
                                'Registro Anual de Nuevos Productos Activos',
                                'Año',
                                'Productos Nuevos',
                                '',
                                'prod'
                            )
            const data_bar_clt_productos = data.data_bar_clt_productos
            const data_bar_fisicos =  data.data_bar_clt_fisicos_productos
            const data_bar_moral =  data.data_bar_clt_morales_productos

            graph_bar('graph_bar_clt_prod', 
                    data_bar_clt_productos, 
                    'Distribucion de productos por Cliente', 
                    '', 
                    '', 
                    'Clientes')    
            
            document.addEventListener('click', (event) => {
                const target = event.target.closest('.dropdown-item'); // Asegura que sea un elemento válido

                if (!target) return; // Si no se hizo clic en un item del dropdown, no hace nada
            
                const dropdown = target.closest('.dropdown-content'); // Encuentra el dropdown al que pertenece
                if (!dropdown) return; // Si no está dentro de un dropdown, sale
            
                const dropdownId = dropdown.id; // Obtiene el ID del dropdown (ej: 'dropdownsirac2')
                const option = target.getAttribute('data-option'); // Obtiene el valor de `data-option`
            
                if (!option) {
                    console.log("No se encontró un valor en data-option.");
                    return;
                }
                
                // Determinar acción según el dropdown
                switch (dropdownId) {
                    case 'dropdownsirac1':
                        if (option === 'ANUAL') {
                            graph_area_crec_clt_insight2('graph_area_1',
                                data_area_chart,
                                'Distribución Contratación de Prestamos Activos Anual',
                                'Año',
                                'Numero de Prestamos: ',
                                ' prestamos',
                                'Prestamos',
                            );
                        } else if (option === 'MENSUAL') {
                            graph_area_crec_clt_insight2_mes('graph_area_1',
                                dataMesContratacion,
                                'Distribución Contratación de Prestamos Activos Mensual',
                                'Año',
                                'Numero de Prestamos: ',
                                ' prestamos',
                                'Prestamos',
                            );
                        } else {
                            console.log("Opción no válida en dropdownsirac1.");
                        }
                        break;
            
                    case 'dropdownsirac2':
                        if (option === 'ANUAL') {
                            graph_area_crec_clt_insight1(
                                'graph_area_2',
                                data_area_plazo_promedio,
                                'Plazo Promedio (Días) de Préstamos Activos Anual',
                                'Año',
                                'Plazo',
                                ' días',
                                'Plazo'
                            );
                        } else if (option === 'MENSUAL') {
                            graph_area_crec_clt_insight1_mes(
                                'graph_area_2',
                                dataMesPlazo,
                                'Plazo Promedio (En Días) de Préstamos Activos Mensual',
                                'Año',
                                'Plazo',
                                ' días',
                                'Plazo'
                            );
                        } else {
                            console.log("Opción no válida en dropdownsirac2.");
                        }
                        break;
            
                    case 'dropdownsirac3':
                        if (option === 'ANUAL') {
                            graph_area_crec_clt_insight3('graph_area_3',
                                data_area_chart_venc,
                                'Distribución Vencimiento de Prestamos Activos',
                                'Año',
                                'Numero Prestamos',
                                ' prestamos',
                                'Prestamos',
                            );
                        } else if (option === 'MENSUAL') {
                            graph_area_crec_clt_insight3_mes('graph_area_3',
                                dataVencimiento,
                                'Distribución Vencimiento de Prestamos Activos',
                                'Año',
                                'Numero Prestamos',
                                ' prestamos',
                                'Prestamos',
                            );
                        } else {
                            console.log("Opción no válida en dropdownsirac3.");
                        }
                        break;
                    
                    case 'dropdownsirac4':
                        if (option === 'ALL'){

                            graph_bar('graph_bar_clt_prod', 
                                data_bar_clt_productos, 
                                'Distribucion de productos por Clientes', 
                                '', 
                                '', 
                                'Clientes')    


                        }
                        else if (option === 'PF'){
                            
                
                            graph_bar('graph_bar_clt_prod', 
                                data_bar_fisicos, 
                                'Distribucion de productos por Clientes Fisicos', 
                                '', 
                                '', 
                                'Clientes')    

                        } 
                        else if (option == 'PM'){

                            graph_bar('graph_bar_clt_prod', 
                                data_bar_moral, 
                                'Distribucion de productos por Clientes Morales', 
                                '', 
                                '', 
                                'Clientes')    

                        }else {
                            console.log("Opción no válida en dropdownsirac4.");
                        }break;

                        
                    default:
                        console.log("Dropdown no reconocido.");
                        break;
                }
                 
                // Cierra el dropdown automáticamente después de seleccionar una opción
                dropdown.style.display = 'none';
            });


            const data_comp_seg = data.data_grap_comp_v2


            const seriesDaTasegFis = data_comp_seg.seriefisica.map(item => [
                Date.UTC(item[0]),
                item[1]
            ])

            const seriesDaTasegMoral = data_comp_seg.seriemoral.map(item => [
                                                Date.UTC(item[0]),
                                                item[1]
                                        ])
            

            
            graph_linear_compara_navigator(
                    'graph_compara_clt_seg_prod',
                    data.data_grap_comp.categories,
                    data.data_grap_comp.seriefisica,
                    data.data_grap_comp.seriemoral,
                    'Tendencias de contratación de préstamos',
                    'Cantidad',
                    'Clientes Fisicos',
                    'Clientes Morales'
            )
            /*
            let dataSplineSerie = [{name: "Clientes Fisicos", data:seriesDaTasegFis},
                                    {name:"CLientes Morales", data:seriesDaTasegMoral}]

            graph_spline_compara('graph_compara_clt_seg_prod', 
                                dataSplineSerie,
                                'Distribucion de Clientes por Año', 
                                'Cantidad')*/
            // Sumar valores de las series correctamente con `reduce()`
             
            //const TCltFisicos = data.data_grap_comp.seriefisica.reduce((acc, val) => acc + val, 0);
            //const TCltMorales = data.data_grap_comp.seriemoral.reduce((acc, val) => acc + val, 0);

            /* SECCION KPIS */

            // T1 S1
            kpi_seg('kp1', 
                [['Persona Fisicas', data.data_kps.TFisicos], ['Personas Morales', data.data_kps.TMoral]], 
                `${data.data_kps.TotalClientes} <br> Clientes`
            );

            // SECCION 1

            // T2 S1
            let numProduct = data.data_bar_clt_productos.length
            document.getElementById("count_product").textContent = `${numProduct}` || '';
            document.getElementById("avg_product").innerHTML  = ` ${data.data_kps.ProdCliente} <br> (Fís: ${data.data_kps.ProdClienteFisico} | Mor: ${data.data_kps.ProdClienteMoral}) ` || '';

            // T3 S1
            document.getElementById("plazo_product").innerHTML  = `${data.data_kps.PlazoMean} días` || '';
            document.getElementById("min_max_plaxo").innerHTML  = ` Mínimo: ${data.data_kps.PlazoMin} días <br> Máximo: ${data.data_kps.PlazoMax} días ` || '';
            
            // T4  S1
            document.getElementById("monto_product").innerHTML  = `${data.data_kps.MontoPromedioMx} mx | ${data.data_kps.MontoPromedioUsd} usd` || '';
            document.getElementById("monto_min_max").innerHTML  = ` Mínimo: ${data.data_kps.MinMontoMx} mx | ${data.data_kps.MinMontoUsd} usd <br> Máximo: ${data.data_kps.MaxMontoMx} mx | ${data.data_kps.MaxMontoUsd} usd ` || '';
           
            // SECCION 2
            
            // T1 S2
            document.getElementById("kp1_producto").textContent = `${data.data_kpi_productos.kp1[0]}` || '';
            document.getElementById("num_kp1").textContent = `${data.data_kpi_productos.kp1[1]} clientes (${data.data_kpi_productos.kp1[2]}%)` || '';


            // T2 S2
            document.getElementById("kp2_producto").textContent = data.data_kpi_productos.kp2[0] || '';
            document.getElementById("num_kp2").textContent = `${data.data_kpi_productos.kp2[1]} cliente (${data.data_kpi_productos.kp2[2]}%)` || '';

            // T3 S2
            document.getElementById("kp3_producto").textContent = data.data_kpi_productos.kp3[0] || '';
            document.getElementById("num_kp3").textContent = `${data.data_kpi_productos.kp3[1]} mx` || '';

            // T4 S2
            document.getElementById("kp4_producto").textContent = data.data_kpi_productos.kp4[0] || '';
            document.getElementById("num_kp4").textContent = `${data.data_kpi_productos.kp4[1]} mx` || '';

            document.getElementById("date_uptade").textContent = `Actualización ${data.date_update}` || '';
            document.getElementById("date_uptade1").textContent = `Actualización ${data.date_update}` || '';
            document.getElementById("date_uptade2").textContent = `Actualización ${data.date_update}` || '';
            document.getElementById("date_uptade3").textContent = `Actualización ${data.date_update}` || '';
            document.getElementById("date_uptade4").textContent = `Actualización ${data.date_update}` || '';
            document.getElementById("date_uptade5").textContent = `Actualización ${data.date_update}` || '';
            document.getElementById("date_uptade6").textContent = `Actualización ${data.date_update}` || '';


            
            const prodMaxMinMedia = data.data_media_min_max_prod
            graph_dispersion_max_min_2('prod_media_max_min', prodMaxMinMedia.amb_cual, 'Dispersión: Monto Máximo y Mínimo por Producto', 
                'Producto', 'Valores Máximos, Mínimo y Media', ' mx', 'Montos', 'Media')
                 // Estado inicial del filtro
            
           
            
            document.addEventListener("click", function (event) {
                const target = event.target.closest('input[type="radio"]'); // Verifica si el clic fue en un radio button
                if (!target) return; // Si no es un radio button, no hace nada
        
                const graph = target.name;
                switch (graph) {
                    case 'grafPresAct':
                        if (target.value === 'anual') {
                            graph_area_crec_clt_insight2(
                                'graph_area_1',
                                data_area_chart,
                                'Distribución Contratación de Prestamos Activos Anual',
                                'Año',
                                'Numero de Prestamos: ',
                                ' prestamos',
                                'Prestamos'
                            );
                        } else if (target.value === 'mensual') {
                            graph_area_crec_clt_insight2_mes(
                                'graph_area_1',
                                dataMesContratacion,
                                'Distribución Contratación de Prestamos Activos Mensual',
                                'Año',
                                'Numero de Prestamos: ',
                                ' prestamos',
                                'Prestamos'
                            );
                        }
                        break; // Evita que el switch continúe ejecutando otros casos innecesariamente
                    case 'graphPlazo':
                        if (target.value === 'anual') {
                            graph_area_crec_clt_insight1(
                                'graph_area_2',
                                data_area_plazo_promedio,
                                'Plazo Promedio (Días) de Préstamos Activos Anual',
                                'Año',
                                'Plazo',
                                ' días',
                                'Plazo'
                            );
                        } else if (target.value === 'mensual') {
                            graph_area_crec_clt_insight1_mes(
                                'graph_area_2',
                                dataMesPlazo,
                                'Plazo Promedio (En Días) de Préstamos Activos Mensual',
                                'Año',
                                'Plazo',
                                ' días',
                                'Plazo'
                            );
                        } else {
                            console.log("Opción no válida en dropdownsirac2.");
                        }
                        break;
                    case 'grafVenc':

                        if (target.value === 'anual') {
                            graph_area_crec_clt_insight3('graph_area_3',
                                data_area_chart_venc,
                                'Distribución Vencimiento de Prestamos Activos',
                                'Año',
                                'Numero Prestamos',
                                ' prestamos',
                                'Prestamos',
                            );
                        } else if (target.value === 'mensual') {
                            graph_area_crec_clt_insight3_mes('graph_area_3',
                                dataVencimiento,
                                'Distribución Vencimiento de Prestamos Activos',
                                'Año',
                                'Numero Prestamos',
                                ' prestamos',
                                'Prestamos',
                            );
                        } else {
                            console.log("Opción no válida en dropdownsirac3.");
                        }
                        break;
                    

                    default:
                        break;
                }
                
            });

            let estadoActual = {
                tipoPersona: "ambos",
                tipoMoneda: "cualquiera"
            };
        
            let timeoutId; // Para controlar el retraso en la aplicación del filtro

            // Delegar eventos de clic para los radio buttons
            document.addEventListener("click", function (event) {
                const target = event.target.closest('input[type="radio"]'); // Verifica si el clic fue en un radio button
                if (!target) return; // Si no es un radio button, no hace nada
        
                // Guardar el nuevo estado seleccionado
                let nuevoEstado = { ...estadoActual }; // Clonar el estado actual
        
                if (target.name === "tipoPersona") {
                    nuevoEstado.tipoPersona = target.value;
                } else if (target.name === "tipoMoneda") {
                    nuevoEstado.tipoMoneda = target.value;
                }
        
                // Solo aplicar filtro si hubo un cambio en el estado
                if (
                    nuevoEstado.tipoPersona !== estadoActual.tipoPersona ||
                    nuevoEstado.tipoMoneda !== estadoActual.tipoMoneda
                ) {
                    //aplicarFiltrograph(nuevoEstado.tipoPersona, nuevoEstado.tipoMoneda);
                    
                    clearTimeout(timeoutId); // Reinicia el temporizador si se hace otra selección rápida

                    timeoutId = setTimeout(() => {
                        estadoActual = nuevoEstado; // Actualizar el estado
                        aplicarFiltrograph(nuevoEstado.tipoPersona, nuevoEstado.tipoMoneda);
                    }, 0); // Espera 2 segundos antes de aplicar el filtro
                }
            });
            
            // Función para aplicar el filtro
            function aplicarFiltrograph(tipoPersona, tipoMoneda) {
                if(tipoPersona === 'ambos' & tipoMoneda === 'cualquiera'){
                    
                    graph_dispersion_max_min_2('prod_media_max_min', prodMaxMinMedia.amb_cual, 'Dispersión: Monto Máximo y Mínimo por Producto', 
                        'Producto', 'Valores Máximos, Mínimo y Media', ' mx', 'Montos', 'Media')

                } else if(tipoPersona === 'ambos' & tipoMoneda === 'MX'){
                    graph_dispersion_max_min_2('prod_media_max_min', prodMaxMinMedia.amb_mx, 'Dispersión (MX): Monto Máximo y Mínimo por Producto', 
                        'Producto', 'Valores Máximos, Mínimo y Media', ' mx', 'Montos', 'Media')

                } else if(tipoPersona === 'ambos' & tipoMoneda === 'USD'){
                    graph_dispersion_max_min_2('prod_media_max_min', prodMaxMinMedia.amb_usd, 'Dispersión (USD): Monto Máximo y Mínimo por Producto', 
                        'Producto', 'Valores Máximos, Mínimo y Media', ' usd', 'Montos', 'Media')

                } else if(tipoPersona === 'fisicas' & tipoMoneda === 'cualquiera'){
                    graph_dispersion_max_min_2('prod_media_max_min', prodMaxMinMedia.pf_cual, 'Dispersión (PF): Monto Máximo y Mínimo por Producto', 
                        'Producto', 'Valores Máximos, Mínimo y Media', ' mx', 'Montos', 'Media')

                }  else if(tipoPersona === 'fisicas' & tipoMoneda === 'MX'){
                    graph_dispersion_max_min_2('prod_media_max_min', prodMaxMinMedia.pf_mx, 'Dispersión (PF|MX): Monto Máximo y Mínimo por Producto', 
                        'Producto', 'Valores Máximos, Mínimo y Media', ' mx', 'Montos', 'Media')

                }  else if(tipoPersona === 'fisicas' & tipoMoneda === 'USD'){
                    graph_dispersion_max_min_2('prod_media_max_min', prodMaxMinMedia.pf_usd, 'Dispersión (PF|USD): Monto Máximo y Mínimo por Producto', 
                        'Producto', 'Valores Máximos, Mínimo y Media', ' usd', 'Montos', 'Media')

                }  else if(tipoPersona === 'morales' & tipoMoneda === 'cualquiera'){
                    graph_dispersion_max_min_2('prod_media_max_min', prodMaxMinMedia.pm_cual, 'Dispersión (PM): Monto Máximo y Mínimo por Producto', 
                        'Producto', 'Valores Máximos, Mínimo y Media', ' mx', 'Montos', 'Media')

                }  else if(tipoPersona === 'morales' & tipoMoneda === 'MX'){
                    graph_dispersion_max_min_2('prod_media_max_min', prodMaxMinMedia.pm_mx, 'Dispersión (PM|MX): Monto Máximo y Mínimo por Producto', 
                        'Producto', 'Valores Máximos, Mínimo y Media', ' mx', 'Montos', 'Media')

                }  else if(tipoPersona === 'morales' & tipoMoneda === 'USD'){
                    graph_dispersion_max_min_2('prod_media_max_min', prodMaxMinMedia.pm_usd, 'Dispersión (PM|USD): Monto Máximo y Mínimo por Producto', 
                        'Producto', 'Valores Máximos, Mínimo y Media', ' usd', 'Montos', 'Media')

                }

                console.log(`Aplicando filtro: Tipo Persona = ${tipoPersona}, Tipo Moneda = ${tipoMoneda}`);
                // Aquí puedes agregar la lógica para filtrar los datos en la UI
            }


            
            const cltPrd = data.data_tree_map.clientes_con_mas_productos
            const cltMonto = data.data_tree_map.clientes_con_mayores_montos
            
            const dropdownMenuYearsFilter = document.getElementById('dropdown_years_menu_filter_sirac');
            const cltPrdTodos = cltPrd.año_todos
            let years = Object.keys(cltPrdTodos).sort((a, b) => b - a);    
            
            years.forEach(year => {
                const listItem = document.createElement('li'); // Crear el elemento <li>
                const link = document.createElement('a'); // Crear el elemento <a>
            
                // Configurar las propiedades del enlace
                link.className = 'dropdown-item';
                link.id = `year-${year}`; // Mejor práctica: usar un id único
                link.setAttribute('data-option', year); // Usar setAttribute para propiedades personalizadas
                link.textContent = year; // Asignar el texto del año
            
                // Añadir el enlace al elemento <li>
                listItem.appendChild(link);
            
                // Añadir el elemento <li> al menú desplegable
                dropdownMenuYearsFilter.appendChild(listItem);
            });
            
            graph_tree_map("hedmapproductclient", `Los 10 Clientes Con Mayor Contratación de Productos 2025`, cltPrdTodos['2025'], "Contratos");
            
            graph_tree_map("headmapmontoclient",  `Los 10 Clientes Con Mayores Montos 2025`, cltMonto.año_todos['2020'], "Montos" )
            console.log(cltMonto)
            // Variables globales para almacenar la selección
            let selectedCategory = null;
            let selectedYear = null;

            document.addEventListener("click", function (event) {
                // Verifica si el clic fue en un radio button
                const targetRadio = event.target.closest('input[type="radio"]');
            
                // Verifica si se seleccionó un año en el dropdown
                const targetDropdown = event.target.closest('#dropdown_years_menu_filter_sirac .dropdown-item');
            
                // Si el clic no fue en ninguno de estos elementos, no hacer nada
                if (!targetRadio && !targetDropdown) {
                    return;
                }
            
                const dropdownButton = document.getElementById('dropdown_years_menu_filter_sirac_b'); // Botón del dropdown
            
                // Si se selecciona un radio button, actualizar la categoría seleccionada
                if (targetRadio) {
                    selectedCategory = targetRadio.value;
                }
            
                // Si se selecciona un año en el dropdown, actualizar el año seleccionado
                if (targetDropdown) {
                    selectedYear = targetDropdown.getAttribute("data-option") || targetDropdown.textContent.trim();
                    if (dropdownButton) {
                        dropdownButton.textContent = selectedYear; // Actualizar el texto del botón
                    }
                }
            
                console.log("Categoría seleccionada:", selectedCategory);
                console.log("Año seleccionado:", selectedYear);
            
                // Determinar título y fuente de datos
                let { title, dataSource } = getTitleAndDataSource(selectedCategory);
                let { titleMonto, dataSourceMonto } = getTitleAndDataSourceMonto(selectedCategory);
                            
                // Determinar el año a usar (por defecto 2025 si no hay uno seleccionado)
                let yearToUse = selectedYear || "2025";
                            
                if (selectedCategory) {
                    graph_tree_map("hedmapproductclient", `${title} ${yearToUse}`, dataSource?.[yearToUse] || {}, "Contratos");
                    graph_tree_map("headmapmontoclient", `${titleMonto} ${yearToUse}`, dataSourceMonto?.[yearToUse] || {}, "Montos");
                } else {
                    graph_tree_map("hedmapproductclient", `Los 10 Clientes Con Mayor Contratación de Productos ${yearToUse}`, cltPrdTodos?.[yearToUse] || {}, "Contratos");
                    graph_tree_map("headmapmontoclient", `Los 10 Clientes Con Mayores Montos ${yearToUse}`, cltMonto?.año_todos?.[yearToUse] || {}, "Montos");
                }

            });

            // Función para determinar el título y la fuente de datos según la categoría seleccionada
            function getTitleAndDataSource(category) {
                switch (category) {
                    case "todoshet":
                        return { title: "Los 10 Clientes Con Mayor Contratación de Productos", dataSource: cltPrdTodos };
                    case "fisicashet":
                        return { title: "Los 10 Clientes Físicos Con Mayor Contratación de Productos", dataSource: cltPrd.año_pf };
                    case "moraleshet":
                        return { title: "Los 10 Clientes Morales Con Mayor Contratación de Productos", dataSource: cltPrd.año_pm };
                    default:
                        return { title: "", dataSource: null };
                }
            }
            
            function getTitleAndDataSourceMonto(category) {
                switch (category) {
                    case "todoshet":
                        return { titleMonto: "Los 10 Clientes Con Mayores Montos", dataSourceMonto: cltMonto.año_todos };
                    case "fisicashet":
                        return { titleMonto: "Los 10 Clientes Físicos con Mayores Montos", dataSourceMonto: cltMonto.año_pf };
                    case "moraleshet":
                        return { titleMonto: "Los 10 Clientes Morales Con Mayores Montos", dataSourceMonto: cltMonto.año_pm };
                    default:
                        return { titleMonto: "", dataSourceMonto: null };
                }
            }
 
            const dataTableSirac = data.data_table_clt
                $('#id_table_cliente_sirac').DataTable({
                    data: dataTableSirac,
                    order:  [[4, "asc"]],
                    columns:  [
        
                        { data: 'NOMBRE_COMPLETO/RAZON_SOCIAL', title: 'NOMBRE_COMPLETO/RAZON_SOCIAL' }, 
                        { data: 'TIPO_PERSONA', title: 'TIPO_PERSONA' }, 
                        { data: 'SECTOR', title: 'SECTOR' }, 
                        { data: 'AÑO', title: 'AÑO' }, 
                        { data: 'CANT_PRODUCTO', title: 'CANT_PRODUCTO'},
                        { data: 'TOTAL_MONTO', title: 'TOTAL_MONTO'},
                        { data: 'PROMEDIO_MONTO', title: 'PROMEDIO_MONTO'},
                        { data: 'MONTO_MAXIMO', title: 'MONTO_MAXIMO'},
                        { data: 'MONTO_MINIMO', title: 'MONTO_MINIMO'}

        
                    ],
                    /*columnDefs: [
                        { width: "7vw", targets: 0},
                        { width: "5vw", targets: 1 },
                    ],*/
                    language: {
                        url: 'config/es-MX.json'
                    },
        
                });
        })
        .catch(error => {
            // Manejo de errores
            console.error('Error al obtener los datos:', error);
            
        });
    }

    function initializeProductTas(){
        
        document.querySelectorAll('.cardModern').forEach(card => {
            card.addEventListener('click', () => {
                const marcador = card.getAttribute('data-marcador');
                if (marcador) {
                    window.location.href = `#${marcador}`;
                }
            });
        });

        fetch('http://127.0.0.1:5050/api/data/productos/tas')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
        const dataKps= data.dataKpsTas
        
        
        document.getElementById("numClient").innerHTML  = `${dataKps.cardClientes.totalClientes}` || '';
        document.getElementById("perDL").innerHTML  = ` Porcentaje clientes DL: ${dataKps.cardClientes.perCLientes}%` || '';
        
        const ctx = document.getElementById("barstaked").getContext("2d");
        const values = [1016, 6868-1016];
        graphkpBarStacked(ctx, values);

        //document.getElementById("updateData").innerHTML  = `Actualización: ${dataKps.dataUpdate}` || '';
        //document.getElementById("updateData2").innerHTML  = `Actualización: ${dataKps.dataUpdate}` || '';
        //document.getElementById("updateData3").innerHTML  = `Actualización: ${dataKps.dataUpdate}` || '';
        //document.getElementById("updateData4").innerHTML  = `Actualización: ${dataKps.dataUpdate}` || '';

        if (parseInt(dataKps.cardProd.crecimiento) > 0) {
            document.getElementById("TotalProd").innerHTML = `${dataKps.cardProd.numProduct} <span class="increase">+${dataKps.cardProd.crecimiento}%</span>` || '';
        } else {
            document.getElementById("TotalProd").innerHTML = `${dataKps.cardProd.numProduct} <span class="increase" style="color: red">${dataKps.cardProd.crecimiento}%</span>` || '';
        }
        document.getElementById("prodCliente").innerHTML = `Productos por cliente: ${dataKps.cardProd.meanClientProduct}`  || '';
        
        const GraphcountProdFin = dataKps.cardProd.GraphcountProdFin;
        const valuesCountProd = GraphcountProdFin.map(item => item[1]);

        var ctxLine = document.getElementById("lineChart").getContext("2d");
    

        graphkpsLineTas(ctxLine, valuesCountProd);

        document.getElementById("plazoMean").innerHTML = `${dataKps.cardPlazo.meanPlazo} días` || '';
        document.getElementById("infoPlazos").innerHTML = `Mínimo: ${dataKps.cardPlazo.minPlazo} | Máximo: ${dataKps.cardPlazo.maxPlazo}`  || '';

        const GraphPlazo = dataKps.cardPlazo.GraphPlazo;
        const valuesPlazo = GraphPlazo.map(item => item[1]);
        
        var ctxLinePlazo = document.getElementById("lineChartPlazo").getContext("2d");
        
        graphkpBarTas(ctxLinePlazo, valuesPlazo);
        
        document.getElementById("MontoOperacion").innerHTML = `${formatLargeNumber(dataKps.cardMonto.meanMonto)}  <span class="increase">+${dataKps.cardMonto.crecimiento}%</span>` || '';
        document.getElementById("infoMonto").innerHTML = `Mínimo: ${dataKps.cardMonto.minMonto} | Máximo: ${formatLargeNumber(dataKps.cardMonto.maxMonto)}`  || '';
        
        var ctxLineAreaMonto =  document.getElementById("GraphOperaciones").getContext("2d")
        graphkpAreaTas(ctxLineAreaMonto, [1000,2000,3000,1000,2000,400,5000,6000,7000,8000])
        
        const dataAñoContratatos = data.dataAñoContratatos;
        const dataAñoMesContratatos = data.dataAñoMesContratatos.map( item=> [
            Date.UTC(item[0], item[1] - 1), // fecha
            item[2] // cantidad
        ]);
        console.log(Date.UTC(1950, 1))
        console.log('lol')
        console.log(data.dataAñoMesContratatos)

        const dataAñoFecVencCont = data.dataAñoFecVencCont;
        const dataAñoMesFecVencCont = data.dataAñoMesFecVencCont.map( item=> [
            Date.UTC(item[0], item[1] - 1), // fecha
            item[2] // cantidad
        ]);

        const dataAñoPlazo = data.dataAñoPlazo;
        const dataAñoMesPlazo = data.dataAñoMesPlazo.map( item=> [
            Date.UTC(item[0], item[1] - 1), // fecha
            item[2] // cantidad
        ]); 



        graph_area_crec_clt_insight('graphContratos', 
            dataAñoContratatos, 
            'Distribución Anual de Operaciones (Clientes Activos)', 
            'Año Operacion', 
            'Operaciones', 
            ' operaciones', '');


        graph_area_crec_clt_insight('grapfVenciContratos', dataAñoFecVencCont, 'Distribución Anual de Vencimiento de Operaciones (Clientes Activos)', 'Año de Vencimiento', 'Operaciones', ' operaciones', '');


        graph_area_crec_clt_insight('graphPlazo', dataAñoPlazo, 'Plazo Promedio (Días) de Operaciones Anuales (Clientes Activos)', 'Año', 'Plazo (en días)', ' días', '');


        document.addEventListener("click", function (event) {
            const target = event.target.closest('input[type="radio"]');
            if (!target) return; 
        
            const graph = target.name;
            const tipoGrafico = document.querySelector('input[name="TipoGrafOpe"]:checked').id;
            const frecuenciaDatos = document.querySelector('input[name="graphFechaOpe"]:checked')?.value;
        
            if (graph === 'graphFechaOpe' || graph.startsWith("TipoGrafOpe")) {
                if (tipoGrafico.includes("heatmap")) {
                    if (frecuenciaDatos === "anual") {
                        heatmapAnual('graphContratos', dataAñoContratatos, 'Distribución Anual de Operaciones (Clientes Activos)', 'Año Operacion', 'Operaciones');
                    } else if (frecuenciaDatos === "mensual") {
                        heatmapMensual('graphContratos',  data.dataAñoMesContratatos, 'Distribución Mensual de Operaciones (Clientes Activos)', 'Año Operacion', 'Operaciones')
                    }
                } else {
                    if (frecuenciaDatos === "anual") {
                        graph_area_crec_clt_insight('graphContratos', dataAñoContratatos, 'Distribución Anual de Operaciones (Clientes Activos)', 'Año Operacion', 'Operaciones', ' operaciones', '');
                    } else if (frecuenciaDatos === "mensual") {
                        graph_area_crec_clt_insight_mes('graphContratos', dataAñoMesContratatos, 'Distribución Mensual de Operaciones (Clientes Activos)', 'Año Operacion', 'Operaciones', ' operaciones', '');
                    }
                }
            }
        });

        document.addEventListener("click", function (event) {
            const target = event.target.closest('input[type="radio"]');
            if (!target) return; 
        
            const graph = target.name;
            const tipoGrafico = document.querySelector('input[name="TipoFechaVenc"]:checked').id;
            const frecuenciaDatos = document.querySelector('input[name="graphFechaVen"]:checked')?.value;
        
            if (graph === 'graphFechaVen' || graph.startsWith("TipoFechaVenc")) {
                if (tipoGrafico.includes("heatmap")) {
                    if (frecuenciaDatos === "anual") {
                        heatmapAnual('grapfVenciContratos', dataAñoContratatos, 'Distribución Anual de Vencimiento de Operaciones (Clientes Activos)', 'Año de Vencimiento', 'Operaciones')
                    } else if (frecuenciaDatos === "mensual") {
                        heatmapMensual('grapfVenciContratos',  data.dataAñoMesFecVencCont, 'Distribución Mensual de Vencimiento de Operaciones (Clientes Activos)', 'Año de Vencimiento', 'Operaciones')
                        
                    }
                } else {
                    if (frecuenciaDatos === "anual") {
                        graph_area_crec_clt_insight('grapfVenciContratos', dataAñoFecVencCont, 'Distribución Anual de Vencimiento de Operaciones (Clientes Activos)', 'Año de Vencimiento', 'Operaciones', ' operaciones', '');
                    } else if (frecuenciaDatos === "mensual") {
                        graph_area_crec_clt_insight_mes('grapfVenciContratos', dataAñoMesFecVencCont, 'Distribución Mensual de Vencimiento de Operaciones (Clientes Activos)', 'Año de Vencimiento', 'Operaciones', ' operaciones', '');
                    }
                }
            }
        });



        document.addEventListener("click", function (event) {
            const target = event.target.closest('input[type="radio"]');
            if (!target) return; 
        
            const graph = target.name;
            const tipoGrafico = document.querySelector('input[name="TipoFechaPlazo"]:checked').id;
            const frecuenciaDatos = document.querySelector('input[name="graphFechaPlazo"]:checked')?.value;
        
            if (graph === 'graphFechaPlazo' || graph.startsWith("TipoFechaPlazo")) {
                if (tipoGrafico.includes("heatmap")) {
                    if (frecuenciaDatos === "anual") {
                        heatmapAnual('graphPlazo', dataAñoPlazo, 'Plazo Promedio (Días) de Operaciones Anuales (Clientes Activos)', 'Año', 'Plazo (en días)')

                    } else if (frecuenciaDatos === "mensual") {
                        heatmapMensual('graphPlazo',  data.dataAñoMesPlazo, 'Plazo Promedio (Días) de Operaciones Mensuales (Clientes Activos)', 'Año', 'Plazo (en días)')
                    }
                } else {
                    if (frecuenciaDatos === "anual") {
                        graph_area_crec_clt_insight('graphPlazo', dataAñoPlazo, 'Plazo Promedio (Días) de Operaciones Anuales (Clientes Activos)', 'Año', 'Plazo (en días)', ' días', '');
                    } else if (frecuenciaDatos === "mensual") {
                        graph_area_crec_clt_insight_mes('graphPlazo', dataAñoMesPlazo, 'Plazo Promedio (Días) de Operaciones Mensuales (Clientes Activos)', 'Año', 'Plazo (en días)', ' días', '');
                    }
                }
            }
        });
        
        const dataMediaMinMax = data.dataMediaMinMax
        graph_dispersion_max_min('graphMediaMaxMin', dataMediaMinMax);

        const dataAnualProdFin = data.tableroProductos.dataAnualProdFin
        const dataMensualProdFin = data.tableroProductos.dataMensualProdFin
        const dataTableProdAnual = data.tableroProductos.dataTableProdAnual
        const prodFrecuencia = data.tableroProductos.prodFrecuencia
        const prodFrecuenciaAnual = data.tableroProductos.prodFrecuenciaAnual
        const dataTableProd = data.tableroProductos.dataTableProd

        graph_spline_annual('graphSplineProdFin', dataAnualProdFin, 'Crecimiento Anual de Productos Financieros', 'Año', 'productos', ' productos', dataTableProdAnual, prodFrecuenciaAnual,'');
        
        graph_histogram('FrecuenciaProd',prodFrecuencia, 'Distribución de Productos Financieros', 'Frecuencia', dataTableProd)
        

        const boton = document.getElementById("miBoton");
        boton.addEventListener("click", () => {

            graph_histogram('FrecuenciaProd',prodFrecuencia, 'Distribución de Productos Financieros', 'Frecuencia', dataTableProd)
            createTableProd(dataTableProd)    

        });

        document.addEventListener("click", function (event) {
            const target = event.target.closest('input[type="radio"]');
            if (!target) return; 

            // graph_spline_annual,  graph_spline_monthly
            
            const namegrah = target.name;
            switch(namegrah){
                case 'graphProdFin':
                    if (target.value === 'anual') {
                        graph_spline_annual('graphSplineProdFin', dataAnualProdFin, 'Crecimiento Anual de Productos Financieros', 'Año', 'productos', ' productos', dataTableProdAnual, prodFrecuenciaAnual,'');
                    } else if (target.value === 'mensual') {
                        graph_spline_monthly('graphSplineProdFin', dataMensualProdFin, 'Crecimiento Mensual de Productos Financieros', 'Fecha', 'Productos', ' productos', '');
                    }
                    break; 
                
                default: break
            }
            
            
        });
        
        const dataMontoOper = data.tableroProductos.dataMontosAnual.dataMontoOper
        const dataMontoAsignado = data.tableroProductos.dataMontosAnual.dataMontoAsignado
        const dataMontoReal = data.tableroProductos.dataMontosAnual.dataMontoReal
        
        const dataMontoOperMensual = data.tableroProductos.dataMontosAnualMensual.dataMontoOper
        const dataMontoAsignadoMensual = data.tableroProductos.dataMontosAnualMensual.dataMontoAsignado
        const dataMontoRealMensual = data.tableroProductos.dataMontosAnualMensual.dataMontoReal
        
        sincronizacion3Series(
            ['idMontos1','idMontos2','idMontos3'],
            'idMontos4',
            [dataMontoOperMensual, dataMontoAsignadoMensual, dataMontoRealMensual],       
            ["Distribución de Montos de Operaciones","Distribución Montos Asignados","Distribución Montos Reales"],
            ["Años","Años","Años"],
            ["Monto Operación","Monto Asignado","Monto Real"],
            ["Monto Operacion","Monto Asignado","Monto Real"],
            false  // anual = true (si es false, se esperan datos con formato [año, mes, valor])
        );
        

        const dataMontoOperacionExt = data.tableroProductos.dataMontoOperacionExt
        const dataMontoRealExt = data.tableroProductos.dataMontoRealExt
        const dataMontoAsignadoExt = data.tableroProductos.dataMontoAsignadoExt
        

        const frecuenciaSelect = document.getElementById("frecuencia");
        const comparacionSelect = document.getElementById("comparacion");
        const subfiltroDiv = document.getElementById("subfiltro");
        const subfiltroSelect = document.getElementById("subfiltroSelect");
        const btnAplicar = document.getElementById("btnAplicar");
        
        
        comparacionSelect.addEventListener("change", () => {
            if (comparacionSelect.value === "Comparación Individual") {
                subfiltroDiv.style.display = "block";
            } else {
                subfiltroDiv.style.display = "none";
            }
        });
    
        // Aplica los filtros y muestra los valores en la consola
        btnAplicar.addEventListener("click", () => {
            const frecuencia = frecuenciaSelect.value;
            const comparacion = comparacionSelect.value;
            const subfiltro = subfiltroSelect.value;

            if (comparacion === "Comparación de Montos") {
                if (frecuencia == "Anual"){
                    sincronizacion3Series(
                        ['idMontos1','idMontos2','idMontos3'],
                        'idMontos4',
                        [dataMontoOper, dataMontoAsignado, dataMontoReal],       
                        ["Distribución Anual de Montos de Operaciones","Distribución Anual Montos Asignados","Distribución Anual Montos Reales"],
                        ["Años","Años","Años"],
                        ["Monto Operación","Monto Asignado","Monto Real"],
                        ["Monto Operacion","Monto Asignado","Monto Real"],
                        true  // anual = true (si es false, se esperan datos con formato [año, mes, valor])
                    );
                } else if (frecuencia == "Mensual"){
                    sincronizacion3Series(
                        ['idMontos1','idMontos2','idMontos3'],
                        'idMontos4',
                        [dataMontoOperMensual, dataMontoAsignadoMensual, dataMontoRealMensual],       
                        ["Distribución Mensual de Montos de Operaciones","Distribución Mensual Montos Asignados","Distribución Mensual Montos Reales"],
                        ["Años","Años","Años"],
                        ["Monto Operación","Monto Asignado","Monto Real"],
                        ["Monto Operacion","Monto Asignado","Monto Real"],
                        false  // anual = true (si es false, se esperan datos con formato [año, mes, valor])
                    );
                }
            } else if (comparacion === "Comparación Individual") {
                if (subfiltro == "Monto Operaciones") {
                    if (frecuencia == "Anual"){
                        const dataOpeSetsAnual = [
                            dataMontoOperacionExt.anual.map(items => [items[0], items[1]]),
                            dataMontoOperacionExt.anual.map(items => [items[0], items[2]]),
                            dataMontoOperacionExt.anual.map(items => [items[0], items[3]])
                        ];
                        sincronizacion3Series(
                            ['idMontos1','idMontos2','idMontos3'],
                            'idMontos4',
                            dataOpeSetsAnual,
                            ["Distribución Anual de Montos Maximo por Operaciones","Distribución Anual Montos Medios por Operaciones","Distribución Anual Montos Minimos Operaciones"],
                            ["Años","Años","Años"],
                            ["Monto Maximos","Monto Medios","Monto Minimos"],
                            ["Monto Maximos","Monto Medios","Monto Minimos"],
                            true  // anual = true (si es false, se esperan datos con formato [año, mes, valor])
                        );
                    } else if (frecuencia == "Mensual"){
                        const dataOpeSetsMensual = [
                            dataMontoOperacionExt.mensual.map(items => [items[0],items[1],items[2]]),
                            dataMontoOperacionExt.mensual.map(items => [items[0],items[1],items[3]]),
                            dataMontoOperacionExt.mensual.map(items => [items[0],items[1],items[4]])
                        ];
                        sincronizacion3Series(
                            ['idMontos1','idMontos2','idMontos3'],
                            'idMontos4',
                            dataOpeSetsMensual,
                            ["Distribución Mensual de Montos Maximo por Operaciones","Distribución Mensual Montos Medios por Operaciones","Distribución Mensual Montos Minimos Operaciones"],
                            ["Años","Años","Años"],
                            ["Monto Maximos","Monto Medios","Monto Minimos"],
                            ["Monto Maximos","Monto Medios","Monto Minimos"],
                            false  // anual = true (si es false, se esperan datos con formato [año, mes, valor])
                        );

                    }
                } else if (subfiltro == "Monto Asignado") {
                    if (frecuencia == "Anual"){
                        const dataAsigSetsAnual= [
                            dataMontoAsignadoExt.anual.map(items => [items[0], items[1]]), 
                            dataMontoAsignadoExt.anual.map(items => [items[0], items[2]]), 
                            dataMontoAsignadoExt.anual.map(items => [items[0], items[3]])
                        ]      
                        
                        sincronizacion3Series(
                            ['idMontos1','idMontos2','idMontos3'],
                            'idMontos4',
                            dataAsigSetsAnual,
                            ["Distribución Anual de Montos Maximo Asignados","Distribución Anual Montos Medios Asignados","Distribución Anual Montos Minimos Asignados"],
                            ["Años","Años","Años"],
                            ["Monto Maximos","Monto Medios","Monto Minimos"],
                            ["Monto Maximos","Monto Medios","Monto Minimos"],
                            true  // anual = true (si es false, se esperan datos con formato [año, mes, valor])
                        );
                    } else if (frecuencia == "Mensual"){
                        const dataAsigSetsMensual = [
                            dataMontoAsignadoExt.mensual.map(items => [items[0],items[1],items[2]]),
                            dataMontoAsignadoExt.mensual.map(items => [items[0],items[1],items[3]]),
                            dataMontoAsignadoExt.mensual.map(items => [items[0],items[1],items[4]])
                        ];
                        sincronizacion3Series(
                            ['idMontos1','idMontos2','idMontos3'],
                            'idMontos4',
                            dataAsigSetsMensual,
                            ["Distribución Mensual de Montos Maximo Asignados","Distribución Mensual Montos Medios Asignados","Distribución Mensual Montos Minimos Asignados"],
                            ["Años","Años","Años"],
                            ["Monto Maximos","Monto Medios","Monto Minimos"],
                            ["Monto Maximos","Monto Medios","Monto Minimos"],
                            false  // anual = true (si es false, se esperan datos con formato [año, mes, valor])
                        );
                    }
                } else if (subfiltro == "Monto Reales") {
                    if (frecuencia == "Anual"){
                        const dataRealesSetsAnual = [
                            dataMontoRealExt.anual.map(items => [items[0], items[1]]), 
                            dataMontoRealExt.anual.map(items => [items[0], items[2]]), 
                            dataMontoRealExt.anual.map(items => [items[0], items[3]])
                        ]       

                        sincronizacion3Series(
                            ['idMontos1','idMontos2','idMontos3'],
                            'idMontos4',
                            dataRealesSetsAnual,
                            ["Distribución Anual de Montos Maximos Reales","Distribución Anual Montos Medios Reales","Distribución Anual Montos Minumos Reales"],
                            ["Años","Años","Años"],
                            ["Monto Maximos","Monto Medios","Monto Minimos"],
                            ["Monto Maximos","Monto Medios","Monto Minimos"],
                            true  // anual = true (si es false, se esperan datos con formato [año, mes, valor])
                        );
                    } else if (frecuencia == "Mensual"){
                        const dataRealesSetsMensual = [
                            dataMontoRealExt.mensual.map(items => [items[0],items[1],items[2]]),
                            dataMontoRealExt.mensual.map(items => [items[0],items[1],items[3]]),
                            dataMontoRealExt.mensual.map(items => [items[0],items[1],items[4]])
                        ];
                        sincronizacion3Series(
                            ['idMontos1','idMontos2','idMontos3'],
                            'idMontos4',
                            dataRealesSetsMensual,
                            ["Distribución Mensual de Montos Maximos Reales","Distribución Mensual Montos Medios Reales","Distribución Mensual Montos Minumos Reales"],
                            ["Años","Años","Años"],
                            ["Monto Maximos","Monto Medios","Monto Minimos"],
                            ["Monto Maximos","Monto Medios","Monto Minimos"],
                            false  // anual = true (si es false, se esperan datos con formato [año, mes, valor])
                        );
                    }
                } 
            }
        });
    
        const mapColClieTas = [
            
        ]
        $('#idTableProdFin').DataTable({
            data: dataTableProd,
            order:  [[0, "asc"]],
            columns:  [
                { data: 'PRODUCTO', title: 'Producto' }, 
                { data: 'MIN_PLAZO', title: 'Plazo Min' }, 
                { data: 'MAX_PLAZO', title: 'Plazo Max'}, 
                { data: 'MIN_MONTO', title: 'Monto Min'},
                { data: 'MAX_MONTO', title: 'Monto Max'}, 
                { data: 'TASA_PROMEDIO', title: 'Tasa Prom'}

            ],
            info: false,
            lengthChange: false,
            searching: false,
            language: {
                url: 'config/es-MX.json'
            },

        })

        
        const dataCliente = data.tableroProductos.dataClientes
       
        let title = 'Top 10 Clientes con Más Contrataciones';
        let title2 = 'Top 10 Clientes con Mayores Montos de Inversión';


        const id_container_1 = 'treemap-container'
        const id_container_2 =  'treemap-container_2'
    
        const dropdownMenuYearsFilter = document.getElementById('dropdown_years_menu_filter_tas');
        
        const years = dataCliente.años    
        console.log(years)
        
        // Llenar dinamicamente años
        years.forEach(year => {
            const listItem = document.createElement('li'); 
            const link = document.createElement('a'); 
        
            // Configurar las propiedades del enlace
            link.className = 'dropdown-item';
            link.id = `year-${year}`; 
            link.setAttribute('data-option', year);
            link.textContent = year; 
        
            // Añadir el enlace al elemento <li>
            listItem.appendChild(link);
        
            // Añadir el elemento <li> al menú desplegable
            dropdownMenuYearsFilter.appendChild(listItem);
        });

        const mappingColumTabClientTas = [
            { data: 'AÑO', title: 'AÑO' }, 
            { data: 'NOMLARGO', title: 'NOMBRE LARGO' }, 
            { data: 'PRODUCTOS', title: 'NUMERO DE PRODUCTOS'}, 
            { data: 'PROMEDIO_MONTO', title: 'PROMEDIO MONTO'}, 
            { data: 'TOTAL_MONTO', title: 'MONTO COMUN'},
            { data: 'MONTO_MAXIMO', title: 'MONTO MÁXIMO'},
            { data: 'MONTO_MINIMO', title: 'MONTO MINIMO'},
            { data: 'TASA_PROMEDIDO', title: 'TASA PROMEDIO'}
        ]
        
        const dataTableTas = data.tableroProductos.dataTableClt
        $('#id_table_cliente_tas').DataTable({
            data: dataTableTas,
            order:  [[2, "asc"]],
            columns: mappingColumTabClientTas ,
            language: {
                url: 'config/es-MX.json'
            },

        })

        
        graph_tree_map_busq(id_container_1, `${title} 2024`, dataCliente.data_treemap_año_pm_product["2024"], 'Productos' , 'id_table_cliente_tas', dataTableTas, mappingColumTabClientTas, null, 'NOMLARGO')
        graph_tree_map_busq(id_container_2, `${title2} 2024`, dataCliente.data_treemap_año_pm_monto["2024"], 'Montos', 'id_table_cliente_tas', dataTableTas, mappingColumTabClientTas, null, 'NOMLARGO')


        
        document.addEventListener('click', (event) => {
            const target = event.target; // Elemento que disparó el evento
        
            // Verifica si el clic fue en un elemento del dropdown con `data-option`
            if (target.closest('#dropdown_years_menu_filter_tas .dropdown-item')) {
                const year = target.getAttribute('data-option'); // Obtén el valor del atributo
                // Referencia al botón del dropdown
                const dropdownButton = document.getElementById('dropdown_years_menu_filter_tas_b');
                // Actualizar el texto del botón con el año seleccionado
                dropdownButton.textContent = year;
                //Actualizar grafico
                let data_filter_1 = dataCliente.data_treemap_año_pm_product[year]
                graph_tree_map_busq(id_container_1, `${title} ${year}`, data_filter_1, 'Productos' , 'id_table_cliente_tas', dataTableTas, mappingColumTabClientTas, null, 'NOMLARGO')


                let data_filter_2 = dataCliente.data_treemap_año_pm_monto[year]
                graph_tree_map_busq(id_container_2, `${title2} ${year}`, data_filter_2, 'Montos', 'id_table_cliente_tas', dataTableTas, mappingColumTabClientTas, null, 'NOMLARGO')


            }
        });

        const buttonCleanClient =  document.getElementById('clean-client-tas')
            
            buttonCleanClient.addEventListener('click', () => {
                const dropdownButton = document.getElementById('dropdown_years_menu_filter_tas_b');
                dropdownButton.textContent = '2024';
            
                const elements = [
                    document.getElementById(id_container_1),
                    document.getElementById(id_container_2),
                    document.getElementById('id_table_cliente_tas')
                ];
            
                // Aplicar fade-out antes de actualizar
                elements.forEach(el => el.classList.add('fade-out'));
            
                setTimeout(() => {
                    graph_tree_map_busq(id_container_1, `${title} 2024`, dataCliente.data_treemap_año_pm_product["2024"], 'Productos' , 'id_table_cliente_tas', dataTableTas, mappingColumTabClientTas, null, 'NOMLARGO')
                    graph_tree_map_busq(id_container_2, `${title2} 2024`, dataCliente.data_treemap_año_pm_monto["2024"], 'Montos', 'id_table_cliente_tas', dataTableTas, mappingColumTabClientTas, null, 'NOMLARGO')
            
            
                    $('#id_table_cliente_tas').DataTable().clear().destroy();
                    $('#id_table_cliente_tas').empty();
                    $('#id_table_cliente_tas').DataTable({
                        data: dataTableTas,
                        order:  [[2, "asc"]],
                        columns: mappingColumTabClientTas ,
                        language: {
                            url: 'config/es-MX.json'
                        },
            
                    })
                    // Aplicar fade-in después de actualizar
                    elements.forEach(el => {
                        el.classList.remove('fade-out');
                        el.classList.add('fade-in');
                    });
            
                }, 350); // Espera 300ms para que el fade-out termine
            });
        

        })    
        .catch(error => {
            // Manejo de errores
            console.error('Error al obtener los datos:', error);
            // Configuración del gráfico de líneas (fondo)
            });
    }

    function initializeProductSifc(){
        
        document.querySelectorAll('.cardModernSifc').forEach(card => {
            card.addEventListener('click', () => {
                const marcador = card.getAttribute('data-marcador');
                if (marcador) {
                    window.location.href = `#${marcador}`;
                }
            });
        });

        fetch('http://127.0.0.1:5050/api/data/productos/sifc')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            
            
            const ctxBar = document.getElementById("barstaked-sifc").getContext("2d");
            const values = [471, 6868];
            const colors = ["rgb(192, 192, 192)", 'rgba(255, 255, 255, 0.3)'];
            new Chart(ctxBar, {
                type: "bar",
                data: {
                    labels: [""],  // Una sola barra horizontal
                    datasets: values.map((value, index) => ({
                        data: [value],
                        backgroundColor: colors[index],
                        borderWidth: 0,
                        barThickness:30
                    }))
                },
                options: {
                    indexAxis: 'y',  // Hace la barra horizontal
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            stacked: true,
                            display: false  // Oculta los ejes para un aspecto limpio
                        },
                        y: {
                            stacked: true,
                            display: false
                        }
                    },
                    plugins: {
                        legend: {
                            display: false  // Muestra la leyenda para identificar las secciones
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    const total = values.reduce((acc, val) => acc + val, 0);
                                    const percentage = ((context.raw / total) * 100).toFixed(2);
                                    return `${percentage}% (${context.raw} clientes)`;
                                }
                            }
                        }
                    }
                }
            });


            

            const FechasEntradasMesual = data.TableroFechas.FechasEntradas.mensual
            const FechasEntradasAnual = data.TableroFechas.FechasEntradas.anual


            const FechasLiquidacionMesual = data.TableroFechas.FechasLiquidacion.mensual
            const FechasLiquidacionAnual = data.TableroFechas.FechasLiquidacion.anual

            const MaxMinMean = data.TableroFechas.MaxMinMean

            CreateGraphBar('divgraphFechaEntradas', FechasEntradasAnual , 'Distribución anual de operaciones según la fecha de entrada de la transacción', 'Años', 'Operaciones', ' operaciones', 'Frecuencia' )
            //CreateGraphBar('divgraphFechaAcuerdos', FechasAcuerdoAnual , 'Distribución Anual de Operaciones con Respecto Fecha de Acuerdos', 'Años', 'Operaciones', ' operaciones', 'Frecuencia',  '#406780' )
            CreateGraphBar('divgraphFechaLiquidacion', FechasLiquidacionAnual , 'Distribución anual de operaciones según la fecha de liquidación', 'Años', 'Operaciones', ' operaciones', 'Frecuencia', '#394A55')

            graph_dispersion_max_min('divgraphMediaMaxMin', MaxMinMean);

            Highcharts.chart('categorysubtype', {
                chart: {
                    type: 'bar'
                },
                title: {
                    text: 'Distribución de subtipos de transacción'
                },
                xAxis: {
                    categories: [
                        'CORTO PLAZO',
                        'Conciliación SIFC - TAS',
                        'Pago de honorarios con cargo al patrimonio',
                        'Pago de honorarios con depósito del cliente',
                        'LARGO PLAZO',
                        'Inicialización de Acuerdos'
                    ],
                    title: {
                        text: null
                    }
                },
                yAxis: {
                    min: 1,
                    type: 'logarithmic',
                    title: {
                        text: 'Cantidad',
                        align: 'high'
                    },
                    labels: {
                        overflow: 'justify'
                    }
                },
                tooltip: {
                    valueSuffix: ''
                },
                plotOptions: {
                    bar: {
                        dataLabels: {
                            enabled: true
                        }
                    }
                },
                legend: {
                    enabled: false
                },
                credits: {
                    enabled: false
                },
                series: [{
                    name: 'Cantidad',
                    data: [803541, 162199, 8051, 4819, 2172, 17]
                }]
            });

            var ctxLine = document.getElementById("lineChartPlazo-sifc").getContext("2d");

            graphkpsLineTas(ctxLine, [69,64,59,59,57,57,68,64,59,43]);


            var ctxBar2 = document.getElementById("barChart-sifc").getContext("2d");

            
 
            graphkpBarTas(ctxBar2, [23475,25557,17789,21594,21755,24293,25036,24529,24719,23540,20972,21562], ['Ene','Feb','Mar','Abril','Mayo','Jun','Jul','Ago','Sep','Oct','Nov','Dic'])
            
            var ctxArea = document.getElementById("areaChart-sifc").getContext("2d"); 
            
            graphkpAreaTas(ctxArea, [1,1,1,1,1,1,1,1,1,1,1])

            document.addEventListener("click", function (event) {
                const target = event.target.closest('input[type="radio"]'); // Verifica si el clic fue en un radio button
                if (!target) return; // Si no es un radio button, no hace nada
                console.log(target)
                const graph = target.name;
                switch (graph) {
                    case 'graphFechaEntrada':

                        if (target.value === 'anual') {
                            CreateGraphBar('divgraphFechaEntradas', FechasEntradasAnual , 'Distribución anual de operaciones según la fecha de entrada de la transacción', 'Años', 'Operaciones', ' operaciones', 'Frecuencia' )
                        } else if (target.value === 'mensual') {
                            let dataMap1 = FechasEntradasMesual.map(item => [Date.UTC(item[0], item[1] - 1), item[2]] )
                            graph_area_crec_clt_insight_mes('divgraphFechaEntradas', dataMap1 , 'Distribución mensual de operaciones según la fecha de entrada de la transacción ', 'Años', 'Operaciones', ' operaciones', 'Frecuencia');

                        }
                        break; // Evita que el switch continúe ejecutando otros casos innecesariamente
                    case 'graphFechaLiquidacion':

                        if (target.value === 'anual') {
                            CreateGraphBar('divgraphFechaLiquidacion', FechasLiquidacionAnual , 'Distribución Anual de Operaciones con Respecto Fecha de Liquidación', 'Años', 'Operaciones', ' operaciones', 'Frecuencia', '#394A55' )
                        } else if (target.value === 'mensual') {
                            graph_area_crec_clt_insight_mes('divgraphFechaLiquidacion', FechasLiquidacionMesual.map(item => [Date.UTC(item[0], item[1] - 1), item[2]]) , 'Distribución Mensual de Operaciones con Respecto Fecha de Liquidación', 'Años', 'Operaciones', ' operaciones', 'Frecuencia');

                        }
                        break; 
                    default:
                        break;
                }
            });

        
            const dataConceptosAnual = data.TableroConceptos.Conceptos.anual
            const dataTablaConceptos = data.TableroConceptos.TablaConceptos

            const dataFrecuenciaConceptos = data.TableroConceptos.FrecuenciaConcepto
            
            const dataFrecuenciaConceptosAnual = data.TableroConceptos.FrecuenciaConceptoAnualizado

            const dataTablaConceptosAnual = data.TableroConceptos.TablaConceptosAnualizado
            
            let columTabCon = [
                { data: 'OPERACION', title: 'Operación' }, 
                { data: 'PROMEDIO_MONTO_OPERACION', title: 'Monto Operación' }, 
                { data: 'MAX_MONTO', title: 'Monto Max'}, 
                { data: 'MIN_MONTO', title: 'Monto Min'},
                ]

            let title = `Frecuencia por Tipo de Operación`
            
            createTable("TableOperaciones", dataTablaConceptos, columTabCon)
            
            graph_spline_annual_sifc('graphOpeInd', dataConceptosAnual, 'Distribución Anual de Operaciones Individuales', 'Años', 'Operaciones Unicas', ' operaciones', 'histFreq', title, dataFrecuenciaConceptosAnual, 'TableOperaciones', dataTablaConceptosAnual, columTabCon);             
            
            graph_histogram_sifc('histFreq', dataFrecuenciaConceptos, 'Frecuencia por Tipo de Operación', 'Operaciones', 'Frecuencia', 'TableOperaciones', dataTablaConceptos, columTabCon)
            


            const cleanFitler = document.getElementById("cleanFilterOperSifc");

            cleanFitler.addEventListener("click", () => {
                graph_histogram_sifc('histFreq', dataFrecuenciaConceptos, 'Frecuencia por Tipo de Operación', 'Operaciones', 'Frecuencia', 'TableOperaciones', dataTablaConceptos, columTabCon)
                createTable("TableOperaciones", dataTablaConceptos, columTabCon)    
                document.getElementById("bestConcept").innerHTML = 'ENTREGA PATRIMONIAL';
                document.getElementById("lessConcept").innerHTML = 'ENTERO DE IVA'
                document.getElementById("bestConceptMonto").innerHTML = 'RETIRO DE RECURSOS PARA INVERSION EN OTROS INTERMEDIARIOS'

                document.getElementById("display-year-sifc").innerHTML = 'Histórico';
                document.getElementById("display-year2-sifc").innerHTML = 'Histórico';
                document.getElementById("display-year3-sifc").innerHTML = 'Histórico';
            });

            const dataTableCLientes = data.TableroClientes.dataTableCLientes
            
            const mappingColumnTableClient = [
                { data: 'AÑO', title: 'Año'}, 
                { data: 'ID', title: 'ID' }, 
                { data: 'NOMBRE', title: 'Nombre'}, 
                { data: 'OPERACIONES', title: 'Operaciones'}, 
                { data: 'MONTOS_PROMEDIOS', title: 'Monto frecuente'}, 
                { data: 'MONTO_MAXIMOS', title: 'Monto mínimo'},
                { data: 'MONTO_MINIMO', title: 'Monto máximo'}
            ]
            

            $('#id_table_cliente_sifc').DataTable({
                data: dataTableCLientes,
                order: [[1, "desc"]],  // Se corrigió "des" por "desc"
                columns: mappingColumnTableClient,
                info: true,
                lengthChange: true,
                searching: true,
                paging: true,
                language: {
                    url: 'config/es-MX.json'
                },
                columnDefs: [
                    {
                        targets: [4,5,6], 
                        render: $.fn.dataTable.render.number(',', '.', 2, '$') 
                    }
                ]
            });

            const dataClientes = data.TableroClientes.dataBestClient
            
            let titleOperaSifc = 'Top 10 Clientes con Mayor Operaciones en';
            let titleMontosSifc = 'Top 10 Clientes con Mayores Montos por Operación en';

            const id_container_1 = 'treemap-container-sifc'
            const id_container_2 =  'treemap-container2-sifc'
            
            let mapeoDato = [
                {
                    targets: [4,5,6], 
                    render: $.fn.dataTable.render.number(',', '.', 2, '$') 
                }
            ]

            graph_tree_map_busq(id_container_1, `${titleOperaSifc} 2025`, dataClientes.product["2025"], 'Operaciones','id_table_cliente_sifc', dataTableCLientes, mappingColumnTableClient, mapeoDato, 'NOMBRE')
            graph_tree_map_busq(id_container_2, `${titleMontosSifc} 2025`, dataClientes.montos["2025"], 'Montos', 'id_table_cliente_sifc', dataTableCLientes, mappingColumnTableClient, mapeoDato, 'NOMBRE')

            const dropdownMenuYearsFilter = document.getElementById('dropdown_years_menu_filter_sifc');
            const years = dataClientes.años    
            // Llenar dinamicamente años
            years.forEach(year => {
                const listItem = document.createElement('li'); 
                const link = document.createElement('a'); 
            
                // Configurar las propiedades del enlace
                link.className = 'dropdown-item';
                link.id = `year-${year}`; 
                link.setAttribute('data-option', year);
                link.textContent = year; 
            
                // Añadir el enlace al elemento <li>
                listItem.appendChild(link);
            
                // Añadir el elemento <li> al menú desplegable
                dropdownMenuYearsFilter.appendChild(listItem);
            });

            document.addEventListener('click', (event) => {
                const target = event.target; // Elemento que disparó el evento
            
                // Verifica si el clic fue en un elemento del dropdown con `data-option`
                if (target.closest('#dropdown_years_menu_filter_sifc .dropdown-item')) {
                    const year = target.getAttribute('data-option'); // Obtén el valor del atributo
                   
                    const dropdownButton = document.getElementById('dropdown_years_menu_filter_sifc_b');
                    
                    dropdownButton.textContent = year;
                    
                    let data_filter_garantias = dataClientes.product[year]

                    graph_tree_map_busq(id_container_1, `${titleOperaSifc} ${year}`, data_filter_garantias, 'Operaciones','id_table_cliente_sifc', dataTableCLientes, mappingColumnTableClient, mapeoDato, 'NOMBRE')


    
                    let data_filter_ganancias3 = dataClientes.montos[year]
                    graph_tree_map_busq(id_container_2, `${titleOperaSifc} ${year}`, data_filter_ganancias3, 'Operaciones','id_table_cliente_sifc', dataTableCLientes, mappingColumnTableClient, mapeoDato, 'NOMBRE')


    
                }
            });
            
            const buttonCleanClient =  document.getElementById('clean-client')
            
            buttonCleanClient.addEventListener('click', () => {
                const dropdownButton = document.getElementById('dropdown_years_menu_filter_sifc_b');
                dropdownButton.textContent = '2025';
            
                const elements = [
                    document.getElementById(id_container_1),
                    document.getElementById(id_container_2),
                    document.getElementById('id_table_cliente_sifc')
                ];
            
                // Aplicar fade-out antes de actualizar
                elements.forEach(el => el.classList.add('fade-out'));
            
                setTimeout(() => {
                    graph_tree_map_busq(id_container_1, `${titleOperaSifc} 2025`, dataClientes.product["2025"], 'Operaciones', 'id_table_cliente_sifc', dataTableCLientes, mappingColumnTableClient);
                    graph_tree_map_busq(id_container_2, `${titleMontosSifc} 2025`, dataClientes.montos["2025"], 'Montos', 'id_table_cliente_sifc', dataTableCLientes, mappingColumnTableClient);
            
                    $('#id_table_cliente_sifc').DataTable().clear().destroy();
                    $('#id_table_cliente_sifc').empty();
                    $('#id_table_cliente_sifc').DataTable({
                        data: dataTableCLientes,
                        order: [[1, "desc"]],
                        columns: mappingColumnTableClient,
                        info: true,
                        lengthChange: true,
                        searching: true,
                        paging: true,
                        language: {
                            url: 'config/es-MX.json'
                        },
                        columnDefs: [
                            {
                                targets: [4,5,6], 
                                render: $.fn.dataTable.render.number(',', '.', 2, '$') 
                            }
                        ]
                    });
            
                    // Aplicar fade-in después de actualizar
                    elements.forEach(el => {
                        el.classList.remove('fade-out');
                        el.classList.add('fade-in');
                    });
            
                }, 350); // Espera 300ms para que el fade-out termine
            });
            
            
        })    
        .catch(error => {
            // Manejo de errores
            console.error('Error al obtener los datos:', error);
            });     
    }


    function initializeProductffonGeneral(){
        fetch('http://127.0.0.1:5050/api/data/productos/ffon/general')
        .then(response => response.json())
        .then(data => {
            const dataBarTrans = data.TableroGeneral.dataBar
            const mapeoCategories = data.TableroGeneral.dataBarMapeo
            const dataConceptTrans = data.TableroGeneral.dataConceptos.transacciones;
            const dataConceptMontoEntrada = data.TableroGeneral.dataConceptos.montosEntrada;
            const dataConceptMontoSalida = data.TableroGeneral.dataConceptos.montosSalida;
            const dataNewCustomers  = data.TableroGeneral.dataClientes.unicos
            const dataCustomersTrans  = data.TableroGeneral.dataClientes.transacciones

            console.log(mapeoCategories)
            createBarChartV2('barSystemFfon',null, null, dataBarTrans, mapeoCategories, 'Transacciones', 'transacciones')
            
            const dataSplinAnual = data.TableroGeneral.dataSplinAnual
            document.addEventListener("click", function(event){
                const target = event.target.closest('input[class="radio-button__input"]')
                if (!target) return; 
                let filtroBar = target.id

                if(filtroBar == 'sistema'){
                    createBarChartV2('barSystemFfon',null, null, dataBarTrans, mapeoCategories, 'Transacciones', 'transacciones')
                    //document.getElementById('labelTransacc').innerHTML = 'Mayor Transacciones'
                    //document.getElementById('indicaTransacc').innerHTML = `54,780,080`
                    //document.getElementById('changeTransac').className  = ''
                    //document.getElementById('changeTransac').innerHTML  = ''
                    //document.getElementById('comparTransac').innerHTML = `VENTAS EN DIRECTO (SVD)`
                    document.getElementById('id-kpi-ffon').innerHTML = ''
                    document.getElementById('id-kpi-ffon').innerHTML=`
                    <div class="divkpi">
                        <div style="margin-bottom: 5px;">
                            <svg xmlns="http://www.w3.org/2000/svg" width=24 height=24 viewBox="0 0 24 24">
                                <path fill="#898989" d="M2.75 17.75q-.325-.325-.325-.75t.325-.75l5.325-5.325q.575-.575 1.425-.575t1.425.575L13.5 13.5l6.4-7.225q.275-.325.713-.325t.737.3q.275.275.287.662t-.262.688L14.9 14.9q-.575.65-1.425.688T12 15l-2.5-2.5l-5.25 5.25q-.325.325-.75.325t-.75-.325"></path>
                            </svg>
                        </div>
                        <div class="label" id="labelTransacc">Sistema con mayor numero de transacciones</div>
                        <div class="main-number" id="indicaTransacc">54.7 M</div>
                        <div class="comparison">Por operación</div>
                        <div class="comparison" id="comparTransac">VENTAS EN DIRECTO (SVD)</div>
                    </div>
                            
                    <div class="divkpi">
                        <div style="display:flex; margin-bottom: 5px;  padding-right: 10px; flex-direction: row;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <path fill="#898989" d="M12.025 21q-.425 0-.712-.288T11.025 20v-1.15Q9.9 18.6 9.05 17.975t-1.375-1.75q-.175-.35-.012-.737t.587-.563q.35-.15.725.013t.575.537q.425.75 1.075 1.138t1.6.387q1.025 0 1.737-.462t.713-1.438q0-.875-.55-1.387t-2.55-1.163q-2.15-.675-2.95-1.612t-.8-2.288q0-1.625 1.05-2.525t2.15-1.025V4q0-.425.288-.713T12.025 3t.713.288t.287.712v1.1q.95.15 1.65.613t1.15 1.137q.225.325.088.725t-.563.575q-.35.15-.725.013t-.7-.488t-.763-.537t-1.087-.188q-1.1 0-1.675.488T9.825 8.65q0 .825.75 1.3t2.6 1q1.725.5 2.613 1.588t.887 2.512q0 1.775-1.05 2.7t-2.6 1.15V20q0 .425-.288.713t-.712.287" />
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#898989" d="M15 19v-2H8.41L20 5.41L18.59 4L7 15.59V9H5v10z"/></svg>
                        </div>
                        <div class="label">Sistema con mayores entrada de montos</div>
                        <div class="main-number">686 M</div>
                        <div class="comparison">Por operación</div>
                        <div class="comparison">MERCADO DE DINERO Y CAMBIOS (TAS)</div>
                    </div>
                            
                    <div class="divkpi">
                        <div style="display:flex; margin-bottom: 5px; padding-right: 10px; flex-direction: row;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <path fill="#898989" d="M12.025 21q-.425 0-.712-.288T11.025 20v-1.15Q9.9 18.6 9.05 17.975t-1.375-1.75q-.175-.35-.012-.737t.587-.563q.35-.15.725.013t.575.537q.425.75 1.075 1.138t1.6.387q1.025 0 1.737-.462t.713-1.438q0-.875-.55-1.387t-2.55-1.163q-2.15-.675-2.95-1.612t-.8-2.288q0-1.625 1.05-2.525t2.15-1.025V4q0-.425.288-.713T12.025 3t.713.288t.287.712v1.1q.95.15 1.65.613t1.15 1.137q.225.325.088.725t-.563.575q-.35.15-.725.013t-.7-.488t-.763-.537t-1.087-.188q-1.1 0-1.675.488T9.825 8.65q0 .825.75 1.3t2.6 1q1.725.5 2.613 1.588t.887 2.512q0 1.775-1.05 2.7t-2.6 1.15V20q0 .425-.288.713t-.712.287" />
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#898989" d="M9 5v2h6.59L4 18.59L5.41 20L17 8.41V15h2V5z"/></svg>
                        </div>
                        <div class="label">Sistema con mayores salida en montos</div>
                        <div class="main-number">555 M</div>
                        <div class="comparison">Por operación</div>
                        <div class="comparison">MERCADO DE DINERO Y CAMBIOS (TAS)</div>
                    </div>
                            
                    <div class="divkpi">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#898989" d="M12 12q-1.65 0-2.825-1.175T8 8t1.175-2.825T12 4t2.825 1.175T16 8t-1.175 2.825T12 12m-8 6v-.8q0-.85.438-1.562T5.6 14.55q1.55-.775 3.15-1.162T12 13t3.25.388t3.15 1.162q.725.375 1.163 1.088T20 17.2v.8q0 .825-.587 1.413T18 20H6q-.825 0-1.412-.587T4 18m2 0h12v-.8q0-.275-.137-.5t-.363-.35q-1.35-.675-2.725-1.012T12 15t-2.775.338T6.5 16.35q-.225.125-.363.35T6 17.2zm6-8q.825 0 1.413-.587T14 8t-.587-1.412T12 6t-1.412.588T10 8t.588 1.413T12 10m0 8"/></svg>
                        <div class="label">Sistema con mayor número de clientes</div>
                        <div class="main-number">2.3 M</div>
                        <div class="comparison">Activos</div>
                        <div class="comparison">VENTAS EN DIRECTO (SVD)</div>
                    </div>
                    `
                } else if (filtroBar == 'año') {
                    let transacciones = dataSplinAnual.map(item => [item[1]])
                    
                    let montosAnualEntrada = data.TableroGeneral.datMontoAño.map(item => [item[1]])
                    let montosAnualSalida = data.TableroGeneral.datMontoAño.map(item => [item[2]])
                    let clientesNuevos = data.TableroGeneral.dataClientes.unicos.map(item => [item[1]])
                    
                    function porcentajeDiferencia(lista) {
                        // Verifica que haya al menos 3 elementos
                        if (lista.length < 3) return null;
                      
                        const antepenultimo = lista[lista.length - 3];
                        const penultimo = lista[lista.length - 2];
                        // Evita división por cero
                        if (antepenultimo === 0) return null;
                      
                        const diferencia = ((penultimo - antepenultimo) / penultimo) * 100;
                        console.log(diferencia)
                        // Redondea a un decimal
                        return Math.round(diferencia * 10) / 10;
                      }
                    
                    function changeClass(valor, class1, class2) {
                        let classChange = '';
                        let infoChange = '';
                    
                        if (valor < 0) {
                            classChange = class1;
                            infoChange = `↓ ${valor}`;
                        } else if (valor > 0) {
                            classChange = class2;
                            infoChange = `↑ ${valor}`;
                        }
                    
                        return { classChange, infoChange };
                    }
                    
                    const kpiTranc = document.getElementById('changeTransac');
                    const difTrans = porcentajeDiferencia(transacciones)
                    

                    /*
                    <div class="divkpi">
                        <div style="margin-bottom: 5px;">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <path fill="#898989" d="M11.8 21q-1.05-.025-2.562-.238t-2.9-.687t-2.363-1.237T3 17v-2.5q0 .9.713 1.588t1.787 1.15t2.363.75t2.412.412q.225.725.613 1.388T11.8 21m-1.775-5.125q-1.125-.125-2.363-.413T5.389 14.7t-1.713-1.137T3 12V9.5q0 .95.788 1.65t1.95 1.188t2.525.75t2.487.362q-.3.55-.488 1.163t-.237 1.262M12 11q-3.725 0-6.363-1.175T3 7t2.638-2.825T12 3q3.75 0 6.375 1.175T21 7t-2.625 2.825T12 11m4.5 10q-1.875 0-3.187-1.312T12 16.5t1.313-3.187T16.5 12t3.188 1.313T21 16.5q0 .65-.187 1.25T20.3 18.9l2 2q.275.275.275.7t-.275.7t-.7.275t-.7-.275l-2-2q-.55.325-1.15.513T16.5 21m0-2q1.05 0 1.775-.725T19 16.5t-.725-1.775T16.5 14t-1.775.725T14 16.5t.725 1.775T16.5 19" />
                           </svg>
                        </div>
                        <div class="label">Sistemas por FFON</div>
                        <div class="main-number">13</div>
                      </div>
                      */
                    document.getElementById('id-kpi-ffon').innerHTML = `
                      <div class="divkpi">
                        <div style="margin-bottom: 5px;">
                            <svg xmlns="http://www.w3.org/2000/svg" width=24 height=24 viewBox="0 0 24 24">
                                <path fill="#898989" d="M2.75 17.75q-.325-.325-.325-.75t.325-.75l5.325-5.325q.575-.575 1.425-.575t1.425.575L13.5 13.5l6.4-7.225q.275-.325.713-.325t.737.3q.275.275.287.662t-.262.688L14.9 14.9q-.575.65-1.425.688T12 15l-2.5-2.5l-5.25 5.25q-.325.325-.75.325t-.75-.325"></path>
                            </svg>
                        </div>
                        <div class="label">Transacciones</div>
                        <div class="main-number">${formatLargeNumber(transacciones[transacciones.length - 2])}</div>
                        <div class="${changeClass(difTrans,'change negative', 'change positive').classChange}">${changeClass(difTrans,'change negative', 'change positive').infoChange}</div>
                        <div class="comparison" id="comparTransac">vs ${formatLargeNumber(transacciones[transacciones.length - 3])} el año anterior</div>
                      </div>

                      <div class="divkpi">
                        <div style="display:flex; margin-bottom: 5px;  padding-right: 10px; flex-direction: row;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <path fill="#898989" d="M12.025 21q-.425 0-.712-.288T11.025 20v-1.15Q9.9 18.6 9.05 17.975t-1.375-1.75q-.175-.35-.012-.737t.587-.563q.35-.15.725.013t.575.537q.425.75 1.075 1.138t1.6.387q1.025 0 1.737-.462t.713-1.438q0-.875-.55-1.387t-2.55-1.163q-2.15-.675-2.95-1.612t-.8-2.288q0-1.625 1.05-2.525t2.15-1.025V4q0-.425.288-.713T12.025 3t.713.288t.287.712v1.1q.95.15 1.65.613t1.15 1.137q.225.325.088.725t-.563.575q-.35.15-.725.013t-.7-.488t-.763-.537t-1.087-.188q-1.1 0-1.675.488T9.825 8.65q0 .825.75 1.3t2.6 1q1.725.5 2.613 1.588t.887 2.512q0 1.775-1.05 2.7t-2.6 1.15V20q0 .425-.288.713t-.712.287" />
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#898989" d="M15 19v-2H8.41L20 5.41L18.59 4L7 15.59V9H5v10z"/></svg>
                        </div>
                        <div class="label">Montos entrada por Operación</div>
                        <div class="main-number">${formatLargeNumber(montosAnualEntrada[montosAnualEntrada.length - 2])}</div>
                        <div class="${changeClass(porcentajeDiferencia(montosAnualEntrada),'change negative', 'change positive').classChange}">${changeClass(porcentajeDiferencia(montosAnualEntrada),'change negative', 'change positive').infoChange}</div>
                        <div class="comparison" id="comparTransac">vs ${formatLargeNumber(montosAnualEntrada[montosAnualEntrada.length - 3])} el año anterior</div>
                      </div>

                      <div class="divkpi">
                        <div style="display:flex; margin-bottom: 5px; padding-right: 10px; flex-direction: row;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <path fill="#898989" d="M12.025 21q-.425 0-.712-.288T11.025 20v-1.15Q9.9 18.6 9.05 17.975t-1.375-1.75q-.175-.35-.012-.737t.587-.563q.35-.15.725.013t.575.537q.425.75 1.075 1.138t1.6.387q1.025 0 1.737-.462t.713-1.438q0-.875-.55-1.387t-2.55-1.163q-2.15-.675-2.95-1.612t-.8-2.288q0-1.625 1.05-2.525t2.15-1.025V4q0-.425.288-.713T12.025 3t.713.288t.287.712v1.1q.95.15 1.65.613t1.15 1.137q.225.325.088.725t-.563.575q-.35.15-.725.013t-.7-.488t-.763-.537t-1.087-.188q-1.1 0-1.675.488T9.825 8.65q0 .825.75 1.3t2.6 1q1.725.5 2.613 1.588t.887 2.512q0 1.775-1.05 2.7t-2.6 1.15V20q0 .425-.288.713t-.712.287" />
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#898989" d="M9 5v2h6.59L4 18.59L5.41 20L17 8.41V15h2V5z"/></svg>
                        </div>
                        <div class="label">Montos salida por Operación</div>
                        <div class="main-number">${formatLargeNumber(montosAnualSalida[montosAnualSalida.length - 2])}</div>
                        <div class="${changeClass(porcentajeDiferencia(montosAnualSalida),'change negative', 'change positive').classChange}">${changeClass(porcentajeDiferencia(montosAnualSalida),'change negative', 'change positive').infoChange}</div>
                        <div class="comparison" id="comparTransac">vs ${formatLargeNumber(montosAnualSalida[montosAnualSalida.length - 3])} el año anterior</div>

                      </div>

                      <div class="divkpi">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#898989" d="M12 12q-1.65 0-2.825-1.175T8 8t1.175-2.825T12 4t2.825 1.175T16 8t-1.175 2.825T12 12m-8 6v-.8q0-.85.438-1.562T5.6 14.55q1.55-.775 3.15-1.162T12 13t3.25.388t3.15 1.162q.725.375 1.163 1.088T20 17.2v.8q0 .825-.587 1.413T18 20H6q-.825 0-1.412-.587T4 18m2 0h12v-.8q0-.275-.137-.5t-.363-.35q-1.35-.675-2.725-1.012T12 15t-2.775.338T6.5 16.35q-.225.125-.363.35T6 17.2zm6-8q.825 0 1.413-.587T14 8t-.587-1.412T12 6t-1.412.588T10 8t.588 1.413T12 10m0 8"/></svg>
                        <div class="label">Nuevos Clientes en FFON</div>
                        <div class="main-number">${formatLargeNumber(clientesNuevos[clientesNuevos.length - 2])}</div>
                        <div class="${changeClass(porcentajeDiferencia(clientesNuevos),'change negative', 'change positive').classChange}">${changeClass(porcentajeDiferencia(clientesNuevos),'change negative', 'change positive').infoChange}</div>
                        <div class="comparison" id="comparTransac">vs ${formatLargeNumber(clientesNuevos[clientesNuevos.length - 3])} el año anterior</div>
                      </div>
                    `;
                      
                    graph_spline_annual_general('barSystemFfon', dataSplinAnual, null, null, null, 'Transacciones');
                } else if (filtroBar == 'entrada') {
                    createChartPieV2('graph-pie-concept', 'Monto Entrada <br>', dataConceptMontoEntrada,'Monto Entrada: ')
                } else if (filtroBar == 'salida') {
                    createChartPieV2('graph-pie-concept', 'Monto Salida <br>', dataConceptMontoSalida,'Monto Salida: ')
                } else if (filtroBar == 'unicos'){
                    document.getElementById('title-customers').innerHTML = 'Distribución anual de clientes únicos';
                    document.getElementById('subtitle-customers').innerHTML = 'Numero de clientes históricos anual';
                    graph_spline_annual_general('graph-line-customers-ffon', dataNewCustomers, null, null, null, 'Nuevo Clientes')
                } else if (filtroBar == 'transacciones'){
                    document.getElementById('title-customers').innerHTML = 'Distribución anual de clientes con transacciones';
                    document.getElementById('subtitle-customers').innerHTML = 'Numero de clientes históricos anual';
                    graph_spline_annual_general('graph-line-customers-ffon', dataCustomersTrans, null, null, null, 'Clientes');
                }
                    
            });

            const dataAnualMonto = data.TableroGeneral.datMontoAño
            graph_spline_dual_series('splin_dual_monto', dataAnualMonto, null, null, null, ['Monto Entrada', 'Monto Salida'])
        

            createChartBarComplement('bar-complemet-concept', null, dataConceptTrans,'')
            createChartPieV2('graph-pie-concept', 'Monto Entrada <br>', dataConceptMontoEntrada,'Monto Entrada: ')

            document.getElementById("toggleRowsBtn").addEventListener("click", function () {
                const row1 = document.getElementById("row1");
                const row2 = document.getElementById("row2");
                const isHidden = row1.classList.contains("hidden");
            
                row1.classList.toggle("hidden");
                row2.classList.toggle("hidden");
            
                this.firstChild.textContent = isHidden ? "VER MENOS" : "VER DATOS MONTOS";
            });

            const dataTableMontosEntrada = data.TableroGeneral.dataTableMontos.montoEntrada
            let mappingColTabMonEntrada = [
                { data: 'año', title: 'AÑO', className: 'px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white' }, 
                { data: 'min', title: 'MÍNIMO' ,  className: 'px-4 py-3', }, 
                { data: 'mean', title: 'PROMEDIO', className: 'px-4 py-3', }, 
                { data: 'max', title: 'MÁXIMO', className: 'px-4 py-3', },
                { data: 'anual', title: 'ANUAL', className: 'px-4 py-3', },
                ]

            createTable("idMontoEntradaGeneral", dataTableMontosEntrada, mappingColTabMonEntrada, false, false, false)

            const dataTableMontosSalida = data.TableroGeneral.dataTableMontos.montoSalida
            let mappingColTabMonSalida = [
                { data: 'año', title: 'AÑO', className: 'px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white' }, 
                { data: 'min', title: 'MÍNIMO' ,  className: 'px-4 py-3', }, 
                { data: 'mean', title: 'PROMEDIO', className: 'px-4 py-3', }, 
                { data: 'max', title: 'MÁXIMO', className: 'px-4 py-3', },
                { data: 'anual', title: 'ANUAL', className: 'px-4 py-3', },
                ]

            createTable("idMontoSalidaGeneral", dataTableMontosSalida, mappingColTabMonSalida, false, false, false)

            
            graph_spline_annual_general('graph-line-customers-ffon', dataNewCustomers, null, null, null, 'Nuevo Clientes');
            
            let dataClientesSistema = data.TableroGeneral.dataClientes.sistema
            createChartBartV2('bar-customers', dataClientesSistema , null, null, null, '', 'Clientes')

            
        })
        .catch(error => console.error('Error:', error));
    }


    function initializeProductffonSystem(sistema){
        let name = sistema.split('-')[1];
        document.getElementById("subtitle-serie-ffon").innerHTML = `Flujo de operaciones anualmente de ${name.toUpperCase()} en FFON`;
        //document.getElementById("flujo-ffon-monto-system").innerHTML = `Montos anuales de ${name.toUpperCase()} en FFON`;
        //document.getElementById("tabla-ffon-monto-system").innerHTML = `Operaciones Anuales de ${name.toUpperCase()} en FFON`;
        document.getElementById("subtitle-ffon-concept-system").innerHTML = `Tendencia Histórica (${name.toUpperCase()}) Operaciones`
 
        fetch(`http://127.0.0.1:5050/api/data/productos/ffon/sistema?iDsistema=${name}`)
          .then(response => response.json())
          .then(data => {

                const transaccionesannual = data.transacciones.anual
                graph_spline_annual_general('chart-serie-ffon-system', transaccionesannual, null, null, null, 'Transacciones');
                const datamontosAnual = data.montos.anual
                const mapeoAnual = data.montos.añomap
                //createBarChartV2('grap_bar_monto_ffon_system',null, null, datamontosAnual, mapeoAnual, 'Montos', 'mx')
                const dataMontosEntSal = data.dataMontosEntSal
                createChartBartComparativa('grap_bar_monto_ffon_system', dataMontosEntSal, null, null, null, '', ['Monto Entrada', 'Monto Salida'], ['#1a57db', '#f4a875'], '')
                
                document.getElementById("toggleRowsBtn").addEventListener("click", function () {
                    const row1 = document.getElementById("row1");
                    const row2 = document.getElementById("row2");
                    const isHidden = row1.classList.contains("hidden");
                
                    row1.classList.toggle("hidden");
                    row2.classList.toggle("hidden");
                
                    this.firstChild.textContent = isHidden ? "VER MENOS" : "VER DATOS MONTOS";
                });

                const dataTableMontosAnual = data.dataTableMontos.anual
                const dataTableMontosSalida = data.dataTableMontosSalida.anual
                let mappingColTabMon = [
                    { data: 'año', title: 'Año', className: 'px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white' }, 
                    { data: 'min', title: 'Minino' ,  className: 'px-4 py-3', }, 
                    { data: 'mean', title: 'Promedio', className: 'px-4 py-3', }, 
                    { data: 'max', title: 'Máximo', className: 'px-4 py-3', },
                    { data: 'anual', title: 'Anual', className: 'px-4 py-3', },
                    ]

                createTable("idMontosFfonsystem", dataTableMontosAnual, mappingColTabMon, false, false, false)
                createTable('idMontoSalidaSystem', dataTableMontosSalida, mappingColTabMon, false, false, false)
                
                const dataTopConcep = data.conceptosTop
                const dataConceptMontoEntrada = data.conceptosTopMontosEntrada
                const dataConceptMontoSalida = data.conceptosTopMontosSalida

                document.addEventListener("click", function(event){
                    const target = event.target.closest('input[class="radio-button__input"]')
                    if (!target) return; 
                    let filtro = target.id  
                    if (filtro == 'entradaMonto'){ 
                        createChartPieV2('graph-pie-concept-system', 'Monto Entrada <br>', dataConceptMontoEntrada,'Monto Entrada: ')
                    } else if(filtro == 'salidaMonto'){
                        createChartPieV2('graph-pie-concept-system', 'Monto Salida <br>', dataConceptMontoSalida,'Monto Salida: ')
                    }
                        
                });

                //createBarVer('graph-3-conceptos', null, dataRaw, 'Porcentaje');
                createChartBarComplement('graph-3-conceptos', null, dataTopConcep,'Porcentaje')
                createChartPieV2('graph-pie-concept-system', 'Monto Entrada <br>', dataConceptMontoEntrada,'Monto Entrada: ')
                

                const dataTableClientes =  data.dataTableClientes
                //createTableV2({data: products, tableId: "my-custom-table", containerId: "my-table-container"});
                
                let mappingColTabClientes = [
                    { data: 'Cliente', title: 'Cliente', className: 'px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white' }, 
                    { data: 'Año', title: 'Año' ,  className: 'px-4 py-3',}, 
                    { data: 'Transacciones', title: 'Transacciones', className: 'px-4 py-3',}, 
                    { data: 'Monto Entrada Promedio', title: 'Monto Entrada Promedio', className: 'px-4 py-3',},
                    { data: 'Monto Entrada Anual', title: 'Monto Entrada Anual', className: 'px-4 py-3',},
                    { data: 'Monto Salida Promedio', title: 'Monto Salida Promedio', className: 'px-4 py-3',},
                    { data: 'Monto Salida Anual', title: 'Monto Salida Anual', className: 'px-4 py-3',},
                ]
    
                createTable("idTableCliente", dataTableClientes, mappingColTabClientes, true, true, true, true, true)

          })
        .catch(error => console.error('Error:', error));

        
        
    }
    
    function initializeProductMeca(){
        fetch('http://127.0.0.1:5050/api/data/productos/meca')
        .then(response => response.json())
        .then(data => {
            const dataNumOperaciones = data.num_transacciones
            const Operaciones =  dataNumOperaciones.map(item => item[1])
            const diferenciaOperaciones = porcentajeDiferencia(Operaciones)
            
            const dataMontosAnual = data.montos
            const montosAnual = dataMontosAnual.map(item => item[1])
            const diferenciaMontos = porcentajeDiferencia(montosAnual)

            const dataMontosAnualMensual = data.monto_mes
            
            const dataConceptos = data.conceptos
            const dataCompConceptos = data.conceptos_anuales
            const conceptosAnuales = dataCompConceptos.map(item => item[1])
            const diferenciaConceptos = porcentajeDiferencia(conceptosAnuales)
            
            const dataNumClientes =  data.clt_año
            const numeroClientes = dataNumClientes.map(item => item[1])
            const diferenciaClientes =  porcentajeDiferencia(numeroClientes)

            const dataclientesTransacciones = data.clientesTransacciones
            const dataclientesMontos = data.clientesMontos

            const dataBestClientTra =  data.dataBestClientTra
            const periodsT = Object.keys(dataBestClientTra).map(Number).sort((a, b) => b - a);

            const dataBestClientMonto = data.dataBestClientMon
            const periodsM = Object.keys(dataBestClientMonto).map(Number).sort((a, b) => b - a);

            
            const dataCLientes =  data.dataTableClientes

            document.getElementById('kpis-meca').innerHTML = `
                 <div class="card-meca"  id="">
                    <div style="margin-bottom: 5px;">
                        <svg xmlns="http://www.w3.org/2000/svg" width=24 height=24 viewBox="0 0 24 24">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#898989" d="m7.4 15.289l3.05-3.031l2 2l4.05-4.045V12.5h1v-4h-4v1h2.286l-3.336 3.337l-2-2L6.712 14.6zM5.616 20q-.691 0-1.153-.462T4 18.384V5.616q0-.691.463-1.153T5.616 4h12.769q.69 0 1.153.463T20 5.616v12.769q0 .69-.462 1.153T18.384 20zm0-1h12.769q.23 0 .423-.192t.192-.424V5.616q0-.231-.192-.424T18.384 5H5.616q-.231 0-.424.192T5 5.616v12.769q0 .23.192.423t.423.192M5 5v14z"/></svg>
                        </svg>
                    </div>
                    <div class="label" style ="font-weight:500" >Transacciones</div>
                    <div class="main-number">${formatLargeNumber(Operaciones[Operaciones.length - 2])}</div>
                    <div class="${changeClass(diferenciaOperaciones,'change negative', 'change positive').classChange}">${changeClass(diferenciaOperaciones,'change negative', 'change positive').infoChange}</div>
                    <div class="comparison"  style ="font-weight:400"">vs ${formatLargeNumber(Operaciones[Operaciones.length - 3])} el año anterior</div>
                </div>

                <div class="card-meca"  id="">
                    <div style="margin-bottom: 5px;">
                       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#898989" d="M12.003 21q-1.866 0-3.51-.708q-1.643-.709-2.859-1.924t-1.925-2.856T3 12.003t.709-3.51Q4.417 6.85 5.63 5.634t2.857-1.925T11.997 3t3.51.709q1.643.708 2.859 1.922t1.925 2.857t.709 3.509t-.708 3.51t-1.924 2.859t-2.856 1.925t-3.509.709M12 20q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m-.025-1.384q.196 0 .343-.148q.148-.147.148-.343v-.683q1.076-.09 2.063-.773q.987-.682.987-2.119q0-1.05-.639-1.79q-.638-.74-2.438-1.39q-1.654-.578-2.114-.991T9.865 9.2t.598-1.275t1.587-.51q.616 0 1.077.243t.789.638q.115.146.283.21t.323-.002q.212-.081.289-.276q.078-.195-.045-.36q-.4-.557-.998-.909q-.597-.351-1.252-.401v-.683q0-.196-.148-.343q-.147-.148-.343-.148t-.343.148t-.148.343v.683q-1.307.217-1.978.975T8.885 9.2q0 1.079.678 1.727t2.287 1.23q1.614.595 2.168 1.074t.555 1.319q0 1.056-.77 1.52q-.77.465-1.653.465q-.775 0-1.401-.4t-1.053-1.12q-.104-.176-.294-.234t-.36.012q-.181.069-.265.263t.008.365q.438.831 1.113 1.301t1.587.67v.733q0 .196.147.343t.343.148"/></svg>
                    </div>
                    <div class="label" style ="font-weight:500">Montos Anuales</div>
                    <div class="main-number">${formatLargeNumber(montosAnual[montosAnual.length - 2])}</div>
                    <div class="${changeClass(diferenciaMontos,'change negative', 'change positive').classChange}">${changeClass(diferenciaMontos,'change negative', 'change positive').infoChange}</div>
                    <div class="comparison"  style ="font-weight:400"">vs ${formatLargeNumber(montosAnual[montosAnual.length - 3])} el año anterior</div>

                </div>
                <div class="card-meca"  id="">
                    <div style="margin-bottom: 5px;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#898989" d="M3.616 20.192q-.691 0-1.153-.462T2 18.577V9.423h1v9.154q0 .23.192.423t.423.192H18.5v1zm3-3q-.691 0-1.153-.462T5 15.577V6.192h5.308V4.615q0-.69.462-1.152T11.923 3h3.154q.69 0 1.153.463t.462 1.152v1.577H22v9.385q0 .69-.462 1.153t-1.153.462zm0-1h13.769q.23 0 .423-.192t.192-.423V7.192H6v8.385q0 .23.192.423t.423.192m4.693-10h4.384V4.615q0-.23-.192-.423T15.077 4h-3.154q-.23 0-.423.192t-.192.423zM6 16.192v-9z"/></svg>
                    </div>
                    <div class="label" style ="font-weight:500">Tipo de Movimiento</div>
                    <div class="main-number">${formatLargeNumber(conceptosAnuales[conceptosAnuales.length - 2])}</div>
                    <div class="${changeClass(diferenciaConceptos,'change negative', 'change positive').classChange}">${changeClass(diferenciaConceptos,'change negative', 'change positive').infoChange}</div>
                    <div class="comparison"  style ="font-weight:400"">vs ${formatLargeNumber(conceptosAnuales[conceptosAnuales.length - 3])} el año anterior</div>
                </div>
                
                <div class="card-meca"  id="">
                    <div style="margin-bottom: 5px;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"><path fill="#898989" d="M12 11.385q-1.237 0-2.119-.882T9 8.385t.881-2.12T12 5.386t2.119.88t.881 2.12t-.881 2.118t-2.119.882m-7 7.23V16.97q0-.619.36-1.158q.361-.54.97-.838q1.416-.679 2.834-1.018q1.417-.34 2.836-.34t2.837.34t2.832 1.018q.61.298.97.838q.361.539.361 1.158v1.646zm1-1h12v-.646q0-.332-.215-.625q-.214-.292-.593-.494q-1.234-.598-2.546-.916T12 14.616t-2.646.318t-2.546.916q-.38.202-.593.494Q6 16.637 6 16.97zm6-7.23q.825 0 1.413-.588T14 8.384t-.587-1.412T12 6.384t-1.412.588T10 8.384t.588 1.413t1.412.587m0 7.232"/></svg>
                    </div>
                    <div class="label" style ="font-weight:500">Clientes con Transacciones</div>
                    <div class="main-number">${formatLargeNumber(numeroClientes[numeroClientes.length - 2])}/245</div>
                    <div class="${changeClass(diferenciaClientes,'change negative', 'change positive').classChange}">${changeClass(diferenciaClientes,'change negative', 'change positive').infoChange}</div>
                    <div class="comparison"  style ="font-weight:400"">vs ${formatLargeNumber(numeroClientes[numeroClientes.length - 3])} el año anterior</div>
                </div>
                `;

            graph_spline_annual_general('operation-meca', dataNumOperaciones, null, null, null, 'Transacciones');

            graph_spline_annual_general('bar-monto-meca', dataMontosAnual, null, null, null, 'Montos Anuales');

            create_headmap('headMap-monto-meca', dataMontosAnualMensual, null)
            
            createSplinV22('comportamiento-mov-meca', dataCompConceptos, null, null, null, ' productos', 'Productos' )
            createChartBarComplemenGeneral('tipo-mov-meca', null, dataConceptos, null, ["#1E5DFF","#6090fa", "#93b4fd", "#bfd3fe", "#dbe6fe", "#eff4ff"]);

            createSplinV22('client-crecimiento-meca', dataNumClientes, null, null, null, ' clientes', 'Clientes')
            graph_scatter_logscale('cliet-trans-meca', dataclientesTransacciones, null, null, "Transacciones");
            graph_scatter_logscale('cliet-monto-meca', dataclientesMontos, null, null, "Montos",'#0072ff');


            function createItemClientTrans(cliente) {
                if (cliente.transacciones >= 0) {
                    const transCount = parseInt(cliente.transacciones, 10);
                    const transText = transCount === 1 ? 'transacción' : 'transacciones';
                  return `
                    <li class="flex items-center justify-between border-b pb-2 last:border-b-0">
                      <div class="flex items-center space-x-4">
                        <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                          <svg class="w-6 h-6 text-[#0080ff] hover:text-[#005bb5] transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/>
                          </svg>
                        </div>
                        <div>
                          <p class="text-base font-semibold text-gray-800">${cliente.name}</p>
                          <p class="text-sm text-gray-500 uppercase tracking-wide font-medium">${cliente.clave}</p>
                        </div>
                      </div>
                      <div class="text-right">
                        <p class="text-sm text-[#1d58d8] font-medium">${cliente.transacciones} ${transText} en el año</p>
                        <p class="text-sm text-gray-600 font-medium">$${cliente.monto} por transacción</p>
                      </div>
                    </li>`;
                }
            }

            createComponentBest('best-clients-transation-meca', dataBestClientTra, periodsT, createItemClientTrans)

            function createItemClientMonto(cliente) {
                const transCount = parseInt(cliente.transacciones, 10);
                const transText = transCount === 1 ? 'transacción' : 'transacciones';
              return `
                <li class="flex items-center justify-between border-b pb-2 last:border-b-0">
                  <div class="flex items-center space-x-4">
                    <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      <svg class="w-6 h-6 text-[#0080ff] hover:text-[#005bb5] transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/>
                      </svg>
                    </div>
                    <div>
                      <p class="text-base font-semibold text-gray-800">${cliente.name}</p>
                      <p class="text-sm text-gray-500 uppercase tracking-wide font-medium">${cliente.clave}</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="text-sm text-[#1d58d8] font-medium">$${cliente.monto} por transacción en el año</p>
                    <p class="text-sm text-gray-600  font-medium">${cliente.transacciones} ${transText}</p>
                  </div>
                </li>
              `;
            }
          
            createComponentBest('best-clients-monto-meca', dataBestClientMonto, periodsM, createItemClientMonto)


            let mappingColTabClientes = [
                { data: 'CLAVE', title: 'Clave', className: 'px-4 py-3',},
                { data: 'AÑO_FOPE', title: 'Año' ,  className: 'px-4 py-3',}, 
                { data: 'NOMBRE', title: 'Cliente', className: 'px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white' }, 
                { data: 'transacciones', title: 'Transacciones', className: 'px-4 py-3',}, 
                { data: 'num_productos', title: 'Productos', className: 'px-4 py-3',},
                { data: 'monto', title: 'Monto Prom', className: 'px-4 py-3',},
            ]

            createTable("id-tab-client-meca", dataCLientes, mappingColTabClientes, true, true, true, true, true)
        })
        .catch(error => console.error('Error:', error));
    }

    function initializeProductSims(){
        fetch('http://127.0.0.1:5050/api/data/productos/sims')
        .then(response => response.json())
        .then(data => {
            const dataNumOperaciones = data.num_transacciones
            const Operaciones =  dataNumOperaciones.map(item => item[1])
            const diferenciaOperaciones = porcentajeDiferencia(Operaciones)

            const dataMontosAnual = data.montos
            const montosAnual = dataMontosAnual.map(item => item[1])
            const diferenciaMontos = porcentajeDiferencia(montosAnual)
            
            const dataMontosAnualMensual = data.monto_mes
            const dataMinMeanMAx = data.plazo_min_max

            const dataConceptos = data.conceptos
            const dataCompConceptos = data.conceptos_anuales

            const conceptosAnuales = dataCompConceptos.map(item => item[1])
            const diferenciaConceptos = porcentajeDiferencia(conceptosAnuales)
            
            const dataNumClientes =  data.clt_año
            const numeroClientes = dataNumClientes.map(item => item[1])
            const diferenciaClientes =  porcentajeDiferencia(numeroClientes)

            
            const dataBestClientTra =  data.dataBestClientTra
            const periodsT = Object.keys(dataBestClientTra).map(Number).sort((a, b) => b - a);
            
            const dataBestClientMonto = data.dataBestClientMon
            const periodsM = Object.keys(dataBestClientMonto).map(Number).sort((a, b) => b - a);

            const dataCLientes =  data.dataTableClientes

            const dataclientesTransacciones = data.clientesTransacciones
            const dataclientesMontos = data.clientesMontos

            document.getElementById('kpis-sims').innerHTML = `
                 <div class="card-meca"  id="">
                    <div style="margin-bottom: 5px;">
                        <svg xmlns="http://www.w3.org/2000/svg" width=24 height=24 viewBox="0 0 24 24">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#898989" d="m7.4 15.289l3.05-3.031l2 2l4.05-4.045V12.5h1v-4h-4v1h2.286l-3.336 3.337l-2-2L6.712 14.6zM5.616 20q-.691 0-1.153-.462T4 18.384V5.616q0-.691.463-1.153T5.616 4h12.769q.69 0 1.153.463T20 5.616v12.769q0 .69-.462 1.153T18.384 20zm0-1h12.769q.23 0 .423-.192t.192-.424V5.616q0-.231-.192-.424T18.384 5H5.616q-.231 0-.424.192T5 5.616v12.769q0 .23.192.423t.423.192M5 5v14z"/></svg>
                        </svg>
                    </div>
                    <div class="label" style ="font-weight:500" >Transacciones</div>
                    <div class="main-number">${formatLargeNumber(Operaciones[Operaciones.length - 2])}</div>
                    <div class="${changeClass(diferenciaOperaciones,'change negative', 'change positive').classChange}">${changeClass(diferenciaOperaciones,'change negative', 'change positive').infoChange}</div>
                    <div class="comparison"  style ="font-weight:400"">vs ${formatLargeNumber(Operaciones[Operaciones.length - 3])} el año anterior</div>
                </div>

                <div class="card-meca"  id="">
                    <div style="margin-bottom: 5px;">
                       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#898989" d="M12.003 21q-1.866 0-3.51-.708q-1.643-.709-2.859-1.924t-1.925-2.856T3 12.003t.709-3.51Q4.417 6.85 5.63 5.634t2.857-1.925T11.997 3t3.51.709q1.643.708 2.859 1.922t1.925 2.857t.709 3.509t-.708 3.51t-1.924 2.859t-2.856 1.925t-3.509.709M12 20q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m-.025-1.384q.196 0 .343-.148q.148-.147.148-.343v-.683q1.076-.09 2.063-.773q.987-.682.987-2.119q0-1.05-.639-1.79q-.638-.74-2.438-1.39q-1.654-.578-2.114-.991T9.865 9.2t.598-1.275t1.587-.51q.616 0 1.077.243t.789.638q.115.146.283.21t.323-.002q.212-.081.289-.276q.078-.195-.045-.36q-.4-.557-.998-.909q-.597-.351-1.252-.401v-.683q0-.196-.148-.343q-.147-.148-.343-.148t-.343.148t-.148.343v.683q-1.307.217-1.978.975T8.885 9.2q0 1.079.678 1.727t2.287 1.23q1.614.595 2.168 1.074t.555 1.319q0 1.056-.77 1.52q-.77.465-1.653.465q-.775 0-1.401-.4t-1.053-1.12q-.104-.176-.294-.234t-.36.012q-.181.069-.265.263t.008.365q.438.831 1.113 1.301t1.587.67v.733q0 .196.147.343t.343.148"/></svg>
                    </div>
                    <div class="label" style ="font-weight:500">Montos Anuales</div>
                    <div class="main-number">${formatLargeNumber(montosAnual[montosAnual.length - 2])}</div>
                    <div class="${changeClass(diferenciaMontos,'change negative', 'change positive').classChange}">${changeClass(diferenciaMontos,'change negative', 'change positive').infoChange}</div>
                    <div class="comparison"  style ="font-weight:400"">vs ${formatLargeNumber(montosAnual[montosAnual.length - 3])} el año anterior</div>
                </div>

                <div class="card-meca"  id="">
                    <div style="margin-bottom: 5px;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#898989" d="M3.616 20.192q-.691 0-1.153-.462T2 18.577V9.423h1v9.154q0 .23.192.423t.423.192H18.5v1zm3-3q-.691 0-1.153-.462T5 15.577V6.192h5.308V4.615q0-.69.462-1.152T11.923 3h3.154q.69 0 1.153.463t.462 1.152v1.577H22v9.385q0 .69-.462 1.153t-1.153.462zm0-1h13.769q.23 0 .423-.192t.192-.423V7.192H6v8.385q0 .23.192.423t.423.192m4.693-10h4.384V4.615q0-.23-.192-.423T15.077 4h-3.154q-.23 0-.423.192t-.192.423zM6 16.192v-9z"/></svg>
                    </div>
                    <div class="label" style ="font-weight:500">Productos Anuales</div>
                    <div class="main-number">${formatLargeNumber(conceptosAnuales[conceptosAnuales.length - 2])}</div>
                    <div class="${changeClass(diferenciaConceptos,'change negative', 'change positive').classChange}">${changeClass(diferenciaConceptos,'change negative', 'change positive').infoChange}</div>
                    <div class="comparison"  style ="font-weight:400"">vs ${formatLargeNumber(conceptosAnuales[conceptosAnuales.length - 3])} el año anterior</div>

                </div>
                
                <div class="card-meca"  id="">
                    <div style="margin-bottom: 5px;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"><path fill="#898989" d="M12 11.385q-1.237 0-2.119-.882T9 8.385t.881-2.12T12 5.386t2.119.88t.881 2.12t-.881 2.118t-2.119.882m-7 7.23V16.97q0-.619.36-1.158q.361-.54.97-.838q1.416-.679 2.834-1.018q1.417-.34 2.836-.34t2.837.34t2.832 1.018q.61.298.97.838q.361.539.361 1.158v1.646zm1-1h12v-.646q0-.332-.215-.625q-.214-.292-.593-.494q-1.234-.598-2.546-.916T12 14.616t-2.646.318t-2.546.916q-.38.202-.593.494Q6 16.637 6 16.97zm6-7.23q.825 0 1.413-.588T14 8.384t-.587-1.412T12 6.384t-1.412.588T10 8.384t.588 1.413t1.412.587m0 7.232"/></svg>
                    </div>
                    <div class="label" style ="font-weight:500">Clientes con Transacciones</div>
                    <div class="main-number">${formatLargeNumber(numeroClientes[numeroClientes.length - 2])}/77</div>
                    <div class="${changeClass(diferenciaClientes,'change negative', 'change positive').classChange}">${changeClass(diferenciaClientes,'change negative', 'change positive').infoChange}</div>
                    <div class="comparison"  style ="font-weight:400"">vs ${formatLargeNumber(numeroClientes[numeroClientes.length - 3])} el año anterior</div>
                </div>
                `;

            graph_spline_annual_general('operation-sims', dataNumOperaciones, null, null, null, 'Transacciones');
            graph_spline_annual_general('bar-monto-sims', dataMontosAnual, null, null, null, 'Montos Anuales');
            
            create_headmap('headMap-monto-sims', dataMontosAnualMensual, null)

            createGraphMaxMinV2Sync('plazo-max-min-max', 'plazo-mean', dataMinMeanMAx, null, null, null)

            createSplinV22('comportamiento-mov-sims', dataCompConceptos, null, null, null, ' productos', 'Productos')
            createChartBarComplemenGeneral('tipo-mov-sims', null, dataConceptos, null, ["#1E5DFF","#6090fa", "#93b4fd", "#bfd3fe", "#dbe6fe", "#eff4ff"]);

            createSplinV22('client-crecimiento-sims', dataNumClientes, null, null, null, ' clientes', 'Clientes')
            graph_scatter_logscale('cliet-trans-sims', dataclientesTransacciones, null, null, "Transacciones");
            graph_scatter_logscale('cliet-monto-sims', dataclientesMontos, null, null, "Montos",'#0072ff');
            
            /* == Creacion dropdown == */
            document.getElementById('container-my-dropdown-ftrans-sims').innerHTML = createDropdown('id-dropwdown-ftrans-sims', 2024, [2022, 2023, 2024, 2025], 'auto');
            
            inicializarDropdown('id-dropwdown-ftrans-sims', 2024, (selectedYear) => {
                console.log('Selected year:', selectedYear);
              }, 'left');

            document.getElementById('container-my-dropdown-fmonto-sims').innerHTML = createDropdown('id-dropwdown-fmonto-sims', 2024, [2022, 2023, 2024, 2025], 'auto');
        
            inicializarDropdown('id-dropwdown-fmonto-sims', 2024, (selectedYear) => {
                console.log('Selected year:', selectedYear);
              }, 'left');
            /* == Fin de creacion dropdown == */    

            function createBestAgentsComponent(containerId, data, periods) {
                const container = document.getElementById(containerId);
                let currentPeriod = periods[0];
              
                function renderComponent() {
                  const agentsData = data[currentPeriod] || [];
                  // style="background:#0080ff;
                  container.innerHTML = `
                    <div class="w-full h-auto pt-0 pl-8 pr-8 rounded-lg"> 
                      <div class="flex justify-end items-start text-m text-gray-500 mb-8">
                        ${createDropdown(containerId, currentPeriod, periods)}
                      </div>

                      <ul class="space-y-4">
                        ${agentsData.map(agent => createAgentItem(agent)).join('')}
                      </ul>

                      <div class="flex justify-between items-center mt-4 text-sm text-gray-500">
                        <a href="#" class="text-blue-600 hover:underline font-medium">Detalle</a>
                      </div>
                    </div>
                  `;
              
                  setupDropdownBehavior(containerId, currentPeriod, (newPeriod) => {
                    currentPeriod = newPeriod;
                    renderComponent();
                  });
                }
              
                function createAgentItem(agent) {
                    if (agent.transacciones >= 0) {
                        const transCount = parseInt(agent.transacciones, 10);
                        const transText = transCount === 1 ? 'transacción' : 'transacciones';
                      return `
                        <li class="flex items-center justify-between border-b pb-2 last:border-b-0">
                          <div class="flex items-center space-x-4">
                            <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                              <svg class="w-6 h-6 text-[#0080ff] hover:text-[#005bb5] transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/>
                              </svg>
                            </div>
                            <div>
                              <p class="text-base font-semibold text-gray-800">${agent.name}</p>
                              <p class="text-sm text-gray-500 uppercase tracking-wide font-medium">${agent.clave}</p>
                            </div>
                          </div>
                          <div class="text-right">
                            <p class="text-sm text-[#1d58d8] font-medium">${agent.transacciones} ${transText} en el año</p>
                            <p class="text-sm text-gray-600 font-medium">$${agent.monto} por transacción</p>
                          </div>
                        </li>`;
                    }
                  }
                  
              
                // === Dropdown Functions ===
                function createDropdown(containerId, selected, options) {
                    return `
                      <div class="relative inline-block text-left">
                        <div id="${containerId}-dropdown-btn"
                          class="flex items-center space-x-1 text-gray-700 hover:text-blue-600 cursor-pointer select-none font-medium text-sm">
                          <span> En el año ${selected}</span>
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path>
                          </svg>
                        </div>
                        <div id="${containerId}-dropdown-menu"
                          class="absolute hidden bg-white shadow-xl rounded-lg py-2 w-32 text-gray-700 text-sm font-medium z-20 transition-all duration-200 transform opacity-0 scale-95 
                          max-h-60 overflow-y-auto"> <!-- AQUI AGREGAS overflow -->
                          ${options.map(option => `
                            <div class="px-4 py-2 hover:bg-blue-100 cursor-pointer ${option === selected ? 'text-blue-600 font-semibold' : ''}" data-value="${option}">
                              ${option}
                            </div>`).join('')}
                        </div>
                      </div>
                    `;
                  }
                  
                function setupDropdownBehavior(containerId, currentSelected, onSelectCallback) {
                  const btn = document.getElementById(`${containerId}-dropdown-btn`);
                  const menu = document.getElementById(`${containerId}-dropdown-menu`);
              
                  btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    toggleDropdownPosition(menu, btn);
                    toggleDropdownVisibility(menu);
                  });
              
                  document.addEventListener('click', () => {
                    hideDropdown(menu);
                  });
              
                  menu.querySelectorAll('[data-value]').forEach(option => {
                    option.addEventListener('click', (e) => {
                      const selectedValue = e.target.getAttribute('data-value');
                      onSelectCallback(selectedValue);
                      hideDropdown(menu);
                    });
                  });
                }
              
                function toggleDropdownVisibility(menu) {
                  if (menu.classList.contains('hidden')) {
                    menu.classList.remove('hidden');
                    requestAnimationFrame(() => {
                      menu.classList.remove('opacity-0', 'scale-95');
                      menu.classList.add('opacity-100', 'scale-100');
                    });
                  } else {
                    hideDropdown(menu);
                  }
                }
              
                function hideDropdown(menu) {
                  menu.classList.add('opacity-0', 'scale-95');
                  menu.classList.remove('opacity-100', 'scale-100');
                  setTimeout(() => {
                    menu.classList.add('hidden');
                  }, 200);
                }
              
                function toggleDropdownPosition(menu, btn) {
                  const rect = btn.getBoundingClientRect();
                  const viewportHeight = window.innerHeight;
                  const spaceBelow = viewportHeight - rect.bottom;
                  const menuHeight = menu.scrollHeight || 150;
              
                  menu.style.top = '';
                  menu.style.bottom = '';
              
                  if (spaceBelow < menuHeight + 10) {
                    menu.style.bottom = `${btn.offsetHeight}px`;
                  } else {
                    menu.style.top = `${btn.offsetHeight}px`;
                  }
                }
              
                // Inicializa el componente
                renderComponent();
              }

            createBestAgentsComponent("best-clients-transation", dataBestClientTra, periodsT);
            
            function createBestClientsMonto(containerId, data, periods) {
                const container = document.getElementById(containerId);
                let currentPeriod = periods[0];
              
                function renderComponent() {
                  const agentsData = data[currentPeriod] || [];
                  // style="background:#0080ff;
                  container.innerHTML = `
                    <div class="w-full h-auto pt-0 pl-8 pr-8 rounded-lg"> 
                      
                      <div class="flex justify-end items-start text-m text-gray-500 mb-8">
                        ${createDropdown(containerId, currentPeriod, periods)}
                      </div>

                       <ul class="space-y-4">
                       ${agentsData.map(agent => createAgentItem(agent)).join('')}
                       </ul>

                      
                      <div class="flex justify-between items-center mt-4 text-sm text-gray-500">
                        <a href="#" class="text-blue-600 hover:underline font-medium">Detalle</a>
                      </div>
                    
                    </div>
                  `;
              
                  setupDropdownBehavior(containerId, currentPeriod, (newPeriod) => {
                    currentPeriod = newPeriod;
                    renderComponent();
                  });
                }
              
                function createAgentItem(agent) {
                    const transCount = parseInt(agent.transacciones, 10);
                    const transText = transCount === 1 ? 'transacción' : 'transacciones';
                  return `
                    <li class="flex items-center justify-between border-b pb-2 last:border-b-0">
                      <div class="flex items-center space-x-4">
                        <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                          <svg class="w-6 h-6 text-[#0080ff] hover:text-[#005bb5] transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/>
                          </svg>
                        </div>
                        <div>
                          <p class="text-base font-semibold text-gray-800">${agent.name}</p>
                          <p class="text-sm text-gray-500 uppercase tracking-wide font-medium">${agent.clave}</p>
                        </div>
                      </div>
                      <div class="text-right">
                        <p class="text-sm text-[#1d58d8] font-medium">$${agent.monto} por transacción en el año</p>
                        <p class="text-sm text-gray-600  font-medium">${agent.transacciones} ${transText}</p>
                      </div>
                    </li>
                  `;
                }
              
                // === Dropdown Functions ===
                function createDropdown(containerId, selected, options) {
                    return `
                      <div class="relative inline-block text-left">
                        <div id="${containerId}-dropdown-btn"
                          class="flex items-center space-x-1 text-gray-700 hover:text-blue-600 cursor-pointer select-none font-medium text-sm">
                          <span> En el año ${selected}</span>
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path>
                          </svg>
                        </div>
                        <div id="${containerId}-dropdown-menu"
                          class="absolute hidden bg-white shadow-xl rounded-lg py-2 w-32 text-gray-700 text-sm font-medium z-20 transition-all duration-200 transform opacity-0 scale-95 
                          max-h-60 overflow-y-auto"> <!-- AQUI AGREGAS overflow -->
                          ${options.map(option => `
                            <div class="px-4 py-2 hover:bg-blue-100 cursor-pointer ${option === selected ? 'text-blue-600 font-semibold' : ''}" data-value="${option}">
                              ${option}
                            </div>`).join('')}
                        </div>
                      </div>
                    `;
                  }
              
                function setupDropdownBehavior(containerId, currentSelected, onSelectCallback) {
                  const btn = document.getElementById(`${containerId}-dropdown-btn`);
                  const menu = document.getElementById(`${containerId}-dropdown-menu`);
              
                  btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    toggleDropdownPosition(menu, btn);
                    toggleDropdownVisibility(menu);
                  });
              
                  document.addEventListener('click', () => {
                    hideDropdown(menu);
                  });
              
                  menu.querySelectorAll('[data-value]').forEach(option => {
                    option.addEventListener('click', (e) => {
                      const selectedValue = e.target.getAttribute('data-value');
                      onSelectCallback(selectedValue);
                      hideDropdown(menu);
                    });
                  });
                }
              
                function toggleDropdownVisibility(menu) {
                  if (menu.classList.contains('hidden')) {
                    menu.classList.remove('hidden');
                    requestAnimationFrame(() => {
                      menu.classList.remove('opacity-0', 'scale-95');
                      menu.classList.add('opacity-100', 'scale-100');
                    });
                  } else {
                    hideDropdown(menu);
                  }
                }
              
                function hideDropdown(menu) {
                  menu.classList.add('opacity-0', 'scale-95');
                  menu.classList.remove('opacity-100', 'scale-100');
                  setTimeout(() => {
                    menu.classList.add('hidden');
                  }, 200);
                }
              
                function toggleDropdownPosition(menu, btn) {
                  const rect = btn.getBoundingClientRect();
                  const viewportHeight = window.innerHeight;
                  const spaceBelow = viewportHeight - rect.bottom;
                  const menuHeight = menu.scrollHeight || 150;
              
                  menu.style.top = '';
                  menu.style.bottom = '';
              
                  if (spaceBelow < menuHeight + 10) {
                    menu.style.bottom = `${btn.offsetHeight}px`;
                  } else {
                    menu.style.top = `${btn.offsetHeight}px`;
                  }
                }
              
                // Inicializa el componente
                renderComponent();
              }
            

            createBestClientsMonto("best-clients-monto", dataBestClientMonto, periodsM);

            let mappingColTabClientes = [
                { data: 'NOMBRE', title: 'Cliente', className: 'px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white' }, 
                { data: 'AÑO_FOPE', title: 'Año' ,  className: 'px-4 py-3',}, 
                { data: 'transacciones', title: 'Transacciones', className: 'px-4 py-3',}, 
                { data: 'num_productos', title: 'Productos', className: 'px-4 py-3',},
                { data: 'monto', title: 'Monto', className: 'px-4 py-3',},
                { data: 'plazo_promedio', title: 'Plazo', className: 'px-4 py-3',},
                { data: 'tasa_prom', title: 'Tasa', className: 'px-4 py-3',},
            ]

            createTable("id-tab-client-sims", dataCLientes, mappingColTabClientes, true, true, true, true, true)
        })
        .catch(error => console.error('Error:', error));
    }

    function initializeProductSoi(){
        fetch('http://127.0.0.1:5050/api/data/productos/soi')
        .then(response => response.json())
        .then(data => {
            const dataNumOperaciones = data.num_transacciones
            const Operaciones =  dataNumOperaciones.map(item => item[1])
            const diferenciaOperaciones = porcentajeDiferencia(Operaciones)

            const dataMontosAnual = data.montos
            const montosAnual = dataMontosAnual.map(item => item[1])

            const diferenciaMontos = porcentajeDiferencia(montosAnual)
            const dataMontosAnualMensual = data.monto_mes

            const dataConceptos = data.conceptos
            const dataCompConceptos = data.conceptos_anuales

            const conceptosAnuales = dataCompConceptos.map(item => item[1])
            const diferenciaConceptos = porcentajeDiferencia(conceptosAnuales)
            
            const dataNumClientes =  data.clt_año
            const numeroClientes = dataNumClientes.map(item => item[1])
            const diferenciaClientes =  porcentajeDiferencia(numeroClientes)

            const dataBestClientTra =  data.dataBestClientTra
            const periodsT = Object.keys(dataBestClientTra).map(Number).sort((a, b) => b - a);
            
            const dataBestClientMonto = data.dataBestClientMon
            const periodsM = Object.keys(dataBestClientMonto).map(Number).sort((a, b) => b - a);

            const dataCLientes = data.dataTableClientes
            
            const dataclientesTransacciones = data.clientesTransacciones
            const dataclientesMontos = data.clientesMontos

            document.getElementById('kpis-soi').innerHTML = `
                 <div class="card-meca"  id="">
                    <div style="margin-bottom: 5px;">
                        <svg xmlns="http://www.w3.org/2000/svg" width=24 height=24 viewBox="0 0 24 24">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#898989" d="m7.4 15.289l3.05-3.031l2 2l4.05-4.045V12.5h1v-4h-4v1h2.286l-3.336 3.337l-2-2L6.712 14.6zM5.616 20q-.691 0-1.153-.462T4 18.384V5.616q0-.691.463-1.153T5.616 4h12.769q.69 0 1.153.463T20 5.616v12.769q0 .69-.462 1.153T18.384 20zm0-1h12.769q.23 0 .423-.192t.192-.424V5.616q0-.231-.192-.424T18.384 5H5.616q-.231 0-.424.192T5 5.616v12.769q0 .23.192.423t.423.192M5 5v14z"/></svg>
                        </svg>
                    </div>
                    <div class="label" style ="font-weight:500" >Transacciones</div>
                    <div class="main-number">${formatLargeNumber(Operaciones[Operaciones.length - 2])}</div>
                    <div class="${changeClass(diferenciaOperaciones,'change negative', 'change positive').classChange}">${changeClass(diferenciaOperaciones,'change negative', 'change positive').infoChange}</div>
                    <div class="comparison"  style ="font-weight:400"">vs ${formatLargeNumber(Operaciones[Operaciones.length - 3])} el año anterior</div>
                </div>

                <div class="card-meca"  id="">
                    <div style="margin-bottom: 5px;">
                       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#898989" d="M12.003 21q-1.866 0-3.51-.708q-1.643-.709-2.859-1.924t-1.925-2.856T3 12.003t.709-3.51Q4.417 6.85 5.63 5.634t2.857-1.925T11.997 3t3.51.709q1.643.708 2.859 1.922t1.925 2.857t.709 3.509t-.708 3.51t-1.924 2.859t-2.856 1.925t-3.509.709M12 20q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m-.025-1.384q.196 0 .343-.148q.148-.147.148-.343v-.683q1.076-.09 2.063-.773q.987-.682.987-2.119q0-1.05-.639-1.79q-.638-.74-2.438-1.39q-1.654-.578-2.114-.991T9.865 9.2t.598-1.275t1.587-.51q.616 0 1.077.243t.789.638q.115.146.283.21t.323-.002q.212-.081.289-.276q.078-.195-.045-.36q-.4-.557-.998-.909q-.597-.351-1.252-.401v-.683q0-.196-.148-.343q-.147-.148-.343-.148t-.343.148t-.148.343v.683q-1.307.217-1.978.975T8.885 9.2q0 1.079.678 1.727t2.287 1.23q1.614.595 2.168 1.074t.555 1.319q0 1.056-.77 1.52q-.77.465-1.653.465q-.775 0-1.401-.4t-1.053-1.12q-.104-.176-.294-.234t-.36.012q-.181.069-.265.263t.008.365q.438.831 1.113 1.301t1.587.67v.733q0 .196.147.343t.343.148"/></svg>
                    </div>
                    <div class="label" style ="font-weight:500">Montos Anuales</div>
                    <div class="main-number">${formatLargeNumber(montosAnual[montosAnual.length - 2])}</div>
                    <div class="${changeClass(diferenciaMontos,'change negative', 'change positive').classChange}">${changeClass(diferenciaMontos,'change negative', 'change positive').infoChange}</div>
                    <div class="comparison"  style ="font-weight:400"">vs ${formatLargeNumber(montosAnual[montosAnual.length - 3])} el año anterior</div>
                </div>

                <div class="card-meca"  id="">
                    <div style="margin-bottom: 5px;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#898989" d="M3.616 20.192q-.691 0-1.153-.462T2 18.577V9.423h1v9.154q0 .23.192.423t.423.192H18.5v1zm3-3q-.691 0-1.153-.462T5 15.577V6.192h5.308V4.615q0-.69.462-1.152T11.923 3h3.154q.69 0 1.153.463t.462 1.152v1.577H22v9.385q0 .69-.462 1.153t-1.153.462zm0-1h13.769q.23 0 .423-.192t.192-.423V7.192H6v8.385q0 .23.192.423t.423.192m4.693-10h4.384V4.615q0-.23-.192-.423T15.077 4h-3.154q-.23 0-.423.192t-.192.423zM6 16.192v-9z"/></svg>
                    </div>
                    <div class="label" style ="font-weight:500">Tipo de Movimiento</div>
                    <div class="main-number">${formatLargeNumber(conceptosAnuales[conceptosAnuales.length - 2])}</div>
                    <div class="${changeClass(diferenciaConceptos,'change negative', 'change positive').classChange}">${changeClass(diferenciaConceptos,'change negative', 'change positive').infoChange}</div>
                    <div class="comparison"  style ="font-weight:400"">vs ${formatLargeNumber(conceptosAnuales[conceptosAnuales.length - 3])} el año anterior</div>
                </div>
                
                <div class="card-meca"  id="">
                    <div style="margin-bottom: 5px;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"><path fill="#898989" d="M12 11.385q-1.237 0-2.119-.882T9 8.385t.881-2.12T12 5.386t2.119.88t.881 2.12t-.881 2.118t-2.119.882m-7 7.23V16.97q0-.619.36-1.158q.361-.54.97-.838q1.416-.679 2.834-1.018q1.417-.34 2.836-.34t2.837.34t2.832 1.018q.61.298.97.838q.361.539.361 1.158v1.646zm1-1h12v-.646q0-.332-.215-.625q-.214-.292-.593-.494q-1.234-.598-2.546-.916T12 14.616t-2.646.318t-2.546.916q-.38.202-.593.494Q6 16.637 6 16.97zm6-7.23q.825 0 1.413-.588T14 8.384t-.587-1.412T12 6.384t-1.412.588T10 8.384t.588 1.413t1.412.587m0 7.232"/></svg>
                    </div>
                    <div class="label" style ="font-weight:500">Clientes con Transacciones</div>
                    <div class="main-number">${formatLargeNumber(numeroClientes[numeroClientes.length - 2])}/22</div>
                    <div class="${changeClass(diferenciaClientes,'change negative', 'change positive').classChange}">${changeClass(diferenciaClientes,'change negative', 'change positive').infoChange}</div>
                    <div class="comparison"  style ="font-weight:400"">vs ${formatLargeNumber(numeroClientes[numeroClientes.length - 3])} el año anterior</div>

                </div>
                `;

            graph_spline_annual_general('operation-soi', dataNumOperaciones, null, null, null, 'Transacciones');
            graph_spline_annual_general('bar-monto-soi', dataMontosAnual, null, null, null, 'Montos Anuales');
            
            create_headmap('headMap-monto-soi', dataMontosAnualMensual, null)
            
            createSplinV22('comportamiento-mov-soi', dataCompConceptos, null, null, null, ' productos', 'Productos')
            createChartBarComplemenGeneral('tipo-mov-monto-soi', null, dataConceptos, null, ["#1E5DFF","#6090fa", "#93b4fd", "#bfd3fe", "#dbe6fe", "#eff4ff"]);

            function createItemClientTrans(cliente) {
                if (cliente.transacciones >= 0) {
                    const transCount = parseInt(cliente.transacciones, 10);
                    const transText = transCount === 1 ? 'transacción' : 'transacciones';
                  return `
                    <li class="flex items-center justify-between border-b pb-2 last:border-b-0">
                      <div class="flex items-center space-x-4">
                        <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                          <svg class="w-6 h-6 text-[#0080ff] hover:text-[#005bb5] transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/>
                          </svg>
                        </div>
                        <div>
                          <p class="text-base font-semibold text-gray-800">${cliente.name}</p>
                          <p class="text-sm text-gray-500 uppercase tracking-wide font-medium">${cliente.clave}</p>
                        </div>
                      </div>
                      <div class="text-right">
                        <p class="text-sm text-[#1d58d8] font-medium">${cliente.transacciones} ${transText} en el año</p>
                        <p class="text-sm text-gray-600 font-medium">$${cliente.monto} por transacción</p>
                      </div>
                    </li>`;
                }
            }

            createComponentBest('best-clients-transation-soi', dataBestClientTra, periodsT, createItemClientTrans)

            function createItemClientMonto(cliente) {
                const transCount = parseInt(cliente.transacciones, 10);
                const transText = transCount === 1 ? 'transacción' : 'transacciones';
              return `
                <li class="flex items-center justify-between border-b pb-2 last:border-b-0">
                  <div class="flex items-center space-x-4">
                    <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      <svg class="w-6 h-6 text-[#0080ff] hover:text-[#005bb5] transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/>
                      </svg>
                    </div>
                    <div>
                      <p class="text-base font-semibold text-gray-800">${cliente.name}</p>
                      <p class="text-sm text-gray-500 uppercase tracking-wide font-medium">${cliente.clave}</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="text-sm text-[#1d58d8] font-medium">$${cliente.monto} por transacción en el año</p>
                    <p class="text-sm text-gray-600  font-medium">${cliente.transacciones} ${transText}</p>
                  </div>
                </li>
              `;
            }
          
            createComponentBest('best-clients-monto-soi', dataBestClientMonto, periodsM, createItemClientMonto)

            let mappingColTabClientes = [
                { data: 'CLAVE', title: 'ID', className: 'px-4 py-3',},
                { data: 'AÑO_FOPE', title: 'Año' ,  className: 'px-4 py-3',}, 
                { data: 'NOMBRE', title: 'Cliente', className: 'px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white'}, 
                { data: 'transacciones', title: 'Transacciones', className: 'px-4 py-3',}, 
                { data: 'tipo_creditos', title: 'Tipos de Creditos', className: 'px-4 py-3',},
                { data: 'monto', title: 'Monto Prom', className: 'px-4 py-3',},
            ]

            createTable("id-tab-client-soi", dataCLientes, mappingColTabClientes, true, true, true, true, true)
            
            createSplinV22('client-crecimiento-soi', dataNumClientes, null, null, null, ' clientes', 'Clientes')
            graph_scatter_logscale('cliet-trans-soi', dataclientesTransacciones, null, null, "Transacciones");
            graph_scatter_logscale('cliet-monto-soi', dataclientesMontos, null, null, "Montos",'#0072ff');
            
            
        })
        .catch(error => console.error('Error:', error));
    }


    function initializeProductSipe(){
        fetch('http://127.0.0.1:5050/api/data/productos/sipe')
        .then(response => response.json())
        .then(data => {
            const dataNumOperaciones = data.num_transacciones
            const Operaciones =  dataNumOperaciones.map(item => item[1])
            const diferenciaOperaciones = porcentajeDiferencia(Operaciones)

            const dataMontosAnual = data.montos
            const montosAnual = dataMontosAnual.map(item => item[1])
            const diferenciaMontos = porcentajeDiferencia(montosAnual)

            const dataNumClientes =  data.clt_año
            const numeroClientes = dataNumClientes.map(item => item[1])
            const diferenciaClientes =  porcentajeDiferencia(numeroClientes)

            const dataMontosAnualMensual = data.monto_mes
            const dataMinMeanMAx = data.plazo_min_max
            
            const dataBestClientTra =  data.dataBestClientTra
            const periodsT = Object.keys(dataBestClientTra).map(Number).sort((a, b) => b - a);

            const dataBestClientMonto = data.dataBestClientMon
            const periodsM = Object.keys(dataBestClientMonto).map(Number).sort((a, b) => b - a);

            const dataclientesTransacciones = data.clientesTransacciones
            const dataclientesMontos = data.clientesMontos

            const dataCLientes =  data.dataTableClientes



            document.getElementById('kpis-sipe').innerHTML = `
                 <div class="card-meca"  id="">
                    <div style="margin-bottom: 5px;">
                        <svg xmlns="http://www.w3.org/2000/svg" width=24 height=24 viewBox="0 0 24 24">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#898989" d="m7.4 15.289l3.05-3.031l2 2l4.05-4.045V12.5h1v-4h-4v1h2.286l-3.336 3.337l-2-2L6.712 14.6zM5.616 20q-.691 0-1.153-.462T4 18.384V5.616q0-.691.463-1.153T5.616 4h12.769q.69 0 1.153.463T20 5.616v12.769q0 .69-.462 1.153T18.384 20zm0-1h12.769q.23 0 .423-.192t.192-.424V5.616q0-.231-.192-.424T18.384 5H5.616q-.231 0-.424.192T5 5.616v12.769q0 .23.192.423t.423.192M5 5v14z"/></svg>
                        </svg>
                    </div>
                    <div class="label" style ="font-weight:500" >Transacciones</div>
                    <div class="main-number">${formatLargeNumber(Operaciones[Operaciones.length - 2])}</div>
                    <div class="${changeClass(diferenciaOperaciones,'change negative', 'change positive').classChange}">${changeClass(diferenciaOperaciones,'change negative', 'change positive').infoChange}</div>
                    <div class="comparison"  style ="font-weight:400"">vs ${formatLargeNumber(Operaciones[Operaciones.length - 3])} el año anterior</div>
                </div>

                <div class="card-meca"  id="">
                    <div style="margin-bottom: 5px;">
                       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#898989" d="M12.003 21q-1.866 0-3.51-.708q-1.643-.709-2.859-1.924t-1.925-2.856T3 12.003t.709-3.51Q4.417 6.85 5.63 5.634t2.857-1.925T11.997 3t3.51.709q1.643.708 2.859 1.922t1.925 2.857t.709 3.509t-.708 3.51t-1.924 2.859t-2.856 1.925t-3.509.709M12 20q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m-.025-1.384q.196 0 .343-.148q.148-.147.148-.343v-.683q1.076-.09 2.063-.773q.987-.682.987-2.119q0-1.05-.639-1.79q-.638-.74-2.438-1.39q-1.654-.578-2.114-.991T9.865 9.2t.598-1.275t1.587-.51q.616 0 1.077.243t.789.638q.115.146.283.21t.323-.002q.212-.081.289-.276q.078-.195-.045-.36q-.4-.557-.998-.909q-.597-.351-1.252-.401v-.683q0-.196-.148-.343q-.147-.148-.343-.148t-.343.148t-.148.343v.683q-1.307.217-1.978.975T8.885 9.2q0 1.079.678 1.727t2.287 1.23q1.614.595 2.168 1.074t.555 1.319q0 1.056-.77 1.52q-.77.465-1.653.465q-.775 0-1.401-.4t-1.053-1.12q-.104-.176-.294-.234t-.36.012q-.181.069-.265.263t.008.365q.438.831 1.113 1.301t1.587.67v.733q0 .196.147.343t.343.148"/></svg>
                    </div>
                    <div class="label" style ="font-weight:500">Montos Anuales</div>
                    <div class="main-number">${formatLargeNumber(montosAnual[montosAnual.length - 2])}</div>
                    <div class="${changeClass(diferenciaMontos,'change negative', 'change positive').classChange}">${changeClass(diferenciaMontos,'change negative', 'change positive').infoChange}</div>
                    <div class="comparison"  style ="font-weight:400"">vs ${formatLargeNumber(montosAnual[montosAnual.length - 3])} el año anterior</div>
                </div>

                <div class="card-meca"  id="">
                    <div style="margin-bottom: 5px;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#898989" d="M3.616 20.192q-.691 0-1.153-.462T2 18.577V9.423h1v9.154q0 .23.192.423t.423.192H18.5v1zm3-3q-.691 0-1.153-.462T5 15.577V6.192h5.308V4.615q0-.69.462-1.152T11.923 3h3.154q.69 0 1.153.463t.462 1.152v1.577H22v9.385q0 .69-.462 1.153t-1.153.462zm0-1h13.769q.23 0 .423-.192t.192-.423V7.192H6v8.385q0 .23.192.423t.423.192m4.693-10h4.384V4.615q0-.23-.192-.423T15.077 4h-3.154q-.23 0-.423.192t-.192.423zM6 16.192v-9z"/></svg>
                    </div>
                    <div class="label" style ="font-weight:500">Tipo de Movimiento</div>
                    <div class="main-number">56</div>
                    <div class='change positive'>↑ 20</div>
                    <div class="comparison" style ="font-weight:400">vs 2023 el año anterior</div>
                </div>
                
                <div class="card-meca"  id="">
                    <div style="margin-bottom: 5px;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"><path fill="#898989" d="M12 11.385q-1.237 0-2.119-.882T9 8.385t.881-2.12T12 5.386t2.119.88t.881 2.12t-.881 2.118t-2.119.882m-7 7.23V16.97q0-.619.36-1.158q.361-.54.97-.838q1.416-.679 2.834-1.018q1.417-.34 2.836-.34t2.837.34t2.832 1.018q.61.298.97.838q.361.539.361 1.158v1.646zm1-1h12v-.646q0-.332-.215-.625q-.214-.292-.593-.494q-1.234-.598-2.546-.916T12 14.616t-2.646.318t-2.546.916q-.38.202-.593.494Q6 16.637 6 16.97zm6-7.23q.825 0 1.413-.588T14 8.384t-.587-1.412T12 6.384t-1.412.588T10 8.384t.588 1.413t1.412.587m0 7.232"/></svg>
                    </div>
                    <div class="label" style ="font-weight:500">Clientes Nuevos</div>
                    <div class="main-number">${formatLargeNumber(numeroClientes[numeroClientes.length - 2])}/156 </div>
                    <div class="${changeClass(diferenciaClientes,'change negative', 'change positive').classChange}">${changeClass(diferenciaClientes, 'change negative', 'change positive').infoChange}</div>
                    <div class="comparison"  style ="font-weight:400"">vs ${formatLargeNumber(numeroClientes[numeroClientes.length - 3])} el año anterior</div>

                </div>
                `;

            graph_spline_annual_general('operation-sipe', dataNumOperaciones, null, null, null, 'Transacciones');
            graph_spline_annual_general('bar-monto-sipe', dataMontosAnual, null, null, null, 'Montos Anuales');
            create_headmap('headMap-monto-sipe', dataMontosAnualMensual, null);

            createGraphMaxMinV2Sync('plazo-max-min-max-sipe', 'plazo-mean-sipe', dataMinMeanMAx, null, null, null)

            function createItemClientTrans(cliente) {
                if (cliente.transacciones >= 0) {
                    const transCount = parseInt(cliente.transacciones, 10);
                    const transText = transCount === 1 ? 'transacción' : 'transacciones';
                  return `
                    <li class="flex items-center justify-between border-b pb-2 last:border-b-0">
                      <div class="flex items-center space-x-4">
                        <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                          <svg class="w-6 h-6 text-[#0080ff] hover:text-[#005bb5] transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/>
                          </svg>
                        </div>
                        <div>
                          <p class="text-base font-semibold text-gray-800">${cliente.name}</p>
                          <p class="text-sm text-gray-500 uppercase tracking-wide font-medium">${cliente.clave}</p>
                        </div>
                      </div>
                      <div class="text-right">
                        <p class="text-sm text-[#1d58d8] font-medium">${cliente.transacciones} ${transText} en el año</p>
                        <p class="text-sm text-gray-600 font-medium">$${cliente.monto} por transacción</p>
                      </div>
                    </li>`;
                }
            }

            createComponentBest('best-clients-transation-sipe', dataBestClientTra, periodsT, createItemClientTrans)

            function createItemClientMonto(cliente) {
                const transCount = parseInt(cliente.transacciones, 10);
                const transText = transCount === 1 ? 'transacción' : 'transacciones';
              return `
                <li class="flex items-center justify-between border-b pb-2 last:border-b-0">
                  <div class="flex items-center space-x-4">
                    <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      <svg class="w-6 h-6 text-[#0080ff] hover:text-[#005bb5] transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/>
                      </svg>
                    </div>
                    <div>
                      <p class="text-base font-semibold text-gray-800">${cliente.name}</p>
                      <p class="text-sm text-gray-500 uppercase tracking-wide font-medium">${cliente.clave}</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="text-sm text-[#1d58d8] font-medium">$${cliente.monto} por transacción en el año</p>
                    <p class="text-sm text-gray-600  font-medium">${cliente.transacciones} ${transText}</p>
                  </div>
                </li>
              `;
            }
          
            createComponentBest('best-clients-monto-sipe', dataBestClientMonto, periodsM, createItemClientMonto)

            let mappingColTabClientes = [
                { data: 'CLAVE', title: 'ID', className: 'px-4 py-3',},
                { data: 'AÑO_FOPE', title: 'Año' ,  className: 'px-4 py-3',}, 
                { data: 'NOMBRE', title: 'Cliente', className: 'px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white'}, 
                { data: 'transacciones', title: 'Transacciones', className: 'px-4 py-3',}, 
                { data: 'monto', title: 'Monto Prom', className: 'px-4 py-3',},
                { data: 'plazo_promedio', title: 'Plazo', className: 'px-4 py-3',},
                { data: 'tasa_prom', title: 'Tasa', className: 'px-4 py-3',},
            ]
            
            createSplinV22('client-crecimiento-sipe', dataNumClientes, null, null, null, ' clientes', 'Clientes')            
            graph_scatter_logscale('cliet-trans-sipe', dataclientesTransacciones, null, null, "Transacciones");
            graph_scatter_logscale('cliet-monto-sipe', dataclientesMontos, null, null, "Montos",'#0072ff');
            
            createTable("id-tab-client-sipe", dataCLientes, mappingColTabClientes, true, true, true, true, true)

            //  == Dropdowns sipe ==
            document.getElementById('container-my-dropdown-ftrans-sipe').innerHTML = createDropdown('id-dropwdown-ftrans-sipe', 2024, [2022, 2023, 2024, 2025], 'auto');
            
            inicializarDropdown('id-dropwdown-ftrans-sipe', 2024, (selectedYear) => {
                console.log('Selected year:', selectedYear);
              }, 'left');

            document.getElementById('container-my-dropdown-fmonto-sipe').innerHTML = createDropdown('id-dropwdown-fmonto-sipe', 2024, [2022, 2023, 2024, 2025], 'auto');
        
            inicializarDropdown('id-dropwdown-fmonto-sipe', 2024, (selectedYear) => {
                  console.log('Selected year:', selectedYear);
                }, 'left');
        })
        .catch(error => console.error('Error:', error));
    }

    

    // Añadir event listeners a cada enlace de navegación
    document.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault(); // Evita que el navegador siga el enlace
            const page = link.getAttribute("data-page"); // Obtiene la URL de la página
            loadPage(page); // Llama a la función para cargarla
        });
    });
    
    
    // Cargar la página por defecto al iniciar
    loadPage("pages/productos.html");
    
}); 


