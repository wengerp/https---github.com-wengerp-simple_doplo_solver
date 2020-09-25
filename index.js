var readline = require('readline');
const _ = require('lodash');

counter = 0;

class SearchSet {
    constructor(size) {
        this.lastSetIndex = 0;
        this.size = size;
        this.sets = [];
        var firstSet = [];
        firstSet.push(0);
        firstSet.push(0);
        for (var i = 1; i < size - 1; i++) {
            firstSet.push(i);
        }
        var t;
        var perms = getPermutations(firstSet);
        var uniqPerms = perms.filter((t = {}, a => !(t[a] = a in t)));
        uniqPerms.forEach(element => {
            if (this.sets.indexOf(element) < 0) {
                this.sets.push(element);
            }
        });
    }

    getSet(index) {
        if (index < this.sets.length) {
            this.lastSetIndex = index;
        } else {
            this.lastSetIndex = 0;
        }
        return this.sets[this.lastSetIndex];
    }

};

class HeuristicSearchNode {

    constructor(searchSet, size, solution) {
        this.uuid = uuidv4();
        this.searchSet = searchSet;
        this.size = size;
        this.sets = [];
        this.solution = solution;
        this.level = 0;
        this.heuristicValue = 0;

    };

    copy(index) {
        var c = new HeuristicSearchNode(this.size);
        c.uuid = uuidv4();
        c.searchSet = this.searchSet;
        c.size = this.size;
        c.sets = this.sets.slice();
        c.solution = this.solution;
        c.level = this.level + 1;
        c.heuristicValue = this.heuristicValue;
        if (c.level <= c.size) {
            c.sets.push(this.searchSet.getSet(index));
        }
        return c;
    };

    getLine(lineIndex) {
        return this.sets[lineIndex];
    };

    updateHeuristicValue() {
        var heuristicValue = 0;
        heuristicValue = this.calculateHeuristicValue();
        this.heuristicValue = heuristicValue;
    };

    getFirstValuesFromColumn(columnIndex) {
        if (columnIndex < this.size) {
            var columnValues = [];
            for (var i = 0; i < this.sets.length; i++) {
                var val = this.sets[i][columnIndex];
                if (val > 0) {
                    columnValues.push(val);
                }
            }
            return columnValues;
        }
        return null;
    };

    getColumn(columnIndex) {
        if (columnIndex < this.size) {
            var columns = [];
            for (var i = 0; i < this.sets.length; i++) {
                columns[i] = this.sets[i][columnIndex];
            }
            return columns;
        }
        return null;
    };

    isValid() {
        for (var j = 0; j < this.level; j++) {
            if (this.checkLine(j) != 0) {
                return false;
            }
        }
        for (var i = 0; i < this.size; i++) {
            var tempColumn = this.getFirstValuesFromColumn(i);
            if (hasDuplicates(tempColumn)) {
                return false;
            }
        }
        return true;
    };

    calculateHeuristicValue() {
        var error = 0;
        if (this.sets.length < this.size) {
            error = (this.size - this.sets.length);
        } else {
            for (var index = 0; index < this.size; index++) {
                error += (this.checkLine(index));
                error += (this.checkColumn(index));
            }
        }
        return error;
    }

    isSolution() {
        var error = 0;
        if (this.sets.length < this.size) {
            error = this.size - this.sets.length;
        } else {
            for (var index = 0; index < this.size; index++) {
                error += this.checkLine(index);
                error += this.checkColumn(index);
            }
        }
        return error;
    };

    checkDoubleBlacks(lineIndex) {
        var sum = 0;
        var numBlacks = 0;
        for (var columnIndex = 0; columnIndex < this.size; columnIndex++) {
            var addValue = this.getLine(lineIndex)[columnIndex];
            if (addValue == 0 && numBlacks == 0)  // first black 
            {
                numBlacks++;
            } else if (addValue == 0 && numBlacks > 0) // second black
            {
                numBlacks++;
            }
            else if (addValue > 0 && numBlacks == 1)  // Value Field between blacks
            {
                return false;
            } else {  // value outside blacks

            }
        }
        return true;
    };

    checkLine(lineIndex) {
        var result = 0;
        var sum = 0;
        var numBlacks = 0;
        for (var columnIndex = 0; columnIndex < this.size; columnIndex++) {
            var addValue = this.getLine(lineIndex)[columnIndex];
            if (addValue == 0 && numBlacks == 0)  // first black 
            {
                numBlacks++;
            } else if (addValue == 0 && numBlacks > 0) // second black
            {
                numBlacks++;
            }
            else if (addValue > 0 && numBlacks == 1)  // Value Field between blacks
            {
                sum = sum + addValue;
            } else {  // value outside blacks

            }
        }
        result = Math.abs(numBlacks - 2) + Math.abs(this.solution[lineIndex] - sum);
        return result;
    };

    checkColumn(columnIndex) {
        var result = 0;
        var sum = 0;
        var numBlacks = 0;
        for (var lineIndex = 0; lineIndex < this.size; lineIndex++) {
            var addValue = this.getColumn(columnIndex)[lineIndex];
            if (addValue == 0 && numBlacks == 0)  // first black 
            {
                numBlacks++;
            } else if (addValue == 0 && numBlacks > 0) // second black
            {
                numBlacks++;
            }
            else if (addValue > 0 && numBlacks == 1)  // Value Field between blacks
            {
                sum = sum + addValue;
            } else {  // value outside blacks

            }
        }
        result = Math.abs(numBlacks - 2) + Math.abs(this.solution[columnIndex + this.size] - sum);
        return result;
    };

    dumpState() {
        readline.clearLine(process.stdout);
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`sets: ${this.sets}, heuristic value: ${this.heuristicValue}, level: ${this.level}`);
    }

    print() {
        this.sets.forEach((oItem, iIndex) => {
            console.log(`${this.solution[iIndex]} | ${oItem}`);
        });
        console.log(`   ----------`);
        
        process.stdout.write(`    `);
        
        for(let i = this.solution.length / 2; i <  this.solution.length; i++) {
            process.stdout.write(`${this.solution[i]} `);
        }
        process.stdout.write(`\n`);
        
    }
};

const hs = (solution,logFrequency) => {
    var size = solution.length/2
    var searchSet = new SearchSet(size);
    var hsnode = new HeuristicSearchNode(searchSet, size, solution);
    var result = [];
    console.time('HeuristicSearch');
    result = HeuristicSearchAlg(hsnode,logFrequency);
    console.timeEnd('HeuristicSearch');
    return result;
}

const HeuristicSearchAlg = (openElement,logFrequency) => {
    var _OPEN = [openElement];
    var _CLOSED = new Map();
    var _SOLUTION = [];
    while (_OPEN.length > 0) {
        var _X = _OPEN.shift();
        if (isSolution(_X)) {
            process.stdout.write("\n");
            return _X;
        } else {
            _SOLUTION.push(_X);
            var _CHILDREN = generateChildren(_X);
            _CLOSED.set(_X.uuid, _X);
            _CHILDREN = [...removeElementsFromArray(_CHILDREN, _OPEN)];
            _CHILDREN = [...removeElementsFromMap(_CHILDREN, _CLOSED)];


            for (var i = 0; i < _CHILDREN.length; i++) {
                _OPEN.unshift(_CHILDREN[i]);
            };

            _OPEN.sort(function (a, b) {
                return (a.heuristicValue) - (b.heuristicValue);
            });
            counter++;
            if (counter % logFrequency == 0) {
                _X.dumpState();
                dumpSearchState(_OPEN.length, _CLOSED.size, _CHILDREN.length);
            }
        }
    }
    return false;
};

function dumpSearchState(open, closed, children) {
    readline.cursorTo(process.stdout, 120);
    process.stdout.write(`OPEN: ${open}, CLOSED: ${closed}, CHILDREN: ${children}`);
};

function isSolution(_X_ELEMENT) {
    if (_X_ELEMENT != null) {
        if (_X_ELEMENT.isSolution() == 0) {
            return true;
        } else {
            return false;
        }
    }
    return false;
};

function generateChildren(_X_ELEMENT) {
    var children = [];
    if (_X_ELEMENT != null && _X_ELEMENT.level < _X_ELEMENT.size) {
        //for (var i = 0; i < fac(_X_ELEMENT.size); i++) {
        for (var i = 0; i < _X_ELEMENT.searchSet.sets.length; i++) {
            var c = _X_ELEMENT.copy(i);
            if (c.isValid()) {
                c.updateHeuristicValue();
                children.push(c);
            }
        }
        return children;
    }
    return children;
};

function removeElementsFromArray(_ELEMENTS, _ARRAY) {
    if (_ARRAY.length === 0) {
        return _ELEMENTS;
    } else {
        _ELEMENTS.forEach((oElement1, iIndex1) => {
            _ARRAY.forEach((oElement2, iIndex2) => {
                if (oElement1.uuid === oElement2.uuid) {
                    _ELEMENTS.splice(iIndex1, 1);
                }
            });
        });
        return _ELEMENTS;
    }
};

function removeElementsFromMap(_ELEMENTS, _MAP) {
    if (_MAP.length === 0) {
        return _ELEMENTS;
    } else {
        _ELEMENTS.forEach((oElement1, iIndex1) => {
            if (_MAP[oElement1.uuid])
                _ELEMENTS.splice(iIndex1, 1);
        });
    }
    return _ELEMENTS;
};

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function hasDuplicates(array) {
    return (new Set(array)).size !== array.length;
}

const getPermutations = arr => {

    const output = [];
    const swapInPlace = (arrToSwap, indexA, indexB) => {
        const temp = arrToSwap[indexA];
        arrToSwap[indexA] = arrToSwap[indexB];
        arrToSwap[indexB] = temp;
    };

    const generate = (n, heapArr) => {
        if (n === 1) {
            output.push(heapArr.slice());
            return;
        }

        generate(n - 1, heapArr);

        for (let i = 0; i < n - 1; i++) {
            if (n % 2 === 0) {
                swapInPlace(heapArr, i, n - 1);
            } else {
                swapInPlace(heapArr, 0, n - 1);
            }
            generate(n - 1, heapArr);
        }
    };

    generate(arr.length, arr.slice());

    return output;

};

module.exports.search = hs;

console.log("This is heuristicSearch - a classic backtracking search algorithm.");
console.log(`Node version: ${process.versions.node}`);