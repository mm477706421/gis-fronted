import React, {useEffect, useState, useRef} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {
    Button,
    Card,
    Col,
    Collapse,
    DatePicker,
    Modal,
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
    InputNumber,
    Popconfirm
} from 'antd';
import {
    AlertOutlined,
    ClearOutlined,
    ClockCircleOutlined,
    DownloadOutlined,
    FilterOutlined,
    LineChartOutlined,
    SettingOutlined,
    PlusOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import {Line} from '@ant-design/plots';
import styles from './index.css';
import {format} from 'fecha';

const {TabPane} = Tabs;
const {RangePicker} = DatePicker;
const {Option} = Select;
const {Panel} = Collapse;

const MonitoringPage = () => {
    const {stationId, type} = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [stationInfo, setStationInfo] = useState(null);
    const [monitoringData, setMonitoringData] = useState([]);
    const [dateRange, setDateRange] = useState(null);
    const [monitoringPoints, setMonitoringPoints] = useState([]);
    const [trendData, setTrendData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [items, setItems] = useState([]);
    const [filterType, setFilterType] = useState('hourly');
    const [tableData, setTableData] = useState([]);
    const [tableName, setTableName] = useState(stationId);
    const [columns, setColumns] = useState([]);
    const [allFields, setAllFields] = useState([]);
    const [selectedFields, setSelectedFields] = useState([]);
    const [filterValue, setFilterValue] = useState('');
    const modalRef = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [addForm] = Form.useForm();

    const loadStationInfo = async () => {
        try {
            let stationName = null;
            // 从表名中提取站点名称
            if( tableName.split('_')[1].toLowerCase() === "water"){
                stationName = tableName.split('_')[0].toUpperCase();
            }
            else {
                stationName = tableName.split('_')[1].toUpperCase();
            }
            

            // 从API获取站点信息
            const response = await fetch('http://127.0.0.1:8080/api/list_station_message');
            const stationData = await response.json();

            // 查找匹配的站点信息
            const stationInfo = stationData.find(station =>
                station.stationName.toLowerCase() === stationName.toLowerCase()
            );

            if (stationInfo) {
                setStationInfo({
                    stationName: stationName,
                    tableName: tableName,
                    manner: stationInfo.manner,
                    quality: stationInfo.quality,
                    frequency: stationInfo.frequency,
                    longitude: stationInfo.longitude,
                    latitude: stationInfo.latitude
                });
            } else {
                setStationInfo({
                    stationName: stationName,
                    tableName: tableName,
                    manner: '未知',
                    quality: '未知',
                    frequency: '未知',
                    longitude: '未知',
                    latitude: '未知'
                });
            }
        } catch (error) {
            console.error("加载站点信息失败:", error);
            message.error("加载站点信息失败");
        }
    };
    // 加载站点信息
    useEffect(() => {
        loadStationInfo();
    }, [tableName, stationId]);

    // 根据stationInfo更新items
    useEffect(() => {
        if (!window.location.pathname.includes(tableName)) {
            window.location.reload(true);
        }
        if (stationInfo) {
            setItems([
                {
                    key: '1',
                    label: '站点信息',
                    children: (<Row gutter={16} className={styles.statistics}>
                        <Col span={6}>
                            <Card size="small" bordered={false} bodyStyle={{
                                height: '80px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center'
                            }}>
                                <Statistic
                                    title="监测方式"
                                    value={stationInfo.manner}
                                    prefix={<ClockCircleOutlined/>}
                                />
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card size="small" bordered={false} bodyStyle={{
                                height: '80px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center'
                            }}>
                                <Statistic
                                    title="监测类型"
                                    value={stationInfo.quality}
                                    prefix={<LineChartOutlined/>}
                                />
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card size="small" bordered={false} bodyStyle={{
                                height: '80px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center'
                            }}>
                                <Statistic
                                    title="监测频率"
                                    value={stationInfo.frequency}
                                    prefix={<AlertOutlined/>}
                                />
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card size="small" bordered={false} bodyStyle={{
                                height: '80px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center'
                            }}>
                                <Statistic
                                    title="经纬度"
                                    value={`${Number(stationInfo.longitude).toFixed(2)}, ${Number(stationInfo.latitude).toFixed(2)}`}
                                    prefix={<SettingOutlined/>}
                                />
                            </Card>
                        </Col>
                    </Row>),
                }
            ]);
        }
    }, [stationInfo, stationId]);

    // 加载监测断面数据
    useEffect(() => {
        const loadMonitoringPoints = async () => {
            if (!stationInfo) return;
            try {
                const response = await fetch(`http://localhost:8080/api/${stationInfo.tableName.replaceAll('_', '-').toLowerCase()}/list`);
                const data = await response.json();

                // 提取唯一的监测断面
                const uniquePoints = [...new Set(data.map(item => item.monitoringPoint))];
                setMonitoringPoints(uniquePoints);
            } catch (error) {
                console.error("加载监测断面数据失败:", error);
                message.error("加载监测断面数据失败" + error.message);
            }
        };

        loadMonitoringPoints();
    }, [stationInfo, stationId]);

    // 处理数据导出
    const handleExport = () => {
        if (tableData.length === 0) {
            message.warning('没有数据可导出');
            return;
        }

        // 构建CSV内容
        const headers = columns.map(column => column.title);
        const csvContent = [
            headers.join(','),
            ...tableData.map(item => {
                return columns.map(column => {
                    const value = item[column.dataIndex];
                    return value === undefined ? '' : value;
                }).join(',');
            })
        ].join('\n');

        // 创建Blob对象
        const blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8;'});
        const url = URL.createObjectURL(blob);

        // 创建下载链接
        const link = document.createElement('a');
        link.href = url;
        link.download = `${stationInfo.stationName}_监测数据_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    // 处理字段选择变化
    const handleFieldSelectionChange = (checkedValues) => {
        setSelectedFields(checkedValues);
        // 重新生成表格列
        const newColumns = allFields
            .filter(field => checkedValues.includes(field))
            .map(field => {
                if (field === 'id') return null;

                if (field === 'samplingTime' || field === 'dateTime') {
                    return {
                        title: '采样时间',
                        dataIndex: field,
                        key: field,
                        width: 200,
                        render: (text) => new Date(text).toLocaleString()
                    };
                }

                const unitMap = {
                    'sbConcentration': 'mg/L',
                    'ph': '',
                    'do': 'mg/L',
                    'cod': 'mg/L',
                    'nh3n': 'mg/L',
                    'tp': 'mg/L',
                    'tn': 'mg/L',
                    'turbidity': 'NTU',
                    'conductivity': 'μS/cm',
                    'temperature': '℃'
                };

                const unit = unitMap[field] || '';
                const title = field === 'sbConcentration' ? 'Sb浓度' :
                    field === 'nh3n' ? '氨氮' :
                        field === 'tp' ? '总磷' :
                            field === 'tn' ? '总氮' :
                                field === 'do' ? '溶解氧' :
                                    field === 'cod' ? '化学需氧量' :
                                        field === 'turbidity' ? '浊度' :
                                            field === 'conductivity' ? '电导率' :
                                                field === 'temperature' ? '温度' :
                                                    field;

                return {
                    title: unit ? `${title}(${unit})` : title,
                    dataIndex: field,
                    key: field,
                    width: 150,
                    render: (text) => {
                        if (field === 'sbConcentration') {
                            return (
                                <span style={{color: Number(text) < 0.002 ? '#ff4d4f' : 'inherit'}}>
                                    {text}
                                </span>
                            );
                        }
                        return text;
                    }
                };
            })
            .filter(column => column !== null);

        setColumns(newColumns);
    };

    // 定义操作列
    const operationColumn = {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 100,
        render: (_, record) => (
            <Popconfirm
                title="确定要删除这条数据吗？"
                onConfirm={() => handleDelete(record)}
                okText="确定"
                cancelText="取消"
            >
                <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                >
                    删除
                </Button>
            </Popconfirm>
        ),
    };

    // 加载监测数据
    useEffect(() => {
        const loadMonitoringData = async () => {
            if (!stationInfo) return;

            setLoading(true);
            try {
                const apiUrl = `http://localhost:8080/api/${stationInfo.tableName.replaceAll('_', '-').toLowerCase()}/list`;
                const response = await fetch(apiUrl);
                const data = await response.json();

                if (data.length > 0) {
                    // 获取第一条数据的所有字段
                    const fields = Object.keys(data[0]);
                    setAllFields(fields);
                    setSelectedFields(fields.filter(field => field !== 'id'));

                    // 生成动态列
                    const dynamicColumns = fields.map(field => {
                        // 跳过id字段
                        if (field === 'id') return null;

                        // 处理特殊字段
                        if (field === 'date_time') {
                            return {
                                title: '采样时间',
                                dataIndex: field,
                                key: field,
                                width: 200,
                                fixed: 'left',
                                align: 'center',
                                render: (text) => new Date(text).toLocaleString()
                            };
                        }

                        // 处理带单位的字段
                        const unitMap = {
                            'sb_concentration': 'mg/L',
                            'ph': '',
                            'do': 'mg/L',
                            'cod': 'mg/L',
                            'nh3n': 'mg/L',
                            'tp': 'mg/L',
                            'tn': 'mg/L',
                            'turbidity': 'NTU',
                            'conductivity': 'μS/cm',
                            'temperature': '℃'
                        };

                        const unit = unitMap[field] || '';
                        const title = field === 'date_time' ? '采样时间' :
                            field === 'sb_concentration' ? 'Sb浓度' :
                                field === 'water_temperature' ? '水温' :
                                    field === 'ph_value' || field === 'ph' ? 'pH值' :
                                        field === 'dissolved_oxygen' ? '溶解氧' :
                                            field === 'conductivity' ? '电导率' :
                                                field === 'ntu' ? '浊度' :
                                                    field === 'ambient_temperature' ? '环境温度' :
                                                        field === 'humidity' ? '湿度' :
                                                            field === 'section_name' ? '断面名称' :
                                                                field === 'section_type' ? '断面类型' :
                                                                    field === 'flow' ? '流量' :
                                                                        field === 'water_level' ? '水位' :
                                                                            field === 'transparency' ? '透明度' :
                                                                                field === 'chlorophyllA' ? '叶绿素a' :
                                                                                    field === 'permanganate_index' ? '高锰酸盐指数' :
                                                                                        field === 'chemical_oxygen_demand' ? '化学需氧量' :
                                                                                            field === 'biochemical_oxygen_demand' ? '生化需氧量' :
                                                                                                field === 'ammonia_nitrogen' ? '氨氮' :
                                                                                                    field === 'total_phosphorus' ? '总磷' :
                                                                                                        field === 'total_nitrogen' ? '总氮' :
                                                                                                            field === 'copper' ? '铜' :
                                                                                                                field === 'zinc' ? '锌' :
                                                                                                                    field === 'fluoride' ? '氟化物' :
                                                                                                                        field === 'selenium' ? '硒' :
                                                                                                                            field === 'arsenic' ? '砷' :
                                                                                                                                field === 'mercury' ? '汞' :
                                                                                                                                    field === 'cadmium' ? '镉' :
                                                                                                                                        field === 'hexavalent_chromium' ? '六价铬' :
                                                                                                                                            field === 'lead_content' ? '铅' :
                                                                                                                                                field === 'cyanide' ? '氰化物' :
                                                                                                                                                    field === 'volatile_phenol' ? '挥发酚' :
                                                                                                                                                        field === 'petroleum' ? '石油类' :
                                                                                                                                                            field === 'anionic_detergent' ? '阴离子表面活性剂' :
                                                                                                                                                                field === 'sulfide' ? '硫化物' :
                                                                                                                                                                    field === 'fecal_coliform' ? '粪大肠菌群' :
                                                                                                                                                                        field === 'sulfate' ? '硫酸盐' :
                                                                                                                                                                            field === 'chloride' ? '氯化物' :
                                                                                                                                                                                field === 'nitrate' ? '硝酸盐' :
                                                                                                                                                                                    field === 'iron' ? '铁' :
                                                                                                                                                                                        field === 'manganese' ? '锰' :
                                                                                                                                                                                            field === 'antimony' ? '锑' :
                                                                                                                                                                                                field === 'molybdenum' ? '钼' :
                                                                                                                                                                                                    field === 'thallium' ? '铊' :
                                                                                                                                                                                                        field === 'water_quality_type' ? '水质类型' :
                                                                                                                                                                                                            field === 'monitoring_point' ? '监测点' :
                                                                                                                                                                                                                    field === 'excess_station' ? '超标站点' :
                                                                                                                                                                                                                        field === 'excess_parameter' ? '超标参数' :
                                                                                                                                                                                                                            field === 'excess_value' ? '超标数值' :
                                                                                                                                                                                                                                field;
                        
                        return {
                            title: unit ? `${title}(${unit})` : title,
                            dataIndex: field,
                            key: field,
                            width: 150,
                            render: (text) => {
                                if (field === 'sb_concentration') {
                                    return (
                                        <span style={{color: Number(text) < 0.002 ? '#ff4d4f' : 'inherit'}}>
                                            {text}
                                        </span>
                                    );
                                }
                                return text;
                            }
                        };
                    }).filter(column => column !== null);

                    // 确保采样时间列在最前面
                    const sortedColumns = dynamicColumns.sort((a, b) => {
                        if (a.dataIndex === 'date_time') return -1;
                        if (b.dataIndex === 'date_time') return 1;
                        return 0;
                    });

                    // 添加操作列
                    sortedColumns.push(operationColumn);

                    setColumns(sortedColumns);
                }

                // 根据筛选方式处理数据
                let processedData = data;
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
    }, [stationInfo, filterType, stationId]);

    // 加载趋势数据
    useEffect(() => {
        const loadTrendData = async () => {
            if (!stationInfo) return;

            try {
                const apiUrl = `http://localhost:8080/api/data/${stationInfo.tableName.replaceAll('_', '-').toLowerCase()}`;
                const response = await fetch(apiUrl);
                const data = await response.json();
                const processedData = data.map(item => ({
                    ...item,
                    date: new Date(item.date_time),
                }));
                
                let retData = []
                processedData.forEach(item => {
                    Object.keys(item).forEach(key => {
                        if(!key.includes("date") && !key.includes("time") && !key.includes("id")){
                            retData.push({"category":key,"date":item.date,"value":item[key]})
                        }
                    })    
                })
                
                // console.log(retData)
                setTrendData(retData);
            } catch (error) {
                console.error("加载趋势数据失败:", error);
                message.error("加载趋势数据失败");
            }
        };

        loadTrendData();
    }, [stationInfo, stationId]);

    // 趋势图配置
    const trendConfig = {
        data: trendData,
        xField: 'date',
        yField: 'value',
        axis: {
            x: {
                line: true,
            }
        },
        xAxis: {
            type: 'time',
            label: {
                formatter: (v) => format(v, 'YYYY-MM-DD HH:mm'),
            },
        },
        colorField: 'category',
        smooth: true,
        connectNulls: {
            connect: true,
            connectStroke: '#aaa',
        },
        slider: {
            x: { labelFormatter: (d) => format(d, 'YYYY/M/D HH:mm') },
        },
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
        setModalVisible(false);
    };

    // 处理筛选应用
    const handleFilterApply = () => {
        handleDrawerClose();
        // 可以在这里添加其他筛选逻辑
    };

    const handleClearFilters = () => {
        setDateRange(null);
        setFilterType('hourly');
        setFilterValue('');
        message.success('已清除所有筛选条件');
    };

    const handleExportAll = () => {
        // 全选所有字段（除了id）
        const allFieldsExceptId = allFields.filter(field => field !== 'id');
        handleFieldSelectionChange(allFieldsExceptId);
        
        // 清除所有筛选条件
        setFilterType('all');
        setFilterValue('');
        setDateRange([]);
        
        // 延迟执行导出，确保状态更新完成
        setTimeout(() => {
            handleExport();
        }, 500);
    };

    const handleMouseDown = (e) => {
        if (e.target.closest('.ant-modal-title')) {
            setIsDragging(true);
            setDragStart({
                x: e.clientX - position.x,
                y: e.clientY - position.y
            });
        }
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    // 处理添加数据
    const handleAddData = async () => {
        try {
            const values = await addForm.validateFields();
            
            // 处理日期格式
            if (values.date_time) {
                const date = new Date(values.date_time);
                values.date_time = date.toISOString().slice(0, 19).replace('T', ' ');
            }

            const response = await fetch(`http://localhost:8080/api/${stationInfo.tableName.replaceAll('_', '-').toLowerCase()}/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            if (response.ok) {
                message.success('添加数据成功');
                setAddModalVisible(false);
                addForm.resetFields();
                
                // 重新加载数据
                const loadMonitoringData = async () => {
                    if (!stationInfo) return;

                    setLoading(true);
                    try {
                        const apiUrl = `http://localhost:8080/api/${stationInfo.tableName.replaceAll('_', '-').toLowerCase()}/list`;
                        const response = await fetch(apiUrl);
                        const data = await response.json();

                        if (data.length > 0) {
                            // 获取第一条数据的所有字段
                            const fields = Object.keys(data[0]);
                            setAllFields(fields);
                            setSelectedFields(fields.filter(field => field !== 'id'));

                            // 生成动态列
                            const dynamicColumns = fields.map(field => {
                                // 跳过id字段
                                if (field === 'id') return null;
                                // 处理特殊字段
                                if (field === 'date_time') {
                                    return {
                                        title: '采样时间',
                                        dataIndex: field,
                                        key: field,
                                        width: 200,
                                        fixed: 'left',
                                        align: 'center',
                                        render: (text) => new Date(text).toLocaleString()
                                    };
                                }

                                // 处理带单位的字段
                                const unitMap = {
                                    'sb_concentration': 'mg/L',
                                    'ph': '',
                                    'do': 'mg/L',
                                    'cod': 'mg/L',
                                    'nh3n': 'mg/L',
                                    'tp': 'mg/L',
                                    'tn': 'mg/L',
                                    'turbidity': 'NTU',
                                    'conductivity': 'μS/cm',
                                    'temperature': '℃'
                                };

                                const unit = unitMap[field] || '';
                                const title = field === 'date_time' ? '采样时间' :
                                    field === 'sb_concentration' ? 'Sb浓度' :
                                        field === 'water_temperature' ? '水温' :
                                            field === 'ph_value' || field === 'ph' ? 'pH值' :
                                                field === 'dissolved_oxygen' ? '溶解氧' :
                                                    field === 'conductivity' ? '电导率' :
                                                        field === 'ntu' ? '浊度' :
                                                            field === 'ambient_temperature' ? '环境温度' :
                                                                field === 'humidity' ? '湿度' :
                                                                    field === 'section_name' ? '断面名称' :
                                                                        field === 'section_type' ? '断面类型' :
                                                                            field === 'flow' ? '流量' :
                                                                                field === 'water_level' ? '水位' :
                                                                                    field === 'transparency' ? '透明度' :
                                                                                        field === 'chlorophyllA' ? '叶绿素a' :
                                                                                            field === 'permanganate_index' ? '高锰酸盐指数' :
                                                                                                field === 'chemical_oxygen_demand' ? '化学需氧量' :
                                                                                                    field === 'biochemical_oxygen_demand' ? '生化需氧量' :
                                                                                                        field === 'ammonia_nitrogen' ? '氨氮' :
                                                                                                            field === 'total_phosphorus' ? '总磷' :
                                                                                                                field === 'total_nitrogen' ? '总氮' :
                                                                                                                    field === 'copper' ? '铜' :
                                                                                                                        field === 'zinc' ? '锌' :
                                                                                                                            field === 'fluoride' ? '氟化物' :
                                                                                                                                field === 'selenium' ? '硒' :
                                                                                                                                    field === 'arsenic' ? '砷' :
                                                                                                                                        field === 'mercury' ? '汞' :
                                                                                                                                            field === 'cadmium' ? '镉' :
                                                                                                                                                field === 'hexavalent_chromium' ? '六价铬' :
                                                                                                                                                    field === 'lead_content' ? '铅' :
                                                                                                                                                        field === 'cyanide' ? '氰化物' :
                                                                                                                                                            field === 'volatile_phenol' ? '挥发酚' :
                                                                                                                                                                field === 'petroleum' ? '石油类' :
                                                                                                                                                                    field === 'anionic_detergent' ? '阴离子表面活性剂' :
                                                                                                                                                                        field === 'sulfide' ? '硫化物' :
                                                                                                                                                                            field === 'fecal_coliform' ? '粪大肠菌群' :
                                                                                                                                                                                field === 'sulfate' ? '硫酸盐' :
                                                                                                                                                                                    field === 'chloride' ? '氯化物' :
                                                                                                                                                                                        field === 'nitrate' ? '硝酸盐' :
                                                                                                                                                                                            field === 'iron' ? '铁' :
                                                                                                                                                                                                field === 'manganese' ? '锰' :
                                                                                                                                                                                                    field === 'antimony' ? '锑' :
                                                                                                                                                                                                        field === 'molybdenum' ? '钼' :
                                                                                                                                                                                                            field === 'thallium' ? '铊' :
                                                                                                                                                                                                                field === 'water_quality_type' ? '水质类型' :
                                                                                                                                                                                                                    field === 'monitoring_point' ? '监测点' :
                                                                                                                                                                                                                        field === 'excess_station' ? '超标站点' :
                                                                                                                                                                                                                            field === 'excess_parameter' ? '超标参数' :
                                                                                                                                                                                                                                field === 'excess_value' ? '超标数值' :
                                                                                                                                                                                                                                    field;

                                return {
                                    title: unit ? `${title}(${unit})` : title,
                                    dataIndex: field,
                                    key: field,
                                    width: 150,
                                    render: (text) => {
                                        if (field === 'sb_concentration') {
                                            return (
                                                <span style={{color: Number(text) < 0.002 ? '#ff4d4f' : 'inherit'}}>
                                                    {text}
                                                </span>
                                            );
                                        }
                                        return text;
                                    }
                                };
                            }).filter(column => column !== null);

                            // 确保采样时间列在最前面
                            const sortedColumns = dynamicColumns.sort((a, b) => {
                                if (a.dataIndex === 'date_time') return -1;
                                if (b.dataIndex === 'date_time') return 1;
                                return 0;
                            });

                            setColumns(sortedColumns);
                            
                            // 添加操作列
                            sortedColumns.push(operationColumn);
                        }

                        // 根据筛选方式处理数据
                        let processedData = data;
                        setTableData(processedData);
                        setMonitoringData(processedData);
                    } catch (error) {
                        console.error("加载监测数据失败:", error);
                        message.error("加载监测数据失败");
                    } finally {
                        setLoading(false);
                    }
                };

                await loadMonitoringData();
            } else {
                message.error('添加数据失败');
            }
        } catch (error) {
            console.error('添加数据失败:', error);
            message.error('添加数据失败');
        }
    };

    // 生成添加数据的表单项
    const generateAddFormItems = () => {
        return columns
            .filter(column => column.dataIndex !== 'id' && column.title !== '操作')
            .map(column => {
                const field = column.dataIndex;
                const rules = [{ required: true, message: `请输入${column.title}` }];
                // console.log(field)
                // 根据字段类型生成不同的表单项
                if (field === 'date_time' || field === 'samplingTime' || field === 'dateTime') {
                    return (
                        <Form.Item
                            key={field}
                            name={field}
                            label={column.title}
                            rules={rules}
                        >
                            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />
                        </Form.Item>
                    );
                } else if (typeof tableData[0]?.[field] === 'number') {
                    return (
                        <Form.Item
                            key={field}
                            name={field}
                            label={column.title}
                            rules={rules}
                        >
                            <InputNumber style={{ width: '100%' }} />
                        </Form.Item>
                    );
                } else {
                    return (
                        <Form.Item
                            key={field}
                            name={field}
                            label={column.title}
                            rules={rules}
                        >
                            <Input />
                        </Form.Item>
                    );
                }
            });
    };

    // 处理删除数据
    const handleDelete = async (record) => {
        try {
            const response = await fetch(`http://localhost:8080/api/${stationInfo.tableName.replaceAll('_', '-').toLowerCase()}/delete/${record.id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                message.success('删除数据成功');
                // 重新加载数据
                const loadMonitoringData = async () => {
                    if (!stationInfo) return;

                    setLoading(true);
                    try {
                        const apiUrl = `http://localhost:8080/api/${stationInfo.tableName.replaceAll('_', '-').toLowerCase()}/list`;
                        const response = await fetch(apiUrl);
                        const data = await response.json();

                        if (data.length > 0) {
                            // 获取第一条数据的所有字段
                            const fields = Object.keys(data[0]);
                            setAllFields(fields);
                            setSelectedFields(fields.filter(field => field !== 'id'));

                            // 生成动态列
                            const dynamicColumns = fields.map(field => {
                                // 跳过id字段
                                if (field === 'id') return null;

                                // 处理特殊字段
                                if (field === 'date_time') {
                                    return {
                                        title: '采样时间',
                                        dataIndex: field,
                                        key: field,
                                        width: 200,
                                        fixed: 'left',
                                        align: 'center',
                                        render: (text) => new Date(text).toLocaleString()
                                    };
                                }

                                // 处理带单位的字段
                                const unitMap = {
                                    'sb_concentration': 'mg/L',
                                    'ph': '',
                                    'do': 'mg/L',
                                    'cod': 'mg/L',
                                    'nh3n': 'mg/L',
                                    'tp': 'mg/L',
                                    'tn': 'mg/L',
                                    'turbidity': 'NTU',
                                    'conductivity': 'μS/cm',
                                    'temperature': '℃'
                                };

                                const unit = unitMap[field] || '';
                                const title = field === 'date_time' ? '采样时间' :
                                    field === 'sb_concentration' ? 'Sb浓度' :
                                        field === 'water_temperature' ? '水温' :
                                            field === 'ph_value' || field === 'ph' ? 'pH值' :
                                                field === 'dissolved_oxygen' ? '溶解氧' :
                                                    field === 'conductivity' ? '电导率' :
                                                        field === 'ntu' ? '浊度' :
                                                            field === 'ambient_temperature' ? '环境温度' :
                                                                field === 'humidity' ? '湿度' :
                                                                    field === 'section_name' ? '断面名称' :
                                                                        field === 'section_type' ? '断面类型' :
                                                                            field === 'flow' ? '流量' :
                                                                                field === 'water_level' ? '水位' :
                                                                                    field === 'transparency' ? '透明度' :
                                                                                        field === 'chlorophyllA' ? '叶绿素a' :
                                                                                            field === 'permanganate_index' ? '高锰酸盐指数' :
                                                                                                field === 'chemical_oxygen_demand' ? '化学需氧量' :
                                                                                                    field === 'biochemical_oxygen_demand' ? '生化需氧量' :
                                                                                                        field === 'ammonia_nitrogen' ? '氨氮' :
                                                                                                            field === 'total_phosphorus' ? '总磷' :
                                                                                                                field === 'total_nitrogen' ? '总氮' :
                                                                                                                    field === 'copper' ? '铜' :
                                                                                                                        field === 'zinc' ? '锌' :
                                                                                                                            field === 'fluoride' ? '氟化物' :
                                                                                                                                field === 'selenium' ? '硒' :
                                                                                                                                    field === 'arsenic' ? '砷' :
                                                                                                                                        field === 'mercury' ? '汞' :
                                                                                                                                            field === 'cadmium' ? '镉' :
                                                                                                                                                field === 'hexavalent_chromium' ? '六价铬' :
                                                                                                                                                    field === 'lead_content' ? '铅' :
                                                                                                                                                        field === 'cyanide' ? '氰化物' :
                                                                                                                                                            field === 'volatile_phenol' ? '挥发酚' :
                                                                                                                                                                field === 'petroleum' ? '石油类' :
                                                                                                                                                                    field === 'anionic_detergent' ? '阴离子表面活性剂' :
                                                                                                                                                                        field === 'sulfide' ? '硫化物' :
                                                                                                                                                                            field === 'fecal_coliform' ? '粪大肠菌群' :
                                                                                                                                                                                field === 'sulfate' ? '硫酸盐' :
                                                                                                                                                                                    field === 'chloride' ? '氯化物' :
                                                                                                                                                                                        field === 'nitrate' ? '硝酸盐' :
                                                                                                                                                                                            field === 'iron' ? '铁' :
                                                                                                                                                                                                field === 'manganese' ? '锰' :
                                                                                                                                                                                                    field === 'antimony' ? '锑' :
                                                                                                                                                                                                        field === 'molybdenum' ? '钼' :
                                                                                                                                                                                                            field === 'thallium' ? '铊' :
                                                                                                                                                                                                                field === 'water_quality_type' ? '水质类型' :
                                                                                                                                                                                                                    field === 'monitoring_point' ? '监测点' :
                                                                                                                                                                                                                        field === 'excess_station' ? '超标站点' :
                                                                                                                                                                                                                            field === 'excess_parameter' ? '超标参数' :
                                                                                                                                                                                                                                field === 'excess_value' ? '超标数值' :
                                                                                                                                                                                                                                    field;

                                return {
                                    title: unit ? `${title}(${unit})` : title,
                                    dataIndex: field,
                                    key: field,
                                    width: 150,
                                    render: (text) => {
                                        if (field === 'sb_concentration') {
                                            return (
                                                <span style={{color: Number(text) < 0.002 ? '#ff4d4f' : 'inherit'}}>
                                                    {text}
                                                </span>
                                            );
                                        }
                                        return text;
                                    }
                                };
                            }).filter(column => column !== null);

                            // 确保采样时间列在最前面
                            const sortedColumns = dynamicColumns.sort((a, b) => {
                                if (a.dataIndex === 'date_time') return -1;
                                if (b.dataIndex === 'date_time') return 1;
                                return 0;
                            });

                            // 添加操作列
                            sortedColumns.push(operationColumn);

                            setColumns(sortedColumns);
                        }

                        setTableData(data);
                        setMonitoringData(data);
                    } catch (error) {
                        console.error("加载监测数据失败:", error);
                        message.error("加载监测数据失败");
                    } finally {
                        setLoading(false);
                    }
                };

                await loadMonitoringData();
            } else {
                message.error('删除数据失败');
            }
        } catch (error) {
            console.error('删除数据失败:', error);
            message.error('删除数据失败');
        }
    };

    return (
        <div className={styles.monitoringPage}>
            {stationInfo && (
                <>
                    <div className={styles.header}>
                        <h2>{stationInfo.stationName} - 监测数据</h2>
                    </div>

                    <Collapse defaultActiveKey={['1']} className={styles.statsCollapse} items={items} size='large'/>

                    <Tabs defaultActiveKey="realtime" className={styles.tabs}>
                        <TabPane tab="实时监测数据" key="realtime">
                            <div style={{marginBottom: 8, textAlign: 'right', marginTop: 0}}>
                                <Space>
                                    <Button
                                        type="primary"
                                        onClick={() => setAddModalVisible(true)}
                                        icon={<PlusOutlined />}
                                    >
                                        添加数据
                                    </Button>
                                    <Button
                                        onClick={() => setModalVisible(true)}
                                        icon={<FilterOutlined/>}
                                    >
                                        筛选
                                    </Button>
                                    <Button
                                        onClick={handleClearFilters}
                                        icon={<ClearOutlined/>}
                                    >
                                        清除筛选
                                    </Button>
                                    <Button
                                        type="primary"
                                        onClick={handleExportAll}
                                        icon={<DownloadOutlined/>}
                                    >
                                        导出全部数据
                                    </Button>
                                </Space>
                            </div>
                            <Table
                                columns={columns}
                                dataSource={tableData}
                                rowKey="date_time"
                                loading={loading}
                                size='small'
                                pagination={{
                                    showSizeChanger: true,
                                    showQuickJumper: true
                                }}
                                scroll={{x: 'max-content'}}
                                bordered
                                footer={page => {
                                    return <div style={{marginTop: 10, fontSize: 16, textAlign: "right"}}>共 {tableData.length} 条数据</div>
                                }}
                            />
                        </TabPane>
                        <TabPane tab="趋势分析" key="trend">
                            <div className={styles.trendChart} id='chart' style={{border: '3px solid rgb(88, 171, 248)'}}>
                                {trendData.length > 0 && <Line {...trendConfig} />}
                            </div>
                        </TabPane>
                        <TabPane tab="异常数据" key="abnormal">
                            <Table
                                columns={columns}
                                dataSource={monitoringData.filter(item => Number(item.sbConcentration) > 0.002)}
                                rowKey="date_time"
                                loading={loading}
                                footer={page => {
                                    return <div style={{marginTop: 10, fontSize: 16, textAlign: "right"}}>共 {tableData.length} 条数据</div>
                                }}
                                pagination={{
                                    showSizeChanger: true,
                                    showQuickJumper: true
                                }}
                            />
                        </TabPane>
                    </Tabs>

                    {/* 添加数据的模态框 */}
                    <Modal
                        title="添加数据"
                        open={addModalVisible}
                        onOk={handleAddData}
                        onCancel={() => {
                            setAddModalVisible(false);
                            addForm.resetFields();
                        }}
                        width={800}
                    >
                        <Form
                            form={addForm}
                            layout="vertical"
                        >
                            {generateAddFormItems()}
                        </Form>
                    </Modal>

                    {/* 现有的筛选模态框 */}
                    <Modal
                        ref={modalRef}
                        title={<div 
                            className="ant-modal-title"
                            style={{ cursor: 'move' }}
                            onMouseDown={handleMouseDown}
                        >
                            <SettingOutlined/>数据筛选
                        </div>}
                        open={modalVisible}
                        onCancel={() => setModalVisible(false)}
                        width={400}
                        footer={[
                            <Button
                                onClick={handleExport}
                                icon={<DownloadOutlined/>}
                            >
                                导出数据
                            </Button>,
                            <Button type="primary" onClick={handleFilterApply} style={{marginLeft: 8}}>
                                应用
                            </Button>
                        ]}
                        mask={false}
                        maskClosable={false}
                        style={{
                            position: 'fixed',
                            right: 20,
                            top: 20,
                            margin: 0,
                            transform: `translate(${position.x}px, ${position.y}px)`,
                            transition: isDragging ? 'none' : 'transform 0.1s ease',
                        }}
                        bodyStyle={{
                            overflow: 'auto',
                        }}
                        destroyOnClose
                    >
                        <div className={styles.filterContent}>
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
                            <div className={styles.filterItem}>
                                <h3>显示字段</h3>
                                <div style={{marginBottom: '16px'}}>
                                    <Space>
                                        <Button
                                            type="primary"
                                            onClick={() => {
                                                const allFieldsExceptId = allFields.filter(field => field !== 'id');
                                                handleFieldSelectionChange(allFieldsExceptId);
                                            }}
                                        >
                                            全选
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                handleFieldSelectionChange([]);
                                            }}
                                        >
                                            全不选
                                        </Button>
                                    </Space>
                                </div>
                                <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
                                    {allFields
                                        .filter(field => field !== 'id')
                                        .map(field => (
                                            <Button
                                                key={field}
                                                type={selectedFields.includes(field) ? 'primary' : 'default'}
                                                onClick={() => {
                                                    const newSelectedFields = selectedFields.includes(field)
                                                        ? selectedFields.filter(f => f !== field)
                                                        : [...selectedFields, field];
                                                    handleFieldSelectionChange(newSelectedFields);
                                                }}
                                                style={{
                                                    marginBottom: '8px',
                                                    minWidth: '100px',
                                                    transition: 'all 0.3s'
                                                }}
                                            >
                                                {field === 'samplingTime' || field === 'dateTime' ? '采样时间' :
                                                    field === 'sbConcentration' ? 'Sb浓度' :
                                                        field === 'waterTemperature' ? '水温' :
                                                            field === 'phValue' || field === 'ph' ? 'pH值' :
                                                                field === 'dissolvedOxygen' ? '溶解氧' :
                                                                    field === 'conductivity' ? '电导率' :
                                                                        field === 'ntu' ? '浊度' :
                                                                            field === 'ambientTemperature' ? '环境温度' :
                                                                                field === 'humidity' ? '湿度' :
                                                                                    field === 'sectionName' ? '断面名称' :
                                                                                        field === 'sectionType' ? '断面类型' :
                                                                                            field === 'flow' ? '流量' :
                                                                                                field === 'waterLevel' ? '水位' :
                                                                                                    field === 'transparency' ? '透明度' :
                                                                                                        field === 'chlorophyllA' ? '叶绿素a' :
                                                                                                            field === 'permanganateIndex' ? '高锰酸盐指数' :
                                                                                                                field === 'chemicalOxygenDemand' ? '化学需氧量' :
                                                                                                                    field === 'biochemicalOxygenDemand' ? '生化需氧量' :
                                                                                                                        field === 'ammoniaNitrogen' ? '氨氮' :
                                                                                                                            field === 'totalPhosphorus' ? '总磷' :
                                                                                                                                field === 'totalNitrogen' ? '总氮' :
                                                                                                                                    field === 'copper' ? '铜' :
                                                                                                                                        field === 'zinc' ? '锌' :
                                                                                                                                            field === 'fluoride' ? '氟化物' :
                                                                                                                                                field === 'selenium' ? '硒' :
                                                                                                                                                    field === 'arsenic' ? '砷' :
                                                                                                                                                        field === 'mercury' ? '汞' :
                                                                                                                                                            field === 'cadmium' ? '镉' :
                                                                                                                                                                field === 'hexavalentChromium' ? '六价铬' :
                                                                                                                                                                    field === 'leadContent' ? '铅' :
                                                                                                                                                                        field === 'cyanide' ? '氰化物' :
                                                                                                                                                                            field === 'volatilePhenol' ? '挥发酚' :
                                                                                                                                                                                field === 'petroleum' ? '石油类' :
                                                                                                                                                                                    field === 'anionicDetergent' ? '阴离子表面活性剂' :
                                                                                                                                                                                        field === 'sulfide' ? '硫化物' :
                                                                                                                                                                                            field === 'fecalColiform' ? '粪大肠菌群' :
                                                                                                                                                                                                field === 'sulfate' ? '硫酸盐' :
                                                                                                                                                                                                    field === 'chloride' ? '氯化物' :
                                                                                                                                                                                                        field === 'nitrate' ? '硝酸盐' :
                                                                                                                                                                                                    field === 'iron' ? '铁' :
                                                                                                                                                                                                    field === 'manganese' ? '锰' :
                                                                                                                                                                                                    field === 'antimony' ? '锑' :
                                                                                                                                                                                                    field === 'molybdenum' ? '钼' :
                                                                                                                                                                                                    field === 'thallium' ? '铊' :
                                                                                                                                                                                                    field === 'waterQualityType' ? '水质类型' :
                                                                                                                                                                                                    field === 'monitoringPoint' ? '监测点' :
                                                                                                                                                                                                    field === 'excessTime' ? '超标时间' :
                                                                                                                                                                                                    field === 'excessStation' ? '超标站点' :
                                                                                                                                                                                                    field === 'excessParameter' ? '超标参数' :
                                                                                                                                                                                                    field === 'excessValue' ? '超标数值' :
                                                                                                                                                                                                    field}
                                            </Button>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </Modal>
                </>
            )}
        </div>
    );
};

export default MonitoringPage;
