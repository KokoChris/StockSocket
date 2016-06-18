      google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(drawChart);
 


      function drawChart() {
        
        var data = google.visualization.arrayToDataTable(chartTable);

        var options = {
          title: 'Closing Values For The Past 30 Days',
          curveType: 'function',
          legend: { position: 'bottom' }
        };

        var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

        chart.draw(data, options);
      }