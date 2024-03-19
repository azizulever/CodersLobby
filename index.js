var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var compiler = require("compilex");
var { problemSet } = require("./data");
var firebase = require("firebase/app");
var fs = require("firebase/firestore");
var { firebaseConfig } = require("./firebase_config");

const port = 5500;

// Initialize Firebase
const fbApp = firebase.initializeApp(firebaseConfig);
var db = fs.getFirestore(fbApp);

var app = express();
app.set('view engine', 'ejs');

app.use(bodyParser());

var option = { stats: true };
compiler.init(option);

function saveSubmissionToDb(isSuccess, code, output, expectedOutput) {
  fs.addDoc(fs.collection(db, "submissions"), {
    isSuccess: isSuccess,
    code: code,
    output: output,
    expectedOutput: expectedOutput,
    createdAt: (new Date).getTime(),
  });
}

app.use(express.static("public"));

app.post("/compilecode", function (req, res) {
  var code = req.body.code;

  let problem = problemSet[0];

  if (problem["hasInput"]) {
    var envData = { OS: "windows", cmd: "g++", options: { timeout: 10000 } };
    compiler.compileCPPWithInput(
      envData,
      code,
      problem["input"],
      function (data) {
        if (data.error) {
          console.log(data.error);
          res.redirect("failed.html");
        } else {
          console.log("OUTPTU: " + data.output);
          if (data.output == problem["expectedOutput"]) {
            saveSubmissionToDb(
              true,
              code,
              data.output,
              problem["expectedOutput"]
            );
            res.redirect("success.html");
          } else {
            saveSubmissionToDb(
              false,
              code,
              data.output,
              problem["expectedOutput"]
            );
            res.redirect("failed.html");
          }
        }
      }
    );
  } else {
    var envData = { OS: "windows", cmd: "g++", options: { timeout: 10000 } };
    compiler.compileCPP(envData, code, function (data) {
      console.log("OUTPTU: " + data.output);
      if (data.output == problem["expectedOutput"]) {
        saveSubmissionToDb(true, code, data.output, problem["expectedOutput"]);
        res.redirect("success.html");
      } else {
        saveSubmissionToDb(false, code, data.output, problem["expectedOutput"]);
        res.redirect("failed.html");
      }
    });
  }
});

app.get("/fullStat", function (req, res) {
  compiler.fullStat(function (data) {
    res.send(data);
  });
});

app.get("/history", async function (req, res){
    const querySnapshot = await fs.getDocs(
        fs.collection(db, "submissions"), 
        fs.orderBy("createdAt", "desc")
      );
    //   querySnapshot.forEach((doc) => {
    //     console.log(doc.id, " => ", doc.data());
    //   });
    res.render("history", {
        histories: querySnapshot, 
    });
  });

app.listen(port);

compiler.flush(function () {
  console.log("All temporary files flushed !");
});
