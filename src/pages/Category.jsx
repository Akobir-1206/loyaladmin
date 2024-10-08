import React, { useEffect, useState } from 'react';
import { Button, Form, Input, message, Modal, Popconfirm, Table } from 'antd';
import { toast } from 'react-toastify';

export default function Category() {
  const [categ, setCateg] = useState([]);
  const tokenxon = localStorage.getItem('tokenchik');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null); 
  const [form] = Form.useForm();


  function getCategory() {
    fetch('https://api.dezinfeksiyatashkent.uz/api/categories')
      .then((res) => res.json())
      .then((element) => setCateg(element?.data))
      .catch((error) => {
        console.error('Error fetching categories:', error);
        message.error('Kategoriyalarni yuklashda xatolik yuz berdi');
      });
  }

  useEffect(() => {
    getCategory();
  }, []);

  // Show modal for adding or editing category
  const showModal = (category = null) => {
    setCurrentCategory(category); // If null, it's an Add, otherwise it's an Edit
    if (category) {
      form.setFieldsValue(category); // Prepopulate the form for editing
    } else {
      form.resetFields(); // Reset the form for adding a new category
    }
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    form.resetFields();
  };


  const deleteCategory = (id) => {
    fetch(`https://api.dezinfeksiyatashkent.uz/api/categories/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${tokenxon}`,
        'Content-Type': 'application/json',
      },
    })
      .then((resp) => {
        if (!resp.ok) {
          throw new Error('Server error');
        }
        return resp.json();
      })
      .then((items) => {
        if (items?.success) {
          message.success(items?.message || 'Category deleted successfully');
          getCategory();
        } else {
          message.error(items?.message || 'Error deleting category');
        }
      })
      .catch((error) => {
        console.error('Error deleting category:', error);
        toast.error("Kategoriyani o'chirishda xatolik yuz berdi");
      });
  };

  // Handle form submission for adding or editing a category
  const handleSubmit = (values) => {
    setLoading(true);
    const url = currentCategory
      ? `https://api.dezinfeksiyatashkent.uz/api/categories/${currentCategory.id}`
      : 'https://api.dezinfeksiyatashkent.uz/api/categories';
    const method = currentCategory ? 'PUT' : 'POST';

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
          message.success(result?.message || (currentCategory ? 'Category updated successfully' : 'Category added successfully'));
          getCategory(); // Refresh category list
          closeModal(); // Close modal on success
        } else {
          message.error(result?.message || (currentCategory ? 'Error updating category' : 'Error adding category'));
        }
      })
      .catch((error) => {
        console.error('Error saving category:', error);
        toast.error(currentCategory ? "Kategoriyani yangilashda xatolik yuz berdi" : "Kategoriyani qo'shishda xatolik yuz berdi");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Table columns configuration
  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
    },
    {
      title: 'Action',
      dataIndex: 'action',
    },
  ];

  // Data for the table
  const Akobir = categ.map((category, index) => ({
    key: index,
    id: category.id,
    name: category.name,
    description: category.description,
    action: (
      <>
        <Button type="primary" style={{ margin: '10px' }} onClick={() => showModal(category)}>
          Edit
        </Button>
        <Popconfirm
          placement="topLeft"
          title="Kategoriyani o'chirish"
          description="Ushbu kategoriyani o'chirishni xohlaysizmi?"
          onConfirm={() => deleteCategory(category.id)}
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
      <Table columns={columns} dataSource={Akobir} />
      <Modal
        title={currentCategory ? "Category o'zgartirish" : "Category qo'shish"}
        open={open}
        footer={null}
        onCancel={closeModal}
      >
        <Form
          form={form}
          labelCol={{
            span: 3,
          }}
          wrapperCol={{
            span: 20,
          }}
          style={{
            maxWidth: 700,
          }}
          onFinish={handleSubmit}
        >
          <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input the name!' }]}>
            <Input placeholder="name" />
          </Form.Item>
          <Form.Item label="Description" name="description" rules={[{ required: true, message: 'Please input the description!' }]}>
            <Input placeholder="description" />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
