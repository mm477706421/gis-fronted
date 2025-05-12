import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Table, Button, Modal, Form, Input, Space, Popconfirm, message } from 'antd';

const columnsDef = [
  { title: '站点名称', dataIndex: 'station_name', key: 'stationName' },
  { title: '经度', dataIndex: 'Longitude', key: 'longitude' },
  { title: '纬度', dataIndex: 'latitude', key: 'latitude' },
  { title: '监测方式', dataIndex: 'manner', key: 'manner' },
  { title: '监测类型', dataIndex: 'quality', key: 'quality' },
  { title: '监测频率', dataIndex: 'frequency', key: 'frequency' },
];

// 加药点表格字段
const medicationColumnsDef = [
  { title: '日期', dataIndex: 'date', key: 'date' },
  { title: '河流名称', dataIndex: 'river_name', key: 'river_name' },
  { title: '上游入流量', dataIndex: 'upstream_inflow', key: 'upstream_inflow' },
  { title: '水库库容', dataIndex: 'reservoir_capacity', key: 'reservoir_capacity' },
  { title: '固体投加量', dataIndex: 'solid_additive_usage', key: 'solid_additive_usage' },
  { title: '二级站点浓度', dataIndex: 'secondary_station_concentration', key: 'secondary_station_concentration' },
  { title: '出库流量', dataIndex: 'discharge', key: 'discharge' },
  { title: '加药点名称', dataIndex: 'add_point_name', key: 'add_point_name' },
  { title: '是否淹没', dataIndex: 'is_flooded', key: 'is_flooded', render: v => v ? '是' : '否' },
  { title: '坝下浓度', dataIndex: 'dam_down_concentration', key: 'dam_down_concentration' },
  { title: '液体投加量', dataIndex: 'liquid_additive_volume', key: 'liquid_additive_volume' },
];

// 应急人员管理表格字段（与接口字段一致）
const personnelColumnsDef = [
  { title: '检查组', dataIndex: 'inspection_team', key: 'inspection_team' },
  { title: '组长', dataIndex: 'group_leader', key: 'group_leader' },
  { title: '技术组', dataIndex: 'technical_team', key: 'technical_team' },
  { title: '人员属性', dataIndex: 'personnel_attribute', key: 'personnel_attribute' },
  { title: '联系方式', dataIndex: 'contact_information', key: 'contact_information' },
  { title: '人员姓名', dataIndex: 'personnel', key: 'personnel' },
  { title: '部门', dataIndex: 'department', key: 'department' },
  { title: '执法组', dataIndex: 'enforcement_team', key: 'enforcement_team' },
];

const EmergencyFrame = () => {
  const { type } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  // 获取数据
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8080/api/station_message/list');
      const d = await res.json();
      console.log("EmergencyFrame", d);
      setData(d);
    } catch (e) {
      message.error('获取数据失败');
    }
    setLoading(false);
  };

  // 获取加药点数据
  const fetchMedicationData = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8080/api/dosing_point_data/list');
      const d = await res.json();
      setData(d);
    } catch (e) {
      message.error('获取加药点数据失败');
    }
    setLoading(false);
  };

  // 获取应急人员管理数据
  const fetchPersonnelData = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8080/api/emergency_personnel_management/list');
      const d = await res.json();
      setData(d);
    } catch (e) {
      message.error('获取应急人员数据失败');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (type === 'site') {
      fetchData();
    } 
    else if (type === 'medication') {
      fetchMedicationData();
    }
    else if (type === 'personnel') {
      fetchPersonnelData();
    }
  }, [type]);

  // 新增
  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 编辑
  const handleEdit = (record) => {
    setEditing(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  // 删除
  const handleDelete = async (id) => {
    try {
      await fetch(`http://127.0.0.1:8080/api/station_message/delete/${id}`, {
        method: 'DELETE',
      });
      message.success('删除成功');
      fetchData();
    } catch {
      message.error('删除失败');
    }
  };

  // 新增加药点
  const handleAddMedication = () => {
    setEditing(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 编辑加药点
  const handleEditMedication = (record) => {
    setEditing(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  // 删除加药点
  const handleDeleteMedication = async (id) => {
    try {
      await fetch(`http://127.0.0.1:8080/api/dosing_point_data/delete/${id}`, {
        method: 'DELETE',
      });
      message.success('删除成功');
      fetchMedicationData();
    } catch {
      message.error('删除失败');
    }
  };

  // 新增应急人员
  const handleAddPersonnel = () => {
    setEditing(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 编辑应急人员
  const handleEditPersonnel = (record) => {
    setEditing(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  // 删除应急人员
  const handleDeletePersonnel = async (id) => {
    try {
      await fetch(`http://127.0.0.1:8080/api/emergency_personnel_management/delete/${id}`, {
        method: 'DELETE',
      });
      message.success('删除成功');
      fetchPersonnelData();
    } catch {
      message.error('删除失败');
    }
  };

  // 提交表单
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editing) {
        // 编辑，调用后端接口
        try {
          await fetch('http://127.0.0.1:8080/api/station_message/update', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...editing, ...values }),
          });
          message.success('编辑成功');
          setModalVisible(false);
          fetchData();
        } catch {
          message.error('编辑失败');
        }
      } else {
        // 新增
        try {
          await fetch('http://127.0.0.1:8080/api/station_message/add', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
          });
          message.success('新增成功');
          setModalVisible(false);
          fetchData();
        } catch {
          message.error('新增失败');
        }
      }
    } catch {}
  };

  // 提交加药点表单
  const handleOkMedication = async () => {
    try {
      const values = await form.validateFields();
      if (editing) {
        // 编辑
        try {
          await fetch('http://127.0.0.1:8080/api/dosing_point_data/update', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...editing, ...values }),
          });
          message.success('编辑成功');
          setModalVisible(false);
          fetchMedicationData();
        } catch {
          message.error('编辑失败');
        }
      } else {
        // 新增
        try {
          await fetch('http://127.0.0.1:8080/api/dosing_point_data/add', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
          });
          message.success('新增成功');
          setModalVisible(false);
          fetchMedicationData();
        } catch {
          message.error('新增失败');
        }
      }
    } catch {}
  };

  // 提交应急人员表单
  const handleOkPersonnel = async () => {
    try {
      const values = await form.validateFields();
      if (editing) {
        // 编辑
        try {
          await fetch('http://127.0.0.1:8080/api/emergency_personnel_management/update', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...editing, ...values }),
          });
          message.success('编辑成功');
          setModalVisible(false);
          fetchPersonnelData();
        } catch {
          message.error('编辑失败');
        }
      } else {
        // 新增
        try {
          await fetch('http://127.0.0.1:8080/api/emergency_personnel_management/add', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
          });
          message.success('新增成功');
          setModalVisible(false);
          fetchPersonnelData();
        } catch {
          message.error('新增失败');
        }
      }
    } catch {}
  };

  if (type !== 'site' && type !== 'medication' && type !== 'personnel') {
    return (
      <div style={{
        minHeight: 400,
        background: '#fff',
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        padding: 32,
        textAlign: 'center',
        color: '#888',
        fontSize: 20
      }}>
        这里是应急管理信息展示的通用框架页面<br/>
        （后续可根据 type 参数加载不同内容）
      </div>
    );
  }

  // 表格列
  const columns = [
    ...columnsDef,
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => handleEdit(record)}>编辑</Button>
          <Popconfirm title="确定删除吗？" onConfirm={() => handleDelete(record.id)}>
            <Button size="small" danger>删除</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  if (type === 'medication') {
    const medicationColumns = [
      ...medicationColumnsDef,
      {
        title: '操作',
        key: 'action',
        render: (_, record) => (
          <Space>
            <Button size="small" onClick={() => handleEditMedication(record)}>编辑</Button>
            <Popconfirm title="确定删除吗？" onConfirm={() => handleDeleteMedication(record.id)}>
              <Button size="small" danger>删除</Button>
            </Popconfirm>
          </Space>
        )
      }
    ];
    return (
      <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', padding: 32 }}>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 18, fontWeight: 500 }}>加药点基本信息</span>
          <Button type="primary" onClick={handleAddMedication}>新增加药点</Button>
        </div>
        <Table
          rowKey="id"
          columns={medicationColumns}
          dataSource={data}
          loading={loading}
          bordered
          pagination={{ pageSize: 10 }}
        />
        <Modal
          title={editing ? '编辑加药点' : '新增加药点'}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          onOk={handleOkMedication}
          destroyOnClose
        >
          <Form form={form} layout="vertical">
            <Form.Item name="date" label="日期" rules={[{ required: true, message: '请输入日期' }]}> <Input /> </Form.Item>
            <Form.Item name="river_name" label="河流名称" rules={[{ required: true, message: '请输入河流名称' }]}> <Input /> </Form.Item>
            <Form.Item name="upstream_inflow" label="上游入流量" rules={[{ required: true, message: '请输入上游入流量' }]}> <Input /> </Form.Item>
            <Form.Item name="reservoir_capacity" label="水库库容" rules={[{ required: true, message: '请输入水库库容' }]}> <Input /> </Form.Item>
            <Form.Item name="solid_additive_usage" label="固体投加量" rules={[{ required: true, message: '请输入固体投加量' }]}> <Input /> </Form.Item>
            <Form.Item name="secondary_station_concentration" label="二级站点浓度" rules={[{ required: true, message: '请输入二级站点浓度' }]}> <Input /> </Form.Item>
            <Form.Item name="discharge" label="出库流量" rules={[{ required: true, message: '请输入出库流量' }]}> <Input /> </Form.Item>
            <Form.Item name="add_point_name" label="加药点名称" rules={[{ required: true, message: '请输入加药点名称' }]}> <Input /> </Form.Item>
            <Form.Item name="is_flooded" label="是否淹没" rules={[{ required: true, message: '请输入是否淹没' }]}> <Input /> </Form.Item>
            <Form.Item name="dam_down_concentration" label="坝下浓度" rules={[{ required: true, message: '请输入坝下浓度' }]}> <Input /> </Form.Item>
            <Form.Item name="liquid_additive_volume" label="液体投加量" rules={[{ required: true, message: '请输入液体投加量' }]}> <Input /> </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }

  if (type === 'personnel') {
    const personnelColumns = [
      ...personnelColumnsDef,
      {
        title: '操作',
        key: 'action',
        render: (_, record) => (
          <Space>
            <Button size="small" onClick={() => handleEditPersonnel(record)}>编辑</Button>
            <Popconfirm title="确定删除吗？" onConfirm={() => handleDeletePersonnel(record.id)}>
              <Button size="small" danger>删除</Button>
            </Popconfirm>
          </Space>
        )
      }
    ];
    return (
      <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', padding: 32 }}>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 18, fontWeight: 500 }}>应急人员管理</span>
          <Button type="primary" onClick={handleAddPersonnel}>新增应急人员</Button>
        </div>
        <Table
          rowKey="id"
          columns={personnelColumns}
          dataSource={data}
          loading={loading}
          bordered
          pagination={{ pageSize: 10 }}
        />
        <Modal
          title={editing ? '编辑应急人员' : '新增应急人员'}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          onOk={handleOkPersonnel}
          destroyOnClose
        >
          <Form form={form} layout="vertical">
            <Form.Item name="inspection_team" label="检查组" rules={[{ required: true, message: '请输入检查组' }]}> <Input /> </Form.Item>
            <Form.Item name="group_leader" label="组长" rules={[{ required: true, message: '请输入组长' }]}> <Input /> </Form.Item>
            <Form.Item name="technical_team" label="技术组" rules={[{ required: true, message: '请输入技术组' }]}> <Input /> </Form.Item>
            <Form.Item name="personnel_attribute" label="人员属性" rules={[{ required: true, message: '请输入人员属性' }]}> <Input /> </Form.Item>
            <Form.Item name="contact_information" label="联系方式" rules={[{ required: true, message: '请输入联系方式' }]}> <Input /> </Form.Item>
            <Form.Item name="personnel" label="人员姓名" rules={[{ required: true, message: '请输入人员姓名' }]}> <Input /> </Form.Item>
            <Form.Item name="department" label="部门" rules={[{ required: true, message: '请输入部门' }]}> <Input /> </Form.Item>
            <Form.Item name="enforcement_team" label="执法组" rules={[{ required: true, message: '请输入执法组' }]}> <Input /> </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }

  return (
    <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', padding: 32 }}>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 18, fontWeight: 500 }}>站点信息管理</span>
        <Button type="primary" onClick={handleAdd}>新增站点</Button>
      </div>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
        bordered
        pagination={{ pageSize: 10 }}
      />
      <Modal
        title={editing ? '编辑站点' : '新增站点'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleOk}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="station_name" label="站点名称" rules={[{ required: true, message: '请输入站点名称' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="Longitude" label="经度" rules={[{ required: true, message: '请输入经度' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="latitude" label="纬度" rules={[{ required: true, message: '请输入纬度' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="manner" label="监测方式" rules={[{ required: true, message: '请输入监测方式' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="quality" label="监测类型" rules={[{ required: true, message: '请输入监测类型' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="frequency" label="监测频率" rules={[{ required: true, message: '请输入监测频率' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EmergencyFrame; 