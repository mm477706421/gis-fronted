import React from 'react';
import Router from './router';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import './App.css';
import { theme } from 'antd';

const { darkAlgorithm, compactAlgorithm } = theme;

const theme_custom = {
    components: {
        Table: {
            borderColor: "#6297ca",
            headerSplitColor: "#6890c5",
            headerColor: "#fff",
            headerBg: "#6297ca",
            fixedHeaderSortActiveBg: "#98d0e5",
            headerBorderRadius: 3
                /* 这里是你的组件 token */
        },
    },
    token: {},
    // algorithm: [darkAlgorithm, compactAlgorithm],
};

function App() {
    return ( < ConfigProvider locale = { zhCN }
        theme = { theme_custom } >
        <
        Router / >
        <
        /ConfigProvider>
    );
}

export default App;