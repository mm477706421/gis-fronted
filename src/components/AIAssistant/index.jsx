import React, { useState, useRef, useEffect } from 'react';
import { Button, Modal, Input, message, Spin } from 'antd';
import { RobotOutlined, SendOutlined } from '@ant-design/icons';
import aiConfig from '../../config/ai';
import './index.css';

const { TextArea } = Input;

const AIAssistant = () => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({
    x: window.innerWidth - 150,
    y: window.innerHeight - 150
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'system', content: aiConfig.SYSTEM_PROMPT }
  ]);
  const buttonRef = useRef(null);
  const chatContainerRef = useRef(null);

  // 处理拖动开始
  const handleMouseDown = (e) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsDragging(true);
    }
  };

  // 处理拖动
  const handleMouseMove = (e) => {
    if (isDragging) {
      const newX = Math.min(Math.max(0, e.clientX - dragOffset.x), window.innerWidth - 120);
      const newY = Math.min(Math.max(0, e.clientY - dragOffset.y), window.innerHeight - 120);
      setPosition({ x: newX, y: newY });
    }
  };

  // 处理拖动结束
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 添加和移除事件监听器
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // 更新窗口大小时重新计算位置
  useEffect(() => {
    const handleResize = () => {
      setPosition({
        x: window.innerWidth - 200,
        y: window.innerHeight - 200
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 发送消息到 AI 接口
  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(`${aiConfig.BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${aiConfig.API_KEY}`,
        },
        body: JSON.stringify({
          model: aiConfig.MODEL,
          messages: [...messages, newMessage],
          max_tokens: aiConfig.MAX_TOKENS,
          temperature: aiConfig.TEMPERATURE,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `请求失败 (${response.status})`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message;
      setMessages(prev => [...prev, aiResponse]);

      // 滚动到底部
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    } catch (error) {
      console.error('AI 请求错误:', error);
      message.error(error.message || '请求失败，请稍后重试');
      // 将用户的消息从历史记录中移除
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        ref={buttonRef}
        type="primary"
        size="large"
        className="ai-assistant-button"
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          cursor: isDragging ? 'grabbing' : 'grab',
          zIndex: 1000,
          padding: 0,
          background: "url('https://static-answer.eol.cn/static/images/4482F4/jqr-zhen.png') no-repeat",

        }}
        onMouseDown={handleMouseDown}
        onClick={() => !isDragging && setVisible(true)}
      />

      <Modal
        title="GIS 智能助手"
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        width={800}
        className="ai-assistant-modal"
      >
        <div className="chat-container" ref={chatContainerRef}>
          {messages.filter(msg => msg.role !== 'system').map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.role === 'user' ? 'user' : 'assistant'}`}
            >
              <div className="message-content">{msg.content}</div>
            </div>
          ))}
          {loading && (
            <div className="message assistant">
              <Spin size="small" />
            </div>
          )}
        </div>

        <div className="input-container">
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="请输入您的问题..."
            autoSize={{ minRows: 2, maxRows: 4 }}
            onPressEnter={(e) => {
              if (!e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={sendMessage}
            loading={loading}
          >
            发送
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default AIAssistant; 