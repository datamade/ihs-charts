var map;
var chart;
var puma_layer;
var leaflet_features = {};
var chart_series = {};
var feature_color = '';
var puma_lookup = {};

$(window).resize(function () {
  var h = $(window).height();
  $('#chart').css('height', h);
}).resize();

$(function () {
    init_chart();
});

function init_chart(){

  Highcharts.setOptions({
    lang: {
        thousandsSep: ','
    }
  });

  $.when($.get('/data/SOR_Charts_Draft_04082016.csv')).then(
    function(data){
      var rent_data = $.csv.toObjects(data);
      var cleaned_data = [];
      var years = [];

      //format numbers
      $.each(rent_data, function(row_id, row){
        var row_data = [];
        $.each(row, function(col_id, col){
          row_data.push(parseInt(col.replace(/,/g,'')));

          if(years.indexOf(col_id) == -1)
            years.push(col_id);
        });
        cleaned_data.push(row_data);
      });

      var series_data = [];
      series_data.push({
            name: 'Owner-Occupied',
            data: cleaned_data[1],
            color: '#C0CAE6'
          });

      series_data.push({
            name: 'Renter-Occupied',
            data: cleaned_data[0],
            color: '#527AB8'
          });

      // console.log(series_data);
      // console.log(years)

      $('#chart').highcharts({
        chart: {
            type: 'area'
        },
        credits: { enabled: false },
        title: {
            text: 'Cook County Renter-occupied vs Owner-occupied housing: 2000 - 2014'
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
                text: 'Percent'
            },
            labels: {
              formatter: function () {
                return this.value + '%';
              }
            },
            max: 50,
            min: 30
        },
        tooltip: {
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.percentage:.1f}%</b> ({point.y:,.0f} households)<br/>',
            shared: true
        },
        plotOptions: {
            area: {
                stacking: 'percent',
                lineColor: '#ffffff',
                lineWidth: 2,
                marker: {
                    lineWidth: 1,
                    lineColor: '#ffffff',
                    symbol: 'square'
                },
                dataLabels: {
                    enabled: true,
                    formatter: function () {
                      return this.percentage.toFixed(1) + '%';
                    }
                }
            }
        },
        series: series_data
    });




    //   // initialize chart
    //   chart = new Highcharts.Chart({
    //     chart: {
    //         renderTo: 'chart',
    //         type: 'area'
    //     },
    //     title: {
    //         text: "Renter-occupied vs Owner-occupied housing: 2000 - 2014",
    //         x: -20 //center
    //     },
    //     credits: { enabled: false },
    //     yAxis: {
    //         title: {
    //             text: 'Percent'
    //         },
    //         labels: {
    //             formatter: function() {
    //                 return this.value + ' %';
    //             }
    //         },
    //     },
    //     xAxis: {
    //       categories: years,
    //       tickmarkPlacement: 'on',
    //       title: {
    //           enabled: false
    //       }
    //     },
    //     tooltip: {
    //       crosshairs: true,
    //       formatter: function() {
    //         return "<strong>" + this.series.name + "</strong><br />" + this.x + "<br />" + this.y + "%";
    //       }
    //     },
    //     legend: {
    //       enabled: false
    //     },
    //     plotOptions: {
    //       series: {
    //         marker: {
    //           radius: 0,
    //           states: {
    //             hover: {
    //               enabled: true,
    //               radius: 5
    //             }
    //           }
    //         },
    //         shadow: false,
    //         states: {
    //            hover: {
    //               lineWidth: 10
    //            }
    //         }
    //       }
    //     },
    //     series: series_data
    //   });
    });
}