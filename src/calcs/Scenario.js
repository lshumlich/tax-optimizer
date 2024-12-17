import { calcTax } from "../tax";
import { toNumber } from "../utils";
import { ATTRIBUTES } from "./attributes";

export class Yearly {
    constructor(params) {
        Object.assign(this, params);
    }
    getValues() {
        return this;
    }
    getNum(s) {
        return toNumber(this[s]);
    }

    // get totalExpenses() {
    //     return this.totalExpenses ? this.totalExpenses : '';
    // }
    // set totalExpenses(v) {
    //     this.totalExpenses = v;
    // }
    // createNextYear() {
    //     return new Yearly({
    //         year: this.year + 1,
    //     });
    // }
}

export class Scenario {
    // 
    // Create a scenario based on the params.
    // 
    constructor(params) {
        const toAge = 95;
        Object.assign(this, params);

        this.iterations = (toAge - this.age) + 1;

        this.yearArray = [...Array(this.iterations)].map((_, i) => {
            return new Yearly({
                year: this.startYear + i,
                age: this.age + i,
                partnerAge: this.partnerAge + i,
                inflation: this.inflation,
                interest: this.interest,
            });
        })

        const year0 = this.yearArray[0];
        year0.totalRegistered = toNumber(this.totalRegistered) || 0;
        year0.totalUnregistered = toNumber(this.totalUnregistered) || 0
        year0.totalTFSA = toNumber(this.totalTFSA) || 0;

        Object.keys(ATTRIBUTES).forEach(a => {
            const { editable } = ATTRIBUTES[a]
            if (editable === 'yearly') {
                // console.log('---Deal with',a);
                const yearlyVals = params[a];
                if (yearlyVals) {
                    Object.keys(yearlyVals).forEach(y => {
                        try {
                            this.getYear(y)[a] = yearlyVals[y];
                        } catch (e) {
                            console.log(`*** Trying to set '${a}' for '${y}' but it failed.`);
                            console.log(e);
                        }
                    })
                    // console.log('---really deal with:',params[a]);
                }
            }
        })
        // year0.employment = toNumber(this.employment) || 0;
        // year0.selfEmployment = toNumber(this.selfEmployment) || 0;
        // year0.otherIncome = toNumber(this.otherIncome) || 0;
        // year0.yearlyExpenses = toNumber(this.yearlyExpenses) || 0;

        this.yearArray.forEach((y, i, n) => {
            y.registeredGain = Math.round(y.totalRegistered * y.interest);
            y.unregisteredGain = Math.round(y.totalUnregistered * y.interest);
            y.TFSAGain = Math.round(y.totalTFSA * y.interest);
            y.investments = y.totalRegistered + y.totalUnregistered + y.totalTFSA;
            y.totalGain = y.registeredGain + y.unregisteredGain + y.TFSAGain;

            y.totalExpenses = y.getNum('annualExpenses') + y.getNum('onetimeExpenses') + y.getNum('taxes');
            y.totalIncome = y.getNum('employment') + y.getNum('selfEmployment') + y.getNum('otherIncome');

            y.shortFall = y.getNum('totalExpenses') - y.getNum('totalIncome');

            let registered = y.getNum('totalRegistered') + y.getNum('registeredGain');
            let unregistered = y.getNum('totalUnregistered') + y.getNum('unregisteredGain');
            let nonTFSA = registered + unregistered;

            // Is there a shortFall and if so can it be allocated to the investments
            try {
                if (y.shortFall > 0) {
                    if (y.shortFall <= nonTFSA) {
                        // Just prorate it.
                        y.registeredUse = Math.round(y.shortFall * (registered / nonTFSA) * -1);
                        y.unregisteredUse = (y.shortFall + y.registeredUse) * -1;
                        y.TFSAUse = 0;
                    } else {
                        throw new Error(`In ${y.year} Non TFSA can not handle Short Fall.... No... what to do.`);
                    }
                } else if (y.shortFall < 0) {
                    throw new Error(`In ${y.year} Short Fall of ${y.shortFall} is actually positive.... Yes... but what to do.`);
                }

                // Calculate the tax burden...
                // const { year, employmentIncome = 0, selfEmploymentIncome = 0, otherIncome = 0,
                //     eligibleDividends = 0, ineligibleDividends = 0, capitalGains = 0 } = input;

                const taxes = calcTax({
                    year:y.year,
                    otherIncome: y.getNum('otherIncome') - y.getNum('registeredUse'),
                    capitalGains: y.getNum('unregisteredGain')
                });
                // console.log(taxes);
                
                const nextYear = n[i + 1];
                if (nextYear) {
                    nextYear.totalRegistered = y.totalRegistered + y.registeredGain + y.registeredUse;
                    nextYear.totalUnregistered = y.totalUnregistered + y.unregisteredGain + y.unregisteredUse;
                    nextYear.totalTFSA = y.totalTFSA + y.TFSAGain + y.TFSAUse;
                    nextYear.annualExpenses = Math.round(y.getNum('annualExpenses') * (1 + y.getNum('interest')));
                    nextYear.taxes = taxes.totalTax;
                }
            } catch (e) {
                console.log(e);
            }
        })
    }

    getArray() {
        return this.yearArray;
    }

    getYear(year) {
        return this.yearArray[year - this.startYear];
    }

}
