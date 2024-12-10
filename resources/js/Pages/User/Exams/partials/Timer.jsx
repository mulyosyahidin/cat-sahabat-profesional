import React from "react";

export default function Timer({timer}) {
    return (
        <div className="absolute bottom-5 right-5 p-5 text-white shadow-md rounded"
             style={{backgroundColor: "rgba(0,0,0,0.8)"}}>
            <span style={{fontSize: "25px"}}>{timer}</span>
        </div>
    );
}
