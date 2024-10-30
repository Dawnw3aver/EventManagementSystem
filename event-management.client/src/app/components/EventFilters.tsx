// EventFilters.tsx
import React, { useState, useEffect } from 'react';
import { Form, Checkbox, Select, DatePicker, Button } from 'antd';

const { Option } = Select;

type EventFiltersProps = {
    events: any[];
    onFilterApply: (filteredEvents: any[]) => void;
    originalEvents: any[];
};

const EventFilters: React.FC<EventFiltersProps> = ({ events, onFilterApply, originalEvents }) => {
    const [form] = Form.useForm();
    const [locationOptions, setLocationOptions] = useState<string[]>([]);
    const [isSpecificDateSelected, setIsSpecificDateSelected] = useState(false);

    useEffect(() => {
        const uniqueLocations = Array.from(new Set(events.map(event => event.location.city)));
        setLocationOptions(uniqueLocations);
    }, [events]);

    const applyFilters = (values: any) => {
        const { location, date, category } = values;

        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const thisWeekStart = new Date(today);
        thisWeekStart.setDate(today.getDate() - today.getDay());
        const thisWeekEnd = new Date(thisWeekStart);
        thisWeekEnd.setDate(thisWeekStart.getDate() + 6);

        const filteredEvents = originalEvents.filter((event) => {
            const eventStartDate = new Date(event.startDate);
            const eventEndDate = new Date(event.endDate);

            const locationMatch = !location || location.includes(event.location.city);

            const dateMatch = !date || date.period.some((period: string) => {
                if (period === 'today') {
                    return (
                        (date.type === 'starts' && eventStartDate.toDateString() === today.toDateString()) ||
                        (date.type === 'ends' && eventEndDate.toDateString() === today.toDateString()) ||
                        (date.type === 'ongoing' && eventStartDate <= today && eventEndDate >= today)
                    );
                } 
                if (period === 'tomorrow') {
                    return (
                        (date.type === 'starts' && eventStartDate.toDateString() === tomorrow.toDateString()) ||
                        (date.type === 'ends' && eventEndDate.toDateString() === tomorrow.toDateString()) ||
                        (date.type === 'ongoing' && eventStartDate <= tomorrow && eventEndDate >= tomorrow)
                    );
                }
                if (period === 'this_week') {
                    return (
                        (date.type === 'starts' && eventStartDate >= thisWeekStart && eventStartDate <= thisWeekEnd) ||
                        (date.type === 'ends' && eventEndDate >= thisWeekStart && eventEndDate <= thisWeekEnd) ||
                        (date.type === 'ongoing' && eventStartDate <= thisWeekEnd && eventEndDate >= thisWeekStart)
                    );
                }
                if (period === 'specific_date' && date.specificDate) {
                    const specificDate = new Date(date.specificDate);
                    return (
                        (date.type === 'starts' && eventStartDate.toDateString() === specificDate.toDateString()) ||
                        (date.type === 'ends' && eventEndDate.toDateString() === specificDate.toDateString()) ||
                        (date.type === 'ongoing' && eventStartDate <= specificDate && eventEndDate >= specificDate)
                    );
                }
                return false;
            });

            const categoryMatch = !category || category.includes(event.category);
            return locationMatch && dateMatch && categoryMatch;
        });

        onFilterApply(filteredEvents);
    };

    const resetFilters = () => {
        form.resetFields();
        onFilterApply(originalEvents);
        setIsSpecificDateSelected(false);
    };

    return (
        <Form
            form={form}
            layout="vertical"
            initialValues={{
                date: { type: 'starts' }
            }}
            onFinish={applyFilters}
        >
            <Form.Item label="Место проведения" name="location">
                <Checkbox.Group options={locationOptions} />
            </Form.Item>
            <Form.Item label="Дата">
                <Form.Item name={['date', 'type']} noStyle>
                    <Select defaultValue="starts" style={{ marginTop: '10px' }}> 
                        <Option value="starts">Начинается</Option>
                        <Option value="ends">Заканчивается</Option>
                        <Option value="ongoing">Проходит</Option>
                    </Select>
                </Form.Item>
                <Form.Item name={['date', 'period']} noStyle>
                    <Checkbox.Group>
                        <Checkbox value="today">Сегодня</Checkbox>
                        <Checkbox value="tomorrow">Завтра</Checkbox>
                        <Checkbox value="this_week">На этой неделе</Checkbox>
                        <Checkbox value="specific_date" onChange={(e) => setIsSpecificDateSelected(e.target.checked)}>В указанную дату</Checkbox>
                    </Checkbox.Group>
                </Form.Item>
                {isSpecificDateSelected && (
                    <Form.Item name={['date', 'specificDate']} noStyle>
                        <DatePicker style={{ marginTop: '10px', width: '100%' }} />
                    </Form.Item>
                )}
            </Form.Item>
            <Form.Item label="Категории" name="category">
                <Checkbox.Group options={['Концерты', 'Спорт', 'Театры']} />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" style={{ width: '100%' }}>Применить фильтры</Button>
                <Button type="primary" style={{ width: '100%', marginTop: '10px' }} onClick={resetFilters}>Сбросить фильтры</Button>
            </Form.Item>
        </Form>
    );
};

export default EventFilters;
