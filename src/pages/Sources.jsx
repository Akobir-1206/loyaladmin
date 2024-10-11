import { Button, Form, Input, message, Modal, Popconfirm, Table, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';

export default function Sources() {
    const [sources, setSources] = useState([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const token = localStorage.getItem('tokenchik');
    const [currentSource, setCurrentSource] = useState(null);

    const getSources = () => {
        fetch('https://api.dezinfeksiyatashkent.uz/api/sources')
            .then((res) => res.json())
            .then((element) => setSources(element?.data))
            .catch((error) => {
                console.error('Manbaalarni yuklashda xatolik yuz berdi:', error);
                message.error('Manbaalarni yuklashda xatolik yuz berdi');
            });
    };

    useEffect(() => {
        getSources();
    }, []);

    const showModal = (item) => {
        setOpen(true);
        setCurrentSource(item);
        form.setFieldsValue(item);
    };

    const closeModal = () => {
        setOpen(false);
        setCurrentSource(null);
        form.resetFields();
    };

    const columns = [
        {
            title: "Title",
            dataIndex: 'title'
        },
        {
            title: "Category",
            dataIndex: 'category'
        },
        {
            title: "Src",
            dataIndex: 'src',
            render: (src) => (
                <img width={150} src={`https://api.dezinfeksiyatashkent.uz/api/uploads/src/${src}`} alt="source" />
            )
        },
        {
            title: "Action",
            dataIndex: 'actions',
            render: (_, source) => (
                <>
                    <Button type='primary' onClick={() => showModal(source)}>Edit</Button>
                    <Popconfirm
                        title="Manbani o'chirish"
                        onConfirm={() => deleteSource(source.id)}
                        okText="Ha"
                        cancelText="Yo'q"
                    >
                        <Button danger>Delete</Button>
                    </Popconfirm>
                </>
            )
        }
    ];

    const deleteSource = (id) => {
        fetch(`https://api.dezinfeksiyatashkent.uz/api/sources/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
        .then((resp) => {
            if (!resp.ok) throw new Error('Server error');
            return resp.json();
        })
        .then((items) => {
            if (items?.success) {
                message.success(items?.message || 'Manba muvaffaqiyatli o\'chirildi');
                getSources();
            } else {
                message.error(items?.message || 'Manbani o\'chirishda xatolik yuz berdi');
            }
        })
        .catch((error) => {
            console.error('Manbani o\'chirishda xatolik yuz berdi:', error);
            message.error("Manbani o'chirishda xatolik yuz berdi");
        });
    };

    const handleSubmit = (values) => {
        setLoading(true);
        const url = currentSource
            ? `https://api.dezinfeksiyatashkent.uz/api/sources/${currentSource.id}`
            : 'https://api.dezinfeksiyatashkent.uz/api/sources';
        const method = currentSource ? 'PUT' : 'POST';

        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('category', values.category);
        if (values.src?.fileList?.[0]?.originFileObj) {
            formData.append('src', values.src.fileList[0].originFileObj);
        }

        fetch(url, {
            method,
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        })
        .then((res) => res.json())
        .then((result) => {
            if (result?.success) {
                message.success(result?.message || 'Manba muvaffaqiyatli saqlandi');
                getSources();
                closeModal();
            } else {
                message.error(result?.message || 'Xatolik yuz berdi');
            }
        })
        .catch((error) => {
            console.error('Saqlashda xatolik yuz berdi:', error);
            message.error('Saqlashda xatolik yuz berdi');
        })
        .finally(() => {
            setLoading(false);
        });
    };

    return (
        <div>
            <Button type='primary' onClick={() => setOpen(true)}>Add</Button>
            <Table columns={columns} dataSource={sources.map((source, index) => ({
                ...source,
                key: index
            }))} />
            <Modal title={currentSource ? 'Manbani tahrirlash' : 'Yangi manba qo\'shish'} open={open} onCancel={closeModal} footer={null}>
                <Form form={form} onFinish={handleSubmit}>
                    <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Sarlavha kiriting' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Category" name="category" rules={[{ required: true, message: 'Kategoriyani kiriting' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Image" name="src" valuePropName="fileList" getValueFromEvent={e => e?.fileList} rules={[{ required: !currentSource, message: 'Rasm yuklang' }]}>
                        <Upload listType="picture" beforeUpload={() => false}>
                            <Button icon={<UploadOutlined />}>Rasm yuklash</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            {currentSource ? 'Yangilash' : 'Qo\'shish'}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
