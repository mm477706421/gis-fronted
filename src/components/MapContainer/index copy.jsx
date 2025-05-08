import React, { Component } from "react";
import AMapLoader from "@amap/amap-jsapi-loader";
import mapConfig from "../../config/map";
import styles from "./index.css";
import { Checkbox, message, Modal, Descriptions, Tabs, Table } from "antd";

const { TabPane } = Tabs;

class MapContainer extends Component {
  constructor() {
    super();
    this.map = null;
    this.AMap = null;
    this.markers = [];
    this.state = {
      loading: true,
      layers: {
        satellite: false,
        roadNet: false,
        traffic: false,
        terrain: false
      },
      modalVisible: false,
      currentStation: null,
      realTimeData: [],
      weeklyData: []
    };
  }

  componentDidMount() {
    this.initMap();
  }

  componentWillUnmount() {
    if (this.map) {
      this.map.destroy();
    }
  }

  // 初始化地图
  initMap = async () => {
    try {
      // 配置安全密钥
      window._AMapSecurityConfig = {
        securityJsCode: mapConfig.SECURITY_CODE,
      };

      // 加载高德地图
      this.AMap = await AMapLoader.load({
        key: mapConfig.KEY,
        version: mapConfig.VERSION,
        plugins: mapConfig.PLUGINS,
      });

      // 创建地图实例
      this.map = new this.AMap.Map("container", {
        // rotateEnable: false,
        // pitchEnable: true,
        zoom: 7,
        // pitch: 80,
        // rotation: 80,
        viewMode: "3D",
        zooms: [2, 20],
        center: [115.121282, 37.222719],
        terrain: this.state.layers.terrain
      });

      // 添加控件
      this.map.addControl(new this.AMap.ToolBar());
      this.map.addControl(new this.AMap.HawkEye());
      this.map.addControl(new this.AMap.MapType());

      // 创建图层
      this.satelliteLayer = new this.AMap.TileLayer.Satellite();
      this.roadNetLayer = new this.AMap.TileLayer.RoadNet();
      this.trafficLayer = new this.AMap.TileLayer.Traffic();

      // 加载站点数据
      this.loadStationMarkers();

      this.setState({ loading: false });
    } catch (error) {
      console.error("地图初始化失败:", error);
      message.error("地图初始化失败");
    }
  };

  // 加载实时监测数据
  loadRealTimeData = async (stationId) => {
    try {
      // TODO: 替换为实际的API调用
      const mockData = [
        { factor: 'COD', value: '45.2', limit: '50' },
        { factor: '氨氮', value: '2.1', limit: '5' },
        { factor: '总磷', value: '0.3', limit: '0.5' }
      ];
      this.setState({ realTimeData: mockData });
    } catch (error) {
      console.error("加载实时数据失败:", error);
      message.error("加载实时数据失败");
    }
  };

  // 加载近一周数据
  loadWeeklyData = async (stationId) => {
    try {
      // TODO: 替换为实际的API调用
      const mockData = [
        { factor: 'COD', value: '42.5', limit: '50' },
        { factor: '氨氮', value: '1.8', limit: '5' },
        { factor: '总磷', value: '0.25', limit: '0.5' }
      ];
      this.setState({ weeklyData: mockData });
    } catch (error) {
      console.error("加载周数据失败:", error);
      message.error("加载周数据失败");
    }
  };

  // 处理标签页切换
  handleTabChange = (key) => {
    if (this.state.currentStation) {
      if (key === 'realtime') {
        this.loadRealTimeData(this.state.currentStation.id);
      } else if (key === 'weekly') {
        this.loadWeeklyData(this.state.currentStation.id);
      }
    }
  };

  // 加载站点标记
  loadStationMarkers = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8080/api/list_station_message");
      const stations = await response.json();
      
      // 清除现有标记
      this.clearMarkers();
      
      // 创建新标记
      stations.forEach(station => {
        const markerContent = `
          <div class="${styles.customContentMarker}">
            <img src="//a.amap.com/jsapi_demos/static/demo-center/icons/dir-via-marker.png">
          </div>
        `;
        
        const position = new this.AMap.LngLat(station.longitude, station.latitude);
        const marker = new this.AMap.Marker({
          position: position,
          content: markerContent,
          offset: new this.AMap.Pixel(-13, -30),
          title: station.stationName
        });
        
        // 添加点击事件
        marker.on('click', () => {
          this.setState({
            modalVisible: true,
            currentStation: station
          }, () => {
            // 加载实时数据
            this.loadRealTimeData(station.id);
          });
        });
        
        this.map.add(marker);
        this.markers.push(marker);
      });
    } catch (error) {
      console.error("加载站点数据失败:", error);
      message.error("加载站点数据失败");
    }
  };

  // 清除所有标记
  clearMarkers = () => {
    this.markers.forEach(marker => {
      this.map.remove(marker);
    });
    this.markers = [];
  };

  // 切换图层
  toggleLayer = (layerName) => {
    const { layers } = this.state;
    const newLayers = { ...layers, [layerName]: !layers[layerName] };
    this.setState({ layers: newLayers });

    switch (layerName) {
      case "satellite":
        newLayers[layerName]
          ? this.map.add(this.satelliteLayer)
          : this.map.remove(this.satelliteLayer);
        break;
      case "roadNet":
        newLayers[layerName]
          ? this.map.add(this.roadNetLayer)
          : this.map.remove(this.roadNetLayer);
        break;
      case "traffic":
        newLayers[layerName]
          ? this.map.add(this.trafficLayer)
          : this.map.remove(this.trafficLayer);
        break;
      case "terrain":
        this.map.setTerrain(newLayers[layerName]);
        break;
      default:
        break;
    }
  };

  // 定位到当前位置
  locateCurrentPosition = () => {
    const geolocation = new this.AMap.Geolocation({
      enableHighAccuracy: true,
      timeout: 10000,
      buttonPosition: "RB",
      buttonOffset: new this.AMap.Pixel(10, 20),
      zoomToAccuracy: true,
    });

    this.map.addControl(geolocation);
    geolocation.getCurrentPosition();
  };

  // 重置地图视图
  resetMapView = () => {
    this.map.setZoomAndCenter(mapConfig.DEFAULT_ZOOM, mapConfig.DEFAULT_CENTER);
  };

  // 处理模态框关闭
  handleModalClose = () => {
    this.setState({
      modalVisible: false,
      currentStation: null,
      realTimeData: [],
      weeklyData: []
    });
  };

  render() {
    const { layers, modalVisible, currentStation, realTimeData, weeklyData } = this.state;

    // 表格列定义
    const columns = [
      {
        title: '监测因子',
        dataIndex: 'factor',
        key: 'factor',
      },
      {
        title: '监测值',
        dataIndex: 'value',
        key: 'value',
      },
      {
        title: '标准限值',
        dataIndex: 'limit',
        key: 'limit',
      }
    ];

    return (
      <div className={styles.container}>
        <div className={styles.layerControl}>
          <Checkbox
            checked={layers.terrain}
            onChange={() => this.toggleLayer("terrain")}
          >
            地形图
          </Checkbox>
        </div>
        <div id="container" style={{ height: "70vh" }}></div>

        <Modal
          title={currentStation?.stationName || "站点信息"}
          open={modalVisible}
          onCancel={this.handleModalClose}
          footer={null}
          width={600}
        >
          {currentStation && (
            <>
              <Descriptions bordered column={1}>
                <Descriptions.Item label="站点名称">
                  {currentStation.stationName}
                </Descriptions.Item>
                <Descriptions.Item label="监测方式">
                  {currentStation.manner}
                </Descriptions.Item>
                <Descriptions.Item label="监测类型">
                  {currentStation.quality}
                </Descriptions.Item>
                <Descriptions.Item label="监测频率">
                  {currentStation.frequency}
                </Descriptions.Item>
                <Descriptions.Item label="经度">
                  {currentStation.longitude}
                </Descriptions.Item>
                <Descriptions.Item label="纬度">
                  {currentStation.latitude}
                </Descriptions.Item>
              </Descriptions>

              <Tabs defaultActiveKey="realtime" onChange={this.handleTabChange} className={styles.dataTabs}>
                <TabPane tab="实时监测数据" key="realtime">
                  <Table
                    columns={columns}
                    dataSource={realTimeData}
                    rowKey="factor"
                    pagination={false}
                    size="small"
                  />
                </TabPane>
                <TabPane tab="近一周数据" key="weekly">
                  <Table
                    columns={columns}
                    dataSource={weeklyData}
                    rowKey="factor"
                    pagination={false}
                    size="small"
                  />
                </TabPane>
              </Tabs>
            </>
          )}
        </Modal>
      </div>
    );
  }
}

export default MapContainer;
