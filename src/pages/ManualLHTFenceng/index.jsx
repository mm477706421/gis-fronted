import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {
    Button,
    Card,
    Col,
    Collapse,
    DatePicker,
    Drawer,
    message,
    Radio,
    Row,
    Select,
    Space,
    Statistic,
    Table,
    Tabs,
    Form,
    Input,
    Popconfirm,
    Typography
} from 'antd';
import {
    AlertOutlined,
    ClockCircleOutlined,
    DownloadOutlined,
    FilterOutlined,
    LineChartOutlined,
    ClearOutlined,
    SettingOutlined
} from '@ant-design/icons';
import {Line} from '@ant-design/plots';
import styles from './index.css';
import {format} from 'fecha';

const {TabPane} = Tabs;
const {RangePicker} = DatePicker;
const {Option} = Select;
const {Panel} = Collapse;

const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    const inputNode = inputType === 'number' ? <Input type="number" step="0.000001" /> : <Input />;
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{margin: 0}}
                    rules={[
                        {
                            required: true,
                            message: `请输入 ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

const ManualLHTFenceng = () => {
    const {stationId, type} = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [stationInfo, setStationInfo] = useState(null);
    const [monitoringData, setMonitoringData] = useState([]);
    const [dateRange, setDateRange] = useState(null);
    const [monitoringPoints, setMonitoringPoints] = useState([]);
    const [trendData, setTrendData] = useState([]);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [items, setItems] = useState([]);
    const [filterType, setFilterType] = useState('hourly');
    const [tableData, setTableData] = useState([]);
    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState('');
    const [selectedPoint, setSelectedPoint] = useState(null);
    const [originalData, setOriginalData] = useState([]);

    const isEditing = (record) => record.id === editingKey;

    // 加载站点信息
    useEffect(() => {
        const loadStationInfo = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8080/api/list_station_message");
                const stations = await response.json();
                const station = stations.find(s => s.id === 15);
                if (station) {
                    setStationInfo(station);
                    console.log(station);
                } else {
                    message.error("未找到站点信息");
                    navigate('/gis');
                }
            } catch (error) {
                console.error("加载站点信息失败:", error);
                message.error("加载站点信息失败");
            }
        };

        loadStationInfo();
    }, [stationId, navigate]);

    // 根据stationInfo更新items
    useEffect(() => {
        if (stationInfo) {
            setItems([
                {
                    key: '1',
                    label: '站点信息',
                    children: (<Row gutter={16} className={styles.statistics}>
                        <Col span={8}>
                            <Card>
                                <Statistic
                                    title="监测方式"
                                    value={stationInfo.manner}
                                    prefix={<ClockCircleOutlined/>}
                                />
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card>
                                <Statistic
                                    title="监测类型"
                                    value={stationInfo.quality}
                                    prefix={<LineChartOutlined/>}
                                />
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card>
                                <Statistic
                                    title="监测频率"
                                    value={stationInfo.frequency}
                                    prefix={<AlertOutlined/>}
                                />
                            </Card>
                        </Col>
                    </Row>),
                }
            ]);
        }
    }, [stationInfo]);

    // 加载监测断面数据
    useEffect(() => {
        const loadMonitoringPoints = async () => {
            if (!stationInfo) return;
            try {
                const response = await fetch(`http://127.0.0.1:8080/api/manual-${stationInfo.stationName.toLowerCase()}-fenceng/list`);
                const data = await response.json();
            } catch (error) {
                console.error("加载监测断面数据失败:", error);
                message.error("加载监测断面数据失败" + error.message);
            }
        };

        loadMonitoringPoints();
    }, [stationInfo, stationId]);

    // 加载监测数据
    useEffect(() => {
        const loadMonitoringData = async () => {
            if (!stationInfo) return;

            setLoading(true);
            try {
                const apiUrl = `http://localhost:8080/api/manual-${stationInfo.stationName.toLowerCase()}-fenceng/list`;
                const response = await fetch(apiUrl);
                const data = await response.json();
                
                // 处理数据
                let processedData = data.map(item => ({
                    id: item.id,
                    dateTime: new Date(item.date).toLocaleString('zh-CN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    }),
                    monitoringPoint: item.monitoringPoint,
                    sbConcentration: item.sbConcentration
                }));

                // 提取唯一的监测断面
                const uniquePoints = [...new Set(data.map(item => item.monitoringPoint))];
                setMonitoringPoints(uniquePoints);
                setOriginalData(processedData);
                setTableData(processedData);
                setMonitoringData(processedData);
            } catch (error) {
                console.error("加载监测数据失败:", error);
                message.error("加载监测数据失败");
            } finally {
                setLoading(false);
            }
        };

        loadMonitoringData();
    }, [stationInfo]);

    // 加载趋势数据
    useEffect(() => {
        const loadTrendData = async () => {
            if (!stationInfo) return;

            try {
                const apiUrl = `http://localhost:8080/api/manual-${stationInfo.stationName.toLowerCase()}-fenceng/list`;
                const response = await fetch(apiUrl);
                const data = await response.json();

                // 处理数据
                const processedData = data.map(item => ({
                    date: new Date(item.date),
                    value: Number(item.sbConcentration),
                    category: item.monitoringPoint
                }));

                setTrendData(processedData);
            } catch (error) {
                console.error("加载趋势数据失败:", error);
                message.error("加载趋势数据失败");
            }
        };

        loadTrendData();
    }, [stationInfo]);

    // 处理数据导出
    const handleExport = () => {
        if (tableData.length === 0) {
            message.warning('没有数据可导出');
            return;
        }

        // 构建CSV内容
        const headers = ['监测时间', '监测断面', 'Sb浓度(mg/L)'];
        const csvContent = [
            headers.join(','),
            ...tableData.map(item => [
                item.dateTime,
                item.monitoringPoint,
                item.sbConcentration
            ].join(','))
        ].join('\n');

        // 创建Blob对象
        const blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8;'});
        const url = URL.createObjectURL(blob);

        // 创建下载链接
        const link = document.createElement('a');
        link.href = url;
        link.download = `监测数据_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    // 处理日期范围变化
    const handleDateRangeChange = (dates) => {
        setDateRange(dates);
        if (dates) {
            // 根据日期范围筛选数据
            const filteredData = monitoringData.filter(item => {
                const itemDate = new Date(item.dateTime);
                return itemDate >= dates[0] && itemDate <= dates[1];
            });
            setMonitoringData(filteredData);
        }
    };

    // 处理抽屉关闭
    const handleDrawerClose = () => {
        setDrawerVisible(false);
    };

    // 处理监测断面变化
    const handlePointChange = (value) => {
        setSelectedPoint(value);
        if (value) {
            const filteredData = originalData.filter(item => item.monitoringPoint === value);
            setTableData(filteredData);
            setMonitoringData(filteredData);
        } else {
            setTableData(originalData);
            setMonitoringData(originalData);
        }
    };

    // 处理筛选应用
    const handleFilterApply = () => {
        let filteredData = [...originalData];

        // 应用监测断面筛选
        if (selectedPoint) {
            filteredData = filteredData.filter(item => item.monitoringPoint === selectedPoint);
        }

        // 应用日期范围筛选
        if (dateRange && dateRange.length === 2) {
            filteredData = filteredData.filter(item => {
                const itemDate = new Date(item.dateTime);
                return itemDate >= dateRange[0] && itemDate <= dateRange[1];
            });
        }

        setTableData(filteredData);
        setMonitoringData(filteredData);
        handleDrawerClose();
    };

    // 开始编辑行
    const edit = (record) => {
        form.setFieldsValue({
            ...record,
        });
        setEditingKey(record.id);
    };

    // 取消编辑
    const cancel = () => {
        setEditingKey('');
    };

    // 保存编辑的数据
    const save = async (key) => {
        try {
            const row = await form.validateFields();
            const newData = [...tableData];
            const index = newData.findIndex((item) => key === item.id);

            if (index > -1) {
                const item = newData[index];
                const updatedItem = {
                    ...item,
                    ...row,
                };
                
                // 调用更新 API
                const response = await fetch(`http://localhost:8080/api/manual-lht-fenceng/update`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id: updatedItem.id,
                        date: item.date, // 保持原始日期不变
                        monitoringPoint: updatedItem.monitoringPoint,
                        sbConcentration: updatedItem.sbConcentration
                    }),
                });

                if (response.ok) {
                    newData.splice(index, 1, updatedItem);
                    setTableData(newData);
                    setEditingKey('');
                    message.success('更新成功');
                } else {
                    message.error('更新失败');
                }
            }
        } catch (errInfo) {
            console.error('验证失败:', errInfo);
        }
    };

    // 添加清除筛选函数
    const handleClearFilters = () => {
        setSelectedPoint(null);
        setDateRange(null);
        setFilterType('hourly');
        setTableData(originalData);
        setMonitoringData(originalData);
        message.success('已清除所有筛选条件');
    };

    // 表格列定义
    const columns = [
        {
            title: '监测时间',
            dataIndex: 'dateTime',
            key: 'dateTime',
            width: 200,
            editable: false,
        },
        {
            title: '监测断面',
            dataIndex: 'monitoringPoint',
            key: 'monitoringPoint',
            width: 150,
            editable: true,
        },
        {
            title: 'Sb浓度(mg/L)',
            dataIndex: 'sbConcentration',
            key: 'sbConcentration',
            width: 150,
            editable: true,
        },
        {
            title: '操作',
            dataIndex: 'operation',
            width: 150,
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link onClick={() => save(record.id)} style={{marginRight: 8}}>
                            保存
                        </Typography.Link>
                        <Popconfirm title="确定取消?" onConfirm={cancel}>
                            <a>取消</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                        编辑
                    </Typography.Link>
                );
            },
        },
    ];

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.dataIndex === 'dateTime' ? 'text' : 'number',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    return (
        <div className={styles.monitoringPage}>
            {stationInfo && (
                <>
                    <div className={styles.header}>
                        <h2>{stationInfo.stationName} - 分层监测数据</h2>
                    </div>

                    <Collapse defaultActiveKey={['1']} className={styles.statsCollapse} items={items} size='large'/>

                    <Form form={form} component={false}>
                        <div style={{ marginBottom: 16, textAlign: 'right' ,marginTop: 24}}>
                            <Space>
                                <Button
                                    onClick={() => setDrawerVisible(true)}
                                    icon={<FilterOutlined />}
                                >
                                    筛选
                                </Button>
                                <Button 
                                    onClick={handleClearFilters}
                                    icon={<ClearOutlined />}
                                >
                                    清除筛选
                                </Button>
                                <Button
                                    onClick={handleExport}
                                    icon={<DownloadOutlined />}
                                >
                                    导出数据
                                </Button>
                            </Space>
                        </div>
                        <Table
                            components={{
                                body: {
                                    cell: EditableCell,
                                },
                            }}
                            bordered
                            dataSource={tableData}
                            columns={mergedColumns}
                            rowClassName="editable-row"
                            pagination={{
                                pageSize: 10,
                                showSizeChanger: true,
                                showQuickJumper: true
                            }}
                            scroll={{x: 'max-content'}}
                        />
                    </Form>

                    <Drawer
                        title={<><SettingOutlined/>数据筛选</>}
                        placement="right"
                        onClose={handleDrawerClose}
                        open={drawerVisible}
                        width={400}
                        extra={
                            <Space>
                                <Button onClick={handleClearFilters}>
                                    清除
                                </Button>
                                <Button onClick={handleDrawerClose}>
                                    取消
                                </Button>
                                <Button type="primary" onClick={handleFilterApply}>
                                    应用
                                </Button>
                            </Space>
                        }
                    >
                        <div className={styles.filterContent}>
                            <div className={styles.filterItem}>
                                <h3>监测断面</h3>
                                <Select
                                    style={{ width: '100%' }}
                                    placeholder="请选择监测断面"
                                    allowClear
                                    value={selectedPoint}
                                    onChange={handlePointChange}
                                >
                                    {monitoringPoints.map(point => (
                                        <Select.Option key={point} value={point}>
                                            {point}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </div>
                            <div className={styles.filterItem}>
                                <h3>时间范围</h3>
                                <RangePicker
                                    value={dateRange}
                                    onChange={handleDateRangeChange}
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    style={{width: '100%'}}
                                />
                            </div>
                            <div className={styles.filterItem}>
                                <h3>数据类型</h3>
                                <Radio.Group
                                    value={filterType}
                                    onChange={e => setFilterType(e.target.value)}
                                    buttonStyle="solid"
                                >
                                    <Radio.Button value="hourly">小时数据</Radio.Button>
                                    <Radio.Button value="daily">日均数据</Radio.Button>
                                </Radio.Group>
                            </div>
                        </div>
                    </Drawer>
                </>
            )}
        </div>
    );
};

export default ManualLHTFenceng;
