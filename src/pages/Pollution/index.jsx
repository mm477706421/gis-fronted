import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import styles from './index.css';

const { Option } = Select;

const PollutionManagement = () => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingItem, setEditingItem] = useState(null);

  const columns = [
    {
      title: '污染源名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '污染源类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: '主要污染物',
      dataIndex: 'pollutants',
      key: 'pollutants',
    },
    {
      title: '排放量',
      dataIndex: 'emission',
      key: 'emission',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span style={{ color: status === 'active' ? '#52c41a' : '#ff4d4f' }}>
          {status === 'active' ? '正常' : '异常'}
        </span>
      ),
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
      const mockData = [
        {
          id: 1,
          name: '污染源一',
          type: '工业废水',
          location: '位置1',
          pollutants: 'COD,氨氮',
          emission: '1000吨/天',
          status: 'active',
        },
        {
          id: 2,
          name: '污染源二',
          type: '生活污水',
          location: '位置2',
          pollutants: 'BOD,总磷',
          emission: '500吨/天',
          status: 'inactive',
        },
      ];
      setData(mockData);
    } catch (error) {
      message.error('获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className={styles.pollutionManagement}>
      <div className={styles.header}>
        <h2>污染源管理</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
        >
          添加污染源
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title={editingItem ? '编辑污染源' : '添加污染源'}
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
          <Form.Item
            name="name"
            label="污染源名称"
            rules={[{ required: true, message: '请输入污染源名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="type"
            label="污染源类型"
            rules={[{ required: true, message: '请选择污染源类型' }]}
          >
            <Select>
              <Option value="工业废水">工业废水</Option>
              <Option value="生活污水">生活污水</Option>
              <Option value="农业面源">农业面源</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="location"
            label="位置"
            rules={[{ required: true, message: '请输入位置' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="pollutants"
            label="主要污染物"
            rules={[{ required: true, message: '请输入主要污染物' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="emission"
            label="排放量"
            rules={[{ required: true, message: '请输入排放量' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select>
              <Option value="active">正常</Option>
              <Option value="inactive">异常</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PollutionManagement; 