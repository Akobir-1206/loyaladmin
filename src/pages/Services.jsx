import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Modal, Popconfirm, Table, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

export default function Service() {
  const [services, setServices] = useState([]);
  const tokenxon = localStorage.getItem('tokenchik');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [form] = Form.useForm();

  function getServices() {
    fetch('https://api.dezinfeksiyatashkent.uz/api/services')
      .then((res) => res.json())
      .then((element) => setServices(element?.data))
      .catch((error) => {
        console.error('Service larni yuklashda xatolik yuz berdi:', error);
        message.error('Service larni yuklashda xatolik yuz berdi');
      });
  }

  useEffect(() => {
    getServices();
  }, []);

  const showModal = (service = null) => {
    setCurrentService(service);
    if (service) {
      form.setFieldsValue(service);
    } else {
      form.resetFields();
    }
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    form.resetFields();
  };

  const deleteService = (id) => {
    fetch(`https://api.dezinfeksiyatashkent.uz/api/services/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${tokenxon}`,
        'Content-Type': 'application/json',
      },
    })
      .then((resp) => {
        if (!resp.ok) {
          throw new Error('Server xatosi');
        }
        return resp.json();
      })
      .then((items) => {
        if (items?.success) {
          message.success(items?.message || 'Service muvaffaqiyatli o\'chirildi');
          getServices();
        } else {
          message.error(items?.message || 'Service o\'chirishda xatolik yuz berdi');
        }
      })
      .catch((error) => {
        console.error('Service o\'chirishda xatolik yuz berdi:', error);
        message.error("Service o'chirishda xatolik yuz berdi");
      });
  };

  const handleSubmit = (values) => {
    setLoading(true);
    const url = currentService
      ? `https://api.dezinfeksiyatashkent.uz/api/services/${currentService.id}`
      : 'https://api.dezinfeksiyatashkent.uz/api/services';
    const method = currentService ? 'PUT' : 'POST';

    const formData = new FormData();
    Object.keys(values).forEach(key => {
      if (key === 'images' && values[key]?.fileList) {
        values[key].fileList.forEach(file => {
          formData.append('images[]', file.originFileObj);
        });
      } else {
        formData.append(key, values[key]);
      }
    });

    fetch(url, {
      method: method,
      headers: {
        Authorization: `Bearer ${tokenxon}`,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((result) => {
        if (result?.success) {
          message.success(result?.message || (currentService ? 'Service muvaffaqiyatli yangilandi' : 'Service muvaffaqiyatli qo\'shildi'));
          getServices();
          closeModal();
        } else {
          message.error(result?.message || (currentService ? 'Serviceni yangilashda xatolik yuz berdi' : 'Serviceni qo\'shishda xatolik yuz berdi'));
        }
      })
      .catch((error) => {
        console.error('Serviceni saqlashda xatolik yuz berdi:', error);
        message.error(currentService ? "Serviceni yangilashda xatolik yuz berdi" : "Serviceni qo'shishda xatolik yuz berdi");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const columns = [
    { title: 'Title (EN)', dataIndex: 'title_en' },
    { title: 'Title (RU)', dataIndex: 'title_ru' },
    { title: 'Title (UZ)', dataIndex: 'title_uz' },
    {
      title: "Images",
      dataIndex: 'images',
      render: (_, record) => (
        record.services_images && record.services_images.length > 0 && record.services_images[0]?.image?.src ? (
          <img
            width={150}
            src={`https://api.dezinfeksiyatashkent.uz/api/uploads/images/${record.services_images[0].image.src}`}
            alt={record.title_en}
          />
        ) : (
          <p>Rasm mavjud emas</p>
        )
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <>
          <Button type="primary" style={{ margin: '10px' }} onClick={() => showModal(record)}>
            Edit
          </Button>
          <Popconfirm
            placement="topLeft"
            title="Serviceni o'chirish"
            description="Ushbu Serviceni o'chirishni xohlaysizmi?"
            onConfirm={() => deleteService(record.id)}
            okText="Ha"
            cancelText="Yo'q"
          >
            <Button danger type="primary">
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={() => showModal()} style={{ marginBottom: '10px' }}>
        Add
      </Button>
      <Table columns={columns} dataSource={services} rowKey="id" />
      <Modal
        title={currentService ? "Serviceni tahrirlash" : "Service qo'shish"}
        open={open}
        footer={null}
        onCancel={closeModal}
        style={{ top: 20 }}
        width={800}
      >
        <Form
          form={form}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 18 }}
          onFinish={handleSubmit}
        >
          <Form.Item label="Title (EN)" name="title_en" rules={[{ required: true, message: 'Title (EN) kiriting!' }]}>
            <Input placeholder="title_en" />
          </Form.Item>
          <Form.Item label="Text (EN)" name="text_en" rules={[{ required: true, message: 'Text (EN) kiriting!' }]}>
            <Input.TextArea placeholder="text_en" />
          </Form.Item>
          <Form.Item label="Title (RU)" name="title_ru" rules={[{ required: true, message: 'Title (RU) kiriting!' }]}>
            <Input placeholder="title_ru" />
          </Form.Item>
          <Form.Item label="Text (RU)" name="text_ru" rules={[{ required: true, message: 'Text (RU) kiriting!' }]}>
            <Input.TextArea placeholder="text_ru" />
          </Form.Item>
          <Form.Item label="Title (UZ)" name="title_uz" rules={[{ required: true, message: 'Title (UZ) kiriting!' }]}>
            <Input placeholder="title_uz" />
          </Form.Item>
          <Form.Item label="Text (UZ)" name="text_uz" rules={[{ required: true, message: 'Text (UZ) kiriting!' }]}>
            <Input.TextArea placeholder="text_uz" />
          </Form.Item>
          <Form.Item label="Images" name="images" rules={[{ required: true, message: 'Rasmni joylang' }]}>
            <Upload
              beforeUpload={() => false}
              multiple
            >
              <Button icon={<UploadOutlined />}>Select Images</Button>
            </Upload>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}