import TextInput from "../UI/TextInput";

const SearchUser = ({ searchText, setSearchText, onSearch }) => (
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
);

export default SearchUser;
