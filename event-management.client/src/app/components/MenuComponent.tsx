"use client"; // Добавлено для использования хуков

import { Button, Menu, Modal, Form, Input, DatePicker } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';

const MenuComponent: React.FC = () => {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]); // Хранение ролей пользователя
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);

  useEffect(() => {
    const storedUserName = sessionStorage.getItem('userName');
    const storedUserRoles = sessionStorage.getItem('userRoles');

    if (storedUserName) {
      setUserName(storedUserName);
    }

    if (storedUserRoles) {
      setUserRoles(JSON.parse(storedUserRoles));
    }
  }, []);

  const handleLogin = async (values: any) => {
    try {
      const response = await axios.post('/api/v1/login?useCookies=true&useSessionCookies=true', values, {
        withCredentials: true // Отправляем cookies с запросом
      });
      console.log('Login successful:', response.data);
      setUserName(response.data.userName);
      setUserRoles(response.data.userRole); // Получаем роли пользователя

      // Сохраняем данные пользователя в localStorage
      sessionStorage.setItem('userName', response.data.userName);
      sessionStorage.setItem('userRoles', JSON.stringify(response.data.userRole));

      setIsLoginModalVisible(false); // Закрыть модальное окно после успешного входа
    } catch (error) {
      console.error('Login failed:', error);
      // Обработка ошибки
    }
  };

  const handleLogout = async () => {
    try {
        await axios.post('/api/v1/logout', {}, {
            withCredentials: true // Отправляем cookies с запросом
        });
        // Сбрасываем данные пользователя
        setUserName(null);
        setUserRoles([]);
        // Удаляем данные из sessionStorage
        sessionStorage.removeItem('userName');
        sessionStorage.removeItem('userRoles');
        console.log('Выход выполнен успешно');
    } catch (error) {
        console.error('Logout failed:', error);
        // Обработка ошибки
    }
};


  const handleRegister = async (values: any) => {
    try {
      const response = await axios.post('/api/v1/register?useCookies=true&useSessionCookies=true', values, {
        withCredentials: true // Отправляем cookies с запросом
      });
      console.log('Register successful:', response.data);
      setIsRegisterModalVisible(false); // Закрыть модальное окно после успешной регистрации
    } catch (error) {
      console.error('Registration failed:', error);
      // Обработка ошибки
    }
  };

  return (
    <>
      <Menu theme="dark" mode="horizontal" style={{ justifyContent: 'flex-end' }}>
        {userRoles.includes('Admin') && (
          <Menu.Item key="1" onClick={() => router.push('/admin')}>Администрирование</Menu.Item>
        )}
        {userName ? (
          <>
            <Menu.Item key="2">{userName}</Menu.Item>
            <Menu.Item key="3">
              <Button type="link" onClick={handleLogout} style={{ color: 'white' }}>Выход</Button>
            </Menu.Item>
          </>
        ) : (
          <>
            <Menu.Item key="4">
              <Button type="link" onClick={() => setIsLoginModalVisible(true)} style={{ color: 'white' }}>Вход</Button>
            </Menu.Item>
            <Menu.Item key="5">
              <Button type="link" onClick={() => setIsRegisterModalVisible(true)} style={{ color: 'white' }}>Регистрация</Button>
            </Menu.Item>
          </>
        )}
      </Menu>

      {/* Модальное окно для входа */}
      <Modal
        title="Вход"
        open={isLoginModalVisible}
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
        open={isRegisterModalVisible}
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
          <Form.Item name="phoneNumber" rules={[{ required: true, message: 'Пожалуйста, введите номер телефона!' }]}>
            <Input placeholder="Номер телефона" />
          </Form.Item>
          <Form.Item name="firstName" rules={[{ required: true, message: 'Пожалуйста, введите своё имя!' }]}>
            <Input placeholder="Имя" />
          </Form.Item>
          <Form.Item name="middleName">
            <Input placeholder="Отчество (необязательно)" />
          </Form.Item>
          <Form.Item name="lastName" rules={[{ required: true, message: 'Пожалуйста, введите свою фамилию!' }]}>
            <Input placeholder="Фамилия" />
          </Form.Item>
          <Form.Item name="birthDate" rules={[{ required: true, message: 'Пожалуйста, выберите дату рождения!' }]}>
            <DatePicker placeholder="Дата рождения" format="DD.MM.YYYY" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Зарегистрироваться
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default MenuComponent;
