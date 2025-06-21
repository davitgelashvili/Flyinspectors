import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Loading from '../../Loading/Loading';

export default function Company() {
  const [load, setLoad] = useState(false)
  const [data, setData] = useState([])
  const [rest, setrest] = useState([])

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
  }, [rest]);

  const handleDelete = async (id) => {
    setLoad(true);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/company/delete`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ companyId: id }), // ან user.companyId
      });

      const message = await res.text();

      if (res.ok) {
        alert("✅ კომპანია წარმატებით წაიშალა");
        // setResetData(prev => !prev); // მონაცემების განახლება
        setrest([])
      } else {
        alert(`❌ წაშლა ვერ მოხერხდა: ${message}`);
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("❌ ქსელური ან სერვერის შეცდომა წაშლისას");
    } finally {
      setLoad(false);
    }
  };


  return (
    <div className='container'>
      <h3 style={{ color: "#007bff" }}><Link to={'add'}>add</Link></h3>
      {load && <Loading />}
      <div className='row'>
        {data?.map((item) => (
          <div className='col-2 d-flex align-items-start' style={{ position: 'relative' }} key={item._id}>
            <button style={{ position: "absolute", zIndex: 1 }} onClick={() => handleDelete(item.companyId)}>delete</button>
            <Link
              to={item.companyId}
              className="d-flex justify-content-between"
              style={{
                width: '100%',
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "20px 10px 10px 10px",
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
                <div>
                  <p style={{ lineHeight: '22px', height: '22px', overflow: 'hidden', margin: 0 }}>{item.title}</p>
                </div>
                <div>
                  <p style={{ lineHeight: '22px', height: '22px', overflow: 'hidden', margin: 0 }}>{item.companyId}</p>
                  {/* <p style={{ lineHeight: '22px', height: '22px', overflow: 'hidden', margin: 0 }}>{item.description.en}</p> */}
                </div>
              </div>


            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
