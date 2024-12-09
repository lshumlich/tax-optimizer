
export function toNumber(s) {
  if(!s) return 0;
  if(typeof s === 'number') return s;
  return(Number(s.replace(/[$,\s]/g, "")));
}

export function dollarFormatter(s) {
  if(!s) return '';

  const n = (typeof s === 'number')
    ? s :
    toNumber(s);
  if (isNaN(n)) {
    return s;
  }
  return n.toLocaleString();
  // return Number(s.replace(/[$,\s]/g, "")).toLocaleString();
}
