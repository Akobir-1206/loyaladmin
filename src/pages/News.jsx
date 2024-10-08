import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Modal, Popconfirm, Table, message } from 'antd';

export default function News() {
  const [news, setNews] = useState([]);
  const tokenxon = localStorage.getItem('tokenchik');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentNews, setCurrentNews] = useState(null);
  const [form] = Form.useForm();

  // FAQ larni olish
  function getNews() {
    fetch('https://api.dezinfeksiyatashkent.uz/api/news')
      .then((res) => res.json())
      .then((element) => setNews(element?.data))
      .catch((error) => {
        console.error('Newslarni yuklashda xatolik yuz berdi:', error);
        message.error('Newslarni yuklashda xatolik yuz berdi');
      });
  }

  useEffect(() => {
    getNews();
  }, []);

  // Modalni ochish
  const showModal = (news = null) => {
    setCurrentNews(news);
    if (news) {
      form.setFieldsValue(news); // Modal ochilganda tahrirlash uchun qiymatlarni to'ldirish
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
  const deleteNews = (id) => {
    fetch(`https://api.dezinfeksiyatashkent.uz/api/news/${id}`, {
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
          message.success(items?.message || 'News muvaffaqiyatli o\'chirildi');
          getFaqs();
        } else {
          message.error(items?.message || 'Newsni o\'chirishda xatolik yuz berdi');
        }
      })
      .catch((error) => {
        console.error('Newsni o\'chirishda xatolik yuz berdi:', error);
        message.error("Newsni o'chirishda xatolik yuz berdi");
      });
  };

  // FAQ qo'shish yoki yangilash
  const handleSubmit = (values) => {
    setLoading(true);
    const url = currentNews
      ? `https://api.dezinfeksiyatashkent.uz/api/faqs/${currentNews.id}`
      : 'https://api.dezinfeksiyatashkent.uz/api/faqs';
    const method = currentNews ? 'PUT' : 'POST';

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
          message.success(result?.message || (currentNews ? 'News muvaffaqiyatli yangilandi' : 'News muvaffaqiyatli qo\'shildi'));
          getNews();
          closeModal();
        } else {
          message.error(result?.message || (currentNews ? 'Newsni yangilashda xatolik yuz berdi' : 'Newsni qo\'shishda xatolik yuz berdi'));
        }
      })
      .catch((error) => {
        console.error('Newsni saqlashda xatolik yuz berdi:', error);
        message.error(currentNews ? "Newsni yangilashda xatolik yuz berdi" : "Newsni qo'shishda xatolik yuz berdi");
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
  const NewsData = news.map((news, index) => ({
    key: index,
    text_en: news.text_en,
    title_ru: news.title_ru,
    text_ru: news.text_ru,
    title_uz: news.title_uz,
    text_uz: news.text_uz,
    title_en: news.title_en,
    action: (
      <>
        <Button type="primary" style={{ margin: '10px' }} onClick={() => showModal(news)}>
          Edit
        </Button>
        <Popconfirm
          placement="topLeft"
          title="Newsni o'chirish"
          description="Ushbu Newsni o'chirishni xohlaysizmi?"
          onConfirm={() => deleteFaqs(news.id)}
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
      <Table columns={columns} dataSource={NewsData} />
      <Modal
        title={currentNews ? "Newsni tahrirlash" : "News qo'shish"}
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

