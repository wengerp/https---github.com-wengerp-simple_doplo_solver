# A simple Doplo Solver using a heuristic search algorithm. Can solve up to 6x6 ridles.

Usage Sample:

var simpleDoploSolver = require("@wengerp/simple_doplo_solver");
var sampleRidle5x5 = [0, 3, 2, 6, 5, 0, 5, 3, 0, 0];
var result = simpleDoploSolver.search(sampleRidle5x5);
result.print();