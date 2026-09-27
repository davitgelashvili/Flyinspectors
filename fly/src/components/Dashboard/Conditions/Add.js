'use client'

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import TextInput from "../../UI/TextInput";
import adminFetch from '../../../api/adminFetch'

const ConditionsAdd = () => {
    const [update, setUpdate] = useState(true);
    const [title, settitle] = useState({en: "", ka: ""});
    const [description, setdescription] = useState({en: "", ka: ""});



    function handleClick(e) {
        e.preventDefault();
        adminFetch(`${process.env.NEXT_PUBLIC_API_URL}/conditions`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                title: title,
                description: description
            }),
        })
        .then((res) => res.json())
        .finally(() => {
            setUpdate(!update);
        });
    }

    return (
        <div className="container">
          <div className="row">
            <div className="col-6">
              <div style={{width: "100%"}}>
                <h3 style={{ color: "#007bff" }}>English</h3>
                <TextInput
                  type="text"
                  value={title.en}
                  placeholder="Enter title"
                  name="title"
                  icon=""
                  onChange={(e) =>
                    settitle({ ...title, en: e.target.value })
                  }
                />
                <TextInput
                  type="textarea"
                  value={description.en}
                  placeholder="Enter description"
                  name="desc"
                  rows={50}
                  icon=""
                  onChange={(e) =>
                    setdescription({ ...description, en: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="col-6">
              <div style={{width: "100%"}}>
                <h3 style={{ color: "#007bff" }}>Georgian</h3>
                <TextInput
                  type="text"
                  value={title.ka}
                  placeholder="Enter title"
                  name="title"
                  icon=""
                  onChange={(e) =>
                    settitle({ ...title, ka: e.target.value })
                  }
                />
                <TextInput
                  type="textarea"
                  value={description.ka}
                  placeholder="Enter description"
                  name="desc"
                  rows={50}
                  icon=""
                  onChange={(e) =>
                    setdescription({ ...description, ka: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="col-12">
              <button onClick={handleClick}>add</button>
            </div>
          </div>
        </div>
    );
};

export default ConditionsAdd;