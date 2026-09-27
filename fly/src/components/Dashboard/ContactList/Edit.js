'use client'

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import TextInput from "../../UI/TextInput";
import Loading from "../../Loading/Loading";
import adminFetch from '../../../api/adminFetch'

const ContactEdit = () => {
  const [data, setData] = useState([]);
  const pathname = usePathname();
  const id = pathname.split('/').pop();
  const [update, setUpdate] = useState(true);
  const [valueCall, setvalueCall] = useState("");
  const [valueEmail, setvalueEmail] = useState("");
  const [valueAddress, setvalueAddress] = useState("");
  const [load, setLoad] = useState(false);

  useEffect(() => {
    setvalueCall({
      en: data?.call?.en,
      ka: data?.call?.ka,
    });
    setvalueEmail({
      en: data?.email?.en,
      ka: data?.email?.ka,
    });
    setvalueAddress({
      en: data?.address?.en,
      ka: data?.address?.ka,
    });
  }, [data]);

  useEffect(() => {
    adminFetch(`${process.env.NEXT_PUBLIC_API_URL}/contactlist`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        const x = res.filter((item) => item.id == id);
        setData(...x);
      });
  }, [update]);

  function handleClick(e) {
    e.preventDefault();
    setLoad(true);
    adminFetch(`${process.env.NEXT_PUBLIC_API_URL}/contactlist`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        id: id,
        call: {
          en: valueCall.en,
          ka: valueCall.ka,
        },
        email: {
          en: valueEmail.en,
          ka: valueEmail.ka,
        },
        address: {
          en: valueAddress.en,
          ka: valueAddress.ka,
        },
      }),
    })
      .then((res) => res.json())
      .finally(() => {
        setLoad(false);
        setUpdate(!update);
      });
  }

  return (
    <div style={{ padding: "20px", backgroundColor: "#f8f9fa" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <div style={{ padding: "20px", backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
          <h3 style={{ marginBottom: "10px", color: "#007bff" }}>Ireland</h3>
          <TextInput
            type={"text"}
            value={valueCall.en}
            placeholder={"Enter title"}
            name={"title"}
            icon={""}
            onChange={(e) =>
              setvalueCall({
                ...valueCall,
                en: e.target.value,
              })
            }
          />
          <TextInput
            type={"text"}
            value={valueEmail.en}
            placeholder={"Enter title"}
            name={"title"}
            icon={""}
            onChange={(e) =>
              setvalueEmail({
                ...valueEmail,
                en: e.target.value,
              })
            }
          />
          <TextInput
            type={"text"}
            value={valueAddress.en}
            placeholder={"Enter title"}
            name={"title"}
            icon={""}
            onChange={(e) =>
              setvalueAddress({
                ...valueAddress,
                en: e.target.value,
              })
            }
          />
        </div>
        <div style={{ padding: "20px", backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
          <h3 style={{ marginBottom: "10px", color: "#007bff" }}>Georgian</h3>
          <TextInput
            type={"text"}
            value={valueCall.ka}
            placeholder={"Enter title"}
            name={"title"}
            icon={""}
            onChange={(e) =>
              setvalueCall({
                ...valueCall,
                ka: e.target.value,
              })
            }
          />
          <TextInput
            type={"text"}
            value={valueEmail.ka}
            placeholder={"Enter title"}
            name={"title"}
            icon={""}
            onChange={(e) =>
              setvalueEmail({
                ...valueEmail,
                ka: e.target.value,
              })
            }
          />
          <TextInput
            type={"text"}
            value={valueAddress.ka}
            placeholder={"Enter title"}
            name={"title"}
            icon={""}
            onChange={(e) =>
              setvalueAddress({
                ...valueAddress,
                ka: e.target.value,
              })
            }
          />
        </div>
      </div>
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        {load && <Loading />}
        <button
          onClick={handleClick}
          style={{
            padding: "10px 20px",
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            transition: "background-color 0.3s",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#218838")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#28a745")}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default ContactEdit;