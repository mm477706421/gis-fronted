import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, message, Popconfirm, Tabs } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import styles from './index.css';

const { Option } = Select;
const { TabPane } = Tabs;

const EmergencyManagement = () => {
  const [activeTab, setActiveTab] = useState('site');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingItem, setEditingItem] = useState(null);

  const siteColumns = [
    {
      title: '站点名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '站点类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: '负责人',
      dataIndex: 'manager',
      key: 'manager',
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
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

  const medicationColumns = [
    {
      title: '加药点名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '加药类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: '库存量',
      dataIndex: 'stock',
      key: 'stock',
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

  const personnelColumns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '职位',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '负责区域',
      dataIndex: 'area',
      key: 'area',
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
        site: [
          {
            id: 1,
            name: '站点一',
            type: '自动监测',
            location: '位置1',
            manager: '张三',
            phone: '13800138000',
          },
        ],
        medication: [
          {
            id: 1,
            name: '加药点一',
            type: '药剂A',
            location: '位置1',
            stock: '100kg',
          },
        ],
        personnel: [
          {
            id: 1,
            name: '李四',
            position: '应急组长',
            phone: '13800138001',
            area: '区域1',
          },
        ],
      };
      // 根据当前标签页设置数据
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
      case 'site':
        return siteColumns;
      case 'medication':
        return medicationColumns;
      case 'personnel':
        return personnelColumns;
      default:
        return [];
    }
  };

  return (
    <div className={styles.emergencyManagement}>
      <div className={styles.header}>
        <h2>应急管理</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
        >
          添加
        </Button>
      </div>

      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        <TabPane tab="站点基本信息" key="site">
          <Table
            columns={getColumns()}
            dataSource={data}
            rowKey="id"
            loading={loading}
          />
        </TabPane>
        <TabPane tab="加药点基本信息" key="medication">
          <Table
            columns={getColumns()}
            dataSource={data}
            rowKey="id"
            loading={loading}
          />
        </TabPane>
        <TabPane tab="应急人员管理" key="personnel">
          <Table
            columns={getColumns()}
            dataSource={data}
            rowKey="id"
            loading={loading}
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
      >
        <Form
          form={form}
          layout="vertical"
        >
          {activeTab === 'site' && (
            <>
              <Form.Item
                name="name"
                label="站点名称"
                rules={[{ required: true, message: '请输入站点名称' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="type"
                label="站点类型"
                rules={[{ required: true, message: '请选择站点类型' }]}
              >
                <Select>
                  <Option value="自动监测">自动监测</Option>
                  <Option value="手动监测">手动监测</Option>
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
                name="manager"
                label="负责人"
                rules={[{ required: true, message: '请输入负责人' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="phone"
                label="联系电话"
                rules={[{ required: true, message: '请输入联系电话' }]}
              >
                <Input />
              </Form.Item>
            </>
          )}
          {activeTab === 'medication' && (
            <>
              <Form.Item
                name="name"
                label="加药点名称"
                rules={[{ required: true, message: '请输入加药点名称' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="type"
                label="加药类型"
                rules={[{ required: true, message: '请选择加药类型' }]}
              >
                <Select>
                  <Option value="药剂A">药剂A</Option>
                  <Option value="药剂B">药剂B</Option>
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
                name="stock"
                label="库存量"
                rules={[{ required: true, message: '请输入库存量' }]}
              >
                <Input />
              </Form.Item>
            </>
          )}
          {activeTab === 'personnel' && (
            <>
              <Form.Item
                name="name"
                label="姓名"
                rules={[{ required: true, message: '请输入姓名' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="position"
                label="职位"
                rules={[{ required: true, message: '请输入职位' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="phone"
                label="联系电话"
                rules={[{ required: true, message: '请输入联系电话' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="area"
                label="负责区域"
                rules={[{ required: true, message: '请输入负责区域' }]}
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

export default EmergencyManagement; 