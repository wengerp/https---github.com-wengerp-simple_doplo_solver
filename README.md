# A simple Doplo Solver
A search algorithm for solving doplo  ridles (https://www.doplo.ch/) using a heuristic backtracking algorithm. If it is run on  standard hardware it is capable to solve up to 6x6 ridles. 7x7 ridles might taking hours and hours... 
## NEWS
I added a new CSP-based variation of the doplo solver to the repository. It is based on Essence 1.0, a language to describe problems as Constraint Satisfaction Problems (CSP). This approach is very strong. And since I used Savile Row (https://savilerow.cs.st-andrews.ac.uk) as environement it is possible to transform CSP-Problems to SAT instances. So called Satisfiability Problems deal with the NP = P Problem and therefore with the hardest problems to find solutions for. SAT-Solvers are incredibly mature software tools and are capable of solving 8x8 instances of Doplos in under a second. It might be possible to solve 9x9 instances. However, I don't know of any 9x9 instance to test this problem. If anybody happens to know of any 9x9 instances I would be interested.
### How to use
- Download Savile Row 1.9.0 (https://savilerow.cs.st-andrews.ac.uk/releases.html)
- install (copy) Savile Row in a directory of your choice
- change into the installation directory.
- start Savile Row with the following command: [FULL_PATH_TO_THE_PROJECT_FILES]/doplov2.eprime [FULL_PATH_TO_THE_PROJECT_FILES]/doplov2.param -sat -run-solver -all-solutions
- After about 1 second the programm finishes and there are a few new files in the project directory: doplov2.param.solution.0000001 (the solution) and doplov2.param.info (statistics)
- of course you can also try other parameters or just generate the SAT-File in DIMACS format. The latter can be achieved in omitting the "-run-solver" parameter. You can then look into the (huge) DIMACS file and solve it with any SAT-Solver. However, you will then have to interpretate the solution yourself.
## API
```
(HeuristicNode) startnode prepare((Int Array)restrictionsarray)
(HeuristicNode) resultnode search((HeuristicNode)startnode, [(Int)verbosecount])

(HeuristicNode) node.print() 
(HeuristicNode) node.sets = (Int Array)(Int Array) expectedresultarray 
```
``` 
restrictionsarray: an array of integers with the given restrictions (from top to down, then left to right).
expectedresultarray: a two dimensional array of integers (line by line from top to down).
if the search doesn't find any solution it will return null;
``` 
## Usage Sample
```
const sds = require("@wengerp/simple_doplo_solver");
var startnode = sds.prepare([0, 3, 2, 6, 5, 0, 5, 3, 0, 0]);
const result = sds.search(startnode);
result.print();
```
## verbose mode
You can add an additional parameter to the search call. This parameter denotes the frequency of the output on standard out. If for example you choose 100 then there will be an update of the verbose info every 100 loop runs. This means the higer the number the lower the update. If you specify 1 as the parameter value then every single loop run will update the infomation. Be aware that this might slow down the search.
### Usage Sample
```
const sds = require("@wengerp/simple_doplo_solver");
var startnode = sds.prepare([0, 3, 2, 6, 5, 0, 5, 3, 0, 0]);
const result = sds.search(startnode,100);
result.print();
```
## check external solutions
If for some reason you want to verify an external solution you can add the expected result to the HeuristicNode which is returned by the prepare call. The expected result must be entered as a two dimensional array of integers (line by line, top down).
### Usage Sample
```
const sds = require("@wengerp/simple_doplo_solver");
var startnode = sds.prepare([0, 3, 2, 6, 5, 0, 5, 3, 0, 0]);
startnode.sets = [[3,1,0,0,2],[2,0,3,0,1],[0,2,0,1,3],[0,3,1,2,0],[1,0,2,3,0]];
const result = sds.search(startnode,100);
if (result) result.print(); else console.log("invalid solution");
```