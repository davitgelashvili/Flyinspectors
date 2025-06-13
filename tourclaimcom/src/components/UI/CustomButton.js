import React from 'react'

export default function CustomButton({onClick, text}) {
    return (
        <button
            style={{
                backgroundColor: "#0d6693",
                color: "#fff",
                border: "none",
                padding: "10px 20px",
                borderRadius: "5px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                transition: "background-color 0.3s ease, transform 0.2s ease"
            }}

            onClick={onClick}
        >
            {text}
        </button>
    )
}
