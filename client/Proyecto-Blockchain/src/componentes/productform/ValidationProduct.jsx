// CurrencyInput.js
import React, { useState } from "react";

function CurrencyInput({ onAmountChange }) {
  const [amount, setAmount] = useState("");

  const handleAmountChange = (e) => {
    const newAmount = e.target.value;
    setAmount(newAmount);
    onAmountChange(newAmount);
  };

  return (
    <div>
      <label htmlFor="usdAmount">Monto en dólares:</label>
      <input
        type="number"
        id="usdAmount"
        name="usdAmount"
        min="0"
        step="0.01"
        value={amount}
        onChange={handleAmountChange}
      />
    </div>
  );
}

export default CurrencyInput;


