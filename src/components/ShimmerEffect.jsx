import '../css/shimmer.css';

const ShimmerEffect = () => (
  <div style={{ marginLeft: '20px' }}>
    <div className="shimmer-wrapper">
      <div className="shimmer"></div>
    </div>
    <div style={{ marginTop: '10px' }} className="shimmer-wrapper">
      <div className="shimmer"></div>
    </div>
  </div>
);

export default ShimmerEffect;
