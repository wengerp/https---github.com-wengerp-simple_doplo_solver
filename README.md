# A simple Doplo Solver.
A search algorithm for solving doplo  ridles (https://www.doplo.ch/) using a heuristic backtracking algorithm. If it is run on  standard hardware it is capable to solve up to 6x6 ridles. 7x7 ridles might taking hours and hours... 
## Usage Sample
```
var simpleDoploSolver = require("@wengerp/simple_doplo_solver");
var sampleRidle5x5 = [0, 3, 2, 6, 5, 0, 5, 3, 0, 0];
var result = simpleDoploSolver.search(sampleRidle5x5);
result.print();
```
## verbose mode
You can add an additional parameter to the search call. This parameter denotes the frequency of the output on standard out. If for example you choose 100 then there will be an update of the verbose info every 100 loop runs. This means the higer the number to lower the update. If you specify 1 as the parameter value the every single loop run will update the infomation. Be aware that this might slow down the search.
### Usage Sample
```
var simpleDoploSolver = require("@wengerp/simple_doplo_solver");
var sampleRidle6x6 = [6, 10, 4, 5, 6, 0, 6, 2, 1, 5, 9, 1];
var result = simpleDoploSolver.search(sampleRidle6x6,100);
result.print();
```