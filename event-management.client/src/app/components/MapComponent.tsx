// components/MapComponent.tsx

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Button } from 'antd';
import { AimOutlined } from '@ant-design/icons';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet-defaulticon-compatibility';
import L from 'leaflet';

interface MapComponentProps {
  center: [number, number];
  zoom: number;
  onLocationChange?: (location: [number, number]) => void; // Новое свойство для передачи координат
}

const LocationMarker = ({ onLocationChange }: { onLocationChange?: (location: [number, number]) => void }) => {
  const map = useMap();
  const [position, setPosition] = useState<[number, number] | null>(null);

  // Определение местоположения и перемещение карты
  const handleFindLocation = () => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by your browser');
      return;
    }

    const onSuccess = (location: GeolocationPosition) => {
      const { latitude, longitude } = location.coords;
      const newPosition: [number, number] = [latitude, longitude];
      setPosition(newPosition);
      map.flyTo(newPosition, map.getZoom()); // Переместить центр карты на местоположение
      if (onLocationChange) {
        onLocationChange(newPosition); // Передать координаты в родительский компонент
      }
    };

    const onError = (error: GeolocationPositionError) => {
      console.error('Error obtaining location:', error);
    };

    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  };

    // Устанавливаем метку по клику мыши
    useEffect(() => {
      const onClickMap = (e: L.LeafletMouseEvent) => {
        const newPosition: [number, number] = [e.latlng.lat, e.latlng.lng];
        setPosition(newPosition); // Устанавливаем или перемещаем метку
        if (onLocationChange) {
          onLocationChange(newPosition); // Передаем координаты
        }
      };
  
      map.on('click', onClickMap); // Обработка клика по карте
  
      return () => {
        map.off('click', onClickMap); // Убираем слушатель кликов при размонтировании
      };
    }, [map, onLocationChange]);

  return (
    <>
      <Button 
        onClick={handleFindLocation}
        type="primary"
        shape="circle"
        icon={<AimOutlined />}
        size="large"
        style={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          zIndex: 1000,
          backgroundColor: '#007bff',
          border: 'none',
        }}
      />
      {position && (
        <Marker position={position}>
          <Popup>You are here!</Popup>
        </Marker>
      )}
    </>
  );
};

const MapComponent: React.FC<MapComponentProps> = ({ center = [55.7558, 37.6176], zoom, onLocationChange }) => {
  return (
    <div style={{ position: 'relative', height: '300px', width: '100%' }}>
      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }} 
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarker onLocationChange={onLocationChange} />
      </MapContainer>
    </div>
  );
};

export default MapComponent;
