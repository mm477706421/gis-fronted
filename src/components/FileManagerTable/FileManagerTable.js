import React, { Component } from 'react'
import { Row, Col, Modal, Table, Upload, Button, Breadcrumb, Progress, message } from 'antd'
import { HomeOutlined, FolderOpenOutlined, UploadOutlined, DownloadOutlined, DeleteOutlined } from '@ant-design/icons'
import "./table.module.css";

export default class FileManagerTable extends Component {
    state = {
        path: this.props.initialPath || ['/'],
        tableData: [],
        loading: false,
        percent: 0,
        processVisible: false
    }

    onClickPathFolder = (e, name) => {
        e.preventDefault();
        const { path } = this.state;
        const newPath = path.slice(0, path.indexOf(name) + 1);
        this.setState({
            path: newPath
        }, () => {
            this.getData(this.state.path);
        });
    }

    onOpenFolder = name => {
        const { path } = this.state;
        this.setState({
            path: path.concat(name)
        }, () => {
            this.getData(this.state.path);
        });
    }

    onDownloadFile = record => {
        const { path } = this.state;
        const token = localStorage.getItem('token');
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.style.height = 0;
        iframe.src = `/api/file/object/?name=${record.name}&path=${encodeURIComponent(JSON.stringify(path))}&x-token=${token}`;
        document.body.appendChild(iframe);
        setTimeout(() => {
            iframe.remove();
        }, 5 * 60 * 1000);
    }

    onDeleteFile = record => {
        const { path } = this.state;
        Modal.confirm({
            title: `确定删除文件${record.name}吗?`,
            onOk: async() => {
                try {
                    const token = localStorage.getItem('token');
                    await fetch(`/api/file/object/?name=${record.name}&path=${encodeURIComponent(JSON.stringify(path))}`, {
                        method: 'DELETE',
                        headers: { 'x-token': token }
                    });
                    message.success(`删除${record.name}成功`);
                    this.getData(path);
                } catch (error) {
                    message.error(`删除失败`);
                }
            },
            onCancel() {
                message.info(`删除文件${record.name}被取消`);
            },
        });
    }

    getData = async(path) => {
        this.setState({ loading: true });
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/file/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-token': token
                },
                body: JSON.stringify({ path })
            });
            const data = await res.json();
            let tableData_D = [];
            let tableData_Other = [];
            data.sort((a, b) => a.name.localeCompare(b.name));
            for (let i = 0; i < data.length; i++) {
                const item = data[i];
                const row = {
                    id: i,
                    name: item.name,
                    size: item.size,
                    date: item.date,
                    kind: item.kind,
                    code: item.code
                };
                if (item.kind === 'd') {
                    tableData_D.push(row);
                } else {
                    tableData_Other.push(row);
                }
            }
            const tableData = tableData_D.concat(tableData_Other);
            this.setState({ tableData, loading: false });
        } catch (error) {
            message.error('文件列表加载失败');
            this.setState({ loading: false });
        }
    }

    componentDidMount() {
        this.getData(this.state.path);
    }

    render() {
        const { path, processVisible, percent, loading, tableData } = this.state;
        const token = localStorage.getItem('token');
        const uploadConfig = {
            name: 'fileManagerFile',
            showUploadList: false,
            action: `/api/file/object/?path=${encodeURIComponent(JSON.stringify(path))}&x-token=${token}`,
            headers: {
                'x-token': token,
            },
            onChange: (info) => {
                if (info.file.status === 'uploading') {
                    this.setState({ processVisible: true, percent: Math.floor(info.file.percent || 0) });
                }
                if (info.file.status === 'done') {
                    message.success(`${info.file.name} 上传成功`);
                    this.getData(this.state.path);
                    this.setState({ processVisible: false, percent: 0 });
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} 上传失败`);
                    this.setState({ processVisible: false, percent: 0 });
                }
            },
        };

        return ( <
            React.Fragment >
            <
            Row style = {
                { marginBottom: 15 }
            } >
            <
            Col span = { 20 } >
            <
            Breadcrumb > {
                path.map((v, i) => {
                    if (i === 0) {
                        return ( <
                            Breadcrumb.Item key = { v }
                            href = ""
                            onClick = { e => this.onClickPathFolder(e, v) } >
                            <
                            HomeOutlined / >
                            <
                            /Breadcrumb.Item>
                        );
                    } else if (i === path.length - 1) {
                        return <Breadcrumb.Item key = { v } > < span > { v } < /span></Breadcrumb.Item > ;
                    } else {
                        return ( <
                            Breadcrumb.Item key = { v }
                            href = ""
                            onClick = { e => this.onClickPathFolder(e, v) } >
                            <
                            span > { v } < /span> < /
                            Breadcrumb.Item >
                        );
                    }
                })
            } <
            /Breadcrumb> < /
            Col > <
            Col span = { 4 }
            style = {
                { textAlign: 'right' }
            } >
            <
            Upload {...uploadConfig } >
            <
            Button type = "primary"
            size = "small"
            icon = { < UploadOutlined / > } >
            上传文件 <
            /Button> < /
            Upload > <
            /Col> < /
            Row >

            <
            Row >
            <
            Col span = { 24 } > {
                processVisible ? < Progress percent = { percent }
                /> : null} < /
                Col > <
                /Row>

                <
                Table
                rowKey = "id"
                loading = { loading }
                dataSource = { tableData }
                pagination = { false }
                className = "fileManagerTable"
                scroll = {
                    { y: 500 }
                } >
                <
                Table.Column
                title = "名称"
                dataIndex = "name"
                key = "name"
                render = {
                    (text, record) => (
                        record.kind === 'd' ? < Button type = "link"
                        icon = { < FolderOpenOutlined / > }
                        onClick = {
                            () => this.onOpenFolder(text)
                        }
                        title = { text } > { text.length > 30 ? text.substring(0, 19) + "..." : text } < /Button> : text
                    )
                }
                /> <
                Table.Column
                title = "大小"
                dataIndex = "size"
                key = "size"
                width = { 100 }
                /> <
                Table.Column
                title = "修改时间"
                dataIndex = "date"
                key = "date"
                width = { 170 }
                /> <
                Table.Column
                title = "属性"
                dataIndex = "code"
                key = "code"
                width = { 100 }
                /> <
                Table.Column
                title = "操作"
                key = "action"
                render = {
                    (_, record) => (
                        record.kind === '-' ? < >
                        <
                        Button type = "link"
                        icon = { < DownloadOutlined / > }
                        title = "下载"
                        onClick = {
                            () => this.onDownloadFile(record)
                        }
                        /> <
                        Button type = "link"
                        icon = { < DeleteOutlined / > }
                        title = "删除"
                        onClick = {
                            () => this.onDeleteFile(record)
                        }
                        style = {
                            { color: '#FF0000' }
                        }
                        /> < /
                        > : null
                    )
                }
                width = { 100 }
                /> < /
                Table > <
                /React.Fragment>
            );
        }
    }