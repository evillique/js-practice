const ms_between_layers = 800;

let cur_ones = 0;
let cur_line = 0;
let max_lines = 0;
let max_precision = 10;

//// Plotter options
let options = {
    left: 0,
    right: 1,
    top: 1.03,
    bottom: 0,
    height: 500,
    width: 800
};

let sun = new Plotter("plot", options);
const button = document.querySelector('button');
const slider = document.getElementById('precision');

slider.addEventListener("change", changeParameters);

function changeParameters(event) {
    let n = parseInt(event.target.value);
    max_precision = Math.min(n, 10);
    max_lines = Math.max(n - 10, 0)
}

//// List of negative powers of 3
let three_pow = [];
for (let i = 1; i <= max_precision; ++i) {
    three_pow.push(1.0 / (3 ** i))
}

//// Main function that evaluates x and draws points
function recursion(ones, k, x) {
    if (k === max_precision) {
        sun.addPoint(x, y, {size: 1.1});
    } else if (k + ones === max_precision) {
        recursion(ones - 1, k + 1, x + three_pow[k])
    } else {
        recursion(ones, k + 1, x)
        if (ones > 0)
            recursion(ones - 1, k + 1, x + three_pow[k])

        recursion(ones, k + 1, x + 2 * three_pow[k])
    }
}

let y;

function print() {
    let startTime = performance.now();

    // Evaluate y for current layer
    y = 1.0 / (cur_ones + cur_line + 1);

    if (cur_ones === 5 && cur_line < max_lines) {
        sun.addFunc(function () {
            return y;
        }, {color: 6,
            strokeWidth: 2.3,
            left: 0,
            right: 1,
            top: 1.03,
            bottom: 0});
        ++cur_line;
    } else {
        recursion(cur_ones, 0, 0);
        ++cur_ones;
    }

    let endTime = performance.now();
    let timeDiff = endTime - startTime;
    console.log(timeDiff + " ms");

    if (cur_ones + cur_line > max_precision + max_lines) {
        return;
    }

    setTimeout(function () {
        print();
    }, Math.max(ms_between_layers - timeDiff, 0));
}

function start() {
    button.disabled = true;
    slider.disabled = true;

    setTimeout(function () {
        print();
    }, 500);
}