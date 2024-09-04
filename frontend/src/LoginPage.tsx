//import md5 from "md5";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { message, Typography } from "antd";
import {
  LoginFormPage,
  ProFormCheckbox,
  ProFormText,
} from "@ant-design/pro-components";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { getInclusionDirectives } from "@apollo/client/utilities";


const { Link } = Typography;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values: any) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/login`, values, {
        headers: { 
          "Content-Type": "application/json", 
        },
      });
      const { token } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("username", values.username);
      message.success("登录成功！");
      return navigate(-1);
    } catch (error) {
      const err = error as AxiosError;
      if (
        values.autoRegister &&
        (err.response?.data as string).includes("User does not exist")
      ) {
        message.info("未找到用户，正在创建新用户");
        try {
          const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/register`, values,{
            headers:{"Content-Type": "application/json",}
          });
          const { token } = response.data;
          localStorage.setItem("token", token);
          localStorage.setItem("username", values.username);
          message.success("注册成功！");
          return navigate(-1);
        } catch (error) {
          console.error(error);
          message.error("注册失败！");
        }
      }
      console.error(error);
      message.error("登录失败！");
    }
  };

  const handleForgetPassword = () => {
    navigate("/user/change-password/request");
  };

  return (
    <LoginFormPage
      style={{ height: "100vh" }}
      backgroundVideoUrl="https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/jXRBRK_VAwoAAAAAAAAAAAAAK4eUAQBr"
      logo="https://eesast.com/android-chrome-192x192.png"
      title="登录账户"
      subTitle="科协暑培(网站部分)学习型工程"
      submitter={{ searchConfig: { submitText: "登录 / 注册" } }}
      onFinish={handleSubmit}
    >
      <ProFormText
        name="username"
        fieldProps={{
          size: "large",
          prefix: <UserOutlined />,
        }}
        placeholder="用户名"
        rules={[{ required: true, message: "请输入用户名！" }]}
        allowClear
      />
      <ProFormText.Password
        name="password"
        fieldProps={{
          size: "large",
          prefix: <LockOutlined />,
        }}
        placeholder="密码"
        rules={[{ required: true, message: "请输入密码！" }]}
        allowClear
      />
      <div style={{ marginBlockEnd: 24 }}>
        <ProFormCheckbox noStyle name="autoRegister" initialValue={true}>
          自动创建新用户
        </ProFormCheckbox>
        <Link style={{ float: "right" }} onClick={handleForgetPassword}>
          忘记密码
        </Link>
      </div>
    </LoginFormPage>
  );
};

export default LoginPage;
