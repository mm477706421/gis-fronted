import React, { useState, useEffect } from 'react';
import { Card, DatePicker, Space, Select } from 'antd';
import { Line } from '@ant-design/plots';

const { RangePicker } = DatePicker;

const TrendAnalysis = () => {
  const [data, setData] = useState([]);
  const [dateRange, setDateRange] = useState([]);
  const [loading, setLoading] = useState(false);

  // 模拟数据获取
  const fetchData = async (startDate, endDate) => {
    setLoading(true);
    try {
      // 这里替换为实际的API调用
      const mockData = [
        { date: '2024/01', value: 20 },
        { date: '2024/02', value: 50 },
        { date: '2024/03', value: 30 },
        { date: '2024/04', value: 80 },
      ];
      setData(mockData);
    } catch (error) {
      console.error('获取数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (dates) => {
    setDateRange(dates);
    if (dates) {
      fetchData(dates[0], dates[1]);
    }
  };

  const config = {
    data,
    xField: 'date',
    yField: 'value',
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
  };

  return (
    <div style={{ padding: '20px' }}>
      <Card>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div style={{ marginBottom: '20px' }}>
            <Space>
              <RangePicker onChange={handleDateChange} />
              <Select
                defaultValue="day"
                style={{ width: 120 }}
                options={[
                  { value: 'hour', label: '按小时' },
                  { value: 'day', label: '按天' },
                  { value: 'month', label: '按月' },
                ]}
              />
            </Space>
          </div>
          <Line {...config} loading={loading} />
        </Space>
      </Card>
    </div>
  );
};

export default TrendAnalysis; 