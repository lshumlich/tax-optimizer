import { PropTypes } from "prop-types";

export function DollarInput({ name, heading, value, onChange }) {
  // console.log(("DollarInput", name, heading, value));

  return (
    // <div className="dash w-60">
    <div className="dash w-44">
      <label className="mt-5 mb-2 flex cursor-pointer items-center text-sm font-medium text-gray-600">
        {heading}
      </label>
      <input
        value={value}
        type="dollar"
        name={name}
        pattern="^$|^[+\-]?\$?(\d+|(\d+[,\s])*?\d+)(\.\d*[1-9]+\d*)?$"
        className="peer block w-32 rounded-full border-2 border-gray-300 bg-transparent px-4 py-2 text-right text-sm font-normal tabular-nums text-gray-900 placeholder:text-gray-400 invalid:border-red-600 focus:bg-white focus:outline-none focus:outline-0 focus:[&:not(:invalid)]:border-blue-300"
        onChange={onChange}
      />
    </div>
  );
}

DollarInput.propTypes = {
  name: PropTypes.string.isRequired,
  heading: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.number.isRequired,
  ]),
  onChange: PropTypes.func,
};
