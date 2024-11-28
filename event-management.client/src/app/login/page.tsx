"use client";

import React, { Suspense, useState } from 'react';
import { Button, Form, Input, message, Typography } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';

const { Title } = Typography;

const LoginForm: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get('redirect') || '/';
    const [loading, setLoading] = useState(false);

    const handleLogin = async (values: { email: string; password: string }) => {
        setLoading(true);
        try {
            const response = await axios.post('/api/v1/login?useCookies=true&useSessionCookies=true', values, { withCredentials: true });
            message.success('Вы успешно вошли в систему!');
            sessionStorage.setItem('userName', response.data.userName);
            sessionStorage.setItem('userRoles', JSON.stringify(response.data.userRole));
            window.location.href = redirectUrl;
        } catch (error) {
            message.error('Ошибка входа. Проверьте свои данные.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#f9f9f9'
        }}>
            <div style={{
                padding: 24,
                maxWidth: 400,
                width: '100%',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                borderRadius: 8,
                backgroundColor: '#fff'
            }}>
                <Title level={3} style={{ textAlign: 'center', color: '#1890ff' }}>Вход в систему</Title>
                <Form onFinish={handleLogin} layout="vertical" style={{ marginTop: 24 }}>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{ required: true, message: 'Пожалуйста, введите свой email!' }]}
                    >
                        <Input placeholder="Введите email" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="Пароль"
                        rules={[{ required: true, message: 'Пожалуйста, введите свой пароль!' }]}
                    >
                        <Input.Password placeholder="Введите пароль" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
                            Войти
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

const LoginPage: React.FC = () => (
    <Suspense fallback={<div>Загрузка...</div>}>
        <LoginForm />
    </Suspense>
);

export default LoginPage;
