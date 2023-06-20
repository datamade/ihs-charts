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
        // age groups
        return ['#547bb6', '#6e83a5', '#878b94', '#a19383', '#ba9b72', '#d4a361', '#edab50']
        // return ['#e0ecf4', '#bfd3e6', '#9ebcda', '#8c96c6', '#8c6bb1', '#88419d', '#6e016b']
      }
      if (num_series == 6){
        // income groups
        return ['#ce603b', '#cc893d', '#cab040', '#AAA646', '#74722F', '#48471E']
      }

      if (num_series == 5){
        // income groups
        return ['#ce603b', '#cc893d', '#cab040', '#AAA646', '#48471E']
      }

      if (num_series == 4){
        // building types
        return ['#8DA7CE', '#547BB6', '#375481', '#1F2F47']
        //return ['#BDD9FF', '#82AFF1', '#1769D6', '#395A88'];
      }

      if (num_series == 3){
        return ['#375481', '#8DA7CE', '#CE603B'];
      }

      if (num_series == 2){
        return ['#375481', '#8DA7CE'];
      }

      return ['#547BB6'];
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
          } else if (number_type == 'rate'){
            row_data.push(parseFloat(val));
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

    make_bar_chart: function(el, series_data, categories, chart_title, yaxis_title, plotOptions, tooltip){

      $(el).highcharts({
        chart: {
          type: 'column',
          backgroundColor:"rgba(255, 255, 255, 0)",
          spacingTop: 40
        },
        plotOptions: plotOptions,
        credits: { enabled: false },
        title: {
          text: chart_title[0]
        },
        subtitle: {
          text: chart_title[1]
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
          endOnTick: false,
          min: 0
        },
        tooltip: tooltip,
        series: series_data
      });

    },

    make_negative_bar_chart: function(el, series_data, categories, chart_title, yaxis_title, plotOptions, tooltip){

      $(el).highcharts({
        chart: {
          type: 'column',
          backgroundColor:"rgba(255, 255, 255, 0)",
          spacingTop: 40
        },
        plotOptions: plotOptions,
        credits: { enabled: false },
        title: {
          text: chart_title[0]
        },
        subtitle: {
          text: chart_title[1]
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
          endOnTick: false
        },
        tooltip: tooltip,
        series: series_data
      });

    },

    make_composition_chart: function(el, series_data, categories, chart_title, xaxis_title, yaxis_title){

      // flipping data so that most recent year comes first
      categories = categories.reverse()
      $.each(series_data, function(i, group_data){
        group_data['data'] = group_data['data'].reverse()
      });

      $(el).highcharts({
        chart: {
          type: 'bar',
          backgroundColor:"rgba(255, 255, 255, 0)",
          spacingTop: 40
        },
        plotOptions: {
          series: {
            stacking: 'percent',
            dataLabels: {
              enabled: true,
              format: '{y:,.1f}%',
              color: '#fff',
              style: {
                textShadow: 'none',
                opacity: .8,
                fontWeight: 'bold'
              }
            },
            states: {
              hover: {
                enabled: false
              }
            }
          }
        },
        credits: { enabled: false },
        title: {
          text: chart_title[0]
        },
        subtitle: {
          text: chart_title[1]
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
          min: 0,
          tickInterval: 100,
          reversedStacks: false
        },
        tooltip: {
          enabled: false
        },
        legend: {
          symbolPadding: 3,
          itemDistance: 12

        },
        series: series_data
      });

    },

    make_small_bar_chart: function(el, series_data, chart_title, y_range, data_type){

      if (data_type == 'percent') {
        num_format = '{point.y:,.1f}%'
        y_labels = {
              formatter: function () {
                  return this.value + '%';
              }
            }
      } else {
        num_format = '{point.y:,.0f}'
        y_labels = {}
      }

      $(el).highcharts({
        chart: {
          backgroundColor:"rgba(255, 255, 255, 0)",
          spacingTop: 30,
          spacingBottom: 30,
          type: 'column'
        },
        plotOptions: {
          series: {
            groupPadding: 0
          }
        },
        credits: { enabled: false },
        title: {
          text: chart_title,
          style: {
                fontSize: '16px'
            }
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
          min: y_range[0],
          max: y_range[1],
          endOnTick: false,
          labels: y_labels
        },
        tooltip: {
          borderColor: '#eee',
          shadow: false,
          headerFormat: '',
          pointFormat: num_format,
        },
        series: series_data
      });

    },

    make_small_line_chart: function(el, series_data, categories, chart_title, y_range, data_type){

      if (data_type=='percent'){
        num_format = '{point.y:,.1f}%'
        y_labels = {
          formatter: function () {
            return this.value + '%';
          }
        }
      } else {
        num_format = '{point.y:,.0f}'
        y_labels = {}
      }

      $(el).highcharts({
        chart: {
          backgroundColor:"rgba(255, 255, 255, 0)",
          spacingTop: 15,
          spacingBottom: 30,
          type: 'area'
        },
        plotOptions: {
          area: {
            fillOpacity: 0.25
          }
        },
        credits: { enabled: false },
        title: {
          text: chart_title,
          style: {
                fontSize: '16px'
            }
        },
        legend: {
            enabled: false
        },
        xAxis: {
          categories: categories,
          lineWidth: 0,
          tickLength: 0,
          title: {
            enabled: false
          },
        },
        yAxis: {
          title: {
              enabled: false
          },
          min: y_range[0],
          max: y_range[1],
          endOnTick: false,
          labels: y_labels
        },
        tooltip: {
          borderColor: '#eee',
          shadow: false,
          headerFormat: '',
          pointFormat: num_format,
        },
        series: series_data
      });

    },

    make_small_composition_chart: function(el, series_data, categories, chart_title, data_type){

      if (data_type=='percent'){
        num_format = '{point.y:,.1f}%';
      } else {
        num_format = '{point.y:,.0f}';
      }

      $(el).highcharts({
        chart: {
          backgroundColor:"rgba(255, 255, 255, 0)",
          spacingTop: 30,
          spacingBottom: 30,
          type: 'area'
        },
        plotOptions: {
          area: {
            marker: {
              symbol: 'circle',
              radius: 2
            },
            stacking: 'percent',
            fillOpacity: 0.7
          },
          series: {
            pointPadding: 0
          }
        },
        credits: { enabled: false },
        title: {
          text: chart_title,
          style: {
                fontSize: '16px'
            }
        },
        legend: {
            enabled: false
        },
        xAxis: {
          categories: categories,
          lineWidth: 0,
          tickLength: 0,
          title: {
            enabled: false
          },
          min: 0.5,
          max: years.length - 1.5
        },
        yAxis: {
          title: {
              enabled: false
          },
          min: 0,
          max: 100,
          endOnTick: false,
          labels: {
            formatter: function () {
              return this.value + '%';
            }
          }
        },
        tooltip: {
          shared: true,
          borderColor: '#eee',
          shadow: false,
          headerFormat: '',
          pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>' + num_format + '</b><br/>.'
        },
        series: series_data
      });

    },

    make_line_chart: function(el, series_data, categories, chart_title, yaxis_title, data_type){
      if (data_type == 'percent'){
        y_min = null
        y_labels = {
              formatter: function () {
                  return this.value + '%';
              }
            }
        data_labels = {
                    enabled: true,
                    format: "{point.y:.1f}%"
                }
        states = {
                hover: {
                  enabled: false
                }
              }
        tooltip = {
            enabled: false
        }
      } else {
        y_min = 0
        y_labels = {}
        data_labels = {
          enabled: false
        }
        states = {}
        tooltip = {
          borderColor: '#eee',
          shadow: false,
          headerFormat: '',
          pointFormat: '{point.y:,.0f}',
        }

      }

      $(el).highcharts({
        chart: {
          type: 'line',
          backgroundColor:"rgba(255, 255, 255, 0)",
          spacingTop: 40
        },
        credits: { enabled: false },
        title: {
            text: chart_title[0]
        },
        subtitle: {
            text: chart_title[1]
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
            labels: y_labels,
            min: y_min
        },
        tooltip: tooltip,
        plotOptions: {
            line: {
                marker: {
                    lineWidth: 1,
                    lineColor: '#ffffff',
                    symbol: 'square'
                },
                dataLabels: data_labels
            },
            series: {
              states: states
            }
        },
        series: series_data
      });

    },

    formatAmount: function(value) {
      if (value >= 1000000000)
        return Math.round(value / 1000000000) + "B";
      else if (value >= 1000000)
        return Math.round(value / 1000000) + "M";
      else if (value >= 1000)
        return Math.round(value / 1000) + "K";
      else
        return value;
    }


}