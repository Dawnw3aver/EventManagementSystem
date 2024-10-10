import { Typography } from 'antd';

const { Title } = Typography;

const UsersPage: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>Users Page</Title>
      <p>This is the users page.</p>
    </div>
  );
};

export default UsersPage;
