/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { createTransaction } from '../utils/api';

const Confirmation = ({ token, chain, quote }) => {
  const [params, setParams] = useState(null);

  const handleConfirm = async () => {
    const response = await createTransaction({ token, chain });
    setParams(response.data);
  };

  return (
    <div>
      <h2>Confirmation</h2>
      <div>Quote: {JSON.stringify(quote)}</div>
      <button onClick={handleConfirm}>Confirm</button>
      {params && <div>{JSON.stringify(params)}</div>}
    </div>
  );
};

export default Confirmation;
