
import { test, expect } from 'vitest';
import { Yearly, Scenario } from './yearly';

test('yearly class', () => {
    const year = new Yearly({year:2024});
    expect(year.createNextYear().getValues()).toStrictEqual({year:2025});
})

test('creating scenarios', () => {
    // const o = {};
    const scenario = new Scenario({
        inflation:.02,interest:.05,
        year:2024,age:66,spouseAge:64,
        totalRegistered:'1,000,000',totalUnregistered:'2,000,000',
        totalTFSA:'500,000'
    });
    let year = scenario.getYear(2030);
    expect(year.getValues().year).toBe(2030)
    expect(scenario.getYear(2030).getValues().year).toBe(2030)
    expect(scenario.getYear(2040).getValues().year).toBe(2040)
    // expect(scenarios).toStrictEqual([1,2,3,4]);
})