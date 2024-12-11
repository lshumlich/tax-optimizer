import React from "react";
import "handsontable/dist/handsontable.full.min.css";

// import Handsontable from "handsontable/base";
import { registerAllModules } from "handsontable/registry";
import { HotTable } from "@handsontable/react";

export function ResultTab() {
  registerAllModules();
  return (
    <div className="mt-10">
      {/* <h1>And the Results are?</h1> */}
      <HotTable
        data={[
          ["", "Tesla", "Volvo", "Toyota", "Ford"],
          ["2019", 10, 11, 12, 13],
          ["2020", 20, 11, 14, 13],
          ["2021", 30, 15, 12, 13],
        ]}
        rowHeaders={true}
        colHeaders={true}
        height="auto"
        autoWrapRow={true}
        autoWrapCol={true}
        licenseKey="non-commercial-and-evaluation" // for non-commercial use only
      />
    </div>
  );
}
