/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TokenList from './components/TokenList';
import Confirmation from './components/Confirmation';

function App() {
  const [selectedToken, setSelectedToken] = useState(null);
  const [quote, setQuote] = useState(null);

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<TokenList sourceChainId="1" destChainId="56" onSelectToken={setSelectedToken} />} onQuoteFetched={setQuote} />
          {/*{quote && <Route path="/confirmation" element={<Confirmation token={selectedToken.name} chainId="1" quote={quote} />} />}*/}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
