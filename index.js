const express = require('express')
const app = express()

app.get('/', (req, res) => {
	// require file system and jsdom
	var fs = require('fs');
	 
	// For jsdom version 10 or higher.
	// Require JSDOM Class.
	var JSDOM = require('jsdom').JSDOM;
	// Create instance of JSDOM.
	var jsdom = new JSDOM('<body><div id="container"></div></body>', {runScripts: 'dangerously'});
	// Get window
	var window = jsdom.window;
	 
	// For jsdom version 9 or lower
	// var jsdom = require('jsdom').jsdom;
	// var document = jsdom('<body><div id="container"></div></body>');
	// var window = document.defaultView;
	 
	// require anychart and anychart export modules
	var anychart = require('anychart')(window);
	var anychartExport = require('anychart-nodejs')(anychart);
	 
	// create and a chart to the jsdom window.
	// chart creating should be called only right after anychart-nodejs module requiring
	var chart = anychart.pie([
		    ["Chocolate", 5],
		    ["Rhubarb compote", 2],
		    ["Crêpe Suzette", 2],
		    ["American blueberry", 2],
		    ["Buttermilk", 1]
		]);
	chart.title("Top 5 pancake fillings");
	chart.legend(true);
	chart.bounds(0, 0, 800, 600);
	chart.container('container');
	chart.draw();
	 
	// generate JPG image and save it to a file
	anychartExport.exportTo(chart, 'jpg').then(function(image) {
	  console.log(console.log(image.toString('base64')));
	  /*fs.writeFile('anychart.jpg', image, function(fsWriteError) {
	    if (fsWriteError) {
	      console.log(fsWriteError);
	    } else {
	      console.log('Complete');
	    }
	  });*/
	  res.send('Complete');
	}, function(generationError) {
	  //console.log(generationError);
	  res.send(generationError);
	});

	res.send('Hello World!');
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))
