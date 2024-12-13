import { toNumber } from "../utils";

export class Yearly {
    constructor(params) {
        Object.assign(this, params);
    }
    getValues() {
        return this;
    }
    createNextYear() {
        return new Yearly({
            year: this.year + 1,
        });
    }
}

export class Scenario {
    // 
    // Create a scenario based on the params.
    // 
    constructor(params) {
        Object.assign(this, params);

        if (!this.year) this.year = 2030;
        if (!this.iterations) this.iterations = 30;
        if (!this.inflation) this.inflation = .022;
        if (!this.interest) this.interest = .052;
        if (!this.age) this.age = 65;
        if (!this.partnerAge) this.partnerAge = 64;

        this.yearArray = [...Array(this.iterations)].map((_, i) => {
            return new Yearly({
                year: this.year + i,
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

        this.yearArray.forEach((y, i, n) => {
            y.registeredGain = Math.round(y.totalRegistered * y.interest);
            y.unregisteredGain = Math.round(y.totalUnregistered * y.interest);
            y.TFSAGain = Math.round(y.totalTFSA * y.interest);
            const nextYear = n[i + 1];
            if (nextYear) {
                nextYear.totalRegistered = y.totalRegistered + y.registeredGain;
                nextYear.totalUnregistered = y.totalUnregistered + y.unregisteredGain;
                nextYear.totalTFSA = y.totalTFSA + y.TFSAGain;
            }
        })
    }

    getArray() {
        return this.yearArray;
    }

    getYear(year) {
        return this.yearArray[year - this.year];
    }

}
