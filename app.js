'use strict';

const express = require('express');
const app = express();
const request = require('request');
const port = process.env.PORT || 3000;
// const m = require('moment');
const h = require('./helpers');

app.set('view engine', 'ejs');


app.get('/', (req, res) => {
    res.render('index');
})




app.get('/test', (req, res) => {

    let parameters = {

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
        }, {
            "Symbol": "IBM",
            "Type": "price",
            "Params": ["c"]
        }]


    }
    parameters = encodeURIComponent(JSON.stringify(parameters));

    let url = `http://dev.markitondemand.com/MODApis/Api/v2/InteractiveChart/json?parameters=${parameters}`;


    request(url, (error, data, body) => {

        if (!error && data.statusCode === 200) {

            let parsedData = JSON.parse(body);


            let symbolsRow = h.createSymbolsRow(parsedData);
            let datesColumn = h.createDatesColumn(parsedData);
            let stockValues = h.extractStockValues(parsedData.Elements);
            let chartTable = h.addValuesToDates(datesColumn, stockValues);

            chartTable.unshift(symbolsRow); //add header of table

            res.render('index', { data: parsedData, chartTable: JSON.stringify(chartTable) });

        } else {
            res.send(error);
        }



    });
})

app.listen(port, () => {
    console.log('Server is running on port ' + port)
});
