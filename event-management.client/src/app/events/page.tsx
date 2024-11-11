// pages/EventsPage.tsx

"use client";

import React, { useEffect, useState } from "react";
import {
  Layout,
  Typography,
  Card,
  Button,
  Spin,
  Input,
  Col,
  Row,
  Form,
  DatePicker,
  Switch,
  UploadFile,
  Upload,
  message,
  Modal,
  List,
  Image,
  Carousel,
  Select,
  FloatButton,
} from "antd";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  FilterOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import axios, { AxiosError } from "axios";
import dynamic from "next/dynamic";
import Paragraph from "antd/es/typography/Paragraph";
import EventFilters from "../components/EventFilters";
import EventCreationForm from "../components/EventCreationComponent";
import { Content } from "antd/es/layout/layout";

const { Footer, Sider } = Layout;
const { Title } = Typography;
const { Search } = Input;

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [originalEvents, setOriginalEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [newEventId, setNewEventId] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null); // Выбранное событие
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false); // Видимость модального окна
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [isSiderCollapsed, setSiderCollapsed] = useState(false);

  const showCreateModal = () => setCreateModalVisible(true);
  const hideCreateModal = () => setCreateModalVisible(false);

  const showFilterModal = () => setFilterModalVisible(true);
  const hideFilterModal = () => setFilterModalVisible(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          "/api/v1/events",
          { withCredentials: true }
        );
        setEvents(response.data);
        setOriginalEvents(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке событий:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const onSearch = (value: string) => {
    if (value.trim() === "") {
      setEvents(originalEvents);
    } else {
      // Фильтрация событий по заголовку
      const filteredEvents = originalEvents.filter(
        (event) =>
          event.title.toLowerCase().includes(value.toLowerCase()) ||
          event.description.toLowerCase().includes(value.toLowerCase())
      );
      setEvents(filteredEvents);
    }
  };

  const handleCollapse = (collapsed: boolean) => {
    setCollapsed(collapsed);
  };

  const handleFilterApply = (filteredEvents: any) => {
    setEvents(filteredEvents);
  };

  const showEventDetails = (event: any) => {
    setSelectedEvent({
      ...event,
      participants: event?.participants ?? [], // Инициализируем пустым массивом, если participants отсутствует
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
        `/api/v1/events/join?eventId=${eventId}`,
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        message.success("Вы успешно присоединились к событию");
        setSelectedEvent((prev: any) => ({
          ...prev,
          participants: prev?.participants
            ? [...prev.participants, "Вы"]
            : ["Вы"], // Убедитесь, что participants существует
        }));
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 401) {
        message.error(
          "Необходимо войти в систему, чтобы присоединиться к событию."
        );
      } else if (axiosError.response?.status === 400) {
        message.warning("Вы уже присоединились к этому событию.");
      } else {
        message.error("Ошибка при попытке присоединиться к событию.");
      }
    }
  };

  const handleLeaveEvent = async (eventId: string) => {
    try {
      const response = await axios.post(
        `/api/v1/events/leave?eventId=${eventId}`,
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        message.success("Вы успешно отписались от события");
        // setSelectedEvent((prev: any) => ({
        //     ...prev,
        //     participants: prev?.participants ? [...prev.participants, 'Вы'] : ['Вы'] // Убедитесь, что participants существует
        // }));
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      message.error("Ошибка при отписке от события" + axiosError.message);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout>
      <Sider
        width={300}
        breakpoint="lg"
        collapsedWidth="0"
        style={{ backgroundColor: "#f9f9f9" }}
        trigger={null}
        onCollapse={(collapsed) => setSiderCollapsed(collapsed)}
      >
        <div style={{ marginLeft: "20px", paddingRight: "20px" }}>
          <Title level={4} style={{ marginTop: "20px" }}>
            Фильтры
          </Title>
          <EventFilters
            events={originalEvents}
            onFilterApply={handleFilterApply}
            originalEvents={originalEvents}
          />
        </div>
      </Sider>
      <Layout style={{ padding: "20px", backgroundColor: "#fff" }}>
        <Content>
          <Row style={{ marginBottom: "20px" }}>
            <Col span={24}>
              <Search
                placeholder="Введите название события"
                onSearch={onSearch}
                onChange={(e) => onSearch(e.target.value)}
                enterButton
                size="large"
              />
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            {events.map((event) => (
              <Col xs={24} sm={12} md={8} lg={6} key={event.id}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt="event"
                      src={event.imageUrls[0]}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  }
                >
                  <Card.Meta
                    title={<span style={{ fontWeight: "bold" }}>{event.title}</span>}
                    description={
                      <>
                        <p>
                          <CalendarOutlined /> {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                        </p>
                        <p>
                          <EnvironmentOutlined /> {event.location.city}
                        </p>
                      </>
                    }
                  />
                  <div style={{ display: "flex", justifyContent: "center", marginTop: "15px" }}>
                    <Button type="primary" style={{ width: "100%" }} onClick={() => showEventDetails(event)}>
                      Подробнее
                    </Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Content>
      </Layout>

      <FloatButton
        icon={<PlusOutlined />}
        type="primary"
        onClick={showCreateModal}
        style={{ right: 24, bottom: 24 }}
      />

      {isSiderCollapsed && (
        <FloatButton
          icon={<FilterOutlined />}
          type="default"
          onClick={showFilterModal}
          style={{ left: 24, bottom: 24 }}
        />
      )}

      <Modal
        title="Создание события"
        open={isCreateModalVisible}
        onCancel={hideCreateModal}
        footer={null}
      >
        <EventCreationForm onEventCreated={(newEventId) => {
          setNewEventId(newEventId);
          hideCreateModal();
        }} />
      </Modal>

      {/* Модальное окно для фильтров (на мобильных устройствах) */}
      <Modal
        title="Фильтры событий"
        visible={isFilterModalVisible}
        onCancel={hideFilterModal}
        footer={null}
      >
        <EventFilters
          events={originalEvents}
          onFilterApply={(filters) => {
            handleFilterApply(filters);
            hideFilterModal();
          }}
          originalEvents={originalEvents}
        />
      </Modal>
    </Layout>
      <Modal
        title={selectedEvent?.title}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <>
            <Button
              key="join"
              type="primary"
              onClick={() => handleJoinEvent(selectedEvent?.id)}
            >
              Подписаться
            </Button>
            <Button
              key="leave"
              type="primary"
              onClick={() => handleLeaveEvent(selectedEvent?.id)}
            >
              Отписаться
            </Button>
          </>,
        ]}
        width={800}
      >
        {selectedEvent && (
          <div>
            {selectedEvent.imageUrls && selectedEvent.imageUrls.length > 0 ? (
              <div>
                <Carousel dots style={{ textAlign: "center" }}>
                  {selectedEvent.imageUrls.map((url: string, index: number) => (
                    <div key={index}>
                      <Image
                        src={`${url}`}
                        alt={`Изображение ${index + 1}`}
                        style={{
                          borderRadius: "8px",
                          objectFit: "cover",
                          width: "100%",
                          height: "400px",
                        }}
                        preview={false}
                      />
                    </div>
                  ))}
                </Carousel>
              </div>
            ) : (
              <Paragraph>Изображения отсутствуют</Paragraph>
            )}
            <Card
              style={{
                backgroundColor: "#f9f9f9",
                borderRadius: "8px",
                marginBottom: "20px",
              }}
            >
              <p>
                <CalendarOutlined />{" "}
                {new Date(selectedEvent.startDate).toLocaleDateString()} -{" "}
                {new Date(selectedEvent.endDate).toLocaleDateString()}
              </p>
              <p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    selectedEvent.location.address
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <EnvironmentOutlined /> {selectedEvent.location.city}
                </a>
              </p>
            </Card>
            <Card
              style={{
                backgroundColor: "#f9f9f9",
                borderRadius: "8px",
                marginBottom: "20px",
              }}
            >
              <Paragraph>{selectedEvent.description}</Paragraph>
            </Card>

            <Card
              style={{
                backgroundColor: "#f9f9f9", 
                borderRadius: "8px", 
                marginBottom: "20px",
              }}
            >
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
    </Layout>
  );
};

export default EventsPage;
