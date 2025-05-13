import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, message, Popconfirm, Tabs } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Outlet } from 'react-router-dom';
import styles from './index.css';

const { Option } = Select;
const { TabPane } = Tabs;

const SourceManagement = () => {
  const [activeTab, setActiveTab] = useState('remote');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingItem, setEditingItem] = useState(null);

  const remoteColumns = [
    {
      title: '遥感信息',
      dataIndex: 'info',
      key: 'info',
    },
    {
      title: '溯源图像',
      dataIndex: 'image',
      key: 'image',
      render: (text) => (
        <a href={text} target="_blank" rel="noopener noreferrer">
          查看图像
        </a>
      ),
    },
    {
      title: '溯源信息',
      dataIndex: 'source',
      key: 'source',
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

  const fingerprintColumns = [
    {
      title: '图谱种类',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '水质指纹分析',
      dataIndex: 'analysis',
      key: 'analysis',
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

  const handleEdit = (item) => {
    setEditingItem(item);
    form.setFieldsValue(item);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      // TODO: 调用删除API
      message.success('删除成功');
      fetchData();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingItem) {
        // TODO: 调用更新API
        message.success('更新成功');
      } else {
        // TODO: 调用创建API
        message.success('创建成功');
      }
      setModalVisible(false);
      form.resetFields();
      setEditingItem(null);
      fetchData();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // TODO: 调用获取数据API
      const mockData = {
        remote: [
          {
            id: 1,
            info: '遥感信息1',
            image: 'http://example.com/image1.jpg',
            source: '溯源信息1',
          },
        ],
        fingerprint: [
          {
            id: 1,
            type: '图谱种类1',
            analysis: '水质指纹分析1',
          },
        ],
      };
      setData(mockData[activeTab] || []);
    } catch (error) {
      message.error('获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const getColumns = () => {
    switch (activeTab) {
      case 'remote':
        return remoteColumns;
      case 'fingerprint':
        return fingerprintColumns;
      default:
        return [];
    }
  };

  return (
    <div className={styles.sourceManagement}>
      <div className={styles.header}>
        <h2>指纹图谱</h2>
      </div>


      <Outlet />
      <Modal
        title={editingItem ? '编辑' : '添加'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setEditingItem(null);
        }}
      >
        <Form
          form={form}
          layout="vertical"
        >
          {activeTab === 'remote' && (
            <>
              <Form.Item
                name="info"
                label="遥感信息"
                rules={[{ required: true, message: '请输入遥感信息' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="image"
                label="溯源图像"
                rules={[{ required: true, message: '请输入图像URL' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="source"
                label="溯源信息"
                rules={[{ required: true, message: '请输入溯源信息' }]}
              >
                <Input />
              </Form.Item>
            </>
          )}
          {activeTab === 'fingerprint' && (
            <>
              <Form.Item
                name="type"
                label="图谱种类"
                rules={[{ required: true, message: '请输入图谱种类' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="analysis"
                label="水质指纹分析"
                rules={[{ required: true, message: '请输入水质指纹分析' }]}
              >
                <Input />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default SourceManagement; 