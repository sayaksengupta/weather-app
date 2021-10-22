const http = require("http");
const fs = require("fs");
var requests = require("requests");

const homeFile = fs.readFileSync("home.html","utf-8");

const replaceVal = (tempVal ,orgVal) => {
    let temperature = tempVal.replace("{%tempval%}",orgVal.main.temp);
    temperature = temperature.replace("{%location%}",orgVal.name);
    temperature = temperature.replace("{%country%}",orgVal.sys.country);
    temperature = temperature.replace("{%tempmin%}",orgVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}",orgVal.main.temp_max);
    temperature = temperature.replace("%tempstatus%",orgVal.weather[0].main);
    temperature = temperature.replace("{%condition%}",orgVal.weather[0].main);
    return temperature;
}

const server = http.createServer((req,res) => {
    if(req.url === "/"){
        requests("https://api.openweathermap.org/data/2.5/weather?q=Kolkata&units=metric&appid=08cd925c9e7793312c67de438f4c64a8")
        .on("data", (chunk) => {
          const objData = JSON.parse(chunk);
          const arrData = [objData]; 
        //   console.log(arrData[0].weather[0].main);
          const realTimeData = arrData.map((val) => replaceVal(homeFile,val)).join("");  //.join("") converts the array to string.
          res.write(realTimeData);
        // console.log(realTimeData);
        })
        .on("end", (err) => {
          if (err) return console.log('connection closed due to errors', err);

         res.end();
        });
    }else{
      res.end("Error 404! Page Not Found.")
    }
})

server.listen(8000,"127.0.0.1");
