"use client";

import React, { useEffect, useState } from 'react';
import { Layout, Menu, Typography, Card, Button, Spin, Input, Col, Row, Checkbox, Form, DatePicker, Switch, Space } from 'antd';
import { CalendarOutlined, EnvironmentOutlined, PlusOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import moment from 'moment';

const { Header, Content, Footer, Sider } = Layout;
const { Title } = Typography;
const { Search } = Input;

const EventsPage: React.FC = () => {
    const router = useRouter();
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [collapsed, setCollapsed] = useState<boolean>(false);

    useEffect(() => {
        // Запрос к API для получения событий
        const fetchEvents = async () => {
            try {
                const response = await axios.get('https://localhost:7285/api/v1/events', { withCredentials: true });
                setEvents(response.data);
            } catch (error) {
                console.error('Ошибка при загрузке событий:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const onSearch = (value: string) => {
        console.log('Поиск:', value);
        // Логика поиска событий
    };

    const onFilterChange = (checkedValues: any) => {
        console.log('Фильтры изменены:', checkedValues);
        // Логика изменения фильтров
    };

    const handleCollapse = (collapsed: boolean) => {
        setCollapsed(collapsed);
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <Layout style={{ minHeight: '100vh' }}>
            {/* Верхнее меню */}
            <Header>
                <Menu theme="dark" mode="horizontal" style={{ justifyContent: 'flex-end' }}>
                    <Menu.Item key="1" onClick={() => router.push('/')}>Главная</Menu.Item>
                    <Menu.Item key="2" onClick={() => router.push('/admin')}>Администрирование</Menu.Item>
                    <Menu.Item key="3">
                        <Button type="link" style={{ color: 'white' }}>Войти</Button>
                    </Menu.Item>
                    <Menu.Item key="4">
                        <Button type="link" style={{ color: 'white' }}>Регистрация</Button>
                    </Menu.Item>
                </Menu>
            </Header>

            {/* Основной контент */}
            <Layout>
                {/* Боковая панель с фильтрами и созданием события */}
                <Sider
                    collapsible
                    collapsed={collapsed}
                    onCollapse={handleCollapse}
                    width={300}
                    style={{ backgroundColor: '#f9f9f9'  }}
                >
                    {!collapsed && (
                        <>
                            <div style={{marginLeft: '20px'}}>
                            <Title level={4} >Фильтры</Title>
                            <Form layout="vertical" onValuesChange={onFilterChange}>
                                <Form.Item label="Место проведения">
                                    <Checkbox.Group options={['Москва', 'Санкт-Петербург', 'Другие']} />
                                </Form.Item>

                                <Form.Item label="Дата">
                                    <Checkbox.Group options={['Сегодня', 'Завтра', 'На этой неделе']} />
                                </Form.Item>

                                <Form.Item label="Категории">
                                    <Checkbox.Group options={['Концерты', 'Спорт', 'Театры']} />
                                </Form.Item>
                                <Button type="primary" style={{ width: '100%' }}>
                                    Применить фильтры
                                </Button>
                            </Form>

                            <Title level={4} style={{ marginTop: '20px' }}>Создание события</Title>
                            <Form layout="vertical">
                                <Form.Item label="Название события">
                                    <Input placeholder="Введите название" />
                                </Form.Item>

                                <Form.Item label="Место проведения">
                                    <Input placeholder="Введите место" />
                                </Form.Item>

                                <Form.Item label="Дата начала">
                                    <DatePicker style={{ width: '100%' }} />
                                </Form.Item>

                                <Form.Item label="Дата окончания">
                                    <DatePicker style={{ width: '100%' }} />
                                </Form.Item>

                                <Form.Item label="Платное событие">
                                    <Switch />
                                </Form.Item>

                                <Button type="primary" icon={<PlusOutlined />} style={{ width: '100%' }}>
                                    Создать событие
                                </Button>
                            </Form>
                            </div>
                        </>
                    )}
                </Sider>

                {/* Содержимое страницы */}
                <Layout style={{ padding: '20px', backgroundColor: '#fff' }}>
                    {/* Полоса поиска */}
                    <Row style={{ marginBottom: '20px' }}>
                        <Col span={24}>
                            <Search
                                placeholder="Введите название события"
                                onSearch={onSearch}
                                enterButton
                                size="large"
                            />
                        </Col>
                    </Row>

                    {/* Карточки событий */}
                    <Row gutter={[16, 16]}>
                        {events.map(event => (
                            <Col span={24} key={event.id}>
                                <Card
                                    hoverable
                                    cover={
                                        <img
                                            alt="event"
                                            src="/images/event-placeholder.jpg"  // Замените на ваши изображения
                                            style={{ height: '200px', objectFit: 'cover' }}
                                        />
                                    }
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                                        <div>
                                            <Card.Meta
                                                title={<span style={{ fontWeight: 'bold' }}>{event.title}</span>}
                                                description={
                                                    <>
                                                        <p><CalendarOutlined /> {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}</p>
                                                        <p><EnvironmentOutlined /> {event.location}</p>
                                                    </>
                                                }
                                            />
                                        </div>
                                        <Button type="primary" style={{ marginTop: '15px', whiteSpace: 'nowrap' }}>
                                            Подробнее
                                        </Button>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Layout>
            </Layout>

            {/* Нижний колонтитул */}
            <Footer style={{ textAlign: 'center' }}>Event Management ©2024 Created by You</Footer>
        </Layout>
    );
};

export default EventsPage;
