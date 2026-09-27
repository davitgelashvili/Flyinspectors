'use client'

import { useEffect, useState } from "react";
import Link from "next/link";
import Loading from "../../Loading/Loading";
import adminFetch from '../../../api/adminFetch'

const ContactList = () => {
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(false)

  useEffect(() => {
    setLoad(true)
    adminFetch(`${process.env.NEXT_PUBLIC_API_URL}/contactlist`, {
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
      {load && <Loading />}
      {data?.map((item) => (
        <Link
          href={'/adminpanel/contact/edit'}
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
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                color: "#007bff",
                marginBottom: "10px",
              }}
            >
              {item.call.en}
            </h3>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                color: "#007bff",
                marginBottom: "10px",
              }}
            >
              {item.email.en}
            </h3>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                color: "#007bff",
                marginBottom: "10px",
              }}
            >
              {item.address.en}
            </h3>
          </div>

          <div>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                color: "#007bff",
                marginBottom: "10px",
              }}
            >
              {item.call.ka}
            </h3>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                color: "#007bff",
                marginBottom: "10px",
              }}
            >
              {item.email.ka}
            </h3>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                color: "#007bff",
                marginBottom: "10px",
              }}
            >
              {item.address.ka}
            </h3>
          </div>

        </Link>
      ))}
    </div>
  );
};

export default ContactList;