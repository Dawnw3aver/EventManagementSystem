"use client"; // Добавлено для использования хуков

import { Button, Layout, Menu, Typography, Modal, Form, Input, Spin } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';
import './Home.css'; // Подключаем CSS файл для стилей

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

const Home: React.FC = () => {
  const router = useRouter();
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

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
        <Menu theme="dark" mode="horizontal" style={{ justifyContent: 'flex-end' }}>
          <Menu.Item key="1" onClick={() => router.push('/admin')}>Администрирование</Menu.Item>
          <Menu.Item key="2">
            <Button type="link" onClick={showLoginModal} style={{ color: 'white' }}>Вход</Button>
          </Menu.Item>
          <Menu.Item key="3">
            <Button type="link" onClick={showRegisterModal} style={{ color: 'white' }}>Регистрация</Button>
          </Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: '0 50px', backgroundImage: "url('/images/background.jpg')", backgroundSize: 'cover', height: '100vh'}}>
        <div className="description-container" style={{ marginTop: '20px', textAlign: 'center', backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: '20px', borderRadius: '10px' }}>
          <Title level={1}>Добро пожаловать в систему управления событиями</Title>
          <Paragraph>
            Все в одном решении для создания, управления и участия в мероприятиях. 
            Независимо от того, проводите ли вы небольшую встречу или крупную конференцию, мы вас поддержим!
          </Paragraph>
          <Button type="primary" onClick={() => router.push('/events')} style={{ marginTop: '20px' }}>Начать</Button>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Event Management ©2024 Created by You</Footer>

      {/* Модальное окно для входа */}
      <Modal
        title="Вход"
        visible={isLoginModalVisible}
        onCancel={() => setIsLoginModalVisible(false)}
        footer={null}
      >
        <Form onFinish={handleLogin}>
          <Form.Item name="email" rules={[{ required: true, message: 'Пожалуйста, введите свой email!' }]}>
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: 'Пожалуйста, введите свой пароль!' }]}>
            <Input.Password placeholder="Пароль" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>Войти</Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Модальное окно для регистрации */}
      <Modal
        title="Регистрация"
        visible={isRegisterModalVisible}
        onCancel={() => setIsRegisterModalVisible(false)}
        footer={null}
      >
        <Form onFinish={handleRegister}>
          <Form.Item name="email" rules={[{ required: true, message: 'Пожалуйста, введите свой email!' }]}>
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: 'Пожалуйста, введите свой пароль!' }]}>
            <Input.Password placeholder="Пароль" />
          </Form.Item>
          <Form.Item name="userName" rules={[{ required: true, message: 'Пожалуйста, введите имя пользователя!' }]}>
            <Input placeholder="Имя пользователя" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>Зарегистрироваться</Button>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default Home;
