

export const ATTRIBUTES = {
  totalRegistered: { title: "Registered", defaultVal: 0, type: 'dollar', editable: 'one', width: 70, },
  totalUnregistered: { title: "Unregistered", defaultVal: 0, type: 'dollar', editable: 'one', width: 70, },
  totalTFSA: { title: "TFSA", defaultVal: 0, type: 'dollar', editable: 'one', width: 70, },
  investments: { title: "Total<br>Investments", width: 70, type: "dollar" },

  employment: { title: "Employment<br>Income", defaultVal: 0, type: 'dollar', editable: 'yearly', width: 70, },
  selfEmployment: { title: "Self<br>Employment<br>Income", defaultVal: 0, type: 'dollar', editable: 'yearly', width: 70, },
  otherIncome: { title: "Other<br>Income", defaultVal: 0, type: 'dollar', editable: 'yearly', width: 70, },
  totalIncome: { title: "Total<br>Income", type: 'dollar', width: 70 },

  annualExpenses: { title: "Annual<br>Expenses", defaultVal: 0, type: 'dollar', editable: 'yearly', width: 70, },
  onetimeExpenses: { title: "Onetime<br>Expenses", defaultVal: 0, type: 'dollar', editable: 'yearly', width: 70, },

  registeredGain: { title: "Registered<br>Gain", width: 70, type: "dollar" },
  unregisteredGain: { title: "Unregistered<br>Gain", width: 70, type: "dollar" },
  TFSAGain: { title: "TFSA<br>Gain", width: 70, type: "dollar" },

  registeredUse: { title: "Registered<br>Use", width: 70, type: "dollar" },
  unregisteredUse: { title: "Unregistered<br>Use", width: 70, type: "dollar" },
  TFSAUse: { title: "TFSA<br>Use", width: 70, type: "dollar" },

  inflation: { title: "Inflation", defaultVal: 0.02, type: 'percent', editable: 'one' },
  interest: { title: "Interest", defaultVal: 0.05, type: 'percent', editable: 'one' },
  year: { title: "Year", defaultVal: 0, type: 'number', width: 50, },
  startYear: { title: "Start<br>Year", defaultVal: new Date().getFullYear(), type: 'number', editable: 'one' },

  age: { title: "Your<br>Age", defaultVal: 64, editable: 'one', width: 30, },
  partnerAge: { title: "Partners<br>Age", defaultVal: 64, editable: 'one', width: 30, },
  taxes: { title: "Last Year<br>Taxes", editable: 'yearly', type: 'dollar',width: 70, },
  totalExpenses: { title: "Total<br>Expenses", type: 'dollar', width: 70 },

  shortFall: { title: "Short<br>Fall", type: 'dollar', width: 70 },
  totalGain: { title: "Total<br>Gain", type: 'dollar', width: 70 },
};
