import fs from "fs";
import csv from "csv-to-js-parser";
import { group } from "console";


const csvToObj = csv.csvToObj;

const data = fs.readFileSync('result.csv').toString();

// Log the first line of the CSV to check headers
const firstLine = data.split('\n')[0];
console.log('CSV Headers:', firstLine);

// Define the description object
const description = {
    id: { type: 'number', group: 1},
    category: { type: 'string', group: 2 },
    brand: { type: 'string', group: 2 },
    name: { type: 'string', group: 2 },
    price: { type: 'string', group: 2 },
    image: { type: 'string', group: 2 },
    link: { type: 'string', group: 2 }
};

// Parse the CSV
try {
    let obj = csvToObj(data, ',', description);
    // save obj to json file
    fs.writeFileSync('data.json', JSON.stringify(obj, null, 1));
    console.log('CSV parsed successfully');
} catch (error) {
    console.error('Error:', error.message);
}