const Controls = ({ handleClear, handleDownloadExcel, limit, setLimit }) => (
    <div className="col-12 d-flex justify-content-between" style={{ marginTop: '20px', padding: '20px 0', borderTop: '1px solid grey' }}>
      <div>
        <button onClick={handleClear}>clear</button>
        <button onClick={handleDownloadExcel}>download excel</button>
      </div>
      <select onChange={(e) => setLimit(Number(e.target.value))} value={limit}>
        <option value={3}>3</option>
        <option value={10}>10</option>
        <option value={20}>20</option>
      </select>
    </div>
  );
  
  export default Controls;
  