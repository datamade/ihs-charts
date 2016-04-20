$(function () {

  $.when($.get('data/2-renters-income-total.csv')).then(
    function(data){

      [series_data, years] = ChartHelper.prep_chart_data(data, 'row');


      init_chart_0('#chart_0', series_data, years);
  });
});

function init_chart_0(el, series_data, years){

    $(el).highcharts({
      chart: {
          type: 'column'
      },
      credits: { enabled: false },
      title: {
          text: 'Shifts in Renter Households by Income level, 2011 to 2014'
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