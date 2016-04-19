$(function () {

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

  $.when($.get('data/1-tenure.csv')).then(
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

    init_chart_0('#chart_0', series_data, years);
    init_chart_1('#chart_1', series_data, years);
    init_chart_2('#chart_2', series_data, years);
    init_chart_3('#chart_3', series_data, years);
  });
});

function init_chart_0(el, series_data, years) {
  $(el).highcharts({
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
}

function init_chart_1(el, series_data, years){

    $(el).highcharts({
      chart: {
          type: 'line'
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
              text: 'Households'
          },
          min: 0
      },
      tooltip: {
          pointFormat: '<span style="color:{series.color}">{series.name}</span>: {point.y:,.0f} households<br/>',
          shared: true
      },
      plotOptions: {
          line: {
              dataLabels: {
                  enabled: true
              }
          }
      },
      series: series_data
  });
}

function init_chart_2(el, series_data, years){

    $(el).highcharts({
      chart: {
          type: 'column'
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
              text: 'Households'
          },
          min: 0
      },
      tooltip: {
          pointFormat: '<span style="color:{series.color}">{series.name}</span>: {point.y:,.0f} households<br/>',
          shared: true
      },
      series: series_data
  });
}

function init_chart_3(el, series_data, years){

    var series_mixed = series_data.slice(0);
    series_mixed[0]['type'] = 'column';
    // series_mixed[0]['color'] = 'url(#highcharts-default-pattern-0)';
    series_mixed[1]['type'] = 'column';

    var trendline = []
    $.each(series_mixed[0]['data'], function(col_id, col){
      trendline.push(100* (series_mixed[1]['data'][col_id] / parseFloat(series_mixed[0]['data'][col_id] + series_mixed[1]['data'][col_id])));
    });

    // console.log(trendline);
    series_mixed.push({
      name: 'Percent renter-occupied',
      data: trendline,
      color: '#E26967',
      type: 'line',
      yAxis: 1
    });

    $(el).highcharts({
      chart: {
          alignTicks: false
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
      yAxis: [{
          title: {
              text: 'Households'
          },
          min: 0
      },{
          title: {
              text: 'Percent'
          },
          opposite: true
      }],
      tooltip: {
          pointFormat: '<span style="color:{series.color}">{series.name}</span>: {point.y:,.0f} households<br/>',
          shared: true
      },
      plotOptions: {
          line: {
              marker: {
                  lineWidth: 1,
                  lineColor: '#ffffff',
                  symbol: 'square'
              }
          }
      },
      series: series_mixed
  });
}