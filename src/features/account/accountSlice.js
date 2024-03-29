const initialStateAccount = {
  balance: 0,
  loan: 0,
  loanPurpose: "",
  isLoading: false,
};
const accountReducer = (state = initialStateAccount, action) => {
  switch (action.type) {
    case "account/deposit":
      return { ...state, balance: state.balance + action.payload, isLoading: false };
    case "account/withdraw":
      return { ...state, balance: state.balance - action.payload };
    case "account/requestLoan":
      if (state.loan > 0) {
        return state;
      } else {
        return {
          ...state,
          loan: action.payload.amount,
          loanPurpose: action.payload.purpose,
          balance: state.balance + action.payload.amount,
        };
      }
    case "account/payLoan":
      return {
        ...state,
        loan: 0,
        loanPurpose: "",
        balance: state.balance - state.loan,
      };
    case "account/depositRequest":
      return { ...state, isLoading: true };

    default:
      return state;
  }
};

export const deposit = (amount, currency) => {
  if (currency === "IDR") return { type: "account/deposit", payload: amount };

  return async (dispatch, getState) => {
    dispatch({ type: "account/depositRequest" });

    const res = await fetch(`https://api.frankfurter.app/latest?amount=${amount}&from=${currency}&to=IDR`);
    const data = await res.json();

    console.log("log", data);

    const converted = data.rates.IDR;

    dispatch({ type: "account/deposit", payload: converted });
  };
};
export const withdraw = (amount) => {
  return { type: "account/withdraw", payload: amount };
};
export const requestLoan = (amount, purpose) => {
  return {
    type: "account/requestLoan",
    payload: {
      amount: amount,
      purpose: purpose,
    },
  };
};
export const payLoan = () => {
  return { type: "account/payLoan" };
};

export default accountReducer;
