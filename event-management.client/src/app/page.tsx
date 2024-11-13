"use client";

import { Button, Card, Col, Layout, Row, Typography } from 'antd';
import { useRouter } from 'next/navigation';
import { CheckCircleOutlined } from '@ant-design/icons';
import './Home.css';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const Home: React.FC = () => {
  const router = useRouter();

  return (
    <Layout className="layout">
      <Content className="home-content">
        <div className="hero-container">
          <div className="text-section">
            <Title level={1} className="hero-title">Лучший способ находить события</Title>
            <div className="features-list">
              <Paragraph>
                <CheckCircleOutlined className="icon" /> Находи интересные события в твоем городе
              </Paragraph>
              <Paragraph>
                <CheckCircleOutlined className="icon" /> Планируй и продвигай свои события
              </Paragraph>
              <Paragraph>
                <CheckCircleOutlined className="icon" /> Привлекай участников
              </Paragraph>
              <Paragraph>
                <CheckCircleOutlined className="icon" /> Отслеживай последние обновления
              </Paragraph>
            </div>
            <Button type="primary" className="explore-button" onClick={() => router.push('/events')}>
              Начать просмотр
            </Button>
            <Button type="link" className="demo-button">Демо</Button>
          </div>
          <div className="image-section">
            <img src="images/tequila-sunrice.png" alt="Event Management" className="hero-image" />
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default Home;
