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
    },

    prep_chart_data: function(data, primary_dimension){
      // preps a matrix-esque csv w/ labels for rows & columns
      if(primary_dimension == 'row'){
        var csv_arrays = this.transpose($.csv.toArrays(data))
      } else{
        var csv_arrays = $.csv.toArrays(data);
      }

      var series_data = []
      var col_names = csv_arrays[0].slice(1)

      // loop through rows after first row
      $.each(csv_arrays.slice(1), function(row_id, row){
        // first element is row name, rest is data
        var row_name = row[0]
        var row_data = []
        // format numbers
        $.each(row.slice(1), function(i, val){
            row_data.push(parseInt(val.replace(/,/g,'')));
        });

        series_data.push({
          name: row_name,
          data: row_data,
        });
      });

      return [series_data, col_names]

    },

    transpose: function(a){
      return Object.keys(a[0]).map(
        function (c) { return a.map(function (r) { return r[c]; }); }
      );
    },

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