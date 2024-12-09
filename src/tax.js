// 
// 
// Both federal and Alberta tax structures provide tax credits, 
// the most common being the basic personal amount. 
// For the 2024 tax year, the federal basic personal amount is $15,7051
//  and the Alberta basic personal amount is $21,885.
// 
// 
// https://www.freshbooks.com/en-ca/hub/taxes/dividend-tax-credit 
// https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/payroll/payroll-deductions-contributions/canada-pension-plan-cpp/cpp-contribution-rates-maximums.html 
// https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/payroll/payroll-deductions-contributions/employment-insurance-ei/ei-premium-rate-maximum.html
// 
// 

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

const CPP_MAX_CONTRIBUTION = 3867.50;
const EI_MAX_CONTRIBUTION = 1049.12;

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

export function calcTax(input) {
    // console.log('calcTax', input);
    const { year, employmentIncome = 0, selfEmploymentIncome = 0, otherIncome = 0,
        eligibleDividends = 0, ineligibleDividends = 0, capitalGains = 0 } = input;

    let cpp = 0;
    if (employmentIncome > 35000) {
        cpp = (employmentIncome - 35000) * .0595;
    }
    if (cpp > CPP_MAX_CONTRIBUTION) {
        cpp = CPP_MAX_CONTRIBUTION;
    }

    if (selfEmploymentIncome > 3500) {
        cpp = cpp + (selfEmploymentIncome - 3500) * (.0595 * 2);
        if (cpp > (CPP_MAX_CONTRIBUTION * 2)) {
            cpp = (CPP_MAX_CONTRIBUTION * 2);
        }
    }

    let ei = (employmentIncome + selfEmploymentIncome) * 1.64;
    if (ei > EI_MAX_CONTRIBUTION) {
        ei = EI_MAX_CONTRIBUTION;
    }

    const eligibleDividendsIncome = eligibleDividends ? (eligibleDividends * 1.38) : 0;
    const ineligibleDividendsIncome = ineligibleDividends ? (ineligibleDividends * 1.15) : 0;

    let capitalGainsIncome = 0;
    if (capitalGains < 250000) {
        capitalGainsIncome = capitalGains * .5;
    } else {
        capitalGainsIncome = 250000 * .5 + (capitalGains - 250000) * .6667;
    }

    const taxableIncome = employmentIncome + selfEmploymentIncome - cpp - ei + otherIncome + eligibleDividendsIncome + ineligibleDividendsIncome + capitalGainsIncome;
    const totalIncome = employmentIncome + selfEmploymentIncome + otherIncome + eligibleDividends + ineligibleDividends + capitalGains;

    const result = { taxableIncome, year, cpp, ei };
    const fTaxBracket = fedTaxTable[year];
    let fTax = calcTaxForBracket(taxableIncome, fTaxBracket, fedTaxRate);
    fTax -= 15705 * .15 + eligibleDividendsIncome * 0.150198 + ineligibleDividendsIncome * 0.090301;
    if (fTax < 0) fTax = 0;
    result.fTax = Math.round(fTax);
    const pTaxBracket = abTaxTable[year];
    let pTax = calcTaxForBracket(taxableIncome, pTaxBracket, abTaxRate);
    // console.log('pTax',taxableIncome,pTax);

    pTax -= 21885 * .10 + eligibleDividendsIncome * .0812 + ineligibleDividends * .0218;
    if (pTax < 0) pTax = 0;
    result.pTax = Math.round(pTax);
    result.totalIncome = totalIncome;
    result.totalTax = Math.round(fTax + pTax + cpp + ei);
    result.afterTaxIncome = result.totalIncome - result.totalTax;
    return result;
}

export function calcTaxForTwo(input) {
    const tf1 = calcTax({ 
        year: input.year,
        employmentIncome: input.employmentIncome / 2,
        selfEmploymentIncome: input.selfEmploymentIncome / 2,
        otherIncome: input.otherIncome / 2,
        eligibleDividends: input.eligibleDividends / 2,
        ineligibleDividends: input.ineligibleDividends / 2,
        capitalGains: input.capitalGains / 2,
    });
        
    return { 
        year: input.year,
        totalIncome: tf1.totalIncome * 2,
        fTax: tf1.fTax * 2,
        pTax: tf1.pTax * 2,
        cpp: tf1.cpp * 2,
        ei: tf1.ei * 2,
        totalTax: tf1.totalTax * 2,
        afterTaxIncome: tf1.afterTaxIncome * 2,
    };
}

export let fedTaxTable = calcFutureTaxRates(STARTING_YEAR, PERIODS, INFLATION, OVERRIDE_INFLATION, FED_TAX_TABLE);
export let abTaxTable = calcFutureTaxRates(STARTING_YEAR, PERIODS, INFLATION, OVERRIDE_INFLATION, AB_TAX_TABLE);

export let fedTaxRate = FED_TAX_TABLE.map(([v, r]) => r);
export let abTaxRate = AB_TAX_TABLE.map(([v, r]) => r);

// console.log(fedTaxRate);
// console.log(fedTaxTable);
// console.log(abTaxRate);
// console.log(abTaxTable);
