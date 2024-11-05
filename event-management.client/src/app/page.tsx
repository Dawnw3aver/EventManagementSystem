"use client";

import { Button, Layout, Menu, Typography, Modal, Form, Input, Spin, DatePicker } from 'antd';
import { useRouter } from 'next/navigation';
import './Home.css';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

const Home: React.FC = () => {
  const router = useRouter();

  return (
    <Layout className="layout">
      <Content style={{ padding: '0 50px', backgroundImage: "url('/images/background.jpg')", backgroundSize: 'cover', height: '100vh' }}>
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
    </Layout>
  );
};

export default Home;
