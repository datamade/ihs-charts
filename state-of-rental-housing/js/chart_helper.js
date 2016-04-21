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

var ChartHelper = ChartHelper || {};
var ChartHelper = {

    cleaned_data: [],
    categories: [],

    get_colors: function(num_series){

      if (num_series == 7){
        return ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f'];
      }

      if (num_series == 4){
        return ['#BDD9FF', '#82AFF1', '#1769D6', '#395A88'];
      }

      if (num_series == 3){
        return ['#82AFF1', '#1769D6', '#395A88'];
      }

      if (num_series == 2){
        return ['#C0CAE6', '#527AB8'];
      }

      if (num_series == 1)
        return ['#E26967']
    },

    prep_chart_data: function(data, primary_dimension, number_type){
      // preps a matrix-esque csv w/ labels for rows & columns
      if(primary_dimension == 'row'){
        var csv_arrays = this.transpose($.csv.toArrays(data))
      } else{
        var csv_arrays = $.csv.toArrays(data);
      }

      var series_data = []
      var col_names = csv_arrays[0].slice(1)

      // loop through rows after first row
      var series_count = 0;
      var num_series = csv_arrays.length - 1;

      $.each(csv_arrays.slice(1), function(row_id, row){
        // first element is row name, rest is data
        var row_name = row[0]
        var row_data = []
        // format numbers
        $.each(row.slice(1), function(i, val){
          if(number_type == 'count'){
            // get rid of commas, parse int
            row_data.push(parseInt(val.replace(/,/g,'')));
          } else if (number_type == 'percentage'){
            row_data.push(parseFloat(val)*100);
          } else{
            // do nothing
            row_data.push(val);
          }
        });

        series_data.push({
          name: row_name,
          data: row_data,
          color: ChartHelper.get_colors(num_series)[series_count]
        });

        series_count = series_count + 1;
      });

      return [series_data, col_names]

    },

    transpose: function(a){
      return Object.keys(a[0]).map(
        function (c) { return a.map(function (r) { return r[c]; }); }
      );
    },

    make_bar_chart: function(el, series_data, categories, chart_title, xaxis_title, yaxis_title){

      $(el).highcharts({
        chart: {
          type: 'column'
        },
        credits: { enabled: false },
        title: {
          text: chart_title
        },
        xAxis: {
          categories: categories,
          tickmarkPlacement: 'on',
          title: {
              enabled: false
          }
        },
        yAxis: {
          title: {
              text: yaxis_title
          },
          min: 0
        },
        tooltip: {
          pointFormat: '<span style="color:{series.color}">{series.name}</span>: {point.y:,.0f} '+yaxis_title+'<br/>',
          shared: true
        },
        series: series_data
      });

    },

    make_composition_chart: function(el, series_data, categories, chart_title, xaxis_title, yaxis_title){

      $(el).highcharts({
        chart: {
          type: 'bar'
        },
        plotOptions: {
            series: {
                stacking: 'percent'
            }
        },
        credits: { enabled: false },
        title: {
          text: chart_title
        },
        xAxis: {
          categories: categories,
          tickmarkPlacement: 'on',
          title: {
              enabled: false
          }
        },
        yAxis: {
          title: {
              text: yaxis_title
          },
          min: 0
        },
        tooltip: {
          pointFormat: '<span style="color:{series.color}">{series.name}</span>: {point.y:,.0f} '+yaxis_title+'<br/>',
          shared: true
        },
        series: series_data
      });

    },

    make_small_chart: function(el, series_data, chart_title, ymin, ymax){

      $(el).highcharts({
        chart: {
          spacingTop: 60,
          type: 'column'
        },
        credits: { enabled: false },
        title: {
          text: chart_title
        },
        legend: {
            enabled: false
        },
        xAxis: {
          categories: [chart_title],
          lineWidth: 0,
          tickLength: 0,
          title: {
            enabled: false
          },
          labels: {
            enabled: false
          }
        },
        yAxis: {
          title: {
              enabled: false
          },
          min: ymin,
          max: ymax,
          endOnTick: false
        },
        tooltip: {
          pointFormat: '<span style="color:{series.color}">{series.name}</span>: {point.y:,.0f} <br/>',
        },
        series: series_data
      });

    },

    make_line_chart: function(el, series_data, categories, chart_title, xaxis_title, yaxis_title){
      $(el).highcharts({
        chart: {
            type: 'line'
        },
        credits: { enabled: false },
        title: {
            text: chart_title
        },
        xAxis: {
            categories: years,
            tickmarkPlacement: 'on',
            title: {
                enabled: false
            }
        },
        yAxis: {
            title: {
                text: yaxis_title
            },
            labels: {
              formatter: function () {
                return this.value + '%';
              }
            },
        },
        tooltip: {
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: {point.y:,.1f}%<br/>',
            shared: true
        },
        plotOptions: {
            line: {
                marker: {
                    lineWidth: 1,
                    lineColor: '#ffffff',
                    symbol: 'square'
                },
                dataLabels: {
                    enabled: true,
                    formatter: function () {
                      return this.y.toFixed(1) + '%';
                    }
                }
            }
        },
        series: series_data
      });

    }


}