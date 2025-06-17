import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { downloadExcel } from "react-export-table-to-excel";
import { fetchClientById, updateClientStatus } from "../../../api/clientApi";
import Loading from "../../Loading/Loading";

const UserEdit = () => {
    const [data, setData] = useState({});
    const [load, setLoad] = useState(false)
    const { id } = useParams();
    const [value, setValue] = useState("");
    const [change, setChange] = useState(false)

    useEffect(() => {
        const loadClients = async () => {
            if (!id) return;
            setLoad(true);

            try {
                const res = await fetchClientById(id);
                if (res) {
                    setData(res);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoad(false);
            }
        };

        loadClients();
    }, [id, change]);



    const handleClick = async () => {

        setLoad(true);
        try {
            const updated = await updateClientStatus(id, value, data.status);
            setData(updated);
        } catch (err) {
            console.error("Failed to update status:", err);
        } finally {
            setLoad(false);
            setChange(!change)
        }
    };

    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);  // ეს აქ დაბრუნებას გულისხმობს
    };

    return (
        <div className="container">
            <div className="user-list" style={{ display: "grid", gap: "20px", marginTop: "20px", marginBottom: "20px" }}>
                <div>
                    <button onClick={goBack}>Back</button>
                </div>
                <div style={{
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "20px",
                    backgroundColor: "#f9f9f9",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}>
                    <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "8px" }}>
                        {data.firstName} {data.lastName}
                    </h2>
                    <h2 style={{ fontSize: "16px", color: "blue", marginBottom: "8px" }}>
                        <p>old status: {data.oldStatus}</p>
                        <strong>Status:</strong> {data.status}
                    </h2>
                    <div className="d-flex align-items-center" style={{ marginBottom: "16px" }}>
                        <select
                            onChange={(e) => setValue(e.target.value)}
                            style={{
                                padding: "8px",
                                borderRadius: "4px",
                                border: "1px solid #ccc",
                                marginRight: "10px",
                            }}
                        >
                            <option value="">Choose status</option>
                            <option value="Application received">Application received</option>
                            <option value="Case proceedings initiated">Case proceedings initiated</option>
                            <option value="Rejected by the airline">Rejected by the airline</option>
                            <option value="Transferred to the legal department">Transferred to the legal department</option>
                            <option value="Case appealed to a higher authority">Case appealed to a higher authority</option>
                            <option value="Case is pending in court">Case is pending in court</option>
                            <option value="Case successfully closed">Case successfully closed</option>
                            <option value="Case closed">Case closed</option>
                        </select>
                        <button
                            onClick={handleClick}
                            style={{
                                padding: "8px 16px",
                                borderRadius: "4px",
                                border: "none",
                                backgroundColor: "#007bff",
                                color: "#fff",
                                cursor: "pointer",
                            }}
                        >
                            {load ? <Loading /> : 'Edit'}
                        
                        </button>
                    </div>
                    <h2 style={{ fontSize: "16px", color: "green", marginBottom: "8px" }}>
                        <strong>User ID:</strong> {data.userId}
                    </h2>
                    <p style={{ fontSize: "14px", marginBottom: "4px" }}><strong>Email:</strong> {data.email}</p>
                    <p style={{ fontSize: "14px", marginBottom: "4px" }}><strong>Phone:</strong> {data.phone}</p>
                    <p style={{ fontSize: "14px", marginBottom: "4px" }}><strong>Address:</strong> {data.address}</p>
                    <p style={{ fontSize: "14px", marginBottom: "4px" }}><strong>Date:</strong> {data.date}</p>
                    <p style={{ fontSize: "14px", marginBottom: "4px" }}><strong>City:</strong> {data.city}</p>
                    <p style={{ fontSize: "14px", marginBottom: "4px" }}><strong>Flight Number:</strong> {data.flightNumber}</p>
                    <p style={{ fontSize: "14px", color: "red", marginBottom: "4px" }}><strong>Problem:</strong> {data.problem}</p>
                    <p style={{ fontSize: "14px", color: "black", marginBottom: "4px" }}><strong>Description:</strong> {data.description}</p>
                    <div className="d-flex align-items-start" style={{ gap: "10px", marginTop: "10px" }}>
                        {data.passportImage && (
                            <img src={data.passportImage} alt="Passport" style={{ width: "100px", height: "100%", borderRadius: "4px" }} />
                        )}
                        {data.ticketImage && (
                            <img src={data.ticketImage} alt="Ticket" style={{ width: "100px", borderRadius: "4px" }} />
                        )}
                        {data.otherImage && (
                            <img src={data.otherImage} alt="Other" style={{ width: "100px", borderRadius: "4px" }} />
                        )}
                        {data.signature && (
                            <img src={data.signature} alt="Signature" style={{ width: "100px", borderRadius: "4px" }} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserEdit;
