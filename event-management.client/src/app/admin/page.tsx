"use client";

import React, { useEffect, useState } from 'react';
import { List, Spin, Typography, Layout, Modal, Button, Form, Input, DatePicker, Checkbox, Tabs, Table, Pagination, message } from 'antd';
import axios from 'axios';
import moment from 'moment';
import dynamic from 'next/dynamic';

const { Title } = Typography;
const { Content } = Layout;
const { TabPane } = Tabs;

const MapComponent = dynamic(() => import('../components/MapComponent'), { ssr: false });
const availableRoles = ['Admin', 'User', 'Manager'];

const UsersAndEventsPage: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [events, setEvents] = useState<any[]>([]);
    const [logs, setLogs] = useState<any[]>([]);
    const [loadingUsers, setLoadingUsers] = useState<boolean>(true);
    const [loadingEvents, setLoadingEvents] = useState<boolean>(true);
    const [loadingLogs, setLoadingLogs] = useState<boolean>(true);
    const [isAddUserModalVisible, setIsAddUserModalVisible] = useState<boolean>(false);
    const [isEditUserModalVisible, setIsEditUserModalVisible] = useState<boolean>(false);
    const [isAddEventModalVisible, setIsAddEventModalVisible] = useState<boolean>(false);
    const [isEditEventModalVisible, setIsEditEventModalVisible] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [currentEvent, setCurrentEvent] = useState<any>(null);
    const [location, setLocation] = useState<string | null>(null);
    const [address, setAddress] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalLogs, setTotalLogs] = useState<number>(0);
    const pageSize = 10;

    // === Загрузка данных ===
    const fetchUsers = async () => {
        setLoadingUsers(true);
        try {
            const response = await axios.get('https://localhost:7285/api/v1/users', { withCredentials: true });
            setUsers(response.data);
        } catch (error) {
            console.error('Ошибка при загрузке пользователей:', error);
        } finally {
            setLoadingUsers(false);
        }
    };

    const fetchEvents = async () => {
        setLoadingEvents(true);
        try {
            const response = await axios.get('https://localhost:7285/api/v1/events', { withCredentials: true });
            setEvents(response.data);
        } catch (error) {
            console.error('Ошибка при загрузке событий:', error);
        } finally {
            setLoadingEvents(false);
        }
    };

    const fetchLogs = async (page: number) => {
        setLoadingLogs(true);
        try {
            const response = await axios.get(`https://localhost:7285/api/v1/logs?page=${page}&pageSize=${pageSize}`, { withCredentials: true });
            setLogs(response.data);
            setTotalLogs(parseInt(response.headers['x-total-count'], 10) || 0);
        } catch (error) {
            console.error('Ошибка при загрузке логов:', error);
        } finally {
            setLoadingLogs(false);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchEvents();
        fetchLogs(currentPage);
    }, [currentPage]);

    // === Обработчики для событий ===
    const handleEditEvent = (event: any) => {
        setCurrentEvent({
            ...event,
            startDate: moment(event.startDate),
            endDate: moment(event.endDate),
        });
        setLocation(event.location);
        setAddress(event.address || "Адрес не указан");
        setIsEditEventModalVisible(true);
    };

    const handleLocationChange = (coords: [number, number]) => {
        const locationString = `${coords[0]},${coords[1]}`;
        setLocation(locationString);
        fetchAddressFromCoords(coords[0], coords[1]);
    };

    const fetchAddressFromCoords = async (latitude: number, longitude: number) => {
        try {
            const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=ru`);
            setAddress(response.data?.display_name || "Адрес не найден");
        } catch (error) {
            console.error("Ошибка при получении адреса:", error);
            setAddress("Ошибка получения адреса");
        }
    };

    const handleOkEditEvent = async (values: any) => {
        try {
            if (currentEvent) {
                const formattedValues = {
                    title: values.title,
                    description: values.description,
                    startDate: values.startDate.toISOString(),
                    endDate: values.endDate.toISOString(),
                    location: location,
                    isActive: values.isActive || false,
                };
                await axios.put(`https://localhost:7285/api/v1/events/${currentEvent.id}`, formattedValues, { withCredentials: true });
                message.success('Событие успешно обновлено');
                fetchEvents();
            }
        } catch (error) {
            console.error('Ошибка при обновлении события:', error);
        } finally {
            setIsEditEventModalVisible(false);
            setCurrentEvent(null);
        }
    };

    const handleAddEvent = async (values: any) => {
        try {
            const formattedValues = {
                title: values.title,
                description: values.description,
                startDate: values.startDate.toISOString(),
                endDate: values.endDate.toISOString(),
                location: location,
                isActive: values.isActive || false,
            };
            await axios.post('https://localhost:7285/api/v1/events', formattedValues, { withCredentials: true });
            message.success('Событие успешно добавлено');
            fetchEvents();
        } catch (error) {
            console.error('Ошибка при добавлении события:', error);
        } finally {
            setIsAddEventModalVisible(false);
        }
    };

    const handleDeleteEvent = async (id: string) => {
        const confirmDelete = window.confirm('Вы уверены, что хотите удалить это событие?');
        if (confirmDelete) {
            try {
                await axios.delete(`https://localhost:7285/api/v1/events/${id}`, { withCredentials: true });
                fetchEvents();
                message.success('Событие успешно удалено');
            } catch (error) {
                console.error('Ошибка при удалении события:', error);
            }
        }
    };

    // === Обработчики для пользователей ===
    const handleEditUser = (user: any) => {
        setCurrentUser({
            ...user,
            birthDate: moment(user.birthDate),
        });
        setIsEditUserModalVisible(true);
    };

    const handleDeleteUser = async (userId: string) => {
        const confirmDelete = window.confirm('Вы уверены, что хотите удалить этого пользователя?');
        if (confirmDelete) {
            try {
                await axios.delete(`https://localhost:7285/api/v1/users/${userId}`, { withCredentials: true });
                fetchUsers();
                message.success('Пользователь успешно удален');
            } catch (error) {
                console.error('Ошибка при удалении пользователя:', error);
            }
        }
    };

    const handleAddUser = async (values: any) => {
        try {
            const formattedValues = {
                ...values,
                birthDate: values.birthDate.toISOString(),
            };
            await axios.post('https://localhost:7285/api/v1/users', formattedValues, { withCredentials: true });
            fetchUsers();
            message.success('Пользователь успешно добавлен');
        } catch (error) {
            console.error('Ошибка при добавлении пользователя:', error);
        } finally {
            setIsAddUserModalVisible(false);
        }
    };

    const handleOkEditUser = async (values: any) => {
        try {
            if (currentUser) {
                const formattedValues = {
                    ...values,
                    birthDate: values.birthDate.toISOString(),
                };
                await axios.put(`https://localhost:7285/api/v1/users/${currentUser.userId}`, formattedValues, { withCredentials: true });
                fetchUsers();
                message.success('Пользователь успешно обновлен');
            }
        } catch (error) {
            console.error('Ошибка при обновлении пользователя:', error);
        } finally {
            setIsEditUserModalVisible(false);
            setCurrentUser(null);
        }
    };

    if (loadingUsers || loadingEvents || loadingLogs) {
        return (
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <Spin size="large" />
            </div>
        );
    }

    const columns = [
        {
            title: 'Дата и время',
            dataIndex: 'timestamp',
            key: 'timestamp',
            render: (timestamp: string) => moment(timestamp).format('DD.MM.YYYY HH:mm:ss'),
        },
        {
            title: 'Действие',
            dataIndex: 'action',
            key: 'action',
        },
        {
            title: 'Детали',
            dataIndex: 'details',
            key: 'details',
        },
        {
            title: 'Объект',
            dataIndex: 'objectId',
            key: 'objectId',
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
            <Content style={{ padding: '20px' }}>
                <div style={{ background: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="События" key="1">
                            <Title level={2} style={{ textAlign: 'center' }}>Список событий</Title>
                            <Button type="primary" style={{ marginBottom: '20px' }} onClick={() => setIsAddEventModalVisible(true)}>
                                Добавить событие
                            </Button>
                            <List
                                itemLayout="horizontal"
                                dataSource={events}
                                renderItem={event => (
                                    <List.Item style={{ borderBottom: '1px solid #f0f0f0' }}>
                                        <List.Item.Meta
                                            title={<span style={{ fontWeight: 'bold' }}>{event.title}</span>}
                                            description={`Дата начала: ${new Date(event.startDate).toLocaleDateString()} - Дата окончания: ${new Date(event.endDate).toLocaleDateString()} | Место: ${event.location}`}
                                        />
                                        <div>
                                            <Button type="primary" onClick={() => handleEditEvent(event)} style={{ marginRight: '10px' }}>Изменить</Button>
                                            <Button type="primary" danger onClick={() => handleDeleteEvent(event.id)}>Удалить</Button>
                                        </div>
                                    </List.Item>
                                )}
                            />
                        </TabPane>

                        <TabPane tab="Пользователи" key="2">
                            <Title level={2} style={{ textAlign: 'center' }}>Список пользователей</Title>
                            <Button type="primary" style={{ marginBottom: '20px' }} onClick={() => setIsAddUserModalVisible(true)}>
                                Добавить пользователя
                            </Button>
                            <List
                                itemLayout="horizontal"
                                dataSource={users}
                                renderItem={user => (
                                    <List.Item style={{ borderBottom: '1px solid #f0f0f0' }}>
                                        <List.Item.Meta
                                            title={<span style={{ fontWeight: 'bold' }}>{user.userName}</span>}
                                            description={`Email: ${user.email}`}
                                        />
                                        <div>
                                            <Button type="primary" onClick={() => handleEditUser(user)} style={{ marginRight: '10px' }}>Изменить</Button>
                                            <Button type="primary" danger onClick={() => handleDeleteUser(user.userId)}>Удалить</Button>
                                        </div>
                                    </List.Item>
                                )}
                            />
                        </TabPane>

                        <TabPane tab="Логи" key="3">
                            <Title level={2} style={{ textAlign: 'center' }}>Логи системы</Title>
                            <Table
                                dataSource={logs}
                                columns={columns}
                                pagination={false}
                                rowKey="id"
                            />
                            <Pagination
                                current={currentPage}
                                total={totalLogs}
                                pageSize={pageSize}
                                onChange={(page) => setCurrentPage(page)}
                                style={{ marginTop: '20px', textAlign: 'right' }}
                            />
                        </TabPane>
                    </Tabs>
                </div>
            </Content>

            {/* Модальное окно для добавления события */}
            <Modal
                title="Добавить событие"
                open={isAddEventModalVisible}
                onCancel={() => setIsAddEventModalVisible(false)}
                footer={null}
            >
                <Form onFinish={handleAddEvent}>
                    <Form.Item name="title" label="Название" rules={[{ required: true, message: 'Введите название события!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Описание" rules={[{ required: true, message: 'Введите описание события!' }]}>
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item name="startDate" label="Дата начала" rules={[{ required: true, message: 'Введите дату начала!' }]}>
                        <DatePicker showTime />
                    </Form.Item>
                    <Form.Item name="endDate" label="Дата окончания" rules={[{ required: true, message: 'Введите дату окончания!' }]}>
                        <DatePicker showTime />
                    </Form.Item>
                    <Form.Item label="Место проведения">
                        <MapComponent center={[55.7558, 37.6176]} zoom={13} onLocationChange={handleLocationChange} />
                        {address && <p>Адрес: {address}</p>}
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                            Добавить событие
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Модальное окно для изменения события */}
            <Modal
                title="Изменить событие"
                open={isEditEventModalVisible}
                onCancel={() => setIsEditEventModalVisible(false)}
                footer={null}
            >
                <Form initialValues={currentEvent} onFinish={handleOkEditEvent}>
                    <Form.Item name="title" label="Название" rules={[{ required: true, message: 'Введите название события!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Описание" rules={[{ required: true, message: 'Введите описание события!' }]}>
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item name="startDate" label="Дата начала" rules={[{ required: true, message: 'Введите дату начала!' }]}>
                        <DatePicker showTime />
                    </Form.Item>
                    <Form.Item name="endDate" label="Дата окончания" rules={[{ required: true, message: 'Введите дату окончания!' }]}>
                        <DatePicker showTime />
                    </Form.Item>
                    <Form.Item label="Место проведения">
                        <MapComponent center={[55.7558, 37.6176]} zoom={13} onLocationChange={handleLocationChange} />
                        {address && <p>Адрес: {address}</p>}
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                            Сохранить изменения
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Модальное окно для добавления пользователя */}
            <Modal
                title="Добавить пользователя"
                open={isAddUserModalVisible}
                onCancel={() => setIsAddUserModalVisible(false)}
                footer={null}
            >
                <Form onFinish={handleAddUser}>
                    <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Введите email!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="password" label="Пароль" rules={[{ required: true, message: 'Введите пароль!' }]}>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item name="userName" label="Имя пользователя" rules={[{ required: true, message: 'Введите имя пользователя!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="phoneNumber" label="Телефон">
                        <Input />
                    </Form.Item>
                    <Form.Item name="firstName" label="Имя" rules={[{ required: true, message: 'Введите имя!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="middleName" label="Отчество">
                        <Input />
                    </Form.Item>
                    <Form.Item name="lastName" label="Фамилия" rules={[{ required: true, message: 'Введите фамилию!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="birthDate" label="Дата рождения" rules={[{ required: true, message: 'Введите дату рождения!' }]}>
                        <DatePicker />
                    </Form.Item>
                    <Form.Item name="roles" label="Роли">
                        <Checkbox.Group>
                            {availableRoles.map(role => (
                                <Checkbox key={role} value={role}>
                                    {role}
                                </Checkbox>
                            ))}
                        </Checkbox.Group>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                            Добавить пользователя
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Модальное окно для изменения пользователя */}
            <Modal
                title="Изменить пользователя"
                open={isEditUserModalVisible}
                onCancel={() => setIsEditUserModalVisible(false)}
                footer={null}
            >
                <Form initialValues={currentUser} onFinish={handleOkEditUser}>
                    <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Введите email!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="userName" label="Имя пользователя" rules={[{ required: true, message: 'Введите имя пользователя!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="phoneNumber" label="Телефон">
                        <Input />
                    </Form.Item>
                    <Form.Item name="firstName" label="Имя" rules={[{ required: true, message: 'Введите имя!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="middleName" label="Отчество">
                        <Input />
                    </Form.Item>
                    <Form.Item name="lastName" label="Фамилия" rules={[{ required: true, message: 'Введите фамилию!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="birthDate" label="Дата рождения" rules={[{ required: true, message: 'Введите дату рождения!' }]}>
                        <DatePicker />
                    </Form.Item>
                    <Form.Item name="roles" label="Роли">
                        <Checkbox.Group>
                            {availableRoles.map(role => (
                                <Checkbox key={role} value={role}>
                                    {role}
                                </Checkbox>
                            ))}
                        </Checkbox.Group>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                            Сохранить изменения
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </Layout>
    );
};

export default UsersAndEventsPage;
