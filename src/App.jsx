import { useState } from "react";
import "./App.css";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

import { MiniComp } from "./components/MiniComp";
import { TaxTab } from "./tax/TaxTab";
import { FontDisplay } from "./components/FontTab";
import { ResultTab } from "./result/Result";
import { InputTab } from "./input/InputTab";

function App() {
  const [tabIndex, setTabIndex] = useState(0);
  const bfo = {
    fname: "",
    year: 2024,
    employmentIncome: 0,
    selfEmploymentIncome: 0,
    capitalGains: 0,
    eligibleDividends: 0,
    ineligibleDividends: 0,
    otherIncome: 0,
    withPartner: true,
  };

  return (
    <div>
      <h1 className="underline">Retirement Income Optimizer</h1>
      <Tabs
        className="mt-8"
        selectedIndex={tabIndex}
        onSelect={(index) => setTabIndex(index)}
      >
        <TabList>
          <Tab>Input</Tab>
          <Tab>Results</Tab>
          <Tab>Tax Calculations</Tab>
          <Tab>Title 4</Tab>
          <Tab>Title 5</Tab>
          <Tab>Font Examples</Tab>
        </TabList>
        <TabPanel className="dash flex justify-center">
          <InputTab />
        </TabPanel>
        <TabPanel className="dash">
          <ResultTab />
        </TabPanel>
        <TabPanel>
          <TaxTab o={bfo} />
        </TabPanel>
        <TabPanel className="dash">
          <MiniComp tab="4"></MiniComp>
        </TabPanel>
        <TabPanel>
          <MiniComp tab="5"></MiniComp>
        </TabPanel>
        <TabPanel>
          <FontDisplay />
        </TabPanel>
      </Tabs>
    </div>
  );
}

export default App;
