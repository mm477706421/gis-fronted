import React from 'react';

const PollutionSourceFrame = () => {
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
      这里是污染源信息展示的通用框架页面<br/>
      （后续可根据 type 参数加载不同内容）
    </div>
  );
};

export default PollutionSourceFrame; 