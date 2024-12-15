import { useEffect, useState } from "react";
import { DollarInput } from "../components/DollarInput";
import { INPUTS } from "./attributes";
import { dollarFormatter } from "../utils";

export function Generator(params) {
//   console.log("---Generator is running---");
  const { display } = params;
  const values = {};
  display.forEach(d => {
      if (typeof d !== 'string') {
          const { name } = d;
          const attr = INPUTS[name];
          values[name] = dollarFormatter(localStorage.getItem(name) || attr.default);
      }
  })
//   console.log(values);

  const [count, setCount] = useState(0);
  const [input, setInput] = useState(values);

    useEffect(() => {
        
        setInput(values);


    },[params]);
  

  function setDollar(e) {
    input[e.target.name] = dollarFormatter(e.target.value);
    localStorage.setItem(e.target.name, e.target.value);
    setCount(count + 1);
    // params.run();
  }

//   const input = {};
  const output = display.map((d) => {
    if (typeof d === "string") {
      //   return (<div key={d} className="flex flex-wrap font-bold w-80">{d}</div>);
      return (
        // <div key={d} className="font-bold dash text-left w-full">
        <div key={d} className="font-bold dash text-left w-full">
          {d}
        </div>
      );
    } else {
      const { name } = d;
      const { title, type } = INPUTS[name];
      if (type === "dollar") {
        return (
          <DollarInput
            key={name}
            name={name}
            heading={title}
            value={input[name]}
            onChange={setDollar}
          />
        );
      } else {
        return (
          <div key={name}>
            {" "}
            *** Type not known for {name} - {title}
          </div>
        );
      }
    }
  });

  return output;
}
