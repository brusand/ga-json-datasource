'use strict';
const {google} = require('googleapis');
const analytics = google.analytics('v3');

var keys = require('/Users/dev/vscode-ts-node-debugging/LoGADashboard-0ca2ec0a14cb.json');
var viewID = 'ga:160890197';
var express = require('express');
var bodyParser = require('body-parser');


var _ = require('lodash');
var app = express();

app.use(bodyParser.json());

var timeserie = require('./series');

var now = Date.now();

for (var i = timeserie.length -1; i >= 0; i--) {
  var series = timeserie[i];
  var decreaser = 0;
  for (var y = series.datapoints.length -1; y >= 0; y--) {
    series.datapoints[y][1] = Math.round((now - decreaser) /1000) * 1000;
    decreaser += 50000;
  }
}

var annotation = {
  name : "annotation name",
  enabled: true,
  datasource: "generic datasource",
  showLine: true,
}

var annotations = [
  { annotation: annotation, "title": "Donlad trump is kinda funny", "time": 1450754160000, text: "teeext", tags: "taaags" },
  { annotation: annotation, "title": "Wow he really won", "time": 1450754160000, text: "teeext", tags: "taaags" },
  { annotation: annotation, "title": "When is the next ", "time": 1450754160000, text: "teeext", tags: "taaags" }
];

var now = Date.now();
var decreaser = 0;
for (var i = 0;i < annotations.length; i++) {
  var anon = annotations[i];

  anon.time = (now - decreaser);
  decreaser += 1000000
}

var table =
  {
    columns: [{text: 'Time', type: 'time'}, {text: 'Country', type: 'string'}, {text: 'Number', type: 'number'}],
    values: [
      [ 1234567, 'SE', 123 ],
      [ 1234567, 'DE', 231 ],
      [ 1234567, 'US', 321 ],
    ]
  };
  
function setCORSHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "accept, content-type");  
}


var now = Date.now();
var decreaser = 0;
for (var i = 0;i < table.values.length; i++) {
  var anon = table.values[i];

  anon[0] = (now - decreaser);
  decreaser += 1000000
}

app.all('/', function(req, res) {
  setCORSHeaders(res);
  res.send('I have a quest for you!');
  res.end();
});

app.all('/search', function(req, res){
  setCORSHeaders(res);
  var result = [];
  _.each(timeserie, function(ts) {
    result.push(ts.target);
  });

  res.json(result);
  res.end();
});

app.all('/annotations', function(req, res) {
  setCORSHeaders(res);
  console.log(req.url);
  console.log(req.body);

  res.json(annotations);
  res.end();
})
app.all('/query1', function(req, res){
  setCORSHeaders(res);
  console.log(req.url);
  console.log(req.body);

  var tsResult = [];
  _.each(req.body.targets, function(target) {
    if (target.type === 'table') {
      tsResult.push(table);
    } else {
      var k = _.filter(timeserie, function(t) {
        return t.target === target.target;
      });

      _.each(k, function(kk) {
        tsResult.push(kk)
      });
    }
  });

  res.json(tsResult);
  res.end();
});
app.all('/query', function(req, res){
  setCORSHeaders(res);
  console.log(req.url);
  console.log(req.body);
  
  var seriesList = [];

  var jwtClient = new google.auth.JWT(keys.client_email, null , keys.private_key, ['https://www.googleapis.com/auth/analytics.readonly'], null);
  jwtClient.authorize(function (err, tokens) {
    if (err) {
      console.log(err);
      return;
    }
  
    analytics.data.ga.get({
      'auth': jwtClient,
      'ids': viewID,
      'metrics': 'ga:pageviews',
      'start-date': 'yesterday',
      'end-date': 'today',
    }, function (err, response) {
      if (err) {
        console.log(err);
        return;
      }
      //console.log(JSON.stringify(response.data.rows);
      var dp = []
      _.each(response.data.rows, function(kk) {
        dp.push([parseInt(kk), 0])
      });
      seriesList.push({"target": "ga:pageviews", "datapoints": dp});
      res.json(seriesList);
      res.end();
    });
  });



});
app.listen(3333);

console.log("Server is listening to port 3333");
