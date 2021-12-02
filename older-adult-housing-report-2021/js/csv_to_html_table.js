var CsvToHtmlTable = CsvToHtmlTable || {};

CsvToHtmlTable = {
    init: function (options) {
        options = options || {};
        var csv_path = options.csv_path || "";
        var el = options.element || "table-container";
        var csv_options = options.csv_options || {};
        var datatables_options = options.datatables_options || {};

        var $table = $("#" + el);

        $.when($.get(csv_path)).then(
            function (data) {
                var csvData = $.csv.toArrays(data, csv_options);
                var $tableBody = $("<tbody></tbody>");

                for (var rowIdx = 1; rowIdx < csvData.length; rowIdx++) {
                    var $tableBodyRow = $("<tr></tr>");
                    $tableBodyRow.append("<td>" + csvData[rowIdx][0] + "</td>")
                    for (var colIdx = 1; colIdx < csvData[rowIdx].length; colIdx++) {
                        var cell_value = parseFloat(csvData[rowIdx][colIdx]);
                        var style = 'danger';
                        if (cell_value >= 0) {
                            style = 'success';
                            cell_value = cell_value;
                        }
                        if (colIdx == 6 || rowIdx == 3)
                            style = '';
                        var $tableBodyRowTd = $("<td class='" + style + "' style='text-align: right;'></td>");
                        $tableBodyRowTd.text(cell_value + "%");
                        $tableBodyRow.append($tableBodyRowTd);
                        $tableBody.append($tableBodyRow);
                    }
                }
                $table.append($tableBody);

                $table.DataTable(datatables_options);
            });
    }
};
