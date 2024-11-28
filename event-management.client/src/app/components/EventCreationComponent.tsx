// components/EventCreationForm.tsx

import React, { useState } from "react";
import { Form, Input, DatePicker, Switch, Upload, Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import { UploadFile } from "antd/es/upload/interface";
import dynamic from "next/dynamic";

interface EventCreationFormProps {
  onEventCreated: (newEventId: string) => void;
}

const MapComponent = dynamic(() => import("../components/MapComponent"), {
    ssr: false,
  });

const EventCreationForm: React.FC<EventCreationFormProps> = ({ onEventCreated }) => {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [location, setLocation] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);

  const handleImageUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Можно загружать только изображения!");
      return false;
    }
    setImageFiles((prevFiles) => [...prevFiles, file]);
    return false; // Предотвращаем автоматическую загрузку
  };

  const handleImageUploadRemove = (file: UploadFile) => {
    setImageFiles((prevFiles) => prevFiles.filter((f) => f.name !== file.name));
  };

  const handleCreateEvent = async (values: any) => {
    const eventData = {
      title: values.title,
      description: values.description,
      startDate: values.startDate?.toISOString(),
      endDate: values.endDate?.toISOString(),
      location,
      address,
      isActive: values.isActive,
    };

    try {
      const response = await axios.post("/api/v1/events", eventData, { withCredentials: true });
      onEventCreated(response.data); // Передача нового ID события наверх
      await handleUploadImages(response.data);
      message.success("Событие успешно создано.");
    } catch (error) {
      console.error("Ошибка при создании события:", error);
    }
  };

  const handleUploadImages = async (eventId: string) => {
    const formData = new FormData();
    imageFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      await axios.post(`/api/v1/events/upload-images?id=${eventId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      message.success("Изображения успешно загружены.");
      setImageFiles([]); // Очищаем список изображений
    } catch (error) {
      console.error("Ошибка при загрузке изображений:", error);
    }
  };

  const handleLocationChange = (coords: [number, number]) => {
    const locationString = `${coords[0]},${coords[1]}`;
    setLocation(locationString);
  };

  return (
    <Form layout="vertical" onFinish={handleCreateEvent}>
      <Form.Item label="Название события" name="title" rules={[{ required: true, message: "Введите название" }]}>
        <Input placeholder="Введите название" />
      </Form.Item>

      <Form.Item label="Описание события" name="description" rules={[{ required: true, message: "Введите описание" }]}>
        <Input.TextArea placeholder="Введите описание" />
      </Form.Item>

      <Form.Item label="Место проведения" name="location">
        <MapComponent center={[55.7558, 37.6176]} zoom={13} onLocationChange={handleLocationChange} />
        {address && <p>Адрес: {address}</p>}
      </Form.Item>

      <Form.Item label="Дата начала" name="startDate" rules={[{ required: true, message: "Выберите дату начала" }]}>
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item label="Дата окончания" name="endDate" rules={[{ required: true, message: "Выберите дату окончания" }]}>
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item label="Активно" name="isActive" valuePropName="checked">
        <Switch />
      </Form.Item>

      <Form.Item label="Изображения">
        <Upload beforeUpload={handleImageUpload} onRemove={handleImageUploadRemove} multiple showUploadList={true}>
          <Button icon={<PlusOutlined />}>Загрузить изображения</Button>
        </Upload>
      </Form.Item>

      <Button type="primary" icon={<PlusOutlined />} style={{ width: "100%" }} htmlType="submit">
        Создать событие
      </Button>
    </Form>
  );
};

export default EventCreationForm;
