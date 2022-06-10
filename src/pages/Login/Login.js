import react, {useState} from 'react';
import { MailOutlined,LockOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';

const LoginPage = () => {
    const [loadings, setLoadings] = useState(true);
    const onFinish = (values) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <div className="container">
            <div className="row">
                <div className="col-sm-12 col-md-6">
                    <img src="https://static.vecteezy.com/system/resources/thumbnails/005/879/539/small_2x/cloud-computing-modern-flat-concept-for-web-banner-design-man-enters-password-and-login-to-access-cloud-storage-for-uploading-and-processing-files-illustration-with-isolated-people-scene-free-vector.jpg"/>
                </div>
                <div className="col-sm-12 col-md-6">
                    <p>LOGIN</p>
                    <Form
                        name="basic"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        className="login-form"
                    >
                        <Form.Item
                            name="email"
                            rules={[{ required: true, message: 'Please input your email!' }]}
                        >
                            <Input
                                placeholder="Email"
                                className="login-input"
                                prefix={<MailOutlined />}
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input.Password
                                placeholder="Password"
                                className="login-input"
                                prefix={<LockOutlined />}
                            />
                        </Form.Item>

                        <Form.Item wrapperCol={{ offset: 0, span: 16 }} style={{textAlign: "center"}}>
                            <Button type="primary" loading shape="round" size="large" >
                                Login
                            </Button>
                        </Form.Item>
                    </Form>
                    <p>do not have account</p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;