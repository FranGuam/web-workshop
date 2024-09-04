import React from 'react';
import { Form, Input, Button, message } from 'antd';
import axios, {AxiosError} from 'axios';

const RequestPasswordResetPage: React.FC = () => {
  const onFinish = async (values: { email: string }) => {
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/change-password/request`, 
        {username: values.email}, 
        {headers: { "Content-Type": "application/json" },}
    );
    message.success("重置密码邮件已发送！");
    } catch (error) {
        const err = error as AxiosError;
      if(err.response?.status === 422){
        message.error("用户名不为邮箱！");
      }
      else if((err.response?.data as string) === "User does not exist"){
        message.error("用户不存在");  
      }
      message.error("请求失败，请重试！");
    }
  };

  return (
    <Form onFinish={onFinish}>
      <Form.Item
        name="email"
        rules={[{ required: true, message: '请输入您的邮箱！' }]}
      >
        <Input placeholder="邮箱" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          请求重置密码
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RequestPasswordResetPage;