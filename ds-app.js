var hs = require('./heuristicSearch');

//var aTask = [12, 2, 15, 2, 9, 12, 0, 5, 0, 4, 7, 8, 15, 4];  // No 109 
//var aTask = [6, 10, 4, 5, 6, 0, 6, 2, 1, 5, 9, 1];  // 9:51  // 7:40 // 7:32  // 7:12  // 6.50  // 13 Sek.
//var aTask = [1, 5, 6, 0, 1, 7, 4, 10, 5, 4, 4, 1];  // 44 Min.  // 37 Sek.
//var aTask = [5, 4, 0, 8, 7, 0, 9, 4, 6, 8, 0, 0];    // 36 Sek.
//var aTask = [3, 10, 4, 3, 4, 3, 3, 2, 3, 2, 10, 5];    // No 71  // 33 Sek.
var aTask = [0, 3, 2, 6, 5, 0, 5, 3, 0, 0];  // 0.8 Sek. // 0.7 // 0.05 // 0.07
//var aTask = [0, 0, 0, 3, 0, 1, 0, 1];
//var aTask = [0,1,0,0,1,0];
var result = hs.search(aTask, 500);
result.print();