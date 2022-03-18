'use strict';

const fs = require('fs');

process.stdin.resume();
process.stdin.setEncoding('utf-8');

let inputString = '';
let currentLine = 0;

process.stdin.on('data', inputStdin => {
    inputString += inputStdin;
});

process.stdin.on('end', _ => {
    inputString = inputString.trim().split('\n').map(str => str.trim());
    
    main();
});

let readLine = () => inputString[currentLine++];


// Complete the calculateArea function below.
// It returns a Promise which on success, returns area of the shape, and on failure returns [-1].
let calculateArea = (shape, values) => {

    const myShape = {
        rectangle: (l, b) => { return (l * b) },
        square: (l) => { return (l * l) },
        circle: (r) => { return (3.14 * r * r) },
        triangle: (b, h) => { return (b * h / 2) }
    };
    return new Promise((resolve, reject) => {
        if (Object.keys(myShape).includes(shape.toLowerCase())) {
                console.log(shape)
            switch (shape) {
                case shape = "rectangle":
                    return resolve(myShape.rectangle(values[0], values[1]));
                case shape = "square":
                    return resolve(myShape.square(values));
                case shape = "circle":
                    return resolve(myShape.circle(values));
                case shape = "triangle":
                    return resolve(myShape.triangle(values[0], values[1]));
                default:
                    return reject([-1]);
            }
        } else {
            return reject([-1]);
        };
    });
}

// Complete the generateArea function below.
// It returns a Promise which on success, returns an array of areas of all the shapes and on failure, returns [-1].
let getAreas = async(shapes, values_arr) => {
    let areas = [];
    if (shapes.length === values_arr.length) {
        for (let i = 0; i < shapes.length; i++) {
            const area = await calculateArea(shapes[i], values_arr[i])
            Number.isInteger(area) ? areas.push(area) : areas.push(Math.round((area + Number.EPSILON) * 100)/100);
        };
        return areas;
    } else {
        return [-1];
    };
}

let callCalculateArea = async (shapes, values) => await calculateArea(shapes[0], values[0]).catch(error => error) instanceof Promise;

let callGetAreas = (shapes, values) => getAreas(shapes, values).catch(error => error);

function main() {
    const ws = fs.createWriteStream(process.env.OUTPUT_PATH);

    const n = parseInt(readLine(), 10);

    let shapes = [];

    for (let shapesItr = 0; shapesItr < n; shapesItr++) {
        const shapesItem =  readLine();
        shapes.push(shapesItem);
    }

    let values = [];

    for (let valuesItr = 0; valuesItr < n; valuesItr++) {
        const valuesItem =  readLine();
        values.push(JSON.parse('[' + valuesItem + ']'));
    }
    
    if (callCalculateArea(shapes, values)) {
        callGetAreas(shapes, values).then((res) => {
            ws.write(res.join('\n') + '\n');
            ws.end();
        });
    } else {
        console.error('calculateArea does not return a Promise.');
    }
}
