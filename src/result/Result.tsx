
// DELETE ME I THINK

import React from "react";
import "handsontable/dist/handsontable.full.min.css";

import { registerAllModules } from "handsontable/registry";
import { HotTable } from "@handsontable/react";
import { Scenario } from "../calcs/yearly";
import { dollarFormatter } from "../utils";
import { INPUTS } from "../calcs/attributes";
import { useState } from "react";

registerAllModules();

export function ResultTab() {
  const display = {
    year: { title: "Year", width: 50, type: null },
    age: { title: "Age", width: 30, type: null },
    partnerAge: { title: "Partner Age", width: 30, type: null },

    totalRegistered: { title: "Registered", width: 70, type: "dollar" },
    totalUnregistered: { title: "Unregistered", width: 70, type: "dollar" },
    totalTFSA: { title: "TFSA", width: 70, type: "dollar" },

    registeredGain: { title: "Registered Gain", width: 70, type: "dollar" },
    unregisteredGain: { title: "Unregistered Gain", width: 70, type: "dollar" },
    TFSAGain: { title: "TFSA Gain", width: 70, type: "dollar" },
    investments: { title: "Investments", width: 70, type: "dollar" },

    employment: { title: "Employment Income", width: 70, type: "dollar" },
    selfEmployment: {
      title: "Self Employment Income",
      width: 70,
      type: "dollar",
    },
    otherIncome: { title: "Other Income", width: 70, type: "dollar" },

    yearlyExpenses: { title: "Yearly Expenses", width: 70, type: "dollar" },

    inflation: { title: "Inflation", width: 70, type: null },
    interest: { title: "Interest", width: 70, type: null },
  };

  let data;
  let columnWidths;

  const GeneralView = [
    "year",
    "age",
    "partnerAge",
    "investments",
    "totalRegistered",
    "registeredGain",
    "totalUnregistered",
    "unregisteredGain",
    "totalTFSA",
    "TFSAGain",
    "employment",
    "selfEmployment",
    "otherIncome",
    "inflation",
    "interest",
    "yearlyExpenses",
  ];
  const ExpenseView = ["age", "totalRegistered", "registeredGain"];
  const RevenueView = ["year", "investments"];

  const [view, setView] = useState(GeneralView);

  // Grab all the input values
  const params = {};
  Object.keys(INPUTS).forEach((k) => {
    params[k] = localStorage.getItem(k) || INPUTS[k].default;
  });

  const scenario = new Scenario(params);

  function lookAt(values) {
    columnWidths = values.map((a) => display[a].width);
    const titles = values.map((a) => display[a].title);
    data = scenario.getArray().map((y) => {
      return values.map((a) => {
        const type = display[a].type;
        if (type === "dollar") {
          return dollarFormatter(y[a]);
        }
        return y[a];
      });
    });
    data.unshift(titles);
    // console.log(data);
  }

  // Sends an array of changes
  function afterChange(changes, source) {
    console.log('--- changes',changes, 'source:',source);
    if (changes) {
      changes.forEach((e) => {
        const [row, col, from, to] = e;
        console.log(row, col, from, to);
        console.log('---', data[row][0], view[col]);
        
      });
    }
  }

  lookAt(view);

  return (
    // <div>
    <div className="dash flex flex-wrap w-full bg-white drop-shadow-[0_0px_10px_rgba(0,0,0,0.25)] rounded-2xl p-4">
      <button onClick={() => setView(GeneralView)}>General</button>
      <button onClick={() => setView(ExpenseView)}>Expense</button>
      <button onClick={() => setView(RevenueView)}>Revenue</button>
      <div className="dash w-full">
        <HotTable
          data={data}
          afterChange={afterChange}
          colWidths={columnWidths}
          width="100%"
          height="auto"
          colHeaders={true}
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
