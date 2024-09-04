import React from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const ResetPasswordPage: React.FC = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const onFinish = async (values: { token: any; password: any; }) => {
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/change-password/action`, 
        {
            token: values.token,
            newPassword: values.password
        },
        {headers: { "Content-Type": "application/json" },}
    );
      message.success("密码重置成功！");
    } catch (error) {
        console.log(values.token);
        console.log(values.password);
      console.error(error);
      message.error("重置密码失败，请重试！");
    }
  };

  return (
    <Form onFinish={onFinish}>
      <Form.Item
        name="password"
        rules={[{ required: true, message: '请输入新密码！' }]}
      >
        <Input.Password placeholder="新密码" />
        </Form.Item>

    <Form.Item
      name="token"
      rules={[{ required: true, message: '请输入token!' }]}
    >
      <Input placeholder="token" />
    </Form.Item>
      
      <Form.Item>
        <Button type="primary" htmlType="submit">
          重置密码
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ResetPasswordPage;