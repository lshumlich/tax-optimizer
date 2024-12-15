import React from "react";
import { useState } from "react";
// import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
// import { MiniComp } from "../components/MiniComp";
import { useEffect } from "react";
import { dollarFormatter } from "../utils";
import { DollarInput } from "../components/DollarInput";
import { Generator } from "../calcs/Generator";

// ----------- Input

export function InputTabOldDeleteMe(params) {

  let inputData = {
    totalRegistered: 0,
    totalUnregistered: 0,
    totalTFSA: 0,
  };

//   console.log("InvestmentInput - function", inputData);

  const [input, setInput] = useState(inputData);

  useEffect(() => {
    inputData = {
      totalRegistered: dollarFormatter(
        localStorage.getItem("totalRegistered") || 0
      ),
      totalUnregistered: dollarFormatter(
        localStorage.getItem("totalUnregistered") || 0
      ),
      totalTFSA: dollarFormatter(localStorage.getItem("totalTFSA") || 0),
    };

    // console.log("InvestmentInput - useEffect", inputData);
    setInput(inputData);
  }, [params]);

  const [count, setCount] = useState(0);

  function setDollar(e) {
    input[e.target.name] = dollarFormatter(e.target.value);
    localStorage.setItem(e.target.name, e.target.value);
    setCount(count + 1);
    // params.run();
  }

  function setCheckBox(e) {
    input[e.target.name] = e.target.checked;
    setCount(count + 1);
    // params.run();
  }

  function genSetter(e) {
    input[e.target.name] = e.target.value;
    setCount(count + 1);
    // params.run();
  }

  return (
    <div className="flex flex-wrap mt-5 bg-white w-80 drop-shadow-[0_0px_10px_rgba(0,0,0,0.25)] rounded-2xl m-4 p-4">
      <span className="font-bold">Investments</span>
      <DollarInput
        name="totalRegistered"
        heading="Total Registered"
        value={input.totalRegistered}
        onChange={setDollar}
      />

      <DollarInput
        name="totalUnregistered"
        heading="Total Unregistered"
        value={input.totalUnregistered}
        onChange={setDollar}
      />

      <DollarInput
        name="totalTFSA"
        heading="Total TFSA"
        value={input.totalTFSA}
        onChange={setDollar}
      />
    </div>
  );
}

export function InputTab(params) {

  const display = [
    'Investments',
    {name:"totalRegistered"},
    {name:"totalUnregistered"},
    {name:"totalTFSA"},
    'Annual Income',
    {name:"employment"},
    {name:"selfEmployment"},
    {name:"otherIncome"},
    'Annual Expenses',
    {name:"yearlyExpenses"},
  ]


  return (
    // <div className="dash flex flex-wrap w-auto bg-white drop-shadow-[0_0px_10px_rgba(0,0,0,0.25)] rounded-2xl m-4 p-4" >
    <div className="dash flex flex-wrap w-9/12 bg-white drop-shadow-[0_0px_10px_rgba(0,0,0,0.25)] rounded-2xl m-4 p-4" >
      <Generator display={display}/>
    </div>
  )
}
