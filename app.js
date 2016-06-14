'use strict';

const express = require('express');
const app = express();
const request = require('request');
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');


app.get('/', (req,res) => {
	res.render('index');
})


var parameters =  {

	 Normalized: false,
	 NumberOfDays: 5,
	 Symbol: 'AAPL',
	 DataPeriod: 'Day',
	 Elements: [
	 		{
	 			"Symbol" : "AAPL" ,
	 			"Type" : "price" ,
	 			"Params" : ["c"]
	 		}
	 ]


}
var parameters = encodeURIComponent(JSON.stringify(parameters));

var url =`http://dev.markitondemand.com/MODApis/Api/v2/InteractiveChart/json?parameters=${parameters}`;
console.log(url);

console.log(parameters)

app.get ('/test' , (req,res) => {
	request( url, (error, data ,body ) => {
  			
  			if ( !error && data.statusCode === 200) {

  				let parsedData = JSON.parse(body);
	  		    console.log(parsedData);
	  			res.send('hey')

  			} else {
  				res.send(error);
  			}

  	
  			
	});
})

app.listen(port, () => {
	console.log('Server is running on port '+ port)
})


