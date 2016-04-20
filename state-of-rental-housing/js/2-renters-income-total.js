$(function () {

  $.when($.get('data/2-renters-income-total.csv')).then(
    function(data){

      [series_data, years] = ChartHelper.prep_chart_data(data, 'row');

      ChartHelper.make_bar_chart('#chart_0', series_data, years, 'Shifts in Renter Households by Income level, 2011 to 2014', '', 'Households')
  });
});