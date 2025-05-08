import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import './index.css';

const Login = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    // 这里添加实际的登录逻辑
    console.log('登录信息:', values);
    message.success('登录成功！');
    localStorage.setItem('token','temp')
    
    // 登录成功后的跳转逻辑
    window.location.href = "/gis"
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-left">
          <img src="/login.jpg" alt="登录插图" className="login-illustration" />
        </div>
        <div className="login-right">
          <div className="login-form-container">
            <h1 className="login-title">河流数据管理系统</h1>
            <Form
              form={form}
              name="login"
              onFinish={onFinish}
              autoComplete="off"
              size="large"
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: '请输入用户名！' }]}
              >
                <Input
                  prefix={<UserOutlined className="input-icon" />}
                  placeholder="用户名"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: '请输入密码！' }]}
              >
                <Input.Password
                  prefix={<LockOutlined className="input-icon" />}
                  placeholder="密码"
                  iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block className="login-button">
                  登录
                </Button>
              </Form.Item>

              <div className="login-footer">
                <Link to="/forgot-password" className="forgot-password">忘记密码</Link>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
