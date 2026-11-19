var CsvToHtmlTable = CsvToHtmlTable || {};

CsvToHtmlTable = {
    // quintile (0 = lowest fifth .. 4 = highest fifth) of value within values
    quintile: function (value, values) {
        var sorted = values.slice().sort(function (a, b) { return a - b; });
        var rank = sorted.indexOf(value);
        return Math.min(4, Math.floor(rank * 5 / sorted.length));
    },

    // css class for each quintile when higher values are better
    shade_classes: ['shade-bad-2', 'shade-bad-1', 'shade-neutral', 'shade-good-1', 'shade-good-2'],

    init: function (options) {
        options = options || {};
        var csv_path = options.csv_path || "";
        var el = options.element || "table-container";
        var csv_options = options.csv_options || {};
        var datatables_options = options.datatables_options || {};
        // one entry per data column (after the name column):
        //  1 = higher is better (top fifth darkest green), -1 = higher is worse (top fifth darkest red), 0 = no shading
        var column_direction = options.column_direction || [];

        var $table = $("#" + el);

        $.when($.get(csv_path)).then(
            function (data) {
                var csvData = $.csv.toArrays(data, csv_options);
                var rows = csvData.slice(1);
                var $tableBody = $("<tbody></tbody>");

                var columns = [];
                for (var c = 1; c < csvData[0].length; c++) {
                    columns[c] = rows.map(function (r) { return parseFloat(r[c]); });
                }

                $.each(rows, function (rowIdx, row) {
                    var $tableBodyRow = $("<tr></tr>");
                    $tableBodyRow.append($("<td></td>").text(row[0]));
                    for (var colIdx = 1; colIdx < row.length; colIdx++) {
                        // values ending in % are shares; everything else is a household count
                        var raw = row[colIdx];
                        var value = parseFloat(raw);
                        var cell_text = raw.indexOf('%') > -1
                            ? value.toFixed(1) + "%"
                            : value.toLocaleString('en-US');

                        var style = '';
                        var direction = column_direction[colIdx - 1] || 0;
                        if (direction != 0) {
                            var q = CsvToHtmlTable.quintile(value, columns[colIdx]);
                            style = CsvToHtmlTable.shade_classes[direction > 0 ? q : 4 - q];
                        }

                        var $tableBodyRowTd = $("<td style='text-align: right;'></td>").addClass(style);
                        $tableBodyRowTd.text(cell_text);
                        $tableBodyRow.append($tableBodyRowTd);
                    }
                    $tableBody.append($tableBodyRow);
                });
                $table.append($tableBody);

                $table.DataTable(datatables_options);
            });
    }
};
