"use client"; // Добавлено для использования хуков

import { Button, Layout, Menu, Typography, Carousel, Modal, Form, Input } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

const Home: React.FC = () => {
  const router = useRouter();
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);

  const showLoginModal = () => {
    setIsLoginModalVisible(true);
  };

  const showRegisterModal = () => {
    setIsRegisterModalVisible(true);
  };

  const handleLogin = async (values: any) => {
    try {
        const response = await axios.post('https://localhost:7285/api/v1/login?useCookies=true&useSessionCookies=true', values, {
            withCredentials: true // Отправляем cookies с запросом
        });
        console.log('Login successful:', response.data);
        setIsLoginModalVisible(false);
    } catch (error) {
        console.error('Login failed:', error);
        // Обработка ошибки
    }
};

  const handleRegister = async (values: any) => {
    try {
        const response = await axios.post('https://localhost:7285/api/v1/register?useCookies=true&useSessionCookies=true', values, {
            withCredentials: true // Отправляем cookies с запросом
        });
        console.log('Login successful:', response.data);
        setIsLoginModalVisible(false);
    } catch (error) {
        console.error('Login failed:', error);
        // Обработка ошибки
    }
};

  return (
    <Layout className="layout">
      <Header>
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} style={{ justifyContent: 'flex-end' }}>
          <Menu.Item key="1" onClick={() => router.push('/')}>Home</Menu.Item>
          <Menu.Item key="2" onClick={() => router.push('/events')}>Events</Menu.Item>
          <Menu.Item key="3" onClick={() => router.push('/users')}>Users</Menu.Item>
          <Menu.Item key="4">
            <Button type="link" onClick={showLoginModal} style={{ color: 'white' }}>Login</Button>
          </Menu.Item>
          <Menu.Item key="5">
            <Button type="link" onClick={showRegisterModal} style={{ color: 'white' }}>Register</Button>
          </Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <div className="site-layout-content" style={{ marginTop: '20px', textAlign: 'center' }}>
          <Title level={1}>Welcome to Event Management System</Title>
          <Paragraph>
            Your all-in-one solution for creating, managing, and attending events. 
            Whether you're hosting a small meeting or a large conference, we've got you covered!
          </Paragraph>
          <Carousel autoplay style={{ marginTop: '20px' }} dots={true}>
            <div>
              <img src="/images/photo1.jpg" alt="Event 1" style={{ width: '100%', height: 'auto' }} />
            </div>
            <div>
              <img src="/images/photo2.jpg" alt="Event 2" style={{ width: '100%', height: 'auto' }} />
            </div>
            <div>
              <img src="/images/photo3.jpg" alt="Event 3" style={{ width: '100%', height: 'auto' }} />
            </div>
          </Carousel>
          <Button type="primary" onClick={() => router.push('/events')} style={{ marginTop: '20px' }}>Get Started</Button>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Event Management ©2024 Created by You</Footer>

      {/* Модальное окно для входа */}
      <Modal
        title="Login"
        visible={isLoginModalVisible}
        onCancel={() => setIsLoginModalVisible(false)}
        footer={null}
      >
        <Form onFinish={handleLogin}>
          <Form.Item name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>Login</Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Модальное окно для регистрации */}
      <Modal
        title="Register"
        visible={isRegisterModalVisible}
        onCancel={() => setIsRegisterModalVisible(false)}
        footer={null}
      >
        <Form onFinish={handleRegister}>
          <Form.Item name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item name="userName" rules={[{ required: true, message: 'Please input your username!' }]}>
            <Input placeholder="Username" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>Register</Button>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default Home;
