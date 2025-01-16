import React, {useState, useEffect} from 'react';

// Mock function to get exchange rates
const getExchangeRate = (currency) => {
  const rates = {
    AED: 1, // Default currency
    USD: 0.27,
    EUR: 0.23,
  };
  return rates[currency] || 1;
};

// CurrencyChanger Component
export const CurrencyChanger = ({price}) => {
  const [currency, setCurrency] = useState('AED'); // Default currency is AED
  const [convertedPrice, setConvertedPrice] = useState(price);

  useEffect(() => {
    const rate = getExchangeRate(currency);
    setConvertedPrice(price * rate);
  }, [currency, price]);

  return (
    <div>
      <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
        <option value="AED">AED</option>
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
      </select>
      <p>
        Price: {convertedPrice.toFixed(2)} {currency}
      </p>
    </div>
  );
};
