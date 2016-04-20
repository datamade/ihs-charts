var ChartHelper = ChartHelper || {};
var ChartHelper = {

    colors: ['#C0CAE6', '#527AB8'],
    cleaned_data: [],
    categories: [],

    init_highcharts: function(){

        Highcharts.setOptions({
            lang: {
                thousandsSep: ','
            },
            chart: {
                style: {
                    fontFamily: '"ColaborateThinRegular", sans-serif'
                }
            }
        });
    },

    clean_csv_data: function(data){
        var obj_data = $.csv.toObjects(data);
          
        _cleaned_data = [];
        _categories = [];

        //format numbers
        $.each(obj_data, function(row_id, row){
            var row_data = [];
            $.each(row, function(col_id, col){
              row_data.push(parseInt(col.replace(/,/g,'')));

              if(_categories.indexOf(col_id) == -1)
                _categories.push(col_id);
            });
            _cleaned_data.push(row_data);
        });

        return [_cleaned_data, _categories]
    }

    load_data: function(csv) {
        $.when($.get(csv)).then(
        function(data){
          var obj_data = $.csv.toObjects(data);
          
          cleaned_data = [];
          categories = [];

          series_data = [];
          series_data.push({
                name: 'Owner-Occupied',
                data: cleaned_data[1],
                color: ChartHelper.colors[0]
              });

          series_data.push({
                name: 'Renter-Occupied',
                data: cleaned_data[0],
                color: ChartHelper.colors[1]
              });

        init_chart_0('#chart_0', series_data, years);
        init_chart_1('#chart_1', series_data, years);
      });
    }
}