import TextInput from "../../UI/TextInput";

const SearchUser = ({ searchText, setSearchText, onSearch }) => (
    <div className="col-6 d-flex flex-column align-items-end">
        <div>
            <TextInput
                type="text"
                value={searchText}
                label="search user id"
                placeholder="Enter User ID"
                name="search"
                onChange={(e) => setSearchText(e.target.value)}
            />
            <button onClick={onSearch}>search</button>
        </div>
    </div>
);

export default SearchUser;
