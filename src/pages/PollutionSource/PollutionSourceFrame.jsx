import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Table, Tabs, Button, Space, DatePicker, message } from 'antd';
import { PlusOutlined, ClearOutlined } from '@ant-design/icons';
import axios from 'axios';
import styles from './index.css';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const PollutionSourceFrame = () => {
    const { type } = useParams();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [dateRange, setDateRange] = useState(null);
    const [activeTab, setActiveTab] = useState('1');

    // 根据类型获取对应的表格列配置
    const getColumns = (type) => {
        const commonColumns = [
            {
                title: '操作',
                key: 'action',
                width: 120,
                render: (_, record) => (
                    <Space>
                        <Button type="link" onClick={() => handleEdit(record)}>编辑</Button>
                        <Button type="link" danger onClick={() => handleDelete(record)}>删除</Button>
                    </Space>
                ),
            },
        ];

        switch (type) {
            case 'waste-piles':
                return [
                    {
                        title: '名称',
                        dataIndex: 'name',
                        key: 'name',
                        width: 150,
                    },
                    {
                        title: '经度',
                        dataIndex: 'longitude',
                        key: 'longitude',
                        width: 120,
                    },
                    {
                        title: '纬度',
                        dataIndex: 'latitude',
                        key: 'latitude',
                        width: 120,
                    },
                    {
                        title: '占地面积(㎡)',
                        dataIndex: 'area',
                        key: 'area',
                        width: 120,
                    },
                    {
                        title: '堆存量(m³)',
                        dataIndex: 'volume',
                        key: 'volume',
                        width: 120,
                    },
                    ...commonColumns,
                ];
            case 'mine-caves':
                if (activeTab === '1') { // 丹凤矿硐
                    return [
                        {
                            title: '序号',
                            dataIndex: 'sequence_number',
                            key: 'sequence_number',
                            width: 80,
                        },
                        {
                            title: '编号',
                            dataIndex: 'code',
                            key: 'code',
                            width: 100,
                        },
                        {
                            title: '经度',
                            dataIndex: 'longitude',
                            key: 'longitude',
                            width: 120,
                        },
                        {
                            title: '纬度',
                            dataIndex: 'latitude',
                            key: 'latitude',
                            width: 120,
                        },
                        {
                            title: '高程(米)',
                            dataIndex: 'elevation',
                            key: 'elevation',
                            width: 100,
                        },
                        {
                            title: '水类型',
                            dataIndex: 'water_type',
                            key: 'water_type',
                            width: 100,
                        },
                        {
                            title: '硐口涌水量(m³/d)',
                            dataIndex: 'water_discharge',
                            key: 'water_discharge',
                            width: 120,
                        },
                        {
                            title: '锑(Sb)百分比',
                            dataIndex: 'antimony_percentage',
                            key: 'antimony_percentage',
                            width: 120,
                        },
                        {
                            title: '砷(As)百分比',
                            dataIndex: 'arsenic_percentage',
                            key: 'arsenic_percentage',
                            width: 120,
                        },
                        {
                            title: '巷道长度(m)',
                            dataIndex: 'tunnel_length',
                            key: 'tunnel_length',
                            width: 120,
                        },
                        {
                            title: '巷道容积(m³)',
                            dataIndex: 'tunnel_volume',
                            key: 'tunnel_volume',
                            width: 120,
                        },
                        {
                            title: '井巷关系',
                            dataIndex: 'tunnel_relationship',
                            key: 'tunnel_relationship',
                            width: 200,
                        },
                        ...commonColumns,
                    ];
                } else { // 商州矿硐
                    return [
                        {
                            title: '序号',
                            dataIndex: 'sequence_number',
                            key: 'sequence_number',
                            width: 80,
                        },
                        {
                            title: '涌水情况',
                            dataIndex: 'water_condition',
                            key: 'water_condition',
                            width: 100,
                        },
                        {
                            title: '矿硐编号',
                            dataIndex: 'tunnel_code',
                            key: 'tunnel_code',
                            width: 100,
                        },
                        {
                            title: '经度',
                            dataIndex: 'longitude',
                            key: 'longitude',
                            width: 120,
                        },
                        {
                            title: '纬度',
                            dataIndex: 'latitude',
                            key: 'latitude',
                            width: 120,
                        },
                        {
                            title: '涌水流量(L/S)',
                            dataIndex: 'water_flow',
                            key: 'water_flow',
                            width: 120,
                        },
                        {
                            title: '封堵情况',
                            dataIndex: 'blockage_status',
                            key: 'blockage_status',
                            width: 100,
                        },
                        {
                            title: '矿硐深度(m)',
                            dataIndex: 'tunnel_depth',
                            key: 'tunnel_depth',
                            width: 120,
                        },
                        {
                            title: '贯通情况',
                            dataIndex: 'penetration_status',
                            key: 'penetration_status',
                            width: 100,
                        },
                        ...commonColumns,
                    ];
                }
            case 'enterprises':
                if (activeTab === '1') { // 排污口
                    return [
                        {
                            title: '入河排污口名称',
                            dataIndex: 'company_name',
                            key: 'company_name',
                            width: 150,
                        },
                        {
                            title: '入河排污口类型',
                            dataIndex: 'outlet_type',
                            key: 'outlet_type',
                            width: 120,
                        },
                        {
                            title: '设置单位',
                            dataIndex: 'setting_unit',
                            key: 'setting_unit',
                            width: 150,
                        },
                        {
                            title: '经纬度',
                            dataIndex: 'coordinates',
                            key: 'coordinates',
                            width: 120,
                        },
                        {
                            title: '行政区位置',
                            dataIndex: 'administrative_location',
                            key: 'administrative_location',
                            width: 150,
                        },
                        {
                            title: '排入水体及水功能区',
                            dataIndex: 'water_body_and_function',
                            key: 'water_body_and_function',
                            width: 150,
                        },
                        {
                            title: '年度废污水排放量(吨/年)',
                            dataIndex: 'annual_wastewater_discharge',
                            key: 'annual_wastewater_discharge',
                            width: 150,
                        },
                        {
                            title: '主要排放污染物',
                            dataIndex: 'main_pollutants',
                            key: 'main_pollutants',
                            width: 150,
                        },
                        {
                            title: 'COD浓度(mg/L)',
                            dataIndex: 'cod_concentration',
                            key: 'cod_concentration',
                            width: 120,
                        },
                        {
                            title: 'COD总量(吨/年)',
                            dataIndex: 'cod_total_emission',
                            key: 'cod_total_emission',
                            width: 120,
                        },
                        {
                            title: '氨氮浓度(mg/L)',
                            dataIndex: 'ammonia_nitrogen_concentration',
                            key: 'ammonia_nitrogen_concentration',
                            width: 120,
                        },
                        {
                            title: '氨氮总量(吨/年)',
                            dataIndex: 'ammonia_nitrogen_total_emission',
                            key: 'ammonia_nitrogen_total_emission',
                            width: 120,
                        },
                        {
                            title: '是否在线监测',
                            dataIndex: 'is_online_monitoring',
                            key: 'is_online_monitoring',
                            width: 120,
                        },
                        {
                            title: '是否联网',
                            dataIndex: 'is_networked',
                            key: 'is_networked',
                            width: 100,
                        },
                        {
                            title: '联网级别',
                            dataIndex: 'network_level',
                            key: 'network_level',
                            width: 120,
                        },
                        ...commonColumns,
                    ];
                } else { // 企业
                    return [
                        {
                            title: '设置单位',
                            dataIndex: 'outlet_setting_company',
                            key: 'outlet_setting_company',
                            width: 150,
                        },
                        {
                            title: '入河排污口名称',
                            dataIndex: 'outlet_name',
                            key: 'outlet_name',
                            width: 150,
                        },
                        {
                            title: '入河排污口类型',
                            dataIndex: 'outlet_type',
                            key: 'outlet_type',
                            width: 120,
                        },
                        {
                            title: '行政区位置',
                            dataIndex: 'administrative_location',
                            key: 'administrative_location',
                            width: 150,
                        },
                        {
                            title: '排入水体及水功能区',
                            dataIndex: 'water_body_and_function',
                            key: 'water_body_and_function',
                            width: 150,
                        },
                        {
                            title: '年度废污水排放量(吨/年)',
                            dataIndex: 'annual_wastewater_discharge',
                            key: 'annual_wastewater_discharge',
                            width: 150,
                        },
                        {
                            title: '主要排放污染物',
                            dataIndex: 'main_pollutants',
                            key: 'main_pollutants',
                            width: 150,
                        },
                        {
                            title: 'COD浓度(mg/L)',
                            dataIndex: 'cod_concentration',
                            key: 'cod_concentration',
                            width: 120,
                        },
                        {
                            title: 'COD总量(吨/年)',
                            dataIndex: 'cod_total_emission',
                            key: 'cod_total_emission',
                            width: 120,
                        },
                        {
                            title: '氨氮浓度(mg/L)',
                            dataIndex: 'ammonia_nitrogen_concentration',
                            key: 'ammonia_nitrogen_concentration',
                            width: 120,
                        },
                        {
                            title: '氨氮总量(吨/年)',
                            dataIndex: 'ammonia_nitrogen_total_emission',
                            key: 'ammonia_nitrogen_total_emission',
                            width: 120,
                        },
                        {
                            title: '是否在线监测',
                            dataIndex: 'is_online_monitoring',
                            key: 'is_online_monitoring',
                            width: 120,
                        },
                        {
                            title: '是否联网',
                            dataIndex: 'is_networked',
                            key: 'is_networked',
                            width: 100,
                        },
                        {
                            title: '联网级别',
                            dataIndex: 'network_level',
                            key: 'network_level',
                            width: 120,
                        },
                        ...commonColumns,
                    ];
                }
            case 'antimony-mines':
                return [
                    {
                        title: '锑矿名称',
                        dataIndex: 'sb_mine_name',
                        key: 'sb_mine_name',
                        width: 150,
                    },
                    {
                        title: '经度',
                        dataIndex: 'longitude',
                        key: 'longitude',
                        width: 120,
                    },
                    {
                        title: '纬度',
                        dataIndex: 'latitude',
                        key: 'latitude',
                        width: 120,
                    },
                    ...commonColumns,
                ];
            default:
                return [];
        }
    };

    // 根据类型获取对应的API路径
    const getApiPath = (type, tab) => {
        switch (type) {
            case 'waste-piles':
                return tab === '1' ? 'feizha_data_danfeng' : 'feizha_data_shangzhou';
            case 'mine-caves':
                return tab === '1' ? 'kuangdong_data_danfeng' : 'kuangdong_data_shangzhou';
            case 'enterprises':
                return tab === '1' ? 'company_data_paiwukou' : 'company_data_qiye';
            case 'antimony-mines':
                return 'sb_position';
            default:
                return '';
        }
    };

    // 加载数据
    const loadData = async () => {
        setLoading(true);
        try {
            const apiPath = getApiPath(type, activeTab);
            const response = await axios.get(`http://127.0.0.1:8080/api/${apiPath}/list`);
            setData(response.data);
            setFilteredData(response.data);
        } catch (error) {
            message.error('加载数据失败');
            console.error('加载数据失败:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, [type, activeTab]);

    // 处理日期范围变化
    const handleDateRangeChange = (dates) => {
        setDateRange(dates);
        if (dates) {
            const filtered = data.filter(item => {
                const itemDate = new Date(item.date_time);
                return itemDate >= dates[0] && itemDate <= dates[1];
            });
            setFilteredData(filtered);
        } else {
            setFilteredData(data);
        }
    };

    // 清除筛选条件
    const handleClearFilters = () => {
        setDateRange(null);
        setFilteredData(data);
        message.success('已清除所有筛选条件');
    };

    // 处理编辑
    const handleEdit = (record) => {
        // TODO: 实现编辑功能
        console.log('编辑记录:', record);
    };

    // 处理删除
    const handleDelete = (record) => {
        // TODO: 实现删除功能
        console.log('删除记录:', record);
    };

    // 获取页面标题
    const getPageTitle = () => {
        switch (type) {
            case 'waste-piles':
                return '流域废渣堆信息';
            case 'mine-caves':
                return '流域矿硐信息';
            case 'enterprises':
                return '周边企业信息';
            case 'antimony-mines':
                return '锑矿信息';
            default:
                return '污染源信息';
        }
    };

    // 获取标签页标题
    const getTabTitles = () => {
        switch (type) {
            case 'waste-piles':
                return ['丹凤废渣堆', '商州废渣堆'];
            case 'mine-caves':
                return ['丹凤矿硐', '商州矿硐'];
            case 'enterprises':
                return ['排污口', '企业'];
            default:
                return [];
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>{getPageTitle()}</h2>
                <Space>
                    <RangePicker
                        showTime
                        value={dateRange}
                        onChange={handleDateRangeChange}
                        placeholder={['开始时间', '结束时间']}
                    />
                    <Button
                        icon={<ClearOutlined />}
                        onClick={handleClearFilters}
                    >
                        清除筛选
                    </Button>
                    <Button type="primary" icon={<PlusOutlined />}>
                        新增
                    </Button>
                </Space>
            </div>

            {type !== 'antimony-mines' ? (
                <Tabs activeKey={activeTab} onChange={setActiveTab}>
                    {getTabTitles().map((title, index) => (
                        <TabPane tab={title} key={String(index + 1)}>
                            <Table
                                columns={getColumns(type)}
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
                    ))}
                </Tabs>
            ) : (
                <Table
                    columns={getColumns(type)}
                    dataSource={filteredData}
                    loading={loading}
                    rowKey="id"
                    scroll={{ x: 1200 }}
                    pagination={{
                        showSizeChanger: true,
                        showQuickJumper: true,
                    }}
                />
            )}
        </div>
    );
};

export default PollutionSourceFrame; 