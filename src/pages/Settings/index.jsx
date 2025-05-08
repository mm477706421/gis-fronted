import React, { useState } from 'react';
import { Card, Form, Input, Button, Switch, Divider, message, Select } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import './index.css';

const { Option } = Select;

const Settings = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // 处理表单提交
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // 这里添加保存设置的逻辑
      console.log('保存设置:', values);
      message.success('设置已保存');
    } catch (error) {
      message.error('保存失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-page">
      <Card title="系统设置" className="settings-card">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            theme: 'light',
            language: 'zh_CN',
            notifications: true,
            mapStyle: 'normal',
          }}
        >
          <Divider orientation="left">界面设置</Divider>
          
          <Form.Item
            name="theme"
            label="主题模式"
          >
            <Select>
              <Option value="light">浅色主题</Option>
              <Option value="dark">深色主题</Option>
              <Option value="system">跟随系统</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="language"
            label="系统语言"
          >
            <Select>
              <Option value="zh_CN">简体中文</Option>
              <Option value="en_US">English</Option>
            </Select>
          </Form.Item>

          <Divider orientation="left">地图设置</Divider>

          <Form.Item
            name="mapStyle"
            label="默认地图样式"
          >
            <Select>
              <Option value="normal">标准地图</Option>
              <Option value="satellite">卫星地图</Option>
              <Option value="night">夜间模式</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="defaultZoom"
            label="默认缩放级别"
          >
            <Select>
              <Option value={5}>全国</Option>
              <Option value={8}>省级</Option>
              <Option value={11}>市级</Option>
              <Option value={13}>区县</Option>
            </Select>
          </Form.Item>

          <Divider orientation="left">消息通知</Divider>

          <Form.Item
            name="notifications"
            label="启用消息通知"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            name="email"
            label="通知邮箱"
            rules={[
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input placeholder="请输入接收通知的邮箱地址" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<SaveOutlined />}
            >
              保存设置
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Settings; 