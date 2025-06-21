const Pagination = ({ page, totalPages, setPage }) => (
    <div style={{ marginTop: "1rem" }}>
      <button disabled={page === 1} onClick={() => setPage(prev => prev - 1)}>Previous</button>
      <span style={{ margin: "0 1rem" }}>Page {page} of {totalPages}</span>
      <button disabled={page === totalPages} onClick={() => setPage(prev => prev + 1)}>Next</button>
    </div>
  );
  
  export default Pagination;
  