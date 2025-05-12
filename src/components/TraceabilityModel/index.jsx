import styles from "./index.css";
import React from "react";

const TraceabilityModel = () => {
    return (
        <>
            <div className={styles.header}>
                <h2>遥感监测模型可视化</h2>
            </div>
            <img src={"/swat.jpg"} alt={"遥感监测模型可视化流程图"}/>
        </>
    );
}

export default TraceabilityModel;
