import React, { useEffect, useState } from 'react'
import { useSearchParams } from "react-router-dom";
import Loading from '../Loading/Loading';

export const TermsConditions = () => {
    const [load, setLoad] = useState(false)
    const [data, setData] = useState([])
    const [searchParams] = useSearchParams();
    const ref = searchParams.get('ref');
    useEffect(() => {
        setLoad(true)
        fetch(`${process.env.REACT_APP_API_URL}/company`, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        })
            .then((res) => res.json())
            .then((res) => {
                setData(res);
            }).finally(() => {
                setLoad(false)
            })
    }, [ref]);
    return (
        <div className='container'>
            {load && <Loading />}
            {!load && data
                .filter((item) => item.companyId === ref)
                .map((item) => (
                    <div key={item._id} dangerouslySetInnerHTML={{ __html: item.document}} />
                ))
            }
        </div>
    )
}