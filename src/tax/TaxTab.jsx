import { useState } from "react";
import { useEffect, useCallback } from "react";

import { dollarFormatter, toNumber } from "../utils"
import { DollarInput } from "../components/DollarInput";
import {
    // abTaxRate,
    // abTaxTable,
    // fedTaxRate,
    // fedTaxTable,
    calcTax,
    calcTaxForTwo,
  } from "../tax";
  
// ----------- TaxTab

export function TaxTab(params) {
    const [result, setResult] = useState({});
    const input = params.o;
  
    const runTaxCalc = useCallback(() => {
      const calcInput = {
        year: input.year,
        otherIncome: toNumber(input.otherIncome),
        employmentIncome: toNumber(input.employmentIncome),
        selfEmploymentIncome: toNumber(input.selfEmploymentIncome),
        capitalGains: toNumber(input.capitalGains),
        eligibleDividends: toNumber(input.eligibleDividends),
        ineligibleDividends: toNumber(input.ineligibleDividends),
      };
  
      try {
        if (input.withPartner) {
          setResult(calcTaxForTwo(calcInput));
        } else {
          setResult(calcTax(calcInput));
        }
      } catch (e) {
        console.trace(e);
        setResult({});
      }
    }, [input]);
  
    useEffect(() => {
      runTaxCalc();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  
    return (
      <>
        <div className="flex w-full flex-wrap">
          <TaxInput run={runTaxCalc} o={input} />
          <TaxDisplay o={result} />
        </div>
      </>
    );
  }
  
  // ----------- TaxDisplay
  
  function TaxDisplay(params) {
    const result = params.o;
    return (
      <div className="flex flex-wrap mt-5 bg-white w-80 drop-shadow-[0_0px_10px_rgba(0,0,0,0.25)] rounded-2xl m-4 p-4">
        <h2 className="justify-center w-80 font-serif">Tax Results</h2>
        <div className="flex mt-6">
          <span className="w-36 text-left font-serif">Total Income:</span>
          <span className="w-36 text-right">
            {dollarFormatter(result.totalIncome)}
          </span>
        </div>
        <hr></hr>
        <div className="flex mt-3 border-t-2 pt-2">
          <span className="w-36 text-left font-serif font-bold">Total Tax:</span>
          <span className="w-36 text-right">
            {dollarFormatter(result.totalTax)}
          </span>
        </div>
        <div className="flex mt-3">
          <span className="w-36 text-left font-serif">Federal Tax:</span>
          <span className="w-36 text-right">{dollarFormatter(result.fTax)}</span>
        </div>
        <div className="flex mt-3">
          <span className="w-36 text-left font-serif">Provincial Tax:</span>
          <span className="w-36 text-right">{dollarFormatter(result.pTax)}</span>
        </div>
        <div className="flex mt-3">
          <span className="w-36 text-left font-serif">CPP premiums</span>
          <span className="w-36 text-right">{dollarFormatter(result.cpp)}</span>
        </div>
        <div className="flex mt-3">
          <span className="w-36 text-left font-serif">EI</span>
          <span className="w-36 text-right">{dollarFormatter(result.ei)}</span>
        </div>
        <div className="flex mt-3 border-t-2 pt-2">
          <span className="w-36 text-left font-serif font-bold">
            After Tax Income
          </span>
          <span className="w-36 text-right">
            {dollarFormatter(result.afterTaxIncome)}
          </span>
        </div>
      </div>
    );
  }
  
  // ----------- TaxInput
  
  function TaxInput(params) {
    const [input, setInput] = useState({
      year: 0,
      employmentIncome: 0,
      selfEmploymentIncome: 0,
      capitalGains: 0,
      eligibleDividends: 0,
      ineligibleDividends: 0,
      otherIncome: 0,
      withPartner: false,
    });
  
    useEffect(() => {
      // console.log('TaxInput - useEffect',params.o);
  
      setInput(params.o);
    }, [params]);
    const [count, setCount] = useState(0);
  
    function setDollar(e) {
      input[e.target.name] = dollarFormatter(e.target.value);
      setCount(count + 1);
      params.run();
    }
  
    function setCheckBox(e) {
      input[e.target.name] = e.target.checked;
      setCount(count + 1);
      params.run();
    }
  
    function genSetter(e) {
      input[e.target.name] = e.target.value;
      setCount(count + 1);
      params.run();
    }
  
    return (
      <div className="flex flex-wrap mt-5 bg-white w-80 drop-shadow-[0_0px_10px_rgba(0,0,0,0.25)] rounded-2xl m-4 p-4">
        <div className="w-36">
          <label className="mt-5 mb-2 flex cursor-pointer items-center text-sm font-medium text-gray-600">
            {"Year"}
          </label>
          <input
            value={input.year}
            type="number"
            name="year"
            min="2024"
            max="2099"
            size={5}
            pattern="^(202[4-9]|20[3-9][0-9]|2099)$"
            className="peer block w-24 rounded-full border-2 border-gray-300 bg-transparent px-4 py-2 text-right text-sm font-normal tabular-nums text-gray-900 placeholder:text-gray-400 invalid:border-red-600 focus:bg-white focus:outline-none focus:outline-0 focus:[&:not(:invalid)]:border-blue-300"
            onChange={genSetter}
          />
        </div>
  
        <div className="w-36 mt-5">
          <label className="text-center">{"Income Splitting"}</label>
          <div className="grid items-center justify-center ">
            <input
              checked={input.withPartner}
              type="checkbox"
              name="withPartner"
              className="h-10"
              onChange={setCheckBox}
            />
          </div>
        </div>
  
        <DollarInput
          name="employmentIncome"
          heading="Employment Income"
          value={input.employmentIncome}
          onChange={setDollar}
        />
  
        <DollarInput
          name="selfEmploymentIncome"
          heading="Self Employment Income"
          value={input.selfEmploymentIncome}
          onChange={setDollar}
        />
  
        <DollarInput
          name="capitalGains"
          heading="Capital Gains"
          value={input.capitalGains}
          onChange={setDollar}
        />
  
        <DollarInput
          name="eligibleDividends"
          heading="Eligible Dividends"
          value={input.eligibleDividends}
          onChange={setDollar}
        />
  
        <DollarInput
          name="ineligibleDividends"
          heading="Ineligible Dividends"
          value={input.ineligibleDividends}
          onChange={setDollar}
        />
  
        <DollarInput
          name="otherIncome"
          heading="Other Income"
          value={input.otherIncome}
          onChange={setDollar}
        />
      </div>
    );
  }
  