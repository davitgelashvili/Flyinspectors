import TextInput from "../../UI/TextInput";

const DateFilter = ({ startDate, endDate, setStartDate, setEndDate, onSearch }) => (
    <>
      <div className="col-3 d-flex flex-column align-items-start">
        <TextInput
          type="date"
          value={startDate}
          placeholder="start date"
          name="startdate"
          label="start date"
          onChange={(e) => setStartDate(e.target.value)}
        />
        <button onClick={onSearch}>filter</button>
      </div>
      <div className="col-3 d-flex flex-column align-items-start">
        <TextInput
          type="date"
          value={endDate}
          placeholder="end date"
          name="enddate"
          label="end date"
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
    </>
  );
  
  export default DateFilter;
  