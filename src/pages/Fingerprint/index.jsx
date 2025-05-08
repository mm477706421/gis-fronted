import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Upload, message, Space, Tabs } from 'antd';
import { PlusOutlined, UploadOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import styles from './index.css';

const { Option } = Select;
const { TabPane } = Tabs;

const FingerprintPage = () => {
    const [activeTab, setActiveTab] = useState('database');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingItem, setEditingItem] = useState(null);
    const [stations, setStations] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [selectedGraphType, setSelectedGraphType] = useState('UV-Vis');

    // 加载站点和员工数据
    useEffect(() => {
        // TODO: 从API加载站点和员工数据
        setStations([
            { id: 1, name: '站点1' },
            { id: 2, name: '站点2' },
        ]);
        setEmployees([
            { id: 1, name: '员工1' },
            { id: 2, name: '员工2' },
        ]);
    }, []);

    const databaseColumns = [
        {
            title: '采集时间',
            dataIndex: 'collectionTime',
            key: 'collectionTime',
            width: 180,
        },
        {
            title: '采集站点',
            dataIndex: 'station',
            key: 'station',
            width: 150,
        },
        {
            title: '采集员工',
            dataIndex: 'employee',
            key: 'employee',
            width: 150,
        },
        {
            title: '图谱',
            dataIndex: 'graph',
            key: 'graph',
            width: 200,
            render: (text, record) => (
                <Select
                    defaultValue={selectedGraphType}
                    style={{ width: 120 }}
                    onChange={(value) => setSelectedGraphType(value)}
                >
                    <Option value="UV-Vis">UV-Vis</Option>
                    <Option value="EEM">EEM</Option>
                    <Option value="ChV">ChV</Option>
                </Select>
            ),
        },
        {
            title: '操作',
            key: 'action',
            width: 200,
            render: (_, record) => (
                <Space>
                    <Button type="link" onClick={() => handleEdit(record)}>编辑</Button>
                    <Button type="link" danger onClick={() => handleDelete(record)}>删除</Button>
                </Space>
            ),
        },
    ];

    const analysisColumns = [
        {
            title: '采集时间',
            dataIndex: 'collectionTime',
            key: 'collectionTime',
            width: 180,
        },
        {
            title: '采集站点',
            dataIndex: 'station',
            key: 'station',
            width: 150,
        },
        {
            title: '采集员工',
            dataIndex: 'employee',
            key: 'employee',
            width: 150,
        },
        {
            title: '图谱展示',
            dataIndex: 'graphs',
            key: 'graphs',
            width: 300,
            render: (text) => (
                <Space>
                    <img src={text.uvVis} alt="UV-Vis" style={{ width: 80 }} />
                    <img src={text.eem} alt="EEM" style={{ width: 80 }} />
                    <img src={text.chv} alt="ChV" style={{ width: 80 }} />
                </Space>
            ),
        },
        {
            title: '预测SB浓度',
            dataIndex: 'predictedSB',
            key: 'predictedSB',
            width: 150,
        },
        {
            title: '预测站点名称',
            dataIndex: 'predictedStation',
            key: 'predictedStation',
            width: 150,
        },
    ];

    const handleAdd = () => {
        setModalVisible(true);
        form.resetFields();
    };

    const handleEdit = (record) => {
        setEditingItem(record);
        form.setFieldsValue(record);
        setModalVisible(true);
    };

    const handleDelete = (record) => {
        Modal.confirm({
            title: '确认删除',
            content: '确定要删除这条记录吗？',
            onOk: () => {
                // TODO: 调用删除API
                message.success('删除成功');
            },
        });
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            // TODO: 调用保存API
            message.success('保存成功');
            setModalVisible(false);
        } catch (error) {
            console.error('表单验证失败:', error);
        }
    };

    const renderDatabaseForm = () => (
        <>
            <Form.Item
                name="station"
                label="采集站点"
                rules={[{ required: true, message: '请选择采集站点' }]}
            >
                <Select placeholder="请选择采集站点">
                    {stations.map(station => (
                        <Option key={station.id} value={station.id}>{station.name}</Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                name="employee"
                label="采集员工"
                rules={[{ required: true, message: '请选择采集员工' }]}
            >
                <Select placeholder="请选择采集员工">
                    {employees.map(employee => (
                        <Option key={employee.id} value={employee.id}>{employee.name}</Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                name="graph"
                label="图谱"
                rules={[{ required: true, message: '请上传图谱' }]}
            >
                <Upload
                    listType="picture-card"
                    maxCount={1}
                    beforeUpload={() => false}
                >
                    <div>
                        <UploadOutlined />
                        <div style={{ marginTop: 8 }}>上传</div>
                    </div>
                </Upload>
            </Form.Item>
        </>
    );

    const renderAnalysisForm = () => (
        <>
            <Form.Item
                name="station"
                label="采集站点"
                rules={[{ required: true, message: '请选择采集站点' }]}
            >
                <Select placeholder="请选择采集站点">
                    {stations.map(station => (
                        <Option key={station.id} value={station.id}>{station.name}</Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                name="employee"
                label="采集员工"
                rules={[{ required: true, message: '请选择采集员工' }]}
            >
                <Select placeholder="请选择采集员工">
                    {employees.map(employee => (
                        <Option key={employee.id} value={employee.id}>{employee.name}</Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                name="uvVis"
                label="UV-Vis图谱"
                rules={[{ required: true, message: '请上传UV-Vis图谱' }]}
            >
                <Upload
                    listType="picture-card"
                    maxCount={1}
                    beforeUpload={() => false}
                >
                    <div>
                        <UploadOutlined />
                        <div style={{ marginTop: 8 }}>上传</div>
                    </div>
                </Upload>
            </Form.Item>

            <Form.Item
                name="eem"
                label="EEM图谱"
                rules={[{ required: true, message: '请上传EEM图谱' }]}
            >
                <Upload
                    listType="picture-card"
                    maxCount={1}
                    beforeUpload={() => false}
                >
                    <div>
                        <UploadOutlined />
                        <div style={{ marginTop: 8 }}>上传</div>
                    </div>
                </Upload>
            </Form.Item>

            <Form.Item
                name="chv"
                label="ChV图谱"
                rules={[{ required: true, message: '请上传ChV图谱' }]}
            >
                <Upload
                    listType="picture-card"
                    maxCount={1}
                    beforeUpload={() => false}
                >
                    <div>
                        <UploadOutlined />
                        <div style={{ marginTop: 8 }}>上传</div>
                    </div>
                </Upload>
            </Form.Item>
        </>
    );

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Button type="primary" onClick={handleAdd} icon={<PlusOutlined />}>
                    新增{activeTab === 'database' ? '指纹图谱' : '分析数据'}
                </Button>
            </div>

            <Tabs activeKey={activeTab} onChange={setActiveTab}>
                <TabPane tab="水质指纹数据库" key="database">
                    <Table
                        columns={databaseColumns}
                        dataSource={data}
                        loading={loading}
                        scroll={{ x: 1200 }}
                        pagination={{
                            showSizeChanger: true,
                            showQuickJumper: true,
                        }}
                    />
                </TabPane>
                <TabPane tab="数据分析" key="analysis">
                    <Table
                        columns={analysisColumns}
                        dataSource={data}
                        loading={loading}
                        scroll={{ x: 1200 }}
                        pagination={{
                            showSizeChanger: true,
                            showQuickJumper: true,
                        }}
                    />
                </TabPane>
            </Tabs>

            <Modal
                title={editingItem ? '编辑' : '新增'}
                open={modalVisible}
                onOk={handleSubmit}
                onCancel={() => {
                    setModalVisible(false);
                    form.resetFields();
                    setEditingItem(null);
                }}
                width={800}
            >
                <Form
                    form={form}
                    layout="vertical"
                >
                    {activeTab === 'database' ? renderDatabaseForm() : renderAnalysisForm()}
                </Form>
            </Modal>
        </div>
    );
};

export default FingerprintPage; 