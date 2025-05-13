import React, { useState, useEffect } from 'react';
import { Table, message, Button, Modal, Form, Input, Space, Popconfirm, Tabs, DatePicker, InputNumber } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import styles from './index.css';
import dayjs from 'dayjs';

const { TabPane } = Tabs;

const RemoteSensing = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [waterQualityData, setWaterQualityData] = useState([]);
  const [meteorologicalData, setMeteorologicalData] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('attributes');
  const [activeMeteorologicalTab, setActiveMeteorologicalTab] = useState('danfeng');
  const location = useLocation();

  const attributesColumns = [
    {
      title: '面积(km²)',
      dataIndex: 'area',
      key: 'area',
      render: (value) => value.toFixed(2),
    },
    {
      title: '中心纬度',
      dataIndex: 'center_latitude',
      key: 'center_latitude',
      render: (value) => value.toFixed(6),
    },
    {
      title: '中心经度',
      dataIndex: 'center_longitude',
      key: 'center_longitude',
      render: (value) => value.toFixed(6),
    },
    {
      title: '最长流路(m)',
      dataIndex: 'longest_flow_path',
      key: 'longest_flow_path',
      render: (value) => value.toFixed(2),
    },
    {
      title: '周长(m)',
      dataIndex: 'perimeter',
      key: 'perimeter',
      render: (value) => value.toFixed(2),
    },
    {
      title: '河道顶宽(m)',
      dataIndex: 'channel_top_width',
      key: 'channel_top_width',
      render: (value) => value.toFixed(2),
    },
    {
      title: '主河道坡度(%)',
      dataIndex: 'main_channel_slope',
      key: 'main_channel_slope',
      render: (value) => value.toFixed(2),
    },
    {
      title: '河道深度(m)',
      dataIndex: 'channel_depth',
      key: 'channel_depth',
      render: (value) => value.toFixed(2),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这条记录吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="text" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const waterQualityColumns = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: '锑浓度',
      dataIndex: 'antimony_concentration',
      key: 'antimony_concentration',
      render: (value) => value.toFixed(6),
    },
    {
      title: '氨氮',
      dataIndex: 'ammonia_nitrogen',
      key: 'ammonia_nitrogen',
      render: (value) => value.toFixed(6),
    },
    {
      title: '总氮',
      dataIndex: 'total_nitrogen',
      key: 'total_nitrogen',
      render: (value) => value.toFixed(6),
    },
    {
      title: '总磷',
      dataIndex: 'total_phosphorus',
      key: 'total_phosphorus',
      render: (value) => value.toFixed(6),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditWaterQuality(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这条记录吗？"
            onConfirm={() => handleDeleteWaterQuality(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="text" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const meteorologicalColumns = [
    {
      title: '站点名称',
      dataIndex: 'station_name',
      key: 'station_name',
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: '海拔(m)',
      dataIndex: 'altitude',
      key: 'altitude',
      render: (value) => value.toFixed(2),
    },
    {
      title: '平均相对湿度(%)',
      dataIndex: 'avg_relative_humidity',
      key: 'avg_relative_humidity',
      render: (value) => value.toFixed(2),
    },
    {
      title: '城市',
      dataIndex: 'city',
      key: 'city',
    },
    {
      title: '纬度',
      dataIndex: 'latitude',
      key: 'latitude',
      render: (value) => value.toFixed(4),
    },
    {
      title: '站点编号',
      dataIndex: 'station_code',
      key: 'station_code',
    },
    {
      title: '平均风速(m/s)',
      dataIndex: 'avg_wind_speed',
      key: 'avg_wind_speed',
      render: (value) => value.toFixed(2),
    },
    {
      title: '降水量(mm)',
      dataIndex: 'precipitation',
      key: 'precipitation',
      render: (value) => value.toFixed(2),
    },
    {
      title: '日照时数(h)',
      dataIndex: 'sunshine_hours',
      key: 'sunshine_hours',
      render: (value) => value.toFixed(2),
    },
    {
      title: '省份',
      dataIndex: 'province',
      key: 'province',
    },
    {
      title: '最低温度(℃)',
      dataIndex: 'min_temp',
      key: 'min_temp',
      render: (value) => value.toFixed(2),
    },
    {
      title: '最高温度(℃)',
      dataIndex: 'max_temp',
      key: 'max_temp',
      render: (value) => value.toFixed(2),
    },
    {
      title: '经度',
      dataIndex: 'longitude',
      key: 'longitude',
      render: (value) => value.toFixed(4),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditMeteorological(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这条记录吗？"
            onConfirm={() => handleDeleteMeteorological(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="text" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const fetchAttributesData = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8080/api/subwatershed_attributes/list');
      if (!response.ok) {
        throw new Error('网络请求失败');
      }
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('获取数据失败:', error);
      message.error('获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchWaterQualityData = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8080/api/subwatershed_value/list');
      if (!response.ok) {
        throw new Error('网络请求失败');
      }
      const result = await response.json();
      setWaterQualityData(result);
    } catch (error) {
      console.error('获取水质数据失败:', error);
      message.error('获取水质数据失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchMeteorologicalData = async (station) => {
    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:8080/api/meteorological_data_${station}/list`);
      if (!response.ok) {
        throw new Error('获取数据失败');
      }
      const result = await response.json();
      setMeteorologicalData(prev => ({
        ...prev,
        [station]: result
      }));
    } catch (error) {
      console.error('获取气象数据失败:', error);
      message.error('获取气象数据失败');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record) => {
    setEditingItem(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleEditWaterQuality = (record) => {
    setEditingItem(record);
    form.setFieldsValue({
      ...record,
      date: dayjs(record.date),
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8080/api/subwatershed_attributes/delete/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('删除失败');
      }
      message.success('删除成功');
      fetchAttributesData();
    } catch (error) {
      console.error('删除失败:', error);
      message.error('删除失败');
    }
  };

  const handleDeleteWaterQuality = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8080/api/subwatershed_value/delete/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('删除失败');
      }
      message.success('删除成功');
      fetchWaterQualityData();
    } catch (error) {
      console.error('删除失败:', error);
      message.error('删除失败');
    }
  };

  const handleEditMeteorological = (record) => {
    setEditingItem(record);
    form.setFieldsValue({
      ...record,
      date: dayjs(record.date),
    });
    setModalVisible(true);
  };

  const handleDeleteMeteorological = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8080/api/meteorological_data_${activeMeteorologicalTab}/delete/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('删除失败');
      }
      message.success('删除成功');
      fetchMeteorologicalData(activeMeteorologicalTab);
    } catch (error) {
      console.error('删除失败:', error);
      message.error('删除失败');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (activeTab === 'attributes') {
        if (editingItem) {
          const response = await fetch('http://127.0.0.1:8080/api/subwatershed_attributes/update', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...editingItem, ...values }),
          });
          if (!response.ok) {
            throw new Error('更新失败');
          }
          message.success('更新成功');
        } else {
          const response = await fetch('http://127.0.0.1:8080/api/subwatershed_attributes/add', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
          });
          if (!response.ok) {
            throw new Error('新增失败');
          }
          message.success('新增成功');
        }
        fetchAttributesData();
      } else if (activeTab === 'waterQuality') {
        const submitData = {
          ...values,
          date: values.date.format('YYYY-MM-DD'),
        };
        if (editingItem) {
          const response = await fetch('http://127.0.0.1:8080/api/subwatershed_value/update', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...editingItem, ...submitData }),
          });
          if (!response.ok) {
            throw new Error('更新失败');
          }
          message.success('更新成功');
        } else {
          const response = await fetch('http://127.0.0.1:8080/api/subwatershed_value/add', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(submitData),
          });
          if (!response.ok) {
            throw new Error('新增失败');
          }
          message.success('新增成功');
        }
        fetchWaterQualityData();
      } else if (activeTab === 'meteorological') {
        const submitData = {
          ...values,
          date: values.date.format('YYYY-MM-DD'),
        };
        if (editingItem) {
          const response = await fetch(`http://127.0.0.1:8080/api/meteorological_data_${activeMeteorologicalTab}/update`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...editingItem, ...submitData }),
          });
          if (!response.ok) {
            throw new Error('更新失败');
          }
          message.success('更新成功');
        } else {
          const response = await fetch(`http://127.0.0.1:8080/api/meteorological_data_${activeMeteorologicalTab}/add`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(submitData),
          });
          if (!response.ok) {
            throw new Error('新增失败');
          }
          message.success('新增成功');
        }
        fetchMeteorologicalData(activeMeteorologicalTab);
      }
      setModalVisible(false);
      form.resetFields();
      setEditingItem(null);
    } catch (error) {
      console.error('操作失败:', error);
      message.error('操作失败');
    }
  };

  useEffect(() => {
    if (location.pathname === '/remote-sensing/water-quality') {
      fetchAttributesData();
      fetchWaterQualityData();
    } else if (location.pathname === '/remote-sensing/meteorological-data') {
      fetchMeteorologicalData(activeMeteorologicalTab);
    }
  }, [location.pathname, activeMeteorologicalTab]);

  if (location.pathname !== '/remote-sensing/water-quality' && location.pathname !== '/remote-sensing/meteorological-data') {
    return null;
  }

  const renderForm = () => {
    if (activeTab === 'attributes') {
      return (
        <>
          <Form.Item
            name="area"
            label="面积(km²)"
            rules={[{ required: true, message: '请输入面积' }]}
          >
            <Input type="number" step="0.01" />
          </Form.Item>
          <Form.Item
            name="center_latitude"
            label="中心纬度"
            rules={[{ required: true, message: '请输入中心纬度' }]}
          >
            <Input type="number" step="0.000001" />
          </Form.Item>
          <Form.Item
            name="center_longitude"
            label="中心经度"
            rules={[{ required: true, message: '请输入中心经度' }]}
          >
            <Input type="number" step="0.000001" />
          </Form.Item>
          <Form.Item
            name="longest_flow_path"
            label="最长流路(m)"
            rules={[{ required: true, message: '请输入最长流路' }]}
          >
            <Input type="number" step="0.01" />
          </Form.Item>
          <Form.Item
            name="perimeter"
            label="周长(m)"
            rules={[{ required: true, message: '请输入周长' }]}
          >
            <Input type="number" step="0.01" />
          </Form.Item>
          <Form.Item
            name="channel_top_width"
            label="河道顶宽(m)"
            rules={[{ required: true, message: '请输入河道顶宽' }]}
          >
            <Input type="number" step="0.01" />
          </Form.Item>
          <Form.Item
            name="main_channel_slope"
            label="主河道坡度(%)"
            rules={[{ required: true, message: '请输入主河道坡度' }]}
          >
            <Input type="number" step="0.01" />
          </Form.Item>
          <Form.Item
            name="channel_depth"
            label="河道深度(m)"
            rules={[{ required: true, message: '请输入河道深度' }]}
          >
            <Input type="number" step="0.01" />
          </Form.Item>
        </>
      );
    } else if (activeTab === 'waterQuality') {
      return (
        <>
          <Form.Item
            name="date"
            label="日期"
            rules={[{ required: true, message: '请选择日期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="antimony_concentration"
            label="锑浓度"
            rules={[{ required: true, message: '请输入锑浓度' }]}
          >
            <Input type="number" step="0.000001" />
          </Form.Item>
          <Form.Item
            name="ammonia_nitrogen"
            label="氨氮"
            rules={[{ required: true, message: '请输入氨氮' }]}
          >
            <Input type="number" step="0.000001" />
          </Form.Item>
          <Form.Item
            name="total_nitrogen"
            label="总氮"
            rules={[{ required: true, message: '请输入总氮' }]}
          >
            <Input type="number" step="0.000001" />
          </Form.Item>
          <Form.Item
            name="total_phosphorus"
            label="总磷"
            rules={[{ required: true, message: '请输入总磷' }]}
          >
            <Input type="number" step="0.000001" />
          </Form.Item>
        </>
      );
    }
  };

  const renderMeteorologicalForm = () => {
    return (
      <>
        <Form.Item
          name="station_name"
          label="站点名称"
          rules={[{ required: true, message: '请输入站点名称' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="date"
          label="日期"
          rules={[{ required: true, message: '请选择日期' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="altitude"
          label="海拔(m)"
          rules={[{ required: true, message: '请输入海拔' }]}
        >
          <InputNumber style={{ width: '100%' }} step={0.01} />
        </Form.Item>
        <Form.Item
          name="avg_relative_humidity"
          label="平均相对湿度(%)"
          rules={[{ required: true, message: '请输入平均相对湿度' }]}
        >
          <InputNumber style={{ width: '100%' }} step={0.01} />
        </Form.Item>
        <Form.Item
          name="city"
          label="城市"
          rules={[{ required: true, message: '请输入城市' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="latitude"
          label="纬度"
          rules={[{ required: true, message: '请输入纬度' }]}
        >
          <InputNumber style={{ width: '100%' }} step={0.0001} />
        </Form.Item>
        <Form.Item
          name="station_code"
          label="站点编号"
          rules={[{ required: true, message: '请输入站点编号' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="avg_wind_speed"
          label="平均风速(m/s)"
          rules={[{ required: true, message: '请输入平均风速' }]}
        >
          <InputNumber style={{ width: '100%' }} step={0.01} />
        </Form.Item>
        <Form.Item
          name="precipitation"
          label="降水量(mm)"
          rules={[{ required: true, message: '请输入降水量' }]}
        >
          <InputNumber style={{ width: '100%' }} step={0.01} />
        </Form.Item>
        <Form.Item
          name="sunshine_hours"
          label="日照时数(h)"
          rules={[{ required: true, message: '请输入日照时数' }]}
        >
          <InputNumber style={{ width: '100%' }} step={0.01} />
        </Form.Item>
        <Form.Item
          name="province"
          label="省份"
          rules={[{ required: true, message: '请输入省份' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="min_temp"
          label="最低温度(℃)"
          rules={[{ required: true, message: '请输入最低温度' }]}
        >
          <InputNumber style={{ width: '100%' }} step={0.01} />
        </Form.Item>
        <Form.Item
          name="max_temp"
          label="最高温度(℃)"
          rules={[{ required: true, message: '请输入最高温度' }]}
        >
          <InputNumber style={{ width: '100%' }} step={0.01} />
        </Form.Item>
        <Form.Item
          name="longitude"
          label="经度"
          rules={[{ required: true, message: '请输入经度' }]}
        >
          <InputNumber style={{ width: '100%' }} step={0.0001} />
        </Form.Item>
      </>
    );
  };

  if (location.pathname === '/remote-sensing/meteorological-data') {
    return (
      <div className={styles.remoteSensing}>
        <div className={styles.header}>
          <h2>气象数据</h2>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingItem(null);
              form.resetFields();
              setModalVisible(true);
            }}
          >
            添加
          </Button>
        </div>
        <Tabs activeKey={activeMeteorologicalTab} onChange={setActiveMeteorologicalTab}>
          <TabPane tab="丹凤" key="danfeng">
            <Table
              columns={meteorologicalColumns}
              dataSource={meteorologicalData.danfeng || []}
              rowKey="id"
              loading={loading}
              scroll={{ x: 2000 }}
              pagination={{
                defaultPageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条数据`,
              }}
            />
          </TabPane>
          <TabPane tab="蓝田" key="lantian">
            <Table
              columns={meteorologicalColumns}
              dataSource={meteorologicalData.lantian || []}
              rowKey="id"
              loading={loading}
              scroll={{ x: 2000 }}
              pagination={{
                defaultPageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条数据`,
              }}
            />
          </TabPane>
          <TabPane tab="洛南" key="luonan">
            <Table
              columns={meteorologicalColumns}
              dataSource={meteorologicalData.luonan || []}
              rowKey="id"
              loading={loading}
              scroll={{ x: 2000 }}
              pagination={{
                defaultPageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条数据`,
              }}
            />
          </TabPane>
          <TabPane tab="卢氏" key="lushi">
            <Table
              columns={meteorologicalColumns}
              dataSource={meteorologicalData.lushi || []}
              rowKey="id"
              loading={loading}
              scroll={{ x: 2000 }}
              pagination={{
                defaultPageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条数据`,
              }}
            />
          </TabPane>
          <TabPane tab="商南" key="shangnan">
            <Table
              columns={meteorologicalColumns}
              dataSource={meteorologicalData.shangnan || []}
              rowKey="id"
              loading={loading}
              scroll={{ x: 2000 }}
              pagination={{
                defaultPageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条数据`,
              }}
            />
          </TabPane>
          <TabPane tab="商县" key="shangxian">
            <Table
              columns={meteorologicalColumns}
              dataSource={meteorologicalData.shangxian || []}
              rowKey="id"
              loading={loading}
              scroll={{ x: 2000 }}
              pagination={{
                defaultPageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条数据`,
              }}
            />
          </TabPane>
          <TabPane tab="山阳" key="shanyang">
            <Table
              columns={meteorologicalColumns}
              dataSource={meteorologicalData.shanyang || []}
              rowKey="id"
              loading={loading}
              scroll={{ x: 2000 }}
              pagination={{
                defaultPageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条数据`,
              }}
            />
          </TabPane>
          <TabPane tab="郧西" key="yunxi">
            <Table
              columns={meteorologicalColumns}
              dataSource={meteorologicalData.yunxi || []}
              rowKey="id"
              loading={loading}
              scroll={{ x: 2000 }}
              pagination={{
                defaultPageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条数据`,
              }}
            />
          </TabPane>
          <TabPane tab="柞水" key="zhashui">
            <Table
              columns={meteorologicalColumns}
              dataSource={meteorologicalData.zhashui || []}
              rowKey="id"
              loading={loading}
              scroll={{ x: 2000 }}
              pagination={{
                defaultPageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条数据`,
              }}
            />
          </TabPane>
        </Tabs>
        <Modal
          title={editingItem ? '编辑' : '添加'}
          open={modalVisible}
          onOk={handleModalOk}
          onCancel={() => {
            setModalVisible(false);
            form.resetFields();
            setEditingItem(null);
          }}
          destroyOnClose
          width={800}
        >
          <Form form={form} layout="vertical">
            {renderMeteorologicalForm()}
          </Form>
        </Modal>
      </div>
    );
  }

  return (
    <div className={styles.remoteSensing}>
      <div className={styles.header}>
        <h2>遥感水质检测数据</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingItem(null);
            form.resetFields();
            setModalVisible(true);
          }}
        >
          添加
        </Button>
      </div>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="子流域属性" key="attributes">
          <Table
            columns={attributesColumns}
            dataSource={data}
            rowKey="id"
            loading={loading}
            scroll={{ x: 1500 }}
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条数据`,
            }}
          />
        </TabPane>
        <TabPane tab="水质检测数据" key="waterQuality">
          <Table
            columns={waterQualityColumns}
            dataSource={waterQualityData}
            rowKey="id"
            loading={loading}
            scroll={{ x: 1500 }}
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条数据`,
            }}
          />
        </TabPane>
      </Tabs>
      <Modal
        title={editingItem ? '编辑' : '添加'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setEditingItem(null);
        }}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          {renderForm()}
        </Form>
      </Modal>
    </div>
  );
};

export default RemoteSensing; 