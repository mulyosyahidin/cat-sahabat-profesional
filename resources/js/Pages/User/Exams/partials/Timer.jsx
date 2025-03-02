import React from "react";

export default function Timer({timer, classes = ''}) {
    return (
        <div className={classes}
             style={{backgroundColor: "rgba(0,0,0,0.8)"}}>
            <span style={{fontSize: "25px"}}>{timer}</span>
        </div>
    );
}
