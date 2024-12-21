import { useEffect, useState } from "react";
import { DollarInput } from "../components/DollarInput";
import { ATTRIBUTES } from "./attributes";
import { dollarFormatter } from "../utils";

export function Generator(params) {
  //   console.log("---Generator is running---");
  const { display } = params;
  const values = {};
  display.forEach((d) => {
    if (typeof d !== "string") {
      const { name } = d;
      const attr = ATTRIBUTES[name];
      values[name] = dollarFormatter(
        localStorage.getItem(name) || attr.default
      );
    }
  });
  //   console.log(values);

  const [count, setCount] = useState(0);
  const [input, setInput] = useState(values);

  useEffect(() => {
    setInput(values);
  }, [params]);

  function setDollar(e) {
    // console.log(e.target.pattern);
    input[e.target.name] = dollarFormatter(e.target.value);
    if (e.target.value.match(e.target.pattern)) {
      localStorage.setItem(e.target.name, e.target.value);
    }
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
      if (!ATTRIBUTES[name]) {
        throw new Error(`Logic error, attribute '${name}' not setup.`);
      }
      const { title, type } = ATTRIBUTES[name];
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
