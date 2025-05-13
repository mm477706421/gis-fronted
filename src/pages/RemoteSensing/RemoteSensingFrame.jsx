import React from 'react';
import { useParams } from 'react-router-dom';
import FileManagerTable from '../../components/FileManagerTable/FileManagerTable';
import RemoteSensing from "./index";

const RemoteSensingFrame = () => {
  const { type } = useParams();

  if (type === 'data-integration') {
    return (
      <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', padding: 32 }}>
        <FileManagerTable />
      </div>
    );
  }
  else if(type === 'water-quality'){
    return (
      <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', padding: 32 }}>
        <RemoteSensing />
      </div>
    )
  }

  return (
    <div style={{
      minHeight: 400,
      background: '#fff',
      borderRadius: 8,
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      padding: 32,
      textAlign: 'center',
      color: '#888',
      fontSize: 20
    }}>
      这里是遥感监测信息的通用框架页面<br/>
      （后续可根据 type 参数加载不同内容）
    </div>
  );
};

export default RemoteSensingFrame;
