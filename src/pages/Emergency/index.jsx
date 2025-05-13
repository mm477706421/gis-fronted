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
  const [data, setData] = useState([]);

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
      title: '检查组',
      dataIndex: 'inspection_team',
      key: 'inspection_team',
    },
    {
      title: '组长',
      dataIndex: 'group_leader',
      key: 'group_leader',
    },
    {
      title: '技术组',
      dataIndex: 'technical_team',
      key: 'technical_team',
    },
    {
      title: '人员属性',
      dataIndex: 'personnel_attribute',
      key: 'personnel_attribute',
    },
    {
      title: '联系方式',
      dataIndex: 'contact_information',
      key: 'contact_information',
    },
    {
      title: '人员姓名',
      dataIndex: 'personnel',
      key: 'personnel',
    },
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: '执法组',
      dataIndex: 'enforcement_team',
      key: 'enforcement_team',
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
      const response = await fetch(`http://127.0.0.1:8080/api/emergency_personnel_management/delete/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('删除失败');
      }
      message.success('删除成功');
      fetchData();
    } catch (error) {
      console.error('删除失败:', error);
      message.error('删除失败');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (activeTab === 'personnel') {
        if (editingItem) {
          const response = await fetch('http://127.0.0.1:8080/api/emergency_personnel_management/update', {
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
          const response = await fetch('http://127.0.0.1:8080/api/emergency_personnel_management/add', {
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
      } else {
        // 其他标签页的处理逻辑保持不变
        message.success(editingItem ? '更新成功' : '创建成功');
      }
      setModalVisible(false);
      form.resetFields();
      setEditingItem(null);
      fetchData();
    } catch (error) {
      console.error('操作失败:', error);
      message.error('操作失败');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'personnel') {
        const response = await fetch('http://127.0.0.1:8080/api/emergency_personnel_management/list');
        if (!response.ok) {
          throw new Error('获取数据失败');
        }
        const result = await response.json();
        setData(result);
      } else {
        // 其他标签页的模拟数据保持不变
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
        };
        setData(mockData[activeTab] || []);
      }
    } catch (error) {
      console.error('获取数据失败:', error);
      message.error('获取数据失败');
    } finally {
      setLoading(false);
    }
  };

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
          onClick={() => {
            setEditingItem(null);
            form.resetFields();
            setModalVisible(true);
          }}
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
                name="inspection_team"
                label="检查组"
                rules={[{ required: true, message: '请输入检查组' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="group_leader"
                label="组长"
                rules={[{ required: true, message: '请输入组长' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="technical_team"
                label="技术组"
                rules={[{ required: true, message: '请输入技术组' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="personnel_attribute"
                label="人员属性"
                rules={[{ required: true, message: '请选择人员属性' }]}
              >
                <Select>
                  <Option value="全职">全职</Option>
                  <Option value="兼职">兼职</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="contact_information"
                label="联系方式"
                rules={[{ required: true, message: '请输入联系方式' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="personnel"
                label="人员姓名"
                rules={[{ required: true, message: '请输入人员姓名' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="department"
                label="部门"
                rules={[{ required: true, message: '请输入部门' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="enforcement_team"
                label="执法组"
                rules={[{ required: true, message: '请输入执法组' }]}
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