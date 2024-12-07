
import { test, expect } from 'vitest';
import { calcTax, calcTaxForTwo } from './src/tax';

test('test calcTest', () => {
    expect(calcTax(2024, 100000)).toStrictEqual({
        "afterTaxIncome": 77073,
        "fTax": 15177,
        "income": 100000,
        "pTax": 7750,
        "totalTax": 22927,
        "year": 2024,
    });
    expect(calcTax(2025, 100000)).toStrictEqual({
        "afterTaxIncome": 77156,
        "fTax": 15094,
        "income": 100000,
        "pTax": 7750,
        "totalTax": 22844,
        "year": 2025,
    });
})

test('test calcTaxForTwo', () => {
    expect(calcTaxForTwo(2024, 100000)).toStrictEqual({
        "afterTaxIncome": 84000,
        "fTax": 10500,
        "income": 100000,
        "pTax": 5500,
        "totalTax": 16000,
        "year": 2024,
    });
    // note: the same numbers as 2024 because 100,000 / 2 is > the next bracket therefore same taxes
    expect(calcTaxForTwo(2025, 100000)).toStrictEqual({
        "afterTaxIncome": 84000,
        "fTax": 10500,
        "income": 100000,
        "pTax": 5500,
        "totalTax": 16000,
        "year": 2025,
    });
    expect(calcTaxForTwo(2024, 200000)).toStrictEqual({
        "afterTaxIncome": 154146,
        "fTax": 30354,
        "income": 200000,
        "pTax": 15500,
        "totalTax": 45854,
        "year": 2024,
    });
    expect(calcTaxForTwo(2025, 200000)).toStrictEqual({
        "afterTaxIncome": 154312,
        "fTax": 30188,
        "income": 200000,
        "pTax": 15500,
        "totalTax": 45688,
        "year": 2025,
    });
});
