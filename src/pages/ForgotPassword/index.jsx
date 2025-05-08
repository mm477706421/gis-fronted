import React, { useState } from 'react';
import { Form, Input, Button, message, Steps } from 'antd';
import { UserOutlined, LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './index.css';

const { Step } = Steps;

const ForgotPassword = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [verificationSent, setVerificationSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const steps = [
    {
      title: '验证账号',
      content: (
        <Form.Item
          name="username"
          rules={[{ required: true, message: '请输入用户名！' }]}
        >
          <Input
            prefix={<UserOutlined className="input-icon" />}
            placeholder="请输入用户名"
            size="large"
          />
        </Form.Item>
      ),
    },
    {
      title: '安全验证',
      content: (
        <>
          <Form.Item
            name="verificationCode"
            rules={[{ required: true, message: '请输入验证码！' }]}
          >
            <div className="verification-code-container">
              <Input
                prefix={<SafetyCertificateOutlined className="input-icon" />}
                placeholder="请输入验证码"
                size="large"
              />
              <Button
                className="send-code-button"
                disabled={countdown > 0}
                onClick={() => {
                  setVerificationSent(true);
                  setCountdown(60);
                  const timer = setInterval(() => {
                    setCountdown((prev) => {
                      if (prev <= 1) {
                        clearInterval(timer);
                        return 0;
                      }
                      return prev - 1;
                    });
                  }, 1000);
                  message.success('验证码已发送');
                }}
              >
                {countdown > 0 ? `${countdown}秒后重试` : '获取验证码'}
              </Button>
            </div>
          </Form.Item>
        </>
      ),
    },
    {
      title: '重置密码',
      content: (
        <>
          <Form.Item
            name="newPassword"
            rules={[
              { required: true, message: '请输入新密码！' },
              { min: 6, message: '密码长度不能小于6位！' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="input-icon" />}
              placeholder="请输入新密码"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            rules={[
              { required: true, message: '请确认新密码！' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致！'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="input-icon" />}
              placeholder="请确认新密码"
              size="large"
            />
          </Form.Item>
        </>
      ),
    },
  ];

  const onFinish = async () => {
    try {
      const values = await form.validateFields();
      if (current < steps.length - 1) {
        setCurrent(current + 1);
      } else {
        message.success('密码重置成功！');
        navigate('/login');
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-content">
        <div className="forgot-password-left">
          <img src="/login.jpg" alt="重置密码插图" className="forgot-password-illustration" />
        </div>
        <div className="forgot-password-right">
          <div className="forgot-password-form-container">
            <h1 className="forgot-password-title">重置密码</h1>
            <Steps current={current} className="forgot-password-steps">
              {steps.map(item => (
                <Step key={item.title} title={item.title} />
              ))}
            </Steps>
            <Form
              form={form}
              name="forgot-password"
              onFinish={onFinish}
              autoComplete="off"
              className="forgot-password-form"
            >
              {steps[current].content}
              <Form.Item>
                <Button type="primary" htmlType="submit" block className="submit-button">
                  {current < steps.length - 1 ? '下一步' : '提交'}
                </Button>
                {current > 0 && (
                  <Button
                    style={{ marginTop: 12 }}
                    block
                    onClick={() => setCurrent(current - 1)}
                  >
                    上一步
                  </Button>
                )}
              </Form.Item>
            </Form>
            <div className="forgot-password-footer">
              <a href="/login" className="back-to-login">返回登录</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 