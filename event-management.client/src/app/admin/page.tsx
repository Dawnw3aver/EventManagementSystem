"use client";

import React, { useEffect, useState } from 'react';
import { List, Spin, Typography, Layout, Modal, Button, Form, Input, DatePicker, Checkbox } from 'antd';
import axios from 'axios';
import moment from 'moment'; // Для работы с датами

const { Title } = Typography;
const { Content } = Layout;

const EventsPage: React.FC = () => {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(false);
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
        setCurrentEvent({
            ...event,
            startDate: moment(event.startDate),
            endDate: moment(event.endDate),
        });
        setIsEditModalVisible(true);
    };

    const handleDelete = async (id: string) => {
        const confirmDelete = window.confirm('Вы уверены, что хотите удалить это событие?');
        if (confirmDelete) {
            try {
                await axios.delete(`https://localhost:7285/api/v1/events/${id}`, { withCredentials: true });
                setEvents(events.filter(event => event.id !== id)); // Убираем удаленное событие из списка
                console.log('Событие удалено');
            } catch (error) {
                console.error('Ошибка при удалении события:', error);
            }
        }
    };

    const handleOkEdit = async (values: any) => {
        try {
            if (currentEvent) {
                // Форматирование данных для сервера
                const formattedValues = {
                    ...values,
                    startDate: values.startDate.toISOString(),
                    endDate: values.endDate.toISOString(),
                    organizerId: currentEvent.organizerId, // Используем organizerId текущего события
                };

                // Изменение события
                await axios.put(`https://localhost:7285/api/v1/events/${currentEvent.id}`, formattedValues, { withCredentials: true });
                setEvents(events.map(event => (event.id === currentEvent.id ? { ...event, ...formattedValues } : event))); // Обновляем измененное событие
                console.log('Событие обновлено');
            }
        } catch (error) {
            console.error('Ошибка при обновлении события:', error);
        } finally {
            setIsEditModalVisible(false);
            setCurrentEvent(null);
        }
    };

    const handleAdd = async (values: any) => {
        try {
            const formattedValues = {
                ...values,
                startDate: values.startDate.toISOString(),
                endDate: values.endDate.toISOString()
            };

            // Добавление нового события
            const response = await axios.post('https://localhost:7285/api/v1/events', formattedValues, { withCredentials: true });
            setEvents([...events, response.data]); // Добавляем новое событие в список
            console.log('Событие добавлено');
        } catch (error) {
            console.error('Ошибка при добавлении события:', error);
        } finally {
            setIsAddModalVisible(false);
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
                    <Button type="primary" style={{ marginBottom: '20px' }} onClick={() => setIsAddModalVisible(true)}>Добавить событие</Button>
                    <List
                        itemLayout="horizontal"
                        dataSource={events}
                        renderItem={event => (
                            <List.Item style={{ borderBottom: '1px solid #f0f0f0' }}>
                                <List.Item.Meta
                                    title={<span style={{ fontWeight: 'bold' }}>{event.title}</span>}
                                    description={`id: ${event.id} Дата начала: ${new Date(event.startDate).toLocaleDateString()} - Дата окончания: ${new Date(event.endDate).toLocaleDateString()} | Место: ${event.location}`}
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
                visible={isEditModalVisible}
                onCancel={() => setIsEditModalVisible(false)}
                footer={null}
            >
                <Form initialValues={currentEvent} onFinish={handleOkEdit}>
                    <Form.Item name="title" label="Название" rules={[{ required: true, message: 'Пожалуйста, введите название события!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Описание" rules={[{ required: true, message: 'Пожалуйста, введите описание события!' }]}>
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item name="startDate" label="Дата начала" rules={[{ required: true, message: 'Пожалуйста, введите дату начала!' }]}>
                        <DatePicker showTime />
                    </Form.Item>
                    <Form.Item name="endDate" label="Дата окончания" rules={[{ required: true, message: 'Пожалуйста, введите дату окончания!' }]}>
                        <DatePicker showTime />
                    </Form.Item>
                    <Form.Item name="location" label="Место" rules={[{ required: true, message: 'Пожалуйста, введите место!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="isActive" valuePropName="checked">
                        <Checkbox>Активно</Checkbox>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>Сохранить изменения</Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Модальное окно для добавления нового события */}
            <Modal
                title="Добавить событие"
                visible={isAddModalVisible}
                onCancel={() => setIsAddModalVisible(false)}
                footer={null}
            >
                <Form onFinish={handleAdd}>
                    <Form.Item name="title" label="Название" rules={[{ required: true, message: 'Пожалуйста, введите название события!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Описание" rules={[{ required: true, message: 'Пожалуйста, введите описание события!' }]}>
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item name="startDate" label="Дата начала" rules={[{ required: true, message: 'Пожалуйста, введите дату начала!' }]}>
                        <DatePicker showTime />
                    </Form.Item>
                    <Form.Item name="endDate" label="Дата окончания" rules={[{ required: true, message: 'Пожалуйста, введите дату окончания!' }]}>
                        <DatePicker showTime />
                    </Form.Item>
                    <Form.Item name="location" label="Место" rules={[{ required: true, message: 'Пожалуйста, введите место!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="isActive" valuePropName="checked">
                        <Checkbox>Активно</Checkbox>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>Добавить событие</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </Layout>
    );
};

export default EventsPage;
