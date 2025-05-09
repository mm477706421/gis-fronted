import React, {useEffect, useState} from 'react';
import {Avatar, Dropdown, Layout, Menu, message, Space, theme} from 'antd';
import {
    AlertOutlined,
    DashboardOutlined,
    FileTextOutlined,
    LineChartOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    MonitorOutlined,
    SearchOutlined,
    SettingOutlined,
    UserOutlined,
    WarningOutlined,
    ExperimentOutlined,
} from '@ant-design/icons';
import {Outlet, useLocation, useNavigate} from 'react-router-dom';
import './index.css';
import AIAssistant from "../../components/AIAssistant";

const {Header, Sider, Content} = Layout;

const MainLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [menuItems, setMenuItems] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();

    // 加载站点数据
    useEffect(() => {
        const loadStationData = () => {
            try {
                // 定义所有表名
                const allTables = [
                    'dzm_water_quality',
                    'excess_historical_data',
                    'excess_lht_fenceng',
                    'excess_manual_historical',
                    'excess_manual_sb',
                    'excess_pre_data',
                    'gfl_water_quality',
                    'ljd_water_quality',
                    'ljh_water_quality',
                    'ljy_water_quality',
                    'manual_dfx_quality',
                    'manual_dzm_sb',
                    'manual_gfl_sb',
                    'manual_gyk_quality',
                    'manual_lht_sb',
                    'manual_ljd_quality',
                    'manual_ljh_sb',
                    'manual_ljp_quality',
                    'manual_ljp_sb',
                    'manual_ljy_sb',
                    'manual_mj_quality',
                    'manual_syj_sb',
                    'manual_wsd_sb',
                    'manual_xh_quality',
                    'manual_xk_quality',
                    'manual_yhh_sb',
                    'manual_zc_quality',
                    'pre_dzm_quality',
                    'pre_gfl_quality',
                    'pre_ljd_quality',
                    'pre_ljh_quality',
                    'pre_ljy_quality',
                    'pre_wsd_quality',
                    'pre_xh_quality',
                    'wsd_water_quality',
                    'xh_water_quality'
                ];

                // 根据表名规则分类站点
                const manualStations = allTables
                    .filter(table => table.startsWith('manual_'))
                    .map(table => {
                        const stationName = table.replace('manual_', '').split('_')[0].toUpperCase();
                        return {
                            id: table,
                            stationName: stationName,
                            type: table.endsWith('_sb') ? 'sb监测' : '常规监测'
                        };
                    });

                const autoStations = allTables
                    .filter(table => !table.startsWith('manual_') && 
                                   !table.startsWith('excess_') && 
                                   !table.startsWith('pre_') && 
                                   table !== 'station_message')
                    .map(table => {
                        const stationName = table.split('_')[0].toUpperCase();
                        return {
                            id: table,
                            stationName: stationName
                        };
                    });

                const preStations = allTables
                    .filter(table => table.startsWith('pre_'))
                    .map(table => {
                        const stationName = table.replace('pre_', '').split('_')[0].toUpperCase();
                        return {
                            id: table,
                            stationName: stationName
                        };
                    });
                console.log("auto:",autoStations)
                console.log("pre:",preStations)
                // 生成菜单项
                const newMenuItems = [
                    {
                      key: '',
                      icon: <MenuUnfoldOutlined/>,
                      label: '菜单',
                    },
                    {
                        key: 'gis',
                        icon: <DashboardOutlined/>,
                        label: 'GIS地图展示',
                    },
                    {
                        key: 'monitoring',
                        icon: <MonitorOutlined/>,
                        label: '监测数据管理',
                        children: [
                            {
                                key: 'lht-monitoring',
                                label: 'LHT站点',
                                children: [
                                    {key: 'manual-lht-fenceng', label: '分层数据'},
                                ],
                            },
                            {
                                key: 'auto-monitoring',
                                label: '自动监测站点',
                                children: [
                                    ...autoStations.map(station => ({
                                        key: `auto-site/${station.id}`,
                                        label: station.stationName,
                                    })),
                                ],
                            },
                            {
                                key: 'manual-monitoring',
                                label: '手动监测站点',
                                children: [
                                    {
                                        key: 'manual-regular',
                                        label: '常规监测',
                                        children: manualStations
                                            .filter(station => station.type === '常规监测')
                                            .map(station => ({
                                                key: `manual-site/${station.id}`,
                                                label: station.stationName,
                                            })),
                                    },
                                    {
                                        key: 'manual-sb',
                                        label: 'SB监测',
                                        children: manualStations
                                            .filter(station => station.type === 'sb监测')
                                            .map(station => ({
                                                key: `manual-site/${station.id}`,
                                                label: station.stationName,
                                            })),
                                    },
                                ],
                            },
                            {
                                key: 'data-analysis',
                                label: '数据分析',
                                children: [
                                    {key: 'abnormal-data', label: '异常数据'},
                                    {key: 'trend-analysis', label: '趋势分析'},
                                    {key: 'fault-statistics', label: '设备故障统计'},
                                ],
                            },
                        ],
                    },
                    {
                        key: 'prediction',
                        icon: <LineChartOutlined/>,
                        label: '预测数据管理',
                        children: [
                          ...preStations.map(station => ({
                            key: `pred-site/${station.id}`,
                            label: station.stationName,
                           })),  
                        ],
                    },
                    {
                        key: 'source',
                        icon: <SearchOutlined/>,
                        label: '溯源信息',
                        children: [
                            {
                                key: 'remote-sensing',
                                label: '遥感监测信息',
                                children: [
                                    {key: 'data-integration', label: '多元数据整合'},
                                    {key: 'meteorological-data', label: '气象数据'},
                                    {key: 'model-visualization', label: '遥感监测模型可视化'},
                                    {key: 'water-quality', label: '遥感水质监测数据'},
                                ],
                            },
                            {
                                key: 'traceability',
                                label: '溯源信息',
                                children: [
                                    {key: 'traceability-model', label: '溯源模型可视化'},
                                    {key: 'dynamic-path', label: '动态溯源路径追踪'},
                                    {
                                        key: 'pollution-source',
                                        label: '污染源位置数据库',
                                        children: [
                                            {key: 'waste-piles', label: '流域废渣堆信息'},
                                            {key: 'mine-caves', label: '流域矿硐信息'},
                                            {key: 'enterprises', label: '周边企业信息'},
                                            {key: 'antimony-mines', label: '锑矿'},
                                        ],
                                    },
                                    {key: 'impact-analysis', label: '溯源影响分析'},
                                ],
                            },
                        ],
                    },
                    {
                        key: 'pollution',
                        icon: <WarningOutlined/>,
                        label: '污染源管理',
                    },
                    {
                        key: 'report',
                        icon: <FileTextOutlined/>,
                        label: '工作报告生成',
                    },
                    {
                        key: 'emergency',
                        icon: <AlertOutlined/>,
                        label: '应急管理',
                        children: [
                            {key: 'emergency-site', label: '站点基本信息'},
                            {key: 'emergency-medication', label: '加药点基本信息'},
                            {key: 'emergency-personnel', label: '应急人员管理'},
                        ],
                    },
                    {
                        key: 'users',
                        icon: <UserOutlined/>,
                        label: '用户管理',
                        children: [
                            {key: 'admin', label: '管理员'},
                            {key: 'user', label: '用户'},
                        ],
                    },
                ];

                setMenuItems(newMenuItems);
            } catch (error) {
                console.error("加载站点数据失败:", error);
                message.error("加载站点数据失败");
            }
        };

        loadStationData();
    }, []);

    const userMenuItems = [
        {
            key: 'profile',
            icon: <UserOutlined/>,
            label: '个人信息',
        },
        {
            key: 'settings',
            icon: <SettingOutlined/>,
            label: '设置',
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            icon: <LogoutOutlined/>,
            label: '退出登录',
        },
    ];

    const handleMenuClick = ({key}) => {
        if (key.startsWith('fingerprint')) {
            navigate(`/source/${key}`);
        } else {
            navigate(`/${key}`);
        }
    };

    const handleUserMenuClick = ({key}) => {
        if (key === 'logout') {
            // 处理退出登录
            localStorage.removeItem('token');
            navigate('/login');
        } else {
            navigate(`/${key}`);
        }
    };

    return (
        <Layout className="main-layout">
            <AIAssistant/>
            <Sider trigger={null} collapsible collapsed={collapsed} theme="light">

                <Menu
                    mode="inline"
                    selectedKeys={[location.pathname.split('/')[1]]}
                    items={menuItems}
                    onClick={handleMenuClick}
                />
            </Sider>
            <Layout>
                <Header style={{padding: 0, background: colorBgContainer}}>
                    <div className="header-content">
                        <div className="header-left">
                            <button
                                type="button"
                                className="collapse-button"
                                onClick={() => setCollapsed(!collapsed)}
                            >
                                {collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
                            </button>
                            <div className="logo">
                                <h1>河流数据管理系统</h1>
                            </div>
                        </div>
                        <div className="header-right">
                            <Dropdown
                                menu={{
                                    items: userMenuItems,
                                    onClick: handleUserMenuClick,
                                }}
                                placement="bottomRight"
                            >
                                <Space className="user-dropdown">
                                    <Avatar icon={<UserOutlined/>}/>
                                    <span className="username">管理员</span>
                                </Space>
                            </Dropdown>
                        </div>
                    </div>
                </Header>
                <Content className="main-content">
                    <div
                        style={{
                            margin: '24px 16px',
                            padding: 24,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                            minHeight: 280,
                        }}
                    >
                        <Outlet/>
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default MainLayout;
