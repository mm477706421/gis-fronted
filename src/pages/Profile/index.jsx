import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, message, Upload, Avatar } from 'antd';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';
import styles from './index.css';

const Profile = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      // TODO: 调用获取用户信息API
      const mockUser = {
        username: 'admin',
        name: '管理员',
        email: 'admin@example.com',
        phone: '13800138000',
        department: '技术部',
        position: '系统管理员',
      };
      form.setFieldsValue(mockUser);
    } catch (error) {
      message.error('获取用户信息失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // TODO: 调用更新用户信息API
      message.success('个人信息更新成功');
    } catch (error) {
      message.error('更新失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (info) => {
    if (info.file.status === 'done') {
      // TODO: 处理头像上传成功后的逻辑
      setAvatarUrl(info.file.response.url);
      message.success('头像上传成功');
    }
  };

  return (
    <div className={styles.profile}>
      <Card title="个人信息" loading={loading}>
        <div className={styles.avatarSection}>
          <Avatar
            size={100}
            icon={<UserOutlined />}
            src={avatarUrl}
            className={styles.avatar}
          />
          <Upload
            name="avatar"
            showUploadList={false}
            onChange={handleAvatarChange}
            // TODO: 配置上传地址
            action="/api/upload"
          >
            <Button icon={<UploadOutlined />}>更换头像</Button>
          </Upload>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className={styles.form}
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="手机号"
            rules={[
              { required: true, message: '请输入手机号' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' },
            ]}
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
            name="position"
            label="职位"
            rules={[{ required: true, message: '请输入职位' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              保存修改
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Profile; 