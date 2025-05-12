import styles from "./index.css";
import React from "react";

const Traceability = () => {
    return (
        <>
            <div className={styles.header}>
                <h2>溯源模型可视化</h2>
            </div>
            <img src={"/Traceability.png"} alt={"溯源可视化流程图"}/>
        </>
    );
}

export default Traceability;
