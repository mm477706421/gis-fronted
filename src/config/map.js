// 高德地图配置
const mapConfig = {
    KEY: 'd1fe31fe167398f4b5fec7cd0da5422f',
    SECURITY_CODE: '031d5f2a9de98784b6f8543587835f54',
    VERSION: '2.0',
    PLUGINS: [
        'AMap.Scale',
        'AMap.ToolBar',
        'AMap.MapType',
        'AMap.Geolocation',
        'AMap.Weather',
    ],
    // 默认地图中心点（中国中心）
    DEFAULT_CENTER: [109.95, 33.85],
    // 默认缩放级别
    DEFAULT_ZOOM: 12
};

export default mapConfig;