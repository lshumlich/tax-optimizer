
import { test, expect } from 'vitest';
import { dollarFormatter, toNumber } from "./utils";

test('dollar formatter', () => {
    expect(dollarFormatter('1,2,3')).toBe('123');
    expect(dollarFormatter('1,2,3.12')).toBe('123.12');
    expect(dollarFormatter('abc1,2,3.12')).toBe('abc1,2,3.12');
    expect(dollarFormatter(1234)).toBe('1,234');
    expect(dollarFormatter(null)).toBe('');
})

test('to number', () => {
    expect(toNumber('1,2,3')).toBe(123);
    expect(toNumber('1,2,3.12')).toBe(123.12);
    expect(toNumber('abc1,2,3.12')).toBe(NaN);
    expect(toNumber(null)).toBe(0);
    expect(toNumber(123)).toBe(123);
}) 
