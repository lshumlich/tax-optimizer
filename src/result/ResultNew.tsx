import React from "react";
import "handsontable/dist/handsontable.full.min.css";

import { registerAllModules } from "handsontable/registry";
import { HotTable } from "@handsontable/react";
import { Scenario } from "../calcs/Scenario";
import { ATTRIBUTES } from "../calcs/attributes";
import { useState } from "react";
import { Generator } from "../calcs/Generator";
import { dollarFormatter, toNumber } from "../utils";

registerAllModules();

export function ResultNewTab() {
  const formatDollar = {
    // thousandSeparated: true,
    pattern: ",",
  };

  let columnWidths;
  let colHeaders;
  let columns;

  const GeneralView = [
    "year",
    "age",
    "partnerAge",
    "shortFall",
    "investments",
    "totalGain",
    "totalRegistered",
    "registeredGain",
    "registeredUse",
    "totalUnregistered",
    "unregisteredGain",
    "unregisteredUse",
    "unregisteredDeposit",
    "totalTFSA",
    "TFSAGain",
    "TFSAUse",
    "employment",
    "selfEmployment",
    "otherIncome",
    "totalIncome",
    "inflation",
    "interest",
    "annualExpenses",
    "onetimeExpenses",
    "taxes",
    "totalExpenses",
    "decumulation",
  ];
  const ExpenseView = [
    "year",
    "annualExpenses",
    "onetimeExpenses",
    "taxes",
    "totalExpenses",
  ];
  const InvestmentView = [
    "year",
    "investments",
    "totalGain",
    "totalRegistered",
    "registeredGain",
    "registeredUse",
    "totalUnregistered",
    "unregisteredGain",
    "unregisteredUse",
    "unregisteredDeposit",
    "totalTFSA",
    "TFSAGain",
    "TFSAUse",
    "decumulation",
  ];
  const SummaryView = [
    "year",
    "investments",
    "totalGain",
    "totalIncome",
    "totalExpenses",
    "decumulation",
  ];

  const [view, setView] = useState(GeneralView);
  const [count, setCount] = useState(0);

  console.time("ScenarioBuild");

  // Grab all the input values
  function getParams() {
    const params = {};
    Object.keys(ATTRIBUTES).forEach((k) => {
      const { editable, defaultVal } = ATTRIBUTES[k];
      if (editable === "one") {
        params[k] = localStorage.getItem(k) || defaultVal;
      } else if (editable === "yearly") {
        params[k] = getYearlyValues(k);
      }
    });
    return params;
  }

  const params = getParams();
  const scenario = new Scenario(params);

  console.timeEnd("ScenarioBuild");

  function lookAt(values) {
    values.forEach((v) => {
      if (!ATTRIBUTES[v]) {
        console.log(`*** Error attribute '${v}' not found in ATTRIBUTES.`);
        console.log("*** ResultNew.tsx... come find me.");
        throw new Error(`Logic error, attribute '${v}' not setup.`);
      }
    });
    columnWidths = values.map((a) => ATTRIBUTES[a].width);
    colHeaders = values.map((a) => ATTRIBUTES[a].title);
    columns = values.map((a) => {
      const { editable, type } = ATTRIBUTES[a];
      const readOnly = editable === "yearly" ? false : true;
      if (type === "dollar") {
        return {
          data: a,
          type: "numeric",
          readOnly,
          numericFormat: formatDollar,
        };
      } else {
        return {
          data: a,
          readOnly,
        };
      }
    });
  }

  // Sends an array of changes
  function afterChange(changes, source) {
    // console.log("--- changes", changes, "source:", source);
    if (changes) {
      changes.forEach((e) => {
        const [row, col, from, to] = e;
        const year = scenario.getArray()[row].year;
        // console.log("---", year, col, ATTRIBUTES[col]);
        // console.log(row, col, from, to);
        const { editable } = ATTRIBUTES[col];
        if (editable === "yearly") {
          const vals = getYearlyValues(col);
          //   console.log("---YearlyValues", vals);

          if (to) {
            vals[year] = to;
          } else {
            delete vals[year];
            console.log("---Should be deleting this entry...");
          }
          //   console.log("---YearlyValues", vals);
          saveYearlyValues(col, vals);
        }
      });
      setCount(count + 1);
    }
  }

  function getYearlyValues(k) {
    const values = localStorage.getItem(k);
    try {
      const r = values ? JSON.parse(values) : {};
      //   console.log("---k is of type", typeof r);
      return r;
    } catch (e) {
      console.log("*** Can not parse json for", k, "-", values);
      console.log("***", e);
    }
    return {};
  }

  function saveYearlyValues(k, o) {
    localStorage.setItem(k, JSON.stringify(o));
  }

  function calcOptimumSpend() {
    console.log("--- calcOptimumSpend");
    console.time("calcOptimumSpend");

    let annualExpenses = "0";
    const params = getParams();
    const results = [];

    for (let run = 0; run < 50; run++) {
      params.annualExpenses = annualExpenses;
      const scenario = new Scenario(params);
      const value = scenario.getOptimumSpend(results);
      console.log('--- when they are the same we are done...',run,annualExpenses,value);
      if (annualExpenses === String(value)) {
        console.log('They are the same at run',run, value);
        break;
      }
      
      annualExpenses = String(value);
    }

    // results.forEach((r, i) => {
    //   console.log(i, dollarFormatter(r.annualExpenses), r.percent, dollarFormatter(r.result));
    // });

    // console.log("   --- final results:", results);

    localStorage.setItem("annualExpenses", annualExpenses);

    console.timeEnd("calcOptimumSpend");

    setCount(count + 1);
  }

  lookAt(view);

  return (
    // <div>
    <div className="dash flex flex-wrap w-full bg-white drop-shadow-[0_0px_10px_rgba(0,0,0,0.25)] rounded-2xl p-4">
      <div className="w-full flex flex-wrap">
        <Generator
          display={[
            { name: "age" },
            { name: "partnerAge" },
            { name: "totalRegistered" },
            { name: "totalUnregistered" },
            { name: "totalTFSA" },
            { name: "annualExpenses" },
          ]}
        />
        <button onClick={() => setCount(count + 1)}>Calc</button>
        <button onClick={calcOptimumSpend}>Optimum Spend</button>
      </div>
      <button onClick={() => setView(GeneralView)}>All</button>
      <button onClick={() => setView(ExpenseView)}>Expense</button>
      <button onClick={() => setView(InvestmentView)}>Investment</button>
      <button onClick={() => setView(SummaryView)}>Summary</button>
      <div className="dash w-full">
        <HotTable
          data={scenario.getArray()}
          colHeaders={colHeaders}
          columns={columns}
          afterChange={afterChange}
          colWidths={columnWidths}
          width="100%"
          height="auto"
          //   colHeaders={true}
          rowHeaders={true}
          manualColumnResize={true}
          autoWrapRow={true}
          autoWrapCol={true}
          licenseKey="non-commercial-and-evaluation" // for non-commercial use only
        />
      </div>
    </div>
  );
}
