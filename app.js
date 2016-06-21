'use strict';

const express = require('express');
const app = express();
const request = require('request');
const port = process.env.PORT || 3000;
const http = require('http').Server(app);
const io = require('socket.io')(http);
const h = require('./helpers');

var parameters = app.locals.parameters;
var symbols = app.locals.symbols;
app.use(express.static('public'));

app.set('view engine', 'ejs');


app.get('/', (req, res) => {
    if (!symbols || symbols.length === 0) {
    

        symbols = [];
      
        res.render('index', { data: undefined, chartTable: JSON.stringify([["Date"]]), symbols: symbols });


    } else {

        parameters = new h.Parameters(symbols);
        parameters = encodeURIComponent(JSON.stringify(parameters));

        let url = `http://dev.markitondemand.com/MODApis/Api/v2/InteractiveChart/json?parameters=${parameters}`;

        request(url, (error, data, body) => {


            if (!error && data.statusCode === 200) {

                let parsedData = JSON.parse(body);

                let chartTable = h.createChartTable(parsedData);

                res.render('index', { data: parsedData, chartTable: JSON.stringify(chartTable), symbols: symbols });

            } else {
                console.log(data.statusCode);
            }



        });
    }
})


io.on('connection', (socket) => {
    socket.on('add symbol', symb => {
        console.log(symb)

        if (symbols.indexOf(symb.slice(-1).toString()) === -1) {
            symbols = symb;
        }

        parameters = new h.Parameters(symbols);
        parameters = encodeURIComponent(JSON.stringify(parameters));

        let url = `http://dev.markitondemand.com/MODApis/Api/v2/InteractiveChart/json?parameters=${parameters}`;


        request(url, (error, data, body) => {

            if (!error && data.statusCode === 200) {

                let parsedData = JSON.parse(body);
                let chartTable = h.createChartTable(parsedData);
                socket.broadcast.emit('addSymbol', {
                    chart: JSON.stringify(chartTable),
                    symbols: symbols
                });

                socket.emit('addSymbol', {
                    chart: JSON.stringify(chartTable),
                    symbols: symbols
                });


            } else {


                symbols.splice(-1, 1); //remove the last symbol that caused the request to fail
                console.log(data.statusCode);
            }
        })

    });
    socket.on('removeSymbol', symbolToRemove => {

        symbols.splice(symbols.indexOf(symbolToRemove), 1);
        if (symbols.length > 0) {


            parameters = new h.Parameters(symbols);
            parameters = encodeURIComponent(JSON.stringify(parameters));

            let url = `http://dev.markitondemand.com/MODApis/Api/v2/InteractiveChart/json?parameters=${parameters}`;


            request(url, (error, data, body) => {

                if (!error && data.statusCode === 200) {

                    let parsedData = JSON.parse(body);
                    let chartTable = h.createChartTable(parsedData);
                    socket.broadcast.emit('removeSymbol', {

                        chart: JSON.stringify(chartTable),
                        symbolToRemove: symbolToRemove


                    });
                    socket.emit('removeSymbol', {

                        chart: JSON.stringify(chartTable),
                        symbolToRemove: symbolToRemove


                    })


                } else {


                    console.log(data.statusCode);
                }
            })
        } else {

            socket.emit('removeSymbol', {
                chart: undefined,
                symbolToRemove: symbolToRemove
            })
            socket.broadcast.emit('removeSymbol', {
                chart: undefined,
                symbolToRemove: symbolToRemove
            })
          
        }


    });
});


http.listen(port, () => {
    console.log('Server is running on port ' + port)
});
