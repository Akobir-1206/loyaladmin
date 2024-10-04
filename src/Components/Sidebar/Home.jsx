import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, Modal, theme } from 'antd';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import '../Sidebar/Home.css'
const { Header, Sider, Content } = Layout;

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal holatini boshqarish uchun state
  const navigate = useNavigate(); // Sahifa navigatsiyasi uchun hook
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Logoutni tasdiqlovchi Modalni boshqaruvchi funksiyalar
  const showModal = () => {
    setIsModalVisible(true);
    
  };

  const handleOk = () => {
    setIsModalVisible(false);
    localStorage.removeItem('tokenchik');
    navigate('/login');
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  

  return (
    <div
      style={{
        maxWidth: '100%',
        margin: '0 auto', // Layoutni gorizontal markazlash
        height: '100vh',  // To'liq ekran balandligini to'ldirish
      }}
    >
      <Layout style={{ minHeight: '100vh' }}> {/* Layout to'liq balandlikni qoplaydi */}
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="demo-logo-vertical" />
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['1']}
            items={[
              {
                key: '1',
                icon: <UserOutlined />,
                label: (<><NavLink to='/category'>Category</NavLink></>)
              },
              {
                key: '2',
                icon: <VideoCameraOutlined />,
                label: (<><NavLink to='/news'>News</NavLink></>)
              },
              {
                key: '3',
                icon: <UploadOutlined />,
                label: (<><NavLink to='/faqs'>Faqs</NavLink></>)
              },
              {
                key: '4',
                icon: <UploadOutlined />,
                label: (<><NavLink to='/services'>Services</NavLink></>)
              },
              {
                key: '5',
                icon: <UserOutlined />,
                label: (<><NavLink to='/blogs'>Blogs</NavLink></>)
              },
              {
                key: '6',
                icon: <SettingOutlined />,
                label: (<><NavLink to='/sources'>Sources</NavLink></>)
              },
            ]}
          />
        </Sider>
        <Layout>
          <Header
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0 16px',
              background: colorBgContainer,
            }}
          >
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />
            {/* Logout Button */}
            <Button
              type="primary"
              bodyStyle={{ backgroundColor: '#001f3f', color: '#fff' }}
              icon={<LogoutOutlined />}
              onClick={showModal}
              style={{
                marginRight: '10px', backgroundColor: '#001f3a'
              }}
            >
              Log Out
            </Button>
          </Header>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>

      {/* Log Outni tasdiqlovchi Modal */}
      <Modal className='logout'
        title="Confirm Logout"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Yes"
        cancelText="No"
      >
        <p>Are you sure you want to log out?</p>
      </Modal>
    </div>
  );
}
