/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "automationpractice.com :\/index.php (Gerado ordem de compra)"], "isController": false}, {"data": [0.0, 500, 1500, "automationpractice.com :\/index.php (Confirmar endere\u00E7o)"], "isController": false}, {"data": [1.0, 500, 1500, "Debug testador"], "isController": false}, {"data": [0.5, 500, 1500, "automationpractice.com :\/index.php (Ir para o endere\u00E7o - Iniciar)"], "isController": false}, {"data": [0.0, 500, 1500, "automationpractice.com :\/index.php (Aceito termos de uso)"], "isController": false}, {"data": [0.5, 500, 1500, "automationpractice.com :\/index.php (Tela Inicial - Logado)"], "isController": false}, {"data": [0.5, 500, 1500, "automationpractice.com :\/index.php (My account - N\u00E3o logado)"], "isController": false}, {"data": [0.5, 500, 1500, "automationpractice.com :\/index.php (Forma de pagamento)"], "isController": false}, {"data": [0.0, 500, 1500, "automationpractice.com :\/index.php (Envio do formul\u00E1rio de login)"], "isController": false}, {"data": [0.5, 500, 1500, "automationpractice.com :\/index.php (Adicionado produto no carrinho de compras)"], "isController": false}, {"data": [0.5, 500, 1500, "automationpractice.com :\/index.php (Lista de ordens de produtos)"], "isController": false}, {"data": [0.0, 500, 1500, "automationpractice.com :\/index.php (Confirmar compra)"], "isController": false}, {"data": [0.5, 500, 1500, "automationpractice.com :\/index.php (Acesso tela inicial)"], "isController": false}, {"data": [0.5, 500, 1500, "automationpractice.com :\/index.php (Escolha de produto)"], "isController": false}, {"data": [0.5, 500, 1500, "automationpractice.com :\/index.php (Proceder com compra - Iniciar)"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 15, 0, 0.0, 1185.6000000000001, 1, 2344, 1214.0, 1982.8000000000002, 2344.0, 2344.0, 0.5365958360163126, 20.20685070785934, 0.4036346542534163], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["automationpractice.com :\/index.php (Gerado ordem de compra)", 1, 0, 0.0, 1214.0, 1214, 1214, 1214.0, 1214.0, 1214.0, 1214.0, 0.8237232289950577, 29.736086799835256, 0.5807892298187809], "isController": false}, {"data": ["automationpractice.com :\/index.php (Confirmar endere\u00E7o)", 1, 0, 0.0, 1648.0, 1648, 1648, 1648.0, 1648.0, 1648.0, 1648.0, 0.6067961165048543, 22.33590431583738, 0.6026480961771845], "isController": false}, {"data": ["Debug testador", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 639.6484375, 0.0], "isController": false}, {"data": ["automationpractice.com :\/index.php (Ir para o endere\u00E7o - Iniciar)", 1, 0, 0.0, 1283.0, 1283, 1283, 1283.0, 1283.0, 1283.0, 1283.0, 0.779423226812159, 28.690234070537805, 0.7017853663289166], "isController": false}, {"data": ["automationpractice.com :\/index.php (Aceito termos de uso)", 1, 0, 0.0, 1651.0, 1651, 1651, 1651.0, 1651.0, 1651.0, 1651.0, 0.6056935190793459, 22.295318178376743, 0.597412552998183], "isController": false}, {"data": ["automationpractice.com :\/index.php (Tela Inicial - Logado)", 1, 0, 0.0, 1276.0, 1276, 1276, 1276.0, 1276.0, 1276.0, 1276.0, 0.7836990595611285, 62.714292711598745, 0.5257824745297806], "isController": false}, {"data": ["automationpractice.com :\/index.php (My account - N\u00E3o logado)", 1, 0, 0.0, 1154.0, 1154, 1154, 1154.0, 1154.0, 1154.0, 1154.0, 0.8665511265164644, 29.77330887131716, 0.5982926234835356], "isController": false}, {"data": ["automationpractice.com :\/index.php (Forma de pagamento)", 1, 0, 0.0, 650.0, 650, 650, 650.0, 650.0, 650.0, 650.0, 1.5384615384615385, 45.04056490384615, 1.2154447115384615], "isController": false}, {"data": ["automationpractice.com :\/index.php (Envio do formul\u00E1rio de login)", 1, 0, 0.0, 2344.0, 2344, 2344, 2344.0, 2344.0, 2344.0, 2344.0, 0.42662116040955633, 14.658019811220138, 0.3487128039675768], "isController": false}, {"data": ["automationpractice.com :\/index.php (Adicionado produto no carrinho de compras)", 1, 0, 0.0, 613.0, 613, 613, 613.0, 613.0, 613.0, 613.0, 1.6313213703099512, 2.2717424551386625, 1.5660047920065252], "isController": false}, {"data": ["automationpractice.com :\/index.php (Lista de ordens de produtos)", 1, 0, 0.0, 1094.0, 1094, 1094, 1094.0, 1094.0, 1094.0, 1094.0, 0.9140767824497258, 32.997814785191956, 0.7864273880255941], "isController": false}, {"data": ["automationpractice.com :\/index.php (Confirmar compra)", 1, 0, 0.0, 1742.0, 1742, 1742, 1742.0, 1742.0, 1742.0, 1742.0, 0.5740528128587831, 21.130637378013777, 0.5819011911595867], "isController": false}, {"data": ["automationpractice.com :\/index.php (Acesso tela inicial)", 1, 0, 0.0, 1269.0, 1269, 1269, 1269.0, 1269.0, 1269.0, 1269.0, 0.7880220646178093, 63.339582102048865, 0.35707249802994484], "isController": false}, {"data": ["automationpractice.com :\/index.php (Escolha de produto)", 1, 0, 0.0, 688.0, 688, 688, 688.0, 688.0, 688.0, 688.0, 1.4534883720930232, 73.90079941860466, 0.9893373001453489], "isController": false}, {"data": ["automationpractice.com :\/index.php (Proceder com compra - Iniciar)", 1, 0, 0.0, 1157.0, 1157, 1157, 1157.0, 1157.0, 1157.0, 1157.0, 0.8643042350907519, 29.519703435609333, 0.6583567415730337], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 15, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
