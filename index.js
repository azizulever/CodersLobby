var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var compiler = require("compilex");
require('./data') 

const port = 5500;

var app = express();
app.use(bodyParser());

var option = { stats: true };
compiler.init(option);

app.use(express.static('public'))

app.post("/compilecode", function (req, res) {
    var code = req.body.code;
    // var input = req.body.input;
    var inputRadio = req.body.inputRadio;
    var lang = req.body.lang;
    if (lang === "C" || lang === "C++") {
        let problem = problemSet[0];

        if(problem['hasInput']) {
            var envData = { OS: "windows", cmd: "g++", options: {timeout:10000}};
            compiler.compileCPPWithInput(envData, code, problem['input'], function(data) {
                if(data.error) {
                    console.log(data.error);
                    res.redirect('failed.html')
                }
                else {
                    console.log("OUTPTU: "+data.output)
                    if(data.output == problem['expectedOutput']){
                        res.redirect('success.html')
                    }else{
                        res.redirect('failed.html')
                    }
                }
            });
            } else {
                var envData = {OS: "windows", cmd: "g++", options: {timeout:10000}};
                compiler.compileCPP(envData, code, function(data) {
                    console.log("OUTPTU: "+data.output)
                    if(data.output == problem['expectedOutput']){
                        res.redirect('success.html')
                    }else{
                        res.redirect('failed.html')
                    }
                });
            }
        }
        if(lang === "Python") {
           if(inputRadio === "true") {
            var envData = {OS: "windows"};
            compiler.compilePythonWithInput(envData, code, input, function(data) {
                res.send(data);
            });
           } else {
            var envData = {OS: "windows"};
            compiler.compilePython(envData, code, function(data) {
                res.send(data);
            });
           }
        }
    });

app.get("/fullStat", function(req, res) {
    compiler.fullStat(function(data) {
        res.send(data);
    });
});

app.listen(port);

compiler.flush(function() {
    console.log("All temporary files flushed !");
});