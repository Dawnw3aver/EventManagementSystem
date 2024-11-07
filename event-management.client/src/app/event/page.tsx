"use client";
import React, { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Layout, Typography, Card, Spin, Button, Carousel, List, message } from 'antd';
import { CalendarOutlined, EnvironmentOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title, Paragraph } = Typography;

const EventDetails: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams.get('eventId');
  
  const [event, setEvent] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchEventDetails = async () => {
    if (!eventId) return;
    
    try {
      const response = await axios.get(`/api/v1/events/${eventId}`, { withCredentials: true });
      setEvent(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке события:", error);
      message.error("Не удалось загрузить событие.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchEventDetails();
  }, [eventId]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!event) {
    return <div style={{ textAlign: "center" }}>Событие не найдено</div>;
  }

  return (
    <Layout style={{ padding: '20px', backgroundColor: '#fff', minHeight: '100vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <Title level={2}>{event.title}</Title>

        {event.imageUrls && event.imageUrls.length > 0 ? (
          <Carousel dots style={{ textAlign: 'center' }}>
            {event.imageUrls.map((url: string, index: number) => (
              <div key={index}>
                <img
                  src={`${url}`}
                  alt={`Изображение ${index + 1}`}
                  style={{
                    borderRadius: "8px",
                    objectFit: "cover",
                    width: "100%",
                    height: "400px",
                  }}
                />
              </div>
            ))}
          </Carousel>
        ) : (
          <Paragraph>Изображения отсутствуют</Paragraph>
        )}

        <Card style={{ backgroundColor: "#f9f9f9", borderRadius: "8px", marginTop: "20px" }}>
          <p>
            <CalendarOutlined /> {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
          </p>
          <p>
            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location.address)}`} target="_blank" rel="noopener noreferrer">
              <EnvironmentOutlined /> {event.location.city}
            </a>
          </p>
        </Card>

        <Card style={{ backgroundColor: "#f9f9f9", borderRadius: "8px", marginTop: "20px" }}>
          <Paragraph>{event.description}</Paragraph>
        </Card>

        <Card style={{ backgroundColor: "#f9f9f9", borderRadius: "8px", marginTop: "20px" }}>
          <Title level={5}>Адрес</Title>
          <Paragraph>{event.location.address}</Paragraph>
        </Card>

        <Title level={4}>Участники</Title>
        <List
          bordered
          dataSource={event.participants || []}
          renderItem={(participant: any) => <List.Item>{participant}</List.Item>}
        />

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <Button type="primary" onClick={() => router.push('/EventsPage')}>
            Назад к списку событий
          </Button>
        </div>
      </div>
    </Layout>
  );
};

const EventDetailsPage: React.FC = () => (
  <Suspense fallback={<div>Загрузка...</div>}>
    <EventDetails />
  </Suspense>
);

export default EventDetailsPage;
