import React from 'react';
import {Card, Typography} from 'antd';
import MapContainer from '../../components/MapContainer';
import './index.css';


const GISMap = () => {
  return (
    <Card
        title={"GIS 地图展示"}>
      <MapContainer />
    </Card>
  );
};

export default GISMap; 
