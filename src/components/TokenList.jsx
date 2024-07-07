/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { fetchTokens, fetchQuote, createTransaction } from '../utils/api';
import ShimmerEffect from './ShimmerEffect';
import Popup from './PopUp';

const TokenList = ({ sourceChainId, destChainId, onSelectToken }) => {
  const [srcTokens, setSrcTokens] = useState([]);
  const [destTokens, setDestTokens] = useState([]);
  const [srcImg, setSrcImg] = useState('');
  const [destImg, setDestImg] = useState('');
  const [formData, setFormData] = useState({
    amount: '',
    srcChainId: '',
    srcQuoteTokenAddress: '',
    dstChainId: '',
    dstQuoteTokenAddress: '',
    decimals: '',
  });

  const [quoteArray, setQuoteArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [tx, setTx] = useState(null);
  const [showLoader, setShowLoader] = useState(false);
  const [hideContent, setHideContent] = useState(true);
  const [clickedQuoteData, setClickedQuoteData] = useState(null);

  const togglePopup = (clickedQuote) => {
    setIsOpen((prevVal) => !prevVal);
    setHideContent(true);
    if (clickedQuote) {
      setClickedQuoteData(clickedQuote);
    } else {
      setClickedQuoteData(null);
    }
  };

  useEffect(() => {
    const getTokens = async () => {
      const response = await fetchTokens(sourceChainId);
      if (response?.status === 200) {
        const recommendedTokens = response?.data?.data?.recommendedTokens;
        setSrcTokens(recommendedTokens);
      }
    };
    getTokens();
  }, [sourceChainId]);

  useEffect(() => {
    const getTokens = async () => {
      const response = await fetchTokens(destChainId);
      if (response?.status === 200) {
        const recommendedTokens = response?.data?.data?.recommendedTokens;
        setDestTokens(recommendedTokens);
      }
    };
    getTokens();
  }, [destChainId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'srcQuoteTokenAddress') {
      const srcTokenData = srcTokens.find((token) => token?.address === value);
      console.log(srcTokenData);
      setSrcImg(srcTokenData?.logoURI);
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        srcChainId: srcTokenData?.chainId || '',
        decimals: srcTokenData?.decimals || '',
      }));
    } else if (name === 'dstQuoteTokenAddress') {
      const destTokenData = destTokens.find((token) => token?.address === value);
      console.log(destTokenData);
      setDestImg(destTokenData?.logoURI);
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        dstChainId: destTokenData?.chainId || '',
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetchQuote({ formData });
      if (response?.status === 200) {
        const quoteData = response?.data?.data;
        if (quoteData?.success === true) {
          const fetchedQuote = quoteData?.routes;
          setLoading(false);
          setQuoteArray(fetchedQuote);
          console.log(fetchedQuote);
        } else {
          alert(quoteData?.errorMsg);
          setLoading(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const QuoteDiv =
    quoteArray.length > 0 ? (
      <div className="shimmerParentDiv">
        {quoteArray.map((quote, i) => (
          <div key={i} className="quoteChildDiv" onClick={() => togglePopup(quoteArray[i])}>
            <div className="quoteIndex">#{`${i + 1}`}</div>
            <div style={{ color: '#efefef', display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
              <span className="srcTokenName">{quote?.srcQuoteToken?.symbol}</span>
              <p className="arrow">&#8594;</p>
              <span className="destTokenName">{quote?.dstQuoteToken?.symbol}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '10px 0px' }}>
              <div style={{ color: '#efefef', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center' }}>
                <label className="roboto-light" htmlFor="srcUSD">
                  Src. USD
                </label>
                <span id="srcUSD">{Number(quote?.srcQuoteTokenUsdValue ?? 0).toFixed(2)}</span>
              </div>

              <div style={{ color: '#efefef', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center' }}>
                <label className="roboto-light" htmlFor="destUSD">
                  Dest. USD
                </label>
                <span id="destUSD">{Number(quote?.dstQuoteTokenUsdValue ?? 0).toFixed(2)}</span>
              </div>
            </div>

            <div
              style={{
                color: '#efefef',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                padding: '10px 0px',
              }}>
              <label style={{ fontSize: '22px', color: 'rgb(55 231 231)' }} htmlFor="estimatedGas">
                Estimated Gas:
              </label>{' '}
              <span id="estimatedGas">{quote?.estimatedGas}</span>
            </div>
          </div>
        ))}
      </div>
    ) : (
      ''
    );

  const handleTransaction = async () => {
    try {
      setShowLoader(true);

      let obj = {};

      if (clickedQuoteData && Object.keys(clickedQuoteData).length > 0) {
        console.log(clickedQuoteData);
        obj = {
          srcChainId: clickedQuoteData?.srcChainId,
          srcQuoteTokenAddress: clickedQuoteData?.srcQuoteTokenAddress,
          srcQuoteTokenAmount: clickedQuoteData?.srcQuoteTokenAmount,
          dstChainId: clickedQuoteData?.dstChainId,
          dstQuoteTokenAddress: clickedQuoteData?.dstQuoteTokenAddress,
          slippage: clickedQuoteData?.slippage || 1,
          receiver: '0x111111111117dC0aa78b770fA6A738034120C302',
          bridgeProvider: clickedQuoteData?.bridgeDescription?.provider,
          srcBridgeTokenAddress: clickedQuoteData?.bridgeDescription?.srcBridgeTokenAddress,
          dstBridgeTokenAddress: clickedQuoteData?.bridgeDescription?.dstBridgeTokenAddress,
          srcSwapProvider: clickedQuoteData?.srcSwapDescription?.provider,
          dstSwapProvider: clickedQuoteData?.srcSwapDescription?.provider,
        };

        if (clickedQuoteData?.srcQuoteTokenAddress === clickedQuoteData?.bridgeDescription?.srcBridgeTokenAddress) {
          delete obj?.srcSwapProvider;
        }
        if (clickedQuoteData?.dstQuoteTokenAddress === clickedQuoteData?.bridgeDescription?.dstBridgeTokenAddress) {
          delete obj?.dstSwapProvider;
        }

        if (
          clickedQuoteData?.srcQuoteTokenAddress === clickedQuoteData?.bridgeDescription?.srcBridgeTokenAddress &&
          clickedQuoteData?.dstQuoteTokenAddress === clickedQuoteData?.bridgeDescription?.dstBridgeTokenAddress
        ) {
          delete obj?.srcSwapProvider;
          delete obj?.dstSwapProvider;
        }
      }

      const response = await createTransaction({ transactionObj: obj });
      if (response?.status === 200) {
        const transactionResponse = response?.data;
        console.log(transactionResponse);
        setShowLoader(false);
        setTx(transactionResponse);
        setHideContent(false);
      } else {
        console.log(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="displayColumn fullScreen">
        <h2 className="h2 gradient-text">Bridge APP</h2>
        <div style={{ display: 'flex' }}>
          <form className="form" onSubmit={handleFormSubmit}>
            <div>
              <div className="fromDiv">
                <h3 className="roboto-light">From:</h3>
                <div className="srcTokenDiv">
                  <input
                    type="number"
                    min={'0'}
                    className="tokenInput"
                    placeholder="0.00"
                    value={formData?.amount}
                    name="amount"
                    onChange={handleChange}
                    required
                  />
                  <div className="tokenSelectDiv">
                    <select
                      className="tokenSelect"
                      name="srcQuoteTokenAddress"
                      id="srcToken"
                      value={formData?.srcQuoteTokenAddress}
                      onChange={handleChange}
                      required>
                      <option value="">Select Token</option>
                      {srcTokens.map((token) => (
                        <option key={token.address} value={token?.address}>
                          {token?.name}
                        </option>
                      ))}
                    </select>
                    {srcImg && <img className="img" src={srcImg} alt="token-logo" />}
                  </div>
                </div>
              </div>
              <div className="toDiv" style={{ marginTop: '5px' }}>
                <h3 className="roboto-light">To:</h3>
                <div className="destTokenDiv">
                  <div className="destTokenInput">0.00</div>
                  <div className="tokenSelectDiv">
                    <select
                      className="tokenSelect"
                      name="dstQuoteTokenAddress"
                      id="destToken"
                      value={formData?.dstQuoteTokenAddress}
                      onChange={handleChange}
                      required>
                      <option value="">Select Token</option>
                      {destTokens.map((token) => (
                        <option key={token.address} value={token?.address}>
                          {token?.name}
                        </option>
                      ))}
                    </select>
                    {destImg && <img className="img" src={destImg} alt="token-logo" />}
                  </div>
                </div>
              </div>
            </div>
            <button className="getQuoteBtn" type="submit">
              Get Quote
            </button>
          </form>
          {loading ? <ShimmerEffect /> : QuoteDiv}
        </div>
      </div>
      <Popup
        isOpen={isOpen}
        handleClose={(data) => togglePopup(data)}
        handleTransaction={handleTransaction}
        showLoader={showLoader}
        transactionDetail={tx}
        hideContent={hideContent}
      />
    </>
  );
};

export default TokenList;
