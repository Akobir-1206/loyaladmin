import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import '../Login/Login.css';

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();

    const onFinish = (values) => {
        fetch("https://api.dezinfeksiyatashkent.uz/api/auth/signin", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                phone_number: values.username,
                password: values.password
            })
        }).then((res) => res.json())
        .then((element) => {
            if (element?.success === true) {
                localStorage.setItem("tokenchik", element?.data?.tokens?.accessToken?.token);
                message.success(element?.message);
                
                const origin = location.state?.from?.pathname || '/';
                navigate(origin);
            } else {
                message.error(element?.message);
            }
        })
        .catch((error) => {
            message.error("Tizimga kirishda xatolik yuz berdi");
            console.error("Login error:", error);
        });
    };

    return (
        <div style={{ maxWidth: 300, margin: '0 auto', paddingTop: 100 }}>
            <h1>Loyal admin </h1>
            <Form
                name="normal_login"
                initialValues={{ remember: true }}
                onFinish={onFinish}
            >
                <Form.Item
                    name="username"
                    rules={[{ required: true, message: 'Iltimos, telefon raqamingizni kiriting!' }]}
                >
                    <Input prefix={<UserOutlined />} placeholder="Telefon raqam" />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Iltimos, parolingizni kiriting!' }]}
                >
                    <Input.Password
                        prefix={<LockOutlined />}
                        type="password"
                        placeholder="Parol"
                    />
                </Form.Item>
                <Form.Item>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Eslab qolish</Checkbox>
                    </Form.Item>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                        Kirish
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}