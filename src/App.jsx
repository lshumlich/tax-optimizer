import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import "./App.css";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { useEffect } from "react";
import {
  abTaxRate,
  abTaxTable,
  fedTaxRate,
  fedTaxTable,
  calcTax,
  calcTaxForTwo,
} from "./tax";

import {dollarFormatter} from "./utils";


function App() {
  console.log("App has just run");

  const [count, setCount] = useState(0);
  const [tabIndex, setTabIndex] = useState(0);
  const [bfo, setBfo] = useState({ fname: "Lorraine", year: 1958, income: 0 });
  // const [bfo, setBfo] = useState({});

  useEffect(() => {
    console.log("App useEffect This should only run once");
    setBfo({ fname: "Larry", year: 2024, income: 100000 });
    // if (!bfo) {
    //   console.log("  in bfo useEffect This should only run once");
    //   setBfo({fname:'Larry'});
    // }
  }, []);

  useEffect(() => {
    console.log("Tab Index changed", tabIndex);
  }, [tabIndex]);

  function runTaxCalc() {
    console.log("--Should run the tax calc with", bfo.year, bfo.income);
    console.log(calcTax(bfo.year, bfo.income));
  }

  return (
    <div>
      <h1 className="underline">Retirement Income Optimizer</h1>
      <Counter />
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          v2 count is {count}
        </button>
      </div>
      {/* ------------------------------------------------------------------------------ */}
      <label>
        Text input: <input name="myInput" />
      </label>
      <hr />
      <label>
        Checkbox: <input type="checkbox" name="myCheckbox" />
      </label>
      <hr />
      <p>
        Radio buttons:
        <label>
          <input type="radio" name="myRadio" value="option1" />
          Option 1
        </label>
        <label>
          <input type="radio" name="myRadio" value="option2" />
          Option 2
        </label>
        <label>
          <input type="radio" name="myRadio" value="option3" />
          Option 3
        </label>
      </p>
      <TaxInput o={bfo} run={runTaxCalc} />
      <Tabs selectedIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
        <TabList>
          <Tab>Title 1</Tab>
          <Tab>Title 2</Tab>
          <Tab>Title 3</Tab>
          <Tab>Title 4</Tab>
          <Tab>Title 5</Tab>
          <Tab>Title 6</Tab>
        </TabList>
        <TabPanel>
          <MiniComp tab="1"></MiniComp>
        </TabPanel>
        <TabPanel>
          <MiniComp tab="2"></MiniComp>
        </TabPanel>
        <TabPanel>
          <MiniComp tab="3"></MiniComp>
        </TabPanel>
        <TabPanel>
          <MiniComp tab="4"></MiniComp>
        </TabPanel>
        <TabPanel />
        <TabPanel />
      </Tabs>
    </div>
  );
}

export default App;

function MiniComp(params) {
  console.log("MiniComp running:", params);
  return <h3>MiniComp {params.tab}</h3>;
}

function Counter(params) {
  const [count, setCount] = useState(0);
  return (
    <div className="card">
      <button onClick={() => setCount((count) => count + 1)}>
        New Component Count is {count}
      </button>
    </div>
  );
}

// ----------- TaxInput

function TaxInput(params) {
  const [input, setInput] = useState({ year: 1, income: 12 });
  useEffect(() => {
    setInput(params.o);
  }, [params]);
  const [count, setCount] = useState(0);

  function didYouPressEnter(e) {
    if (e.key === "Enter") {
      console.log("We are going to run some shit....");
      params.run();
    }
  }

  function genSetter(e) {
    // console.log(e.target.name, e.target.value);a
    const ok = new RegExp(e.target.pattern).test(e.target.value);
    let value = "";
    // id.value = Number(id.value.replace(/,/gi, "")).toLocaleString();

    // let value = e.target.value.replace(/[$,.\s]/g, "");
    if (ok) {
      value = dollarFormatter(e.target.value);
      // value = Number(e.target.value.replace(/[$,\s]/g, "")).toLocaleString();
      if (value === "0") value = "";
      input[e.target.name] = value;
    } else {
      // value = Number(value).toLocaleString();

      input[e.target.name] = e.target.value;
    }
    // needed to cause a rerender
    setCount(count + 1);
    // }
    // setInput(input);
    // o[e.target.name] = e.target.value;
    // console.log("--o:", o);
    console.log("--input:", input, e.target.pattern, ok);
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
          onChange={(e) => genSetter(e)}
          onKeyUp={didYouPressEnter}
        />
      </div>
      <div className="w-36 mt-5">
        <label className="text-center">{"Income Splitting"}</label>
        <div className="grid items-center justify-center ">
          <input
            value={input.withPartner}
            type="checkbox"
            name="withPartner"
            className="h-10"
            onChange={(e) => genSetter(e)}
            onKeyUp={didYouPressEnter}
          />
        </div>
      </div>

      <div className="w-50">
        <label className="mt-5 mb-2 flex cursor-pointer items-center text-sm font-medium text-gray-600">
          {"Other Income"}
        </label>
        <input
          value={input.income}
          type="text"
          name="income"
          pattern="^$|^[+\-]?\$?(\d+|(\d+[,\s])*?\d+)(\.\d*[1-9]+\d*)?$"
          className="peer block w-32 rounded-full border-2 border-gray-300 bg-transparent px-4 py-2 text-right text-sm font-normal tabular-nums text-gray-900 placeholder:text-gray-400 invalid:border-red-600 focus:bg-white focus:outline-none focus:outline-0 focus:[&:not(:invalid)]:border-blue-300"
          onChange={(e) => genSetter(e)}
          onKeyUp={didYouPressEnter}
        />
      </div>
    </div>
  );
}

function PlayInput(params) {
  console.log(`PlayInput ${params}`);
}
