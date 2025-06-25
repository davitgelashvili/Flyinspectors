import { useEffect, useState } from "react";
import Item from "./Item";
// import DateFilter from "./DateFilter";
import SearchUser from "./SearchUser";
// import Controls from "./Controls";
import Pagination from "./Pagination";
// import { exportToExcel } from "../../../utils/exportExcel";
import { fetchClientsByCompanyId, fetchClientById, fetchClientsByDate, deleteClient } from "./../../api/clientApi";
import { useSelector } from "react-redux";
import Loading from "../Loading/Loading";

const UserList = ({data, setData, load, setLoad, totalPages, setTotalPages, page, setPage}) => {
    const { userData } = useSelector(state => state.userData)

    const getFormattedDate = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const fullDate = getFormattedDate();

    const [excelBody, setExcelBody] = useState([]);
    // const [data, setData] = useState([]);
    // const [load, setLoad] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [resetData, setResetData] = useState(true);
    const [startDate, setStartDate] = useState(fullDate);
    const [endDate, setEndDate] = useState(fullDate);
    const [limit, setLimit] = useState(9);
    const [reverse] = useState(true);
    // const [page, setPage] = useState(1);
    // const [totalPages, setTotalPages] = useState(1);

    const excelHeader = [
        '_id', 'passportImage', 'ticketImage', 'otherImage', 'signature',
        'userId', 'firstName', 'lastName', 'phone', 'email', 'city', 'address',
        'problem', 'flightNumber', 'date', 'select', 'description', 'status',
        'oldStatus', 'createDate', '__v'
    ];

    const queryParams = new URLSearchParams({
        page,
        limit,
        reverse,
        companyId: userData.companyId
    }).toString();

    useEffect(() => {
        const loadClients = async () => {
            setLoad(true);
            setData([]);
            setSearchText("");
            setStartDate(fullDate);
            setEndDate(fullDate);

            try {
                const res = await fetchClientsByCompanyId(queryParams);
                setData(res.data || []);
                setTotalPages(res.pagination?.totalPages || 1);
            } catch (err) {
                console.error(err);
            } finally {
                setLoad(false);
            }
        };

        loadClients();
    }, [page, resetData, limit]);

    const handleDownloadExcel = () => {
        // exportToExcel(excelBody, excelHeader);
    };

    const clickSearchText = async () => {
        if (!searchText.trim()) return;
        setLoad(true);

        try {
            const res = await fetchClientById(searchText.trim());
            if (res) {
                setData([res]);
                setTotalPages(1);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoad(false);
        }
    };


    const clickSearchDate = async () => {
        setLoad(true);

        try {
            const res = await fetchClientsByDate(startDate, endDate);
            if (res) {
                setData(res);
                setTotalPages(1);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoad(false);
        }
    };


    const handleDelete = async (user) => {
        setLoad(true);

        try {
            await deleteClient(user.userId);
            setResetData(prev => !prev);
        } catch (err) {
            console.error(err);
        } finally {
            setLoad(false);
        }
    };


    const handleClear = () => {
        setLoad(true);
        setPage(1);
        setSearchText("");
        setStartDate(fullDate);
        setEndDate(fullDate);
        setResetData(prev => !prev);
    };

    useEffect(() => {
        setExcelBody(data);
        console.log(data)
    }, [data]);

    return (
        <div className="container" style={{ marginBottom: "20px" }}>
            <div className="row">
                {/* <DateFilter {...{ startDate, endDate, setStartDate, setEndDate, onSearch: clickSearchDate }} /> */}
                {/* <SearchUser {...{ searchText, setSearchText, onSearch: clickSearchText }} /> */}
                {/* <Controls {...{ handleClear, handleDownloadExcel, limit, setLimit }} /> */}
                {load && <Loading />}
                {data?.map((item) => (
                    <Item key={item._id} item={item} handleDelete={handleDelete} load={load} />
                ))}
                {totalPages > 1 && <Pagination {...{ page, totalPages, setPage }} />}
            </div>
        </div>
    );
};

export default UserList;
