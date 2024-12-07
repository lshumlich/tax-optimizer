import { useState } from "react";
import "./App.css";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { useEffect,useCallback } from "react";
import {
  abTaxRate,
  abTaxTable,
  fedTaxRate,
  fedTaxTable,
  calcTax,
  calcTaxForTwo,
} from "./tax";

import { dollarFormatter, toNumber } from "./utils";

function App() {
  console.log("App has just run");

  const [count, setCount] = useState(0);
  const [tabIndex, setTabIndex] = useState(0);
  const [bfo, setBfo] = useState({
    fname: "",
    year: 0,
    income: 0,
    withPartner: true,
  });

  useEffect(() => {
    console.log("App useEffect This should only run once");
    setBfo({
      fname: "Larry",
      year: 2024,
      income: dollarFormatter(100000),
      withPartner: true,
    });
  }, []);

  useEffect(() => {
    console.log("Tab Index changed", tabIndex);
  }, [tabIndex]);

  // function runTaxCalc() {
  //   console.log(
  //     "--Should run the tax calc with",
  //     bfo.year,
  //     bfo.income,
  //     bfo.withPartner
  //   );
  //   if (bfo.withPartner) {
  //     console.log(calcTaxForTwo(bfo.year, toNumber(bfo.income)));
  //   } else {
  //     console.log(calcTax(bfo.year, toNumber(bfo.income)));
  //   }
  // }

  return (
    <div>
      <h1 className="underline">Retirement Income Optimizer</h1>
      {/* <Counter />
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          v2 count is {count}
        </button>
      </div>
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
      </p> */}

      {/* <TaxInput o={bfo} run={runTaxCalc} /> */}
      <Tabs
        className="mt-8"
        selectedIndex={tabIndex}
        onSelect={(index) => setTabIndex(index)}
      >
        <TabList>
          <Tab>Tax Calculations</Tab>
          <Tab>Title 2</Tab>
          <Tab>Title 3</Tab>
          <Tab>Title 4</Tab>
          <Tab>Title 5</Tab>
          <Tab>Font Examples</Tab>
        </TabList>
        <TabPanel>
          <TaxTab o={bfo} />
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

function MiniComp(params) {
  // console.log("MiniComp running:", params);
  return <h3>MiniComp {params.tab}</h3>;
}

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div className="card">
      <button onClick={() => setCount((count) => count + 1)}>
        New Component Count is {count}
      </button>
    </div>
  );
}

// ----------- TaxTab

function TaxTab(params) {
  const [result, setResult] = useState({});
  const [input, setInput] = useState({});
  
  const runTaxCalc = useCallback(() => {
    console.log(
      "--Should run the tax calc with",
      input.year,
      input.income,
      input.withPartner
    );
    try {
      if (input.withPartner) {
        setResult(calcTaxForTwo(input.year, toNumber(input.income)));
      } else {
        setResult(calcTax(input.year, toNumber(input.income)));
      }
    } catch (e) {
      console.trace(e);
      setResult({});
    }
  },[input]);

  useEffect(() => {
    setInput(params.o);
  //   runTaxCalc();
  //   // console.log("useEffect in TaxTab (should only run once)");
  }, [params.o]);


  // console.log('about to render TaxTab---',result);

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
          {dollarFormatter(result.income)}
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
  // console.log("TaxInput has just run");

  const [input, setInput] = useState({
    year: 0,
    income: 0,
    withPartner: false,
  });

  useEffect(() => {
    setInput(params.o);
  }, [params]);
  const [count, setCount] = useState(0);

  // function didYouPressEnter(e) {
  //   if (e.key === "Enter") {
  //     console.log("We are going to run some shit....");
  //     // params.run();
  //   }
  //   // console.log('didYouPressEnter',e.key);

  //   // params.run()
  // }

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

      <div className="w-50">
        <label className="mt-5 mb-2 flex cursor-pointer items-center text-sm font-medium text-gray-600">
          {"Other Income"}
        </label>
        <input
          value={input.income}
          type="dollar"
          name="income"
          pattern="^$|^[+\-]?\$?(\d+|(\d+[,\s])*?\d+)(\.\d*[1-9]+\d*)?$"
          className="peer block w-32 rounded-full border-2 border-gray-300 bg-transparent px-4 py-2 text-right text-sm font-normal tabular-nums text-gray-900 placeholder:text-gray-400 invalid:border-red-600 focus:bg-white focus:outline-none focus:outline-0 focus:[&:not(:invalid)]:border-blue-300"
          onChange={setDollar}
        />
      </div>
    </div>
  );
}

function FontDisplay() {
  return (
    <>
      <p className="font-sans">font-sans font-sans font-sans</p>
      <p className="font-serif">font-serif font-serif font-serif</p>
      <p className="font-mono">font-mono font-mono font-mono</p>
      <p className="font-light">font-light font-mono font-mono</p>
      <p className="font-bold">font-bold font-mono font-mono</p>
      <p className="text-sm">sm text size text size text size </p>
      <p className="text-base">base text size text size text size </p>
      <p className="text-lg">lg text size text size text size </p>
      <p className="text-xl">xl text size text size text size </p>
      <p className="text-2xl">xl2 text size text size text size </p>
      <p className="text-2xl tabular-nums">111,111.78</p>
      <p className="text-2xl tabular-nums">999,999.78</p>
      <p className="text-2xl">111,111.78</p>
      <p className="text-base tabular-nums">111,111.78</p>
    </>
  );
}
