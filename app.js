var express = require('express');
var streamifier = require('streamifier');
var bodyParser = require('body-parser');
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var PythonShell = require ('python-shell');

var app = express();

app.use(bodyParser.urlencoded({ 
    extended: true,
    limit: '5mb',
    parameterLimit: 100000 
}));
app.use(bodyParser.json({limit: '5mb'}));

var config = 
   {
     userName: 'mukesh.kr', // update me
     password: 'Levers111', // update me
     server: 'unilevercbprod.database.windows.net', // update me
     options: 
        {
           database: 'ULAFR2RBOT' //update me
           , encrypt: true
        }
   };

var connection = new Connection(config);

// Attempt to connect and execute queries if connection goes through


app.use(function(req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'content-type,x-prototype-version,x-requested-with');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.get('/graphdata',function(req, response){

    connection.on('connect', function(err) {
        if (err) {
          console.log(err)
        }
    }
    );
    var result = [];
    console.log('Reading rows from the Table...');

    // Read all rows from table
    request = new Request(
        "SELECT DISTINCT TOP (10) region,target from dbo.AccuracyOfFinancialReporting ORDER BY 'target' ASC ;",
        function(err, rowCount, rows) 
        {
            console.log(rowCount + ' row(s) returned');
            console.log("Data is",result);

            for(var i= 1;i<result.length;i++){
                result[i] = result[i].replace("%","");
                result[i] = result[i].replace(">=","");
                result[i] = parseInt(result[i]);
                i++;
            }
            console.log(result);
            response.send(JSON.stringify(result));
        }
    );
    request.on('row', function(columns) {
        columns.forEach(function(column) {
            
            result.push(column.value);
            
            console.log("%s\t%s", column.metadata.colName, column.value);
        });
    });
    connection.execSql(request);
});

app.post('/base64Image', function(req, response) {
    // console.log(req.body);
    var image_base64 = req.body.image;
    var image_name = req.body.image_file_name;
    uploadBlob(image_base64,image_name,function(error_result,response_result){
        if(error_result)
            response.send(JSON.stringify({'error':response_result}));
        else
            response.send(JSON.stringify({'Success':response_result}));
    });

});



function graphEngine(type){
    
    console.log("graph ENgine is called !")

    var options =
    {
     pythonPath: 'D:\\home\\python364x64\\python.exe',  
     scriptPath: 'D:\\home\\site\\wwwroot',
    };

    console.log("All option parameter: "+ options);

   let pyshell = PythonShell.run('python_script.py', options,function (error_result,response_result) {
        console.log("After the recomm function: ");
        console.log("Error is: "+error_result);
        console.log("Response is: "+response_result);
        
        if(error_result)
           callback("Error",error_result);
    });
    
    pyshell.on('error', (err) => {
        console.log(err);
    });
}

app.get('/',function(req,response){
    response.send('Welcome to Dynamic Chart generation API');
});

app.post('/getChart',function(req,response){
    graphEngine(req.body.type);
    response.send(req.body);
});

var port = process.env.port || 1337;
var server = app.listen(port, function (req,res,next) {
    console.log("App listening at %s", port);
    //graphEngine();
 })
//.on('error', function(err){
//     console.log('on error handler');
//     console.log(err);
// });

  
// process.on('uncaughtException', function(err) {
//     console.log('Caught Error');
// });