'use client'

import { useEffect, useState } from "react";
import Link from "next/link";
import Loading from "../../Loading/Loading";
import adminFetch from '../../../api/adminFetch'

const RateList = () => {
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(false)

  useEffect(() => {
    setLoad(true)

    adminFetch(`${process.env.NEXT_PUBLIC_API_URL}/rate`, {
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
    <div style={{ padding: "20px", backgroundColor: "#f8f9fa" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
        }}
      >
        {load && <Loading />}
        {data?.map((item) => (
          <div
            key={item._id}
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
            }}
          >
            <Link href={`/adminpanel/rate/${item.id}`} style={{ textDecoration: "none", color: "inherit" }}>
              <h3 style={{ color: "#007bff", marginBottom: "10px" }}>
                <strong>Name:</strong> {item.description.en}
              </h3>
              <p style={{ color: "#6c757d" }}>{item.title.en}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RateList;