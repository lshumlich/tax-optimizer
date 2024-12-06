import { dollarFormatter } from "./utils";

test('dollar formatter', () => {
    expect(dollarFormatter('1,2,3')).toBe('123');
}) 