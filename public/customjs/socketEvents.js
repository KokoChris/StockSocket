var socket = io();
$('form').submit(function() {

    var newSymbol = $('#m').val();

    var symbols = chartTable[0].map(function(symbol) {
        return symbol;
    });
    symbols.push(newSymbol);
    symbols.shift();
    socket.emit('add symbol', symbols);

    $('#m').val('');


    return false;
});


socket.on('addSymbol', data => {

    var newItem = data.symbols.slice(-1)
    
    var tags = $('.tags');
    var tag = $('.tag');
    if (tag.length !== data.symbols.length){
        tags.append(`<span class="tag btn btn-small btn-primary">${newItem}</span>`)  

    }

    chartTable = (JSON.parse(data.chart));
    drawChart();
})

$('.tags').on('click','.tag', function() {
    let symbolToRemove = $(this).text()
    socket.emit('removeSymbol', symbolToRemove)
   
})

socket.on('removeSymbol', data => {
    let symbolToRemove = data.symbolToRemove;
    $(`.tag:contains("${symbolToRemove}")`).remove();
    
    if (data.chart) {
      chartTable = (JSON.parse(data.chart));
      drawChart();
    
    } else {
      chartTable = [['Date']];
      drawChart();
    }
})
