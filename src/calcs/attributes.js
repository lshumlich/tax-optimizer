

export const INPUTS = {
  totalRegistered: { title: "Total Registered", default: 0, type:'dollar' },
  totalUnregistered: { title: "Total Unregistered", default: 0, type:'dollar' },
  totalTFSA: { title: "Total TFSA", default: 0, type:'dollar' },

  employment: {title: "Employment Income", default:0, type:'dollar' },
  selfEmployment: {title: "Self Employment Income", default:0, type:'dollar' },
  otherIncome: {title: "Other Income", default:0, type:'dollar' },

  yearlyExpenses: {title: "Yearly Expenses", default:0, type:'dollar' },
  
  inflation: { title: "Inflation", default: 0.02, type:'percent' },
  interest: { title: "Interest", default: 0.05, type:'percent' },
  year: { title: "Year", default: new Date().getFullYear(), type:'number' },

  age: { title: "Your Age", default: 64 },
  partnerAge: { title: "Partners Age", default: 64 },
};
