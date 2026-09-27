'use client'

import { useEffect, useState } from "react";
import Link from "next/link";
import Loading from "../../Loading/Loading";
import adminFetch from '../../../api/adminFetch'

const ConditionsList = () => {
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(false)

  useEffect(() => {
    setLoad(true)
    adminFetch(`${process.env.NEXT_PUBLIC_API_URL}/conditions`, {
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
  }, []);

  return (
    <div className="container">
      <h3 style={{ color: "#007bff" }}><Link href={'/adminpanel/condition/add'}>add</Link></h3>
      {load && <Loading />}
      {data?.map((item) => (
        <Link
          href={`/adminpanel/condition/${item._id}`}
          key={item._id}
          className="d-flex justify-content-between"
          style={{
            width: ' 500px',
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "20px",
            backgroundColor: "#fff",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            transition: "transform 0.3s, box-shadow 0.3s",
            textDecoration: "none",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "translateY(-5px)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.transform = "translateY(0)")
          }
        >
          <div>
            <div style={{
              width: '450px',
              height: '44px',
              overflow: 'hidden',
            }}>
              <p style={{ lineHeight: '22px', height: '22px', overflow: 'hidden', margin: 0 }}>{item.title.ka}</p>
              <p style={{ lineHeight: '22px', height: '22px', overflow: 'hidden', margin: 0 }}>{item.title.en}</p>
            </div>
            <div style={{
              width: '450px',
              height: '44px',
              overflow: 'hidden',
            }}>
              <p style={{ lineHeight: '22px', height: '22px', overflow: 'hidden', margin: 0 }}>{item.description.ka}</p>
              <p style={{ lineHeight: '22px', height: '22px', overflow: 'hidden', margin: 0 }}>{item.description.en}</p>
            </div>
          </div>


        </Link>
      ))}
    </div>
  );
};

export default ConditionsList;