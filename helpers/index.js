'use strict';

const m = require('moment');


function createSymbolsRow(parsedApiData) {

    let elements = parsedApiData.Elements;

    let symbolNames = elements.map((element) => {
        return element.Symbol;
    });
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



function extractStockValues(elements) {

    let values = elements.map((element) => {
        return element.DataSeries.close.values;
    });

    return values;
}


function addValuesToDates(dates, values) {
    //dates is an array of arrays.In each array index 0 is a date, we want to push values to dates

    values.forEach((value) => {

        for (let i = 0; i < value.length; i++) {
            dates[i].push(value[i]);
        }
    })

    return dates;
}


function createChartTable(parsedData) {
    let symbolsRow = createSymbolsRow(parsedData);
    let datesColumn = createDatesColumn(parsedData);
    let stockValues = extractStockValues(parsedData.Elements);
    let chartTable = addValuesToDates(datesColumn, stockValues);

    chartTable.unshift(symbolsRow); //add header of table
    return chartTable;
}



function Parameters(symbolArray) {
    let Normalized = false;
    let NumberOfDays = 30;
    let DataPeriod = 'Day';

    this.symbols = symbolArray;

    let Elements = this.symbols.map((symbol) => {
        return {
            "Symbol": symbol,
            "Type": "price",
            "Params": ["c"]
        }
    })

    return {
        Normalized,
        NumberOfDays,
        DataPeriod,
        Elements
    }



}


module.exports = {
    createDatesColumn,
    createSymbolsRow,
    extractStockValues,
    sanitizeDates,
    addValuesToDates,
    Parameters,
    createChartTable
}
