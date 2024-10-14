"use client";

import React, { useEffect, useState } from 'react';
import { List, Spin, Typography, Layout, Modal, Button, Form, Input } from 'antd';
import axios from 'axios';

const { Title } = Typography;
const { Content } = Layout;

const EventsPage: React.FC = () => {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [currentEvent, setCurrentEvent] = useState<any>(null);

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

    const handleEdit = (event: any) => {
        setCurrentEvent(event);
        setIsModalVisible(true);
    };

    const handleDelete = async (eventId: string) => {
        const confirmDelete = window.confirm('Вы уверены, что хотите удалить это событие?');
        if (confirmDelete) {
            try {
                await axios.delete(`https://localhost:7285/api/v1/events/${eventId}`);
                setEvents(events.filter(event => event.id !== eventId)); // Убираем удаленное событие из списка
                console.log('Событие удалено');
            } catch (error) {
                console.error('Ошибка при удалении события:', error);
            }
        }
    };

    const handleOk = async (values: any) => {
        try {
            if (currentEvent) {
                // Изменение события
                await axios.put(`https://localhost:7285/api/v1/events/${currentEvent.id}`, values, { withCredentials: true });
                setEvents(events.map(event => (event.id === currentEvent.id ? { ...event, ...values } : event))); // Обновляем измененное событие
                console.log('Событие обновлено');
            }
        } catch (error) {
            console.error('Ошибка при обновлении события:', error);
        } finally {
            setIsModalVisible(false);
            setCurrentEvent(null);
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
            <Content style={{ padding: '20px' }}>
                <div style={{ background: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    <Title level={2} style={{ textAlign: 'center' }}>Список событий</Title>
                    <List
                        itemLayout="horizontal"
                        dataSource={events}
                        renderItem={event => (
                            <List.Item style={{ borderBottom: '1px solid #f0f0f0' }}>
                                <List.Item.Meta
                                    title={<span style={{ fontWeight: 'bold' }}>{event.title}</span>}
                                    description={`Дата начала: ${new Date(event.startDate).toLocaleDateString()} - Дата окончания: ${new Date(event.endDate).toLocaleDateString()} | Место: ${event.location}`}
                                    style={{ marginBottom: '10px' }}
                                />
                                <div>
                                    <Button type="primary" onClick={() => handleEdit(event)} style={{ marginRight: '10px' }}>Изменить</Button>
                                    <Button type="primary" onClick={() => handleDelete(event.id)}>Удалить</Button>
                                </div>
                            </List.Item>
                        )}
                    />
                </div>
            </Content>

            {/* Модальное окно для изменения события */}
            <Modal
                title="Изменить событие"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Form initialValues={currentEvent} onFinish={handleOk}>
                    <Form.Item name="title" label="Название" rules={[{ required: true, message: 'Пожалуйста, введите название события!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="startDate" label="Дата начала" rules={[{ required: true, message: 'Пожалуйста, введите дату начала!' }]}>
                        <Input type="date" />
                    </Form.Item>
                    <Form.Item name="endDate" label="Дата окончания" rules={[{ required: true, message: 'Пожалуйста, введите дату окончания!' }]}>
                        <Input type="date" />
                    </Form.Item>
                    <Form.Item name="location" label="Место" rules={[{ required: true, message: 'Пожалуйста, введите место!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>Сохранить изменения</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </Layout>
    );
};

export default EventsPage;
