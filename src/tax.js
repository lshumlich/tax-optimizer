
console.log('***** tax.js ****** has just run... Should only run once.');


const STARTING_YEAR = 2024;
const PERIODS = 36;
const INFLATION = .02
const OVERRIDE_INFLATION = { 2025: .027 }

const FED_TAX_TABLE = [
    [55867, .15],
    [111733, .205],
    [173205, .26],
    [246752, .29],
    [Number.MAX_VALUE, .33]
];

const AB_TAX_TABLE = [
    [148269, .1],
    [177922, .12],
    [237230, .13],
    [355845, .14],
    [Number.MAX_VALUE, .15]
];

function calcFutureTaxRates(startingYear, periods, inflation, overrideInflation, initialTaxTable) {
    let prevYear = startingYear
    let prevRates = initialTaxTable.map(([v, r]) => v);
    let taxTable = {};

    for (let i = 0; i < periods; i++) {
        taxTable[prevYear] = prevRates;
        prevYear++;
        let rate = inflation;
        if (prevYear in overrideInflation) rate = overrideInflation[prevYear];

        prevRates = prevRates.map(r => Math.round(r * (1 + rate)));
    }
    return taxTable;
}

function calcTaxForBracket(income, brackets, rates) {
    let tax = 0
    let prevLimit = 0
    brackets.forEach((incomeLimit, i) => {
        if (income > incomeLimit) {
            tax += (incomeLimit - prevLimit) * rates[i];
        }
        else if (income > prevLimit) {
            tax += (income - prevLimit) * rates[i];
        }
        prevLimit = incomeLimit;
    })
    return Math.round(tax);
}

export function calcTax(year, income) {
    const fTaxBracket = fedTaxTable[year];
    let fTax = calcTaxForBracket(income, fTaxBracket, fedTaxRate);
    fTax -= (15000 * .15);
    if (fTax < 0) fTax = 0;
    const pTaxBracket = abTaxTable[year];
    let pTax = calcTaxForBracket(income, pTaxBracket, abTaxRate);
    pTax -= (15000 * .15);
    if (pTax < 0) pTax = 0;
    return fTax + pTax;
}

export function calcTaxForTwo(year, income) {
    const halfIncome = income / 2;
    const tax = calcTax(year, halfIncome);
    return tax * 2;
}



export let fedTaxTable = calcFutureTaxRates(STARTING_YEAR, PERIODS, INFLATION, OVERRIDE_INFLATION, FED_TAX_TABLE);
export let abTaxTable = calcFutureTaxRates(STARTING_YEAR, PERIODS, INFLATION, OVERRIDE_INFLATION, AB_TAX_TABLE);

export let fedTaxRate = FED_TAX_TABLE.map(([v, r]) => r);
export let abTaxRate = AB_TAX_TABLE.map(([v, r]) => r);

// console.log(fedTaxRate);
// console.log(fedTaxTable);
// console.log(abTaxRate);
// console.log(abTaxTable);
