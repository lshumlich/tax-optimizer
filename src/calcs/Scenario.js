import { calcTax, calcTaxForTwo } from "../tax";
import { toNumber } from "../utils";
import { ATTRIBUTES } from "./attributes";

export class Yearly {
    constructor(params) {
        Object.assign(this, params);
        this.totalUnregistered = 0;
        this.unregisteredGain = 0;
        this.unregisteredUse = 0;
        this.unregisteredDeposit = 0;
        this.totalRegistered = 0;
        this.registeredGain = 0;
        this.registeredUse = 0;
        this.totalTFSA = 0;
        this.TFSAGain = 0;
        this.TFSAUse = 0;
        this.shortFall = 0;
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
        Object.assign(this, params);
        const toAge = 95;

        this.iterations = (toAge - this.age) + 1;
        if (this.iterations > 0 && this.iterations < 100) {
            null;
        } else {
            this.iterations = 10;
        }
        // console.log(this.iterations, this.age);


        this.yearArray = [...Array(this.iterations)].map((_, i) => {
            return new Yearly({
                year: this.startYear + i,
                age: this.getNum('age') + i,
                partnerAge: this.getNum('partnerAge') + i,
                inflation: this.inflation,
                interest: this.interest,
            });
        })

        const year0 = this.yearArray[0];
        year0.totalRegistered = toNumber(this.totalRegistered) || 0;
        year0.totalUnregistered = toNumber(this.totalUnregistered) || 0
        year0.totalTFSA = toNumber(this.totalTFSA) || 0;
        year0.annualExpenses = toNumber(this.annualExpenses) || 0;

        Object.keys(ATTRIBUTES).forEach(a => {
            const { editable } = ATTRIBUTES[a]
            if (editable === 'yearly') {
                // console.log('---Deal with',a);
                const yearlyVals = params[a];
                if (yearlyVals) {
                    Object.keys(yearlyVals).forEach(y => {
                        try {
                            if (this.getYear(y)) {
                                this.getYear(y)[a] = yearlyVals[y];
                            }
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

            y.decumulation = y.getNum('totalExpenses') - y.getNum('totalIncome');

            let registered = y.getNum('totalRegistered') + y.getNum('registeredGain');
            let unregistered = y.getNum('totalUnregistered') + y.getNum('unregisteredGain');
            let TFSA = y.getNum('totalTFSA') + y.getNum('TFSAGain');
            let nonTFSA = registered + unregistered;

            // Is there a decumulation and if so can it be allocated to the investments
            try {
                if (y.decumulation > 0) {
                    if (y.decumulation <= nonTFSA) {
                        // Just prorate it.
                        y.registeredUse = Math.round(y.decumulation * (registered / nonTFSA) * -1);
                        y.unregisteredUse = (y.decumulation + y.registeredUse) * -1;
                        y.TFSAUse = 0;
                        // last resort use up registered and unregistered and then tfsa then add to decumulation
                    } else {
                        let remainingDecumulation = y.decumulation;
                        if (registered > 0) {
                            y.registeredUse = registered * -1;
                            remainingDecumulation -= registered;
                        }
                        if (unregistered > 0) {
                            y.unregisteredUse = unregistered * -1;
                            remainingDecumulation -= unregistered;
                        }
                        if (TFSA > remainingDecumulation) {
                            y.TFSAUse = remainingDecumulation * -1;
                        } else {
                            y.TFSAUse = TFSA * -1;
                            remainingDecumulation -= TFSA;
                            y.shortFall = remainingDecumulation * -1;
                        }
                        // throw new Error(`In ${y.year} Non TFSA can not handle Short Fall.... No... what to do.`);
                        // console.log(`--- In ${y.year} Non TFSA can not handle Short Fall.... did I do it right???`);
                    }
                } else {
                    y.unregisteredDeposit = y.decumulation * -1;
                    // throw new Error(`In ${y.year} Short Fall of ${y.decumulation} is actually positive.... Yes... but what to do.`);
                    // console.log(`--- In ${y.year} Short Fall of ${y.decumulation} is actually positive.... Yes... add it to deposit.`);
                }

                // Calculate the tax burden...
                // const { year, employmentIncome = 0, selfEmploymentIncome = 0, otherIncome = 0,
                //     eligibleDividends = 0, ineligibleDividends = 0, capitalGains = 0 } = input;

                // const taxes = calcTax({
                const taxes = calcTaxForTwo({
                    year: y.year,
                    otherIncome: y.getNum('otherIncome') - y.getNum('registeredUse'),
                    capitalGains: y.getNum('unregisteredGain')
                });
                // console.log(taxes);

                const nextYear = n[i + 1];
                if (nextYear) {
                    nextYear.totalRegistered = y.totalRegistered + y.registeredGain + y.registeredUse;
                    nextYear.totalUnregistered = y.totalUnregistered + y.unregisteredGain + y.unregisteredUse + y.unregisteredDeposit;
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
    getNum(s) {
        return toNumber(this[s]);
    }

    // ---------------- Optimization processes ---------------------------

    // 
    //
    // 

    getOptimumSpend(runs) {
        // 
        // Grab the results from the current run
        // 
        const periods = this.getArray().length;
        const annualExpenses = this.getArray()[0].annualExpenses;
        const initialInvestments = this.getArray()[0].investments;
        const shortFall = this.getArray().reduce((a, c) => a + c.shortFall, 0);
        const endingInvestments = this.getArray()[periods - 1].investments - this.getArray()[periods - 1].decumulation;

        runs.push({
            periods,
            shortFall,
            endingInvestments,
            annualExpenses,
            initialInvestments,
            result: endingInvestments + shortFall,
            percent: annualExpenses / initialInvestments,
        });

        const limits = runs.reduce((a, c, i) => {
            // let [foundI, val] = a;
            let { result } = c;

            if (result < 0 && result > a.over[1]) {
                a.over = [i, result];
            }
            if (result > 0 && result < a.under[1]) {
                a.under = [i, result];
            }

            // console.log(a);

            return a;
        }, {
            // over / under spend
            over: [-1, Number.MAX_VALUE * -1],
            under: [-1, Number.MAX_VALUE]
        }
        );

        const over = limits.over[0];
        const under = limits.under[0];

        let newTry = 0;
        if (over === -1) {
            const { percent } = runs[under];
            newTry = initialInvestments * (percent + .1);
        } else if (under === -1) {
            newTry = initialInvestments * .1;
        } else {
            const overPercent = runs[over].percent;
            const underPercent = runs[under].percent;
            const newPercent = ((overPercent - underPercent) / 2.0) + underPercent;
            
            newTry = newPercent * initialInvestments;
            // console.log('--- ',over,under,newPercent,newTry,);
        }

        // console.log(`   newTry: ${newTry} limits = ${limits}`, limits);

        return Math.round(newTry);
    }
    showRuns(r) {
        console.log(`---- Stats periods: ${r.periods} percent = ${r.percent} initialInvestments: ${r.initialInvestments} shortFall: ${r.shortFall} endingInvestments: ${r.endingInvestments} annualExpenses: ${r.annualExpenses}`);
    }
}
