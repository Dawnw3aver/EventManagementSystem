// pages/EventsPage.tsx

"use client";

import React, { useEffect, useState } from 'react';
import { Layout, Menu, Typography, Card, Button, Spin, Input, Col, Row, Checkbox, Form, DatePicker, Switch, Space, UploadFile,Upload, message, Modal, List, Image, Carousel } from 'antd';
import { CalendarOutlined, EnvironmentOutlined, PlusOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import dynamic from 'next/dynamic';
import Paragraph from 'antd/es/typography/Paragraph';
const MapComponent = dynamic(() => import('../components/MapComponent'), { ssr: false });

const { Header, Footer, Sider } = Layout;
const { Title } = Typography;
const { Search } = Input;

const EventsPage: React.FC = () => {
    const router = useRouter();
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [collapsed, setCollapsed] = useState<boolean>(false);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [newEventId, setNewEventId] = useState<string | null>(null);
    const [location, setLocation] = useState<string | null>(null); // Состояние для координат
    const [address, setAddress] = useState<string | null>(null);   // Состояние для адреса
    const [selectedEvent, setSelectedEvent] = useState<any | null>(null); // Выбранное событие
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false); // Видимость модального окна

    useEffect(() => {
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
    };

    const onFilterChange = (checkedValues: any) => {
        console.log('Фильтры изменены:', checkedValues);
    };

    const handleCollapse = (collapsed: boolean) => {
        setCollapsed(collapsed);
    };

    const handleImageUpload = (file: File) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('Вы можете загружать только изображения!');
            return false;
        }
        setImageFiles(prevFiles => [...prevFiles, file]);
        return true;
    };

    const handleImageUploadRemove = (file: UploadFile) => {
        setImageFiles(prevFiles => prevFiles.filter(f => f.name !== file.name)); // Сравнение по имени файла
    };

    const handleCreateEvent = async (values: any) => {
        const eventData = {
            title: values.title,
            description: values.description,
            startDate: values.startDate?.toISOString(),
            endDate: values.endDate?.toISOString(),
            location: location, // Используем строку координат
            address: address,   // Используем адрес
            isActive: values.isActive,
        };

        try {
            const response = await axios.post('https://localhost:7285/api/v1/events', eventData, {
                withCredentials: true
            });
            setNewEventId(response.data); // Сохраняем ID нового события
            handleUploadImages(response.data);
            message.success('Событие успешно создано.');
        } catch (error) {
            console.error('Ошибка при создании события:', error);
        }
    };

    const handleUploadImages = async (id: string) => {
        const formData = new FormData();
        imageFiles.forEach(file => {
            formData.append('files', file);
        });

        try {
            await axios.post(`https://localhost:7285/api/v1/events/upload-images?id=${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true
            });
            message.success('Изображения успешно загружены.');
            setNewEventId(null); // Сбрасываем ID события
            setImageFiles([]); // Очищаем загруженные изображения
        } catch (error) {
            console.error('Ошибка при загрузке изображений:', error);
        }
    };

    // Функция обратного геокодирования для получения адреса
    const fetchAddressFromCoords = async (latitude: number, longitude: number) => {
        try {
            const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=ru`);
            if (response.data && response.data.display_name) {
                setAddress(response.data.display_name); // Устанавливаем адрес на русском языке
            } else {
                setAddress("Адрес не найден");
            }
        } catch (error) {
            console.error("Ошибка при получении адреса:", error);
            setAddress("Ошибка получения адреса");
        }
    };

    // Обрабатываем координаты как строку "latitude,longitude" и получаем адрес
    const handleLocationChange = (coords: [number, number]) => {
        const locationString = `${coords[0]},${coords[1]}`;
        setLocation(locationString);
        fetchAddressFromCoords(coords[0], coords[1]); // Получаем адрес по координатам
    };

    const showEventDetails = (event: any) => {
        setSelectedEvent({
            ...event,
            participants: event?.participants ?? [] // Инициализируем пустым массивом, если participants отсутствует
        });
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false); // Закрытие модального окна
        setSelectedEvent(null); // Очищаем выбранное событие
    };

    const handleJoinEvent = async (eventId: string) => {
        try {
            const response = await axios.post(
                `https://localhost:7285/api/v1/events/join?eventId=${eventId}`, 
                {}, 
                { withCredentials: true }
            );
    
            if (response.status === 200) {
                message.success('Вы успешно присоединились к событию');
                setSelectedEvent((prev: any) => ({
                    ...prev,
                    participants: prev?.participants ? [...prev.participants, 'Вы'] : ['Вы'] // Убедитесь, что participants существует
                }));
            }
        } catch (error) {
            const axiosError = error as AxiosError;
            if (axiosError.response?.status === 401) {
                message.error('Необходимо войти в систему, чтобы присоединиться к событию.');
            } else if (axiosError.response?.status === 400) {
                message.warning('Вы уже присоединились к этому событию.');
            } else {
                message.error('Ошибка при попытке присоединиться к событию.');
            }
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
        <Layout style={{ minHeight: '100vh' }}>
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

            <Layout>
                <Sider
                    collapsible
                    collapsed={collapsed}
                    onCollapse={handleCollapse}
                    width={300}
                    style={{ backgroundColor: '#f9f9f9' }}
                >
                    {!collapsed && (
                        <>
                            <div style={{ marginLeft: '20px', paddingRight: '20px' }}>
                                <Title level={4}>Фильтры</Title>
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
                                <Form layout="vertical" onFinish={handleCreateEvent}>
                                    <Form.Item label="Название события" name="title">
                                        <Input placeholder="Введите название" />
                                    </Form.Item>

                                    <Form.Item label="Описание события" name="description">
                                        <Input.TextArea placeholder="Введите описание" />
                                    </Form.Item>

                                    <Form.Item label="Место проведения" name="location">
                                        <MapComponent center={[55.7558, 37.6176]} zoom={13} onLocationChange={handleLocationChange} />
                                        {address && <p>Адрес: {address}</p>}
                                    </Form.Item>

                                    <Form.Item label="Дата начала" name="startDate">
                                        <DatePicker style={{ width: '100%' }} />
                                    </Form.Item>

                                    <Form.Item label="Дата окончания" name="endDate">
                                        <DatePicker style={{ width: '100%' }} />
                                    </Form.Item>

                                    <Form.Item label="Активно" name="isActive" valuePropName="checked">
                                        <Switch />
                                    </Form.Item>

                                    <Form.Item label="Изображения">
                                        <Upload
                                            beforeUpload={handleImageUpload}
                                            onRemove={handleImageUploadRemove}
                                            multiple
                                            showUploadList={true}
                                        >
                                            <Button icon={<PlusOutlined />}>Загрузить изображения</Button>
                                        </Upload>
                                    </Form.Item>

                                    <Button type="primary" icon={<PlusOutlined />} style={{ width: '100%' }} htmlType="submit">
                                        Создать событие
                                    </Button>
                                </Form>
                            </div>
                        </>
                    )}
                </Sider>

                <Layout style={{ padding: '20px', backgroundColor: '#fff' }}>
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

                    <Row gutter={[16, 16]}>
                        {events.map(event => (
                            <Col xs={24} sm={12} md={8} lg={6} key={event.id}>
                                <Card
                                    hoverable
                                    cover={
                                        <img
                                            alt="event"
                                            src={'https://localhost:7285' + event.imageUrls[0]} // Изображение события
                                            style={{ height: '200px', objectFit: 'cover' }}
                                        />
                                    }
                                >
                                    <Card.Meta
                                        title={<span style={{ fontWeight: 'bold' }}>{event.title}</span>}
                                        description={
                                            <>
                                                <p><CalendarOutlined /> {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}</p>
                                                <p><EnvironmentOutlined /> {event.location.city}</p> {/* Адрес или координаты */}
                                            </>
                                        }
                                    />
                                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
                                        <Button type="primary" style={{ width: '100%' } } onClick={() => showEventDetails(event)}>
                                            Подробнее
                                        </Button>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Layout>
            </Layout>
            <Modal
                title={selectedEvent?.title}
                open={isModalVisible}
                onCancel={handleCancel}
                footer={[
                    <Button key="join" type="primary" onClick={() => handleJoinEvent(selectedEvent?.id)}>
                        Присоединиться
                    </Button>
                ]}
                width={800}
            >
                {selectedEvent && (
                    <div>
                        {selectedEvent.imageUrls && selectedEvent.imageUrls.length > 0 ? (
                            <div>
                            <Carousel dots style={{ textAlign: 'center' }}>
                                {selectedEvent.imageUrls.map((url: string, index: number) => (
                                    <div key={index}>
                                        <Image
                                            src={`https://localhost:7285${url}`}
                                            alt={`Изображение ${index + 1}`}
                                            style={{
                                                borderRadius: '8px', // Закругленные края
                                                objectFit: 'cover',
                                                width: '100%', // Ширина изображений по размеру карусели
                                                height: '400px' // Фиксированная высота изображений
                                            }}
                                            preview={false} // Отключение превью
                                        />
                                    </div>
                                ))}
                            </Carousel>
                            </div>
                        ) : (
                            <Paragraph>Изображения отсутствуют</Paragraph> // Альтернативный текст, если изображений нет
                        )}
                        <Card style={{
                                backgroundColor: '#f9f9f9', // Цвет фона контейнера
                                borderRadius: '8px', // Закруглённые края
                                marginBottom: '20px', // Отступ снизу
                            }}>
                            <p>
                                <CalendarOutlined /> {new Date(selectedEvent.startDate).toLocaleDateString()} - {new Date(selectedEvent.endDate).toLocaleDateString()}
                            </p>
                            <p>
                                <a 
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedEvent.location.address)}`}
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                >
                                    <EnvironmentOutlined /> {selectedEvent.location.city}
                                </a>
                            </p>
                        </Card>
                        <Card
                            style={{
                                backgroundColor: '#f9f9f9', // Цвет фона контейнера
                                borderRadius: '8px', // Закруглённые края
                                marginBottom: '20px', // Отступ снизу
                            }}
                        >
                            <Paragraph>{selectedEvent.description}</Paragraph>
                        </Card>

                        <Card
                            style={{
                                backgroundColor: '#f9f9f9', // Цвет фона контейнера
                                borderRadius: '8px', // Закруглённые края
                                marginBottom: '20px', // Отступ снизу
                            }}>
                        <Title level={5}>Адрес</Title>
                        <Paragraph>{selectedEvent.location.address}</Paragraph>
                        </Card>

                        <Title level={4}>Участники</Title>
                        <List
                            bordered
                            dataSource={selectedEvent.participants}
                            renderItem={(participant: any) => (
                                <List.Item>{participant}</List.Item>
                            )}
                        />
                    </div>
                )}
            </Modal>             
            <Footer style={{ textAlign: 'center' }}>Event Management ©2024 Created by You</Footer>
        </Layout>
    );
};

export default EventsPage;
