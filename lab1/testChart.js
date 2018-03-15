const path = require('path');
require('dotenv').config({path: path.join(__dirname, "../.env")});
const plotly = require('plotly')(process.env.PLOTLY_USERNAME, process.env.PLOTLY_API_KEY);

var data = [
  {
    x: ["2013-10-04 22:23:00", "2013-11-04 22:23:00", "2013-12-04 22:23:00"],
    y: [1, 3, 6],
    type: "scatter"
  }
];
var graphOptions = {filename: "date-axes", fileopt: "overwrite"};

plotly.plot(data, graphOptions, function (err, msg) {
    console.log(msg);
});