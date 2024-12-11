import { useState } from "react";
import "./App.css";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { useEffect } from "react";

import { MiniComp } from "./components/MiniComp";
import { InvestmentTab } from "./investment/InvestmentTab";
import { TaxTab } from "./tax/TaxTab";
import { FontDisplay } from "./components/FontTab";
import { ResultTab } from "./result/Result";

function App() {
  // console.log("App has just run");

  const [tabIndex, setTabIndex] = useState(0);
  // const [bfo, setBfo] = useState({
  //   fname: "",
  //   year: 2024,
  //   employmentIncome: 0,
  //   selfEmploymentIncome: 0,
  //   capitalGains: 0,
  //   eligibleDividends: 0,
  //   ineligibleDividends: 0,
  //   otherIncome: 0,
  //   withPartner: true,
  // });
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

  // useEffect(() => {
  //   // console.log("App useEffect This should only run once");
  //   setBfo({
  //     fname: "Larry",
  //     year: 2024,
  //     otherIncome: dollarFormatter(100000),
  //     withPartner: true,
  //   });
  // }, []);

  useEffect(() => {
    // console.log("Tab Index changed", tabIndex);
  }, [tabIndex]);

  return (
    <div>
      <h1 className="underline">Retirement Income Optimizer</h1>
      <Tabs
        className="mt-8"
        selectedIndex={tabIndex}
        onSelect={(index) => setTabIndex(index)}
      >
        <TabList>
          <Tab>Tax Calculations</Tab>
          <Tab>Investments</Tab>
          <Tab>Results</Tab>
          <Tab>Title 4</Tab>
          <Tab>Title 5</Tab>
          <Tab>Font Examples</Tab>
        </TabList>
        <TabPanel>
          <TaxTab o={bfo} />
        </TabPanel>
        <TabPanel>
          <InvestmentTab />
        </TabPanel>
        <TabPanel>
          <ResultTab/>
        </TabPanel>
        <TabPanel>
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
