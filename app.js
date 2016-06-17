'use strict';

const express = require('express');
const app = express();
const request = require('request');
const port = process.env.PORT || 3000;
const m = require('moment');

app.set('view engine', 'ejs');


app.get('/', (req, res) => {
    res.render('index');
})


var parameters = {

    Normalized: false,
    NumberOfDays: 30,
    Symbol: 'AAPL',
    DataPeriod: 'Day',
    Elements: [{
        "Symbol": "AAPL",
        "Type": "price",
        "Params": ["c"]
    }, {
        "Symbol": "FB",
        "Type": "price",
        "Params": ["c"]
    }]


}
var parameters = encodeURIComponent(JSON.stringify(parameters));

var url = `http://dev.markitondemand.com/MODApis/Api/v2/InteractiveChart/json?parameters=${parameters}`;


app.get('/test', (req, res) => {

    request(url, (error, data, body) => {

        if (!error && data.statusCode === 200) {

            let parsedData = JSON.parse(body);
            

            let symbolsRow  =  createSymbolsRow(parsedData);
            let datesColumn =  createDatesColumn(parsedData);
            let stockValues =  extractStockValues(parsedData.Elements);

            let chartTable = addValuesToDates(datesColumn,stockValues);
            
            chartTable.unshift(symbolsRow);

     

            res.render('index', { data: parsedData , chartTable: JSON.stringify(chartTable)});
            // res.send(chartTable);



        } else {
            res.send(error);
        }



    });
})

app.listen(port, () => {
    console.log('Server is running on port ' + port)
});




function createSymbolsRow (parsedApiData) {
    
    let elements = parsedApiData.Elements;

    let symbolNames = elements.map((element)=> {
            return element.Symbol;
        });
        //prefix 'Date' to symbols Array
    symbolNames.unshift('Date');

    return symbolNames;

}

function createDatesColumn(parsedApiData) {

    let dates = parsedApiData.Dates;
    let formattedDates = sanitizeDates(dates);
    let datesColumn = formattedDates.map((date) => {
        return [date];
    })
    return datesColumn;

}

function sanitizeDates(dates) {

    let sanitizedDates = dates.map((date) => {
        return m(date, 'YYYY-MM-DDTHH:mm:ss').format("MMMM DD YYYY");
    });
    return sanitizedDates;

}



function extractStockValues (elements) {

	let values = elements.map((element) => {
		console.log(element);
		 return element.DataSeries.close.values;
	});

	return values;
}


function addValuesToDates (dates, values) {
	//dates is an array of arrays.In each array index 0 is a date, we want to push values to dates

	values.forEach((value) => {
		
		for (let i = 0; i < value.length; i ++ ){
			dates[i].push(value[i]);
		}
	})

	return dates;
}