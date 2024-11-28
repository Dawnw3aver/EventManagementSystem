"use client";

import { NextPage } from "next";
import { useEffect, useState } from "react";
import { Card, Descriptions, Badge, Spin, Alert, Button, Layout } from "antd";
import axios from "axios";
import moment from "moment";

interface UserResponse {
  userId: string;
  email: string;
  userName: string;
  phoneNumber: string;
  firstName: string;
  middleName: string;
  lastName: string;
  birthDate: string;
  roles: string[];
}

const UserPage: NextPage = () => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await axios.get<UserResponse>(`/api/v1/users/current`, {
          withCredentials: true,
        });
        setUser(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleEdit = () => {
    console.log("Редактирование данных пользователя...");
  };

  const handleDelete = async () => {
    try {
      console.log("Удаление аккаунта...");
    } catch (err: any) {
      alert("Ошибка при удалении аккаунта.");
    }
  };

  if (loading) {
    return <Spin size="large" style={{ display: "block", margin: "100px auto" }} />;
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  return (
    <Layout style={{ backgroundColor: "f9f9f9", height: "100vh" }}>
      <div style={{ padding: "50px" }}>
        {user ? (
          <Card
            title={`${user.firstName} ${user.lastName}`}
            bordered
          >
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
              <Descriptions.Item label="Никнейм">{user.userName}</Descriptions.Item>
              <Descriptions.Item label="Телефон">{user.phoneNumber}</Descriptions.Item>
              <Descriptions.Item label="Дата рождения">
                {moment(user.birthDate).format("DD.MM.YYYY")}
              </Descriptions.Item>
              <Descriptions.Item label="Роли">
                {user.roles.map((role, index) => (
                  <Badge
                    key={index}
                    count={role}
                    style={{ backgroundColor: "#52c41a", marginRight: 8 }}
                  />
                ))}
              </Descriptions.Item>
            </Descriptions>
            <div style={{marginTop: "10px"}}>
              <Button type="primary" style={{ marginRight: 10 }} onClick={handleEdit}>
                Изменить данные
              </Button>
              <Button danger onClick={handleDelete}>
                Удалить аккаунт
              </Button>
            </div>
          </Card>
        ) : null}
      </div>
    </Layout>
  );
};

export default UserPage;
