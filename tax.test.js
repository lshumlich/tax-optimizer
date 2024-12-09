
import { test, expect } from 'vitest';
import { calcTax, calcTaxForTwo } from './src/tax';

test('test calcTest', () => {
    expect(calcTax({ year: 2024, otherIncome: 100000 })).toStrictEqual({
        "afterTaxIncome": 77117,
        "fTax": 15071,
        "totalIncome": 100000,
        "taxableIncome": 100000,
        "pTax": 7812,
        "totalTax": 22883,
        "year": 2024,
    });
})

test('test calcTaxForTwo', () => {
    expect(calcTaxForTwo({ year: 2024, otherIncome: 100000 })).toStrictEqual({
        "afterTaxIncome": 84088,
        "fTax": 10288,
        "income": 100000,
        "pTax": 5624,
        "totalTax": 15912,
        "year": 2024,
    });
    // note: the same numbers as 2024 because 100,000 / 2 is > the next bracket therefore same taxes
});
