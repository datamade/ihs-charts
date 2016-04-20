$(function () {

  $.when($.get('data/1-tenure.csv')).then(
    function(data){

      [cleaned_data, years] = clean_csv_data(data)

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

      ChartHelper.make_bar_chart('#chart_0', series_data, years, 'Cook County Renter-occupied vs Owner-occupied housing: 2000 - 2014', '', 'Households')
      init_chart_1('#chart_1', series_data, years);
  });
});

function clean_csv_data(data){
  // this is just for the first chart, where there are only col labels
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


function init_chart_1(el, series_data, years){

    var trendline = []
    $.each(series_data[0]['data'], function(col_id, col){
      trendline.push(100* (series_data[1]['data'][col_id] / parseFloat(series_data[0]['data'][col_id] + series_data[1]['data'][col_id])));
    });

    // console.log(trendline);
    var series_percent = [];
    series_percent.push({
      name: 'Percent renter-occupied',
      data: trendline,
      color: '#E26967'
    });

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
              text: 'Percent'
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
      series: series_percent
  });
}