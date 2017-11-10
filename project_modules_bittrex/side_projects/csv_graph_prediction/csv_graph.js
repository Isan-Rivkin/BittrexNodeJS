var csv = require("fast-csv");
var csv_list = [];
csv
 .fromPath("eth-parsed.csv")
 .on("data", function(data){
     csv_list.push(data);
 	})
 .on("end", function(){
 	csv_list.forEach((c)=>{
 		console.log(c);
 	});
     console.log("done");
 });