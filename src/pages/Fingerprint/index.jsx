import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Upload, message, Space, Tabs, DatePicker, Card } from 'antd';
import { PlusOutlined, UploadOutlined, EditOutlined, DeleteOutlined, FilterOutlined, ClearOutlined } from '@ant-design/icons';
import axios from 'axios';
import styles from './index.css';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const FingerprintPage = ({ activeTab = 'database' }) => {
    const [data, setData] = useState([]);
    const [analysisData, setAnalysisData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [analysisLoading, setAnalysisLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [analysisModalVisible, setAnalysisModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [analysisForm] = Form.useForm();
    const [editingItem, setEditingItem] = useState(null);
    const [currentTab, setCurrentTab] = useState(activeTab);
    const [dateRange, setDateRange] = useState(null);
    const [filteredData, setFilteredData] = useState([]);
    const [filteredAnalysisData, setFilteredAnalysisData] = useState([]);

    // 加载数据库数据
    const loadData = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://127.0.0.1:8080/api/trace_atlas_dataset/list');
            setData(response.data);
            setFilteredData(response.data);
        } catch (error) {
            message.error('加载数据失败');
            console.error('加载数据失败:', error);
        }
        setLoading(false);
    };

    // 加载分析数据
    const loadAnalysisData = async () => {
        setAnalysisLoading(true);
        try {
            const response = await axios.get('http://127.0.0.1:8080/api/trace_atlas_prearg/list');
            setAnalysisData(response.data);
            setFilteredAnalysisData(response.data);
        } catch (error) {
            message.error('加载分析数据失败');
            console.error('加载分析数据失败:', error);
        }
        setAnalysisLoading(false);
    };

    useEffect(() => {
        loadData();
        loadAnalysisData();
    }, []);

    // 处理日期范围变化
    const handleDateRangeChange = (dates) => {
        setDateRange(dates);
        if (dates) {
            const filtered = data.filter(item => {
                const itemDate = new Date(item.data_time);
                return itemDate >= dates[0] && itemDate <= dates[1];
            });
            setFilteredData(filtered);
        } else {
            setFilteredData(data);
        }
    };

    // 处理分析数据日期范围变化
    const handleAnalysisDateRangeChange = (dates) => {
        setDateRange(dates);
        if (dates) {
            const filtered = analysisData.filter(item => {
                const itemDate = new Date(item.data_time);
                return itemDate >= dates[0] && itemDate <= dates[1];
            });
            setFilteredAnalysisData(filtered);
        } else {
            setFilteredAnalysisData(analysisData);
        }
    };

    // 清除筛选条件
    const handleClearFilters = () => {
        setDateRange(null);
        setFilteredData(data);
        setFilteredAnalysisData(analysisData);
        message.success('已清除所有筛选条件');
    };

    const columns = [
        {
            title: '采集时间',
            dataIndex: 'data_time',
            key: 'data_time',
            width: 180,
        },
        {
            title: '采集人员',
            dataIndex: 'people',
            key: 'people',
            width: 150,
        },
        {
            title: '图谱',
            key: 'graphs',
            width: 300,
            render: (_, record) => (
                <Space>
                    {record.url1 && <img src={record.url1} alt="图谱1" style={{ width: 80 }} />}
                    {record.url2 && <img src={record.url2} alt="图谱2" style={{ width: 80 }} />}
                    {record.url3 && <img src={record.url3} alt="图谱3" style={{ width: 80 }} />}
                </Space>
            ),
        },
        {
            title: '操作',
            key: 'action',
            width: 200,
            render: (_, record) => (
                <Space>
                    <Button type="link" onClick={() => handleEdit(record)} icon={<EditOutlined />}>编辑</Button>
                    <Button type="link" danger onClick={() => handleDelete(record)} icon={<DeleteOutlined />}>删除</Button>
                </Space>
            ),
        },
    ];

    const analysisColumns = [
        {
            title: '采集时间',
            dataIndex: 'data_time',
            key: 'data_time',
            width: 180,
        },
        {
            title: '站点名称',
            dataIndex: 'station_name',
            key: 'station_name',
            width: 150,
        },
        {
            title: '采集人员',
            dataIndex: 'people',
            key: 'people',
            width: 150,
        },
        {
            title: 'SB浓度',
            dataIndex: 'sb_concentration',
            key: 'sb_concentration',
            width: 120,
        },
        {
            title: '图谱',
            key: 'graphs',
            width: 300,
            render: (_, record) => (
                <Space>
                    {record.url1 && <img src={record.url1} alt="图谱1" style={{ width: 80 }} />}
                    {record.url2 && <img src={record.url2} alt="图谱2" style={{ width: 80 }} />}
                    {record.url3 && <img src={record.url3} alt="图谱3" style={{ width: 80 }} />}
                </Space>
            ),
        },
        {
            title: '操作',
            key: 'action',
            width: 200,
            render: (_, record) => (
                <Space>
                    <Button type="link" onClick={() => handleAnalysisEdit(record)} icon={<EditOutlined />}>编辑</Button>
                    <Button type="link" danger onClick={() => handleAnalysisDelete(record)} icon={<DeleteOutlined />}>删除</Button>
                </Space>
            ),
        },
    ];

    const handleAdd = () => {
        setModalVisible(true);
        form.resetFields();
    };

    const handleAnalysisAdd = () => {
        setAnalysisModalVisible(true);
        analysisForm.resetFields();
    };

    const handleEdit = (record) => {
        setEditingItem(record);
        form.setFieldsValue(record);
        setModalVisible(true);
    };

    const handleAnalysisEdit = (record) => {
        setEditingItem(record);
        analysisForm.setFieldsValue(record);
        setAnalysisModalVisible(true);
    };

    const handleDelete = (record) => {
        Modal.confirm({
            title: '确认删除',
            content: '确定要删除这条记录吗？',
            onOk: async () => {
                try {
                    await axios.delete(`http://127.0.0.1:8080/api/trace_atlas_dataset/delete/${record.id}`);
                    message.success('删除成功');
                    loadData();
                } catch (error) {
                    message.error('删除失败');
                    console.error('删除失败:', error);
                }
            },
        });
    };

    const handleAnalysisDelete = (record) => {
        Modal.confirm({
            title: '确认删除',
            content: '确定要删除这条记录吗？',
            onOk: async () => {
                try {
                    await axios.delete(`http://127.0.0.1:8080/api/trace_atlas_prearg/delete/${record.id}`);
                    message.success('删除成功');
                    loadAnalysisData();
                } catch (error) {
                    message.error('删除失败');
                    console.error('删除失败:', error);
                }
            },
        });
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            if (editingItem) {
                await axios.put('http://127.0.0.1:8080/api/trace_atlas_dataset/update', {
                    ...values,
                    id: editingItem.id
                });
            } else {
                await axios.post('http://127.0.0.1:8080/api/trace_atlas_dataset/add', values);
            }
            message.success('保存成功');
            setModalVisible(false);
            loadData();
        } catch (error) {
            message.error('保存失败');
            console.error('保存失败:', error);
        }
    };

    const handleAnalysisSubmit = async () => {
        try {
            const values = await analysisForm.validateFields();
            if (editingItem) {
                await axios.put('http://127.0.0.1:8080/api/trace_atlas_prearg/update', {
                    ...values,
                    id: editingItem.id
                });
            } else {
                await axios.post('http://127.0.0.1:8080/api/trace_atlas_prearg/add', values);
            }
            message.success('保存成功');
            setAnalysisModalVisible(false);
            loadAnalysisData();
        } catch (error) {
            message.error('保存失败');
            console.error('保存失败:', error);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Space>
                    <RangePicker
                        showTime
                        value={dateRange}
                        onChange={currentTab === 'database' ? handleDateRangeChange : handleAnalysisDateRangeChange}
                        placeholder={['开始时间', '结束时间']}
                    />
                    <Button
                        icon={<ClearOutlined />}
                        onClick={handleClearFilters}
                    >
                        清除筛选
                    </Button>
                    <Button type="primary" onClick={currentTab === 'database' ? handleAdd : handleAnalysisAdd} icon={<PlusOutlined />}>
                        新增{currentTab === 'database' ? '指纹图谱' : '分析数据'}
                    </Button>
                </Space>
            </div>

            <Tabs activeKey={currentTab} onChange={setCurrentTab}>
                <TabPane tab="水质指纹数据库" key="database">
                    <Table
                        columns={columns}
                        dataSource={filteredData}
                        loading={loading}
                        rowKey="id"
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
                        dataSource={filteredAnalysisData}
                        loading={analysisLoading}
                        rowKey="id"
                        scroll={{ x: 1200 }}
                        pagination={{
                            showSizeChanger: true,
                            showQuickJumper: true,
                        }}
                    />
                </TabPane>
            </Tabs>

            {/* 数据库模态框 */}
            <Modal
                title={editingItem ? '编辑指纹图谱' : '新增指纹图谱'}
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
                    <Form.Item
                        name="data_time"
                        label="采集时间"
                        rules={[{ required: true, message: '请选择采集时间' }]}
                    >
                        <Input type="datetime-local" />
                    </Form.Item>

                    <Form.Item
                        name="people"
                        label="采集人员"
                        rules={[{ required: true, message: '请输入采集人员' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="url1"
                        label="图谱1"
                        rules={[{ required: true, message: '请上传图谱1' }]}
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
                        name="url2"
                        label="图谱2"
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
                        name="url3"
                        label="图谱3"
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
                </Form>
            </Modal>

            {/* 分析数据模态框 */}
            <Modal
                title={editingItem ? '编辑分析数据' : '新增分析数据'}
                open={analysisModalVisible}
                onOk={handleAnalysisSubmit}
                onCancel={() => {
                    setAnalysisModalVisible(false);
                    analysisForm.resetFields();
                    setEditingItem(null);
                }}
                width={800}
            >
                <Form
                    form={analysisForm}
                    layout="vertical"
                >
                    <Form.Item
                        name="data_time"
                        label="采集时间"
                        rules={[{ required: true, message: '请选择采集时间' }]}
                    >
                        <Input type="datetime-local" />
                    </Form.Item>

                    <Form.Item
                        name="station_name"
                        label="站点名称"
                        rules={[{ required: true, message: '请输入站点名称' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="people"
                        label="采集人员"
                        rules={[{ required: true, message: '请输入采集人员' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="sb_concentration"
                        label="SB浓度"
                        rules={[{ required: true, message: '请输入SB浓度' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="url1"
                        label="图谱1"
                        rules={[{ required: true, message: '请上传图谱1' }]}
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
                        name="url2"
                        label="图谱2"
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
                        name="url3"
                        label="图谱3"
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
                </Form>
            </Modal>
        </div>
    );
};

export default FingerprintPage; 