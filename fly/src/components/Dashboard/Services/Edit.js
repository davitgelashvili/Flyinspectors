'use client'

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import TextInput from "../../UI/TextInput";
import Loading from "../../Loading/Loading";
import adminFetch from '../../../api/adminFetch'

const ServicesEdit = () => {
  const [data, setData] = useState([]);
  const pathname = usePathname();
  const id = pathname.split('/').pop();
  const [update, setUpdate] = useState(true);
  const [valueTitle, setValueTitle] = useState("");
  const [valueDesc, setValueDesc] = useState("");
  const [load, setLoad] = useState(false);

  useEffect(() => {
    setValueTitle({
      en: data?.title?.en,
      ka: data?.title?.ka,
    });
    setValueDesc({
      en: data?.description?.en,
      ka: data?.description?.ka,
    });
  }, [data]);

  useEffect(() => {
    adminFetch(`${process.env.NEXT_PUBLIC_API_URL}/services`, {
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
    adminFetch(`${process.env.NEXT_PUBLIC_API_URL}/services/id`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        id: id,
        title: {
          en: valueTitle.en,
          ka: valueTitle.ka,
        },
        description: {
          en: valueDesc.en,
          ka: valueDesc.ka,
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
          <h3 style={{ marginBottom: "10px", color: "#007bff" }}>English</h3>
          <TextInput
            type={"text"}
            value={valueTitle.en}
            placeholder={"Enter title"}
            name={"title"}
            icon={""}
            onChange={(e) =>
              setValueTitle({
                ...valueTitle,
                en: e.target.value,
              })
            }
          />
          <TextInput
            type={"textarea"}
            value={valueDesc.en}
            placeholder={"Enter description"}
            name={"desc"}
            icon={""}
            onChange={(e) =>
              setValueDesc({
                ...valueDesc,
                en: e.target.value,
              })
            }
          />
        </div>
        <div style={{ padding: "20px", backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
          <h3 style={{ marginBottom: "10px", color: "#007bff" }}>Georgian</h3>
          <TextInput
            type={"text"}
            value={valueTitle.ka}
            placeholder={"Enter title"}
            name={"title"}
            icon={""}
            onChange={(e) =>
              setValueTitle({
                ...valueTitle,
                ka: e.target.value,
              })
            }
          />
          <TextInput
            type={"textarea"}
            value={valueDesc.ka}
            placeholder={"Enter description"}
            name={"desc"}
            icon={""}
            onChange={(e) =>
              setValueDesc({
                ...valueDesc,
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

export default ServicesEdit;