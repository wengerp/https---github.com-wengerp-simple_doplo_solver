# A simple Doplo Solver.
A search algorithm for solving doplo  ridles (https://www.doplo.ch/) using a heuristic backtracking algorithm. If it is run on  standard hardware it is capable to solve up to 6x6 ridles. 7x7 ridles might taking hours and hours... 
## Usage Sample
```
var simpleDoploSolver = require("@wengerp/simple_doplo_solver");
var sampleRidle5x5 = [0, 3, 2, 6, 5, 0, 5, 3, 0, 0];
var result = simpleDoploSolver.search(sampleRidle5x5);
result.print();
```