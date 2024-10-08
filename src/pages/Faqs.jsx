import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Modal, Popconfirm, Table, message } from 'antd';

export default function Faqs() {
  const [faqs, setFaqs] = useState([]);
  const tokenxon = localStorage.getItem('tokenchik');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentFaq, setCurrentFaq] = useState(null);
  const [form] = Form.useForm();

  // FAQ larni olish
  function getFaqs() {
    fetch('https://api.dezinfeksiyatashkent.uz/api/faqs')
      .then((res) => res.json())
      .then((element) => setFaqs(element?.data))
      .catch((error) => {
        console.error('FAQlarni yuklashda xatolik yuz berdi:', error);
        message.error('FAQlarni yuklashda xatolik yuz berdi');
      });
  }

  useEffect(() => {
    getFaqs();
  }, []);

  // Modalni ochish
  const showModal = (faq = null) => {
    setCurrentFaq(faq);
    if (faq) {
      form.setFieldsValue(faq); // Modal ochilganda tahrirlash uchun qiymatlarni to'ldirish
    } else {
      form.resetFields(); // Qo'shish uchun qiymatlarni tozalash
    }
    setOpen(true);
  };

  // Modalni yopish
  const closeModal = () => {
    setOpen(false);
    form.resetFields();
  };

  // FAQni o'chirish
  const deleteFaqs = (id) => {
    fetch(`https://api.dezinfeksiyatashkent.uz/api/faqs/${id}`, {
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
          message.success(items?.message || 'FAQ muvaffaqiyatli o\'chirildi');
          getFaqs();
        } else {
          message.error(items?.message || 'FAQni o\'chirishda xatolik yuz berdi');
        }
      })
      .catch((error) => {
        console.error('FAQni o\'chirishda xatolik yuz berdi:', error);
        message.error("FAQni o'chirishda xatolik yuz berdi");
      });
  };

  // FAQ qo'shish yoki yangilash
  const handleSubmit = (values) => {
    setLoading(true);
    const url = currentFaq
      ? `https://api.dezinfeksiyatashkent.uz/api/faqs/${currentFaq.id}`
      : 'https://api.dezinfeksiyatashkent.uz/api/faqs';
    const method = currentFaq ? 'PUT' : 'POST';

    fetch(url, {
      method: method,
      headers: {
        Authorization: `Bearer ${tokenxon}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result?.success) {
          message.success(result?.message || (currentFaq ? 'FAQ muvaffaqiyatli yangilandi' : 'FAQ muvaffaqiyatli qo\'shildi'));
          getFaqs();
          closeModal();
        } else {
          message.error(result?.message || (currentFaq ? 'FAQni yangilashda xatolik yuz berdi' : 'FAQni qo\'shishda xatolik yuz berdi'));
        }
      })
      .catch((error) => {
        console.error('FAQni saqlashda xatolik yuz berdi:', error);
        message.error(currentFaq ? "FAQni yangilashda xatolik yuz berdi" : "FAQni qo'shishda xatolik yuz berdi");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Jadval uchun ustunlar
  const columns = [
    {
      title: 'Title (EN)',
      dataIndex: 'title_en',
    },
    {
      title: 'Text (EN)',
      dataIndex: 'text_en',
    },
    {
      title: 'Title (RU)',
      dataIndex: 'title_ru',
    },
    {
      title: 'Text (RU)',
      dataIndex: 'text_ru',
    },
    {
      title: 'Title (UZ)',
      dataIndex: 'title_uz',
    },
    {
      title: 'Text (UZ)',
      dataIndex: 'text_uz',
    },
    {
      title: 'Action',
      dataIndex: 'action',
    },
  ];

  // Ma'lumotlarni jadvalga o'rnatish
  const FaqsData = faqs.map((faq, index) => ({
    key: index,
    title_en: faq.title_en,
    text_en: faq.text_en,
    title_ru: faq.title_ru,
    text_ru: faq.text_ru,
    title_uz: faq.title_uz,
    text_uz: faq.text_uz,
    action: (
      <>
        <Button type="primary" style={{ margin: '10px' }} onClick={() => showModal(faq)}>
          Edit
        </Button>
        <Popconfirm
          placement="topLeft"
          title="FAQni o'chirish"
          description="Ushbu FAQni o'chirishni xohlaysizmi?"
          onConfirm={() => deleteFaqs(faq.id)}
          okText="Ha"
          cancelText="Yo'q"
        >
          <Button danger type="primary">
            Delete
          </Button>
        </Popconfirm>
      </>
    ),
  }));

  return (
    <div>
      <Button type="primary" onClick={() => showModal()} style={{ marginBottom: '10px' }}>
        Add
      </Button>
      <Table columns={columns} dataSource={FaqsData} />
      <Modal
        title={currentFaq ? "FAQni tahrirlash" : "FAQ qo'shish"}
        open={open}
        footer={null}
        onCancel={closeModal}
        style={{ top: 20 }} // Modalni biroz tepaga ko'tarish
        width={800} // Modal kengligini kengaytirish
      >
        <Form
          form={form}
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 18,
          }}
          onFinish={handleSubmit}
        >
          <Form.Item label="Title (EN)" name="title_en" rules={[{ required: true, message: 'Title (EN) kiriting!' }]}>
            <Input placeholder="title_en" />
          </Form.Item>
          <Form.Item label="Text (EN)" name="text_en" rules={[{ required: true, message: 'Text (EN) kiriting!' }]}>
            <Input placeholder="text_en" />
          </Form.Item>
          <Form.Item label="Title (RU)" name="title_ru" rules={[{ required: true, message: 'Title (RU) kiriting!' }]}>
            <Input placeholder="title_ru" />
          </Form.Item>
          <Form.Item label="Text (RU)" name="text_ru" rules={[{ required: true, message: 'Text (RU) kiriting!' }]}>
            <Input placeholder="text_ru" />
          </Form.Item>
          <Form.Item label="Title (UZ)" name="title_uz" rules={[{ required: true, message: 'Title (UZ) kiriting!' }]}>
            <Input placeholder="title_uz" />
          </Form.Item>
          <Form.Item label="Text (UZ)" name="text_uz" rules={[{ required: true, message: 'Text (UZ) kiriting!' }]}>
            <Input placeholder="text_uz" />
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
