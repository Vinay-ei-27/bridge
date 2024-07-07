/* eslint-disable react/prop-types */
import '../../public/css/pop-up.css';
import Loader from './Loader.jsx';

const Popup = ({ isOpen, handleClose, handleTransaction, showLoader, transactionDetail, hideContent }) => {
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('popup-overlay')) {
      handleClose(null);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="popup-overlay" onClick={handleOverlayClick}>
          <div className="popup">
            {!hideContent && (
              <div style={{ width: '100%' }}>
                <div className="transactionHeading">Transaction Details</div>
                <div>
                  <div className="flexStart">
                    <strong style={{ marginRight: '36px' }}>To:</strong> <p style={{ margin: '0px' }}>{transactionDetail?.data?.tx?.to}</p>
                  </div>
                  <div className="flexStart">
                    <strong style={{ marginRight: '20px' }}>Data: </strong>
                    <p className="txData">{transactionDetail?.data?.tx?.data}</p>
                  </div>
                  <div className="flexStart">
                    <strong style={{ marginRight: '14px' }}>Value: </strong>
                    <p style={{ margin: '0px' }}>{transactionDetail?.data?.tx?.value}</p>
                  </div>
                </div>
              </div>
            )}
            {showLoader ? (
              <Loader />
            ) : (
              <>
                {hideContent && (
                  <div style={{ marginBottom: '72px' }} className="displayColumn">
                    <p style={{ margin: '0px' }}>Are you sure want to initiate transaction?</p>
                    <p>
                      if <strong>Yes</strong>, then click on the <strong>Bridge</strong> button{' '}
                    </p>
                  </div>
                )}
                <div style={{ display: 'flex', width: '100%', justifyContent: 'space-evenly' }}>
                  <button className="close" onClick={() => handleClose(null)}>
                    Close
                  </button>
                  {hideContent && (
                    <button className="bridge" onClick={handleTransaction}>
                      Bridge
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Popup;
