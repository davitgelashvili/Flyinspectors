import React, { useEffect, useState } from 'react'
import UserList from '../User/List';
import styles from './style.module.scss'
import { Profile } from './Profile';
import { Url } from './Url';
import SearchUser from '../User/SearchUser';
import { fetchClientsByCompanyId, fetchClientById, fetchClientsByDate, deleteClient } from "./../../api/clientApi";
import { useSelector } from 'react-redux';

export const Admin = () => {
  const { userData } = useSelector(state => state.userData)
  const [load, setLoad] = useState(true);
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [limit, setLimit] = useState(9);
  const [reverse] = useState(true);

  const queryParams = new URLSearchParams({
    page,
    limit,
    reverse,
    companyId: userData.companyId
  }).toString();

  const clickSearchText = async () => {
    if (!searchText.trim()) return;
    setLoad(true);

    try {
      const res = await fetchClientById(searchText.trim());
      if (res) {
        setData([res]);
        setTotalPages(1);
      } else {
        setData([])
        setTotalPages(1);
      }
    } catch (err) {
      console.error(err);
      setTotalPages(1);
      setData([])
    } finally {
      setLoad(false);
    }
  };

  useEffect(() => {
    if (searchText.length < 1) {
      const loadClients = async () => {
        setLoad(true);
        setData([]);
        setSearchText("");
        // setStartDate(fullDate);
        // setEndDate(fullDate);

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
    }

  }, [searchText]);

  return (
    <div className={styles.admin}>
      <div className='container'>
        <div className='row'>
          <div className='col-md-8'>
            <Profile />
            <Url />
          </div>
          <div className='col-4 d-flex flex-column align-items-end' style={{marginBottom: '20px'}}>
            <SearchUser {...{ searchText, setSearchText, onSearch: clickSearchText }} />
          </div>
        </div>
        <div className={styles.admin__content}>
          <UserList
            data={data}
            setData={setData}
            load={load}
            page={page}
            setPage={setPage}
            setLoad={setLoad}
            totalPages={totalPages}
            setTotalPages={setTotalPages} />
        </div>
      </div>
    </div>
  )
}
