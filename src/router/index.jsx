import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import ForgotPassword from '../pages/ForgotPassword';
import MainLayout from '../pages/Layout';
import GISMap from '../pages/GIS';
import Settings from '../pages/Settings';
import UserManagement from '../pages/Users';
import Profile from '../pages/Profile';
import SourceManagement from '../pages/Source';
import debugConfig from '../config/debug';
import PollutionManagement from "../pages/Pollution";
import EmergencyManagement from "../pages/Emergency";
import MonitoringPage from "../pages/Monitoring";
import TrendAnalysis from "../pages/TrendAnalysis";
import ManualLHTFenceng from "../pages/ManualLHTFenceng";
import { createBrowserRouter } from 'react-router-dom';
import FingerprintPage from '../pages/Fingerprint';

const Router = () => {
  // 判断是否已登录或处于调试模式
  const isAuthenticated = () => {
    return debugConfig.skipLogin || localStorage.getItem('token');
  };

  // 保护路由组件
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  const router = createBrowserRouter([
    {
      path: '/',
      element: <MainLayout />,
      children: [
        {
          path: 'monitoring',
          element: <div>监测数据管理</div>
        },
        {
          path: 'manual-site:tableName',
          element: <MonitoringPage />
        },
        {
          path: 'auto-site:tableName',
          element: <MonitoringPage />
        },
        {
          path: 'pred-site:tableName',
          element: <MonitoringPage />
        },
        {
          path: 'fingerprint',
          element: <FingerprintPage />
        },
        {
          path: 'trend-analysis',
          element: <TrendAnalysis />
        }
      ]
    },
    {
      path: '/login',
      element: <Login />
    }
  ]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          isAuthenticated() ? <Navigate to="/" replace /> : <Login />
        } />

        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* 主布局路由 */}
        <Route path="/" element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          {/* 子路由 */}
          <Route index element={<Navigate to="/gis" replace />} />
          <Route path="gis" element={<GISMap />} />
          <Route path="monitoring" element={<div>监测数据管理</div>} />
          <Route path="manual-lht-fenceng" element={<ManualLHTFenceng />} />
          <Route path="auto-site/:stationId" element={<MonitoringPage />} />
          <Route path="manual-site/:stationId" element={<MonitoringPage />} />
          <Route path="pred-site/:stationId" element={<MonitoringPage />} />
          <Route path="trend-analysis" element={<TrendAnalysis />} />
          <Route path="prediction" element={<div>预测数据管理</div>} />
          <Route path="source" element={<SourceManagement />}>
            <Route path="fingerprint" element={<FingerprintPage />} />
            <Route path="fingerprint-db" element={<FingerprintPage />} />
            <Route path="fingerprint-analysis" element={<FingerprintPage />} />
            <Route path="fingerprint-type-1" element={<FingerprintPage />} />
            <Route path="fingerprint-type-2" element={<FingerprintPage />} />
            <Route path="fingerprint-type-3" element={<FingerprintPage />} />
          </Route>
          <Route path="pollution" element={<PollutionManagement />} />
          <Route path="report" element={<div>工作报告生成</div>} />
          <Route path="emergency" element={<EmergencyManagement />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
