import React from "react";
import "handsontable/dist/handsontable.full.min.css";

import { registerAllModules } from "handsontable/registry";
import { HotTable } from "@handsontable/react";
import { Scenario } from "../calcs/Scenario";
import { ATTRIBUTES } from "../calcs/attributes";
import { useState } from "react";

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
    "investments",
    "totalGain",
    "totalRegistered",
    "registeredGain",
    "registeredUse",
    "totalUnregistered",
    "unregisteredGain",
    "unregisteredUse",
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
    "shortFall",
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
    "totalTFSA",
    "TFSAGain",
    "TFSAUse",
    "shortFall",
];
const SummaryView = [
    "year", 
    "investments",
    "totalGain",
    "totalIncome",
    "totalExpenses",
    "shortFall",
];

  const [view, setView] = useState(GeneralView);
  const [count, setCount] = useState(0);

  console.time("ScenarioBuild");

  // Grab all the input values
  const params = {};
  Object.keys(ATTRIBUTES).forEach((k) => {
    const { editable, defaultVal } = ATTRIBUTES[k];
    if (editable === "one") {
      params[k] = localStorage.getItem(k) || defaultVal;
    } else if (editable === "yearly") {
      params[k] = getYearlyValues(k);
    }
  });

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

  lookAt(view);

  return (
    // <div>
    <div className="dash flex flex-wrap w-full bg-white drop-shadow-[0_0px_10px_rgba(0,0,0,0.25)] rounded-2xl p-4">
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
