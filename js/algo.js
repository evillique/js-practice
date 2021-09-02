let cur_ones = 0;
const max_precision = 10;
const ms_between_layers = 1200;

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



function visibility(radioObj) {
    if (radioObj.value === "0") {
        document.getElementById("plot_bg").style.display = 'block';
        document.getElementById("plot_static").style.display = 'block';
        document.getElementById("plot").style.display = 'none';
    } else if (radioObj.value === "1") {
        document.getElementById("plot_bg").style.display = 'none';
        document.getElementById("plot_static").style.display = 'none';
        document.getElementById("plot").style.display = 'block';
    }
}

//// List of negative powers of 3
let three_pow = [];
for (let i = 1; i <= max_precision; ++i) {
    three_pow.push(1.0 / (3 ** i))
}

//// Main function that evaluates x and draws points
function recursion(ones, k, x) {
    if (k === max_precision) {
        sun.addPoint(x, y, {size: 1.5});
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
    y = 1.0/(cur_ones + 1);
    recursion(cur_ones, 0, 0);

    let endTime = performance.now();
    let timeDiff = endTime - startTime;
    console.log(timeDiff + " ms");

    if (++cur_ones > max_precision) {
        return;
    }

    setTimeout(function () {
        print();
    }, Math.max(ms_between_layers - timeDiff, 0));
}

function start() {
    button.disabled = true;

    setTimeout(function () {
        print();
    }, 500);
}