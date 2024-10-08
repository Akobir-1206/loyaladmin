import React, { useEffect, useState } from 'react';
import { Button, Form, Input, message, Modal, Popconfirm, Table } from 'antd';
import { toast } from 'react-toastify';

export default function Category() {
  const [categ, setCateg] = useState([]);
  const tokenxon = localStorage.getItem('tokenchik');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm(); 

  function getCategory() {
    fetch('https://api.dezinfeksiyatashkent.uz/api/categories')
      .then((res) => res.json())
      .then((element) => setCateg(element?.data))
      .catch((error) => {
        console.error('Error fetching categories:', error);
        toast.error('Kategoriyalarni yuklashda xatolik yuz berdi');
      });
  }

  useEffect(() => {
    getCategory();
  }, []);

  const showModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    form.resetFields(); // Reset the form fields when closing the modal
  };

  ///////////DELETE///////////////
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

  ///////////SUBMIT FORM///////////////
  const handleSubmit = (values) => {
    setLoading(true); // Set loading state
    fetch('https://api.dezinfeksiyatashkent.uz/api/categories', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenxon}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result?.success) {
          message.success(result?.message || 'Category added successfully');
          getCategory(); // Refresh category list
          closeModal(); // Close modal on success
        } else {
          message.error(result?.message || 'Error adding category');
        }
      })
      .catch((error) => {
        console.error('Error adding category:', error);
        toast.error("Kategoriyani qo'shishda xatolik yuz berdi");
      })
      .finally(() => {
        setLoading(false); 
      });
  };
   
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

  const Akobir = categ.map((category, index) => ({
    key: index,
    number: index + 1,
    id: category.id,
    name: category.name,
    description: category.description,
    action: (
      <>
        <Button type="primary" style={{ margin: '10px' }}>Edit</Button>
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
      <Button type="primary" onClick={showModal} style={{ marginBottom: '10px' }}>
        Add
      </Button>
      <Table columns={columns} dataSource={Akobir} />
      <Modal
        title="Category qo'shish"
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
          <Form.Item label="Name" name="name">
            <Input placeholder="name" required/>
          </Form.Item>
          <Form.Item label="Descrip" name="description">
            <Input placeholder="description" required/>
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
