import React from "react";
import "handsontable/dist/handsontable.full.min.css";

// import Handsontable from "handsontable/base";
import { registerAllModules } from "handsontable/registry";
import { HotTable } from "@handsontable/react";
import { Scenario } from "../calcs/yearly";
import { dollarFormatter } from "../utils";
import { INPUTS } from "../calcs/attributes";

registerAllModules();

export function ResultTab() {

  const start = Date.now();
  console.time('lengthOfTime');
  // Grab all the input values
  const params = {};
  Object.keys(INPUTS).forEach(k => {
    params[k] = localStorage.getItem(k) || INPUTS[k].default;
  })
  console.log('Here are to values:', params);
  


  const scenario = new Scenario(params);
  // const scenario = new Scenario({
  //   inflation: 0.02,
  //   interest: 0.05,
  //   year: 2024,
  //   age: 66,
  //   spouseAge: 64,
  //   totalRegistered: "10,000,000",
  //   totalUnregistered: "2,000,000",
  //   totalTFSA: "500,000",
  // });

  const after = Date.now();
  console.timeEnd('lengthOfTime')
  console.log('to setup the scenario was:',after, after - start);
  

  const data = scenario.getArray().map((y) => {
    return [
      y.year,
      y.age,
      y.partnerAge,
      dollarFormatter(y.totalRegistered),
      dollarFormatter(y.totalUnregistered),
      dollarFormatter(y.totalTFSA),
      dollarFormatter(y.registeredGain),
      y.inflation,
      y.interest,
    ];
  });
  data.unshift([
    "Year",
    "Age",
    "Partner Age",
    "Registered",
    "Unregistered",
    "TFSA",
    "Registered Gain",
    "Inflation",
    "Interest",
  ]);

  // const data = scenario1.
  return (
    <div className="mt-10">
      {/* <h1>And the Results are?</h1> */}
      <HotTable
        // data={[
        //   ["", "Tesla", "Volvo", "Toyota", "Ford"],
        //   ["2019", 10, 11, 12, 13],
        //   ["2020", 20, 11, 14, 13],
        //   ["2021", 30, 15, 12, 13],
        // ]}
        data={data}
        // rowHeaders={true}
        // colHeaders={true}
        // height="auto"
        // manualColumnResize={true}
        colWidths={[50,30,30,70,70,70,70,70]}
        // autoWrapRow={true}
        // autoWrapCol={true}
        width="100%"
        height="auto"
        colHeaders={true}
        rowHeaders={true}
        // colWidths={100}
        manualColumnResize={true}
        autoWrapRow={true}
        autoWrapCol={true}
        licenseKey="non-commercial-and-evaluation" // for non-commercial use only
      />
    </div>
  );
}
