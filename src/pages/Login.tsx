import React from "react";
import type { FormProps } from "antd";
import { Button, Checkbox, Form, Input, Card } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
  captcha?: string;
};

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log("Success:", values, process.env.NEXT_PUBLIC_GITHUB_TOKE);
    localStorage.setItem("token", "token");
    navigate("/");
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Card
      title={isLogin ? "Login" : "Register"}
      style={{ width: 400, margin: "auto", marginTop: "100px" }}
    >
      <Form
        name={isLogin ? "login" : "register"}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>

        {!isLogin && (
          <Form.Item<FieldType>
            label="Captcha:"
            name="captcha"
            rules={[
              { required: true, message: "Please input verification code!" },
            ]}
          >
            <Input.Group compact>
              <Input style={{ width: "calc(100% - 60px)" }} />
              <Button type="primary" style={{ width: 60 }}>
                send
              </Button>
            </Input.Group>
          </Form.Item>
        )}

        <Form.Item<FieldType>
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        {isLogin && (
          <Form.Item<FieldType>
            name="remember"
            valuePropName="checked"
            label={null}
          >
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
        )}

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            {isLogin ? "Log in" : "Register"}
          </Button>
        </Form.Item>
      </Form>
      <div style={{ textAlign: "right", marginTop: "10px" }}>
        {isLogin ? (
          <span
            onClick={toggleMode}
            style={{ color: "#0366d6", cursor: "pointer" }}
          >
            No account? Register here
          </span>
        ) : (
          <span
            onClick={toggleMode}
            style={{ color: "#0366d6", cursor: "pointer" }}
          >
            Have an account? Log in here
          </span>
        )}
      </div>
    </Card>
  );
};

export default Login;
