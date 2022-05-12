import { Button, Checkbox, Col, DatePicker, Form, Input, Modal, Row, Select, Space, Table } from "antd";
import { useState } from "react";


const AccountManager = () => {
    const { Option } = Select;
    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 8 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 },
        },
    };
    const tailFormItemLayout = {
        wrapperCol: {
            xs: {
                span: 24,
                offset: 0,
            },
            sm: {
                span: 16,
                offset: 8,
            },
        },
    };
    const [form] = Form.useForm();

    const onFinishCreateAccount = (values) => {
        console.log('Received values of form: ', values);
    };

    const prefixSelector = (
        <Form.Item name="prefix" noStyle>
            <Select style={{ width: 70 }}>
                <Option value="86">+86</Option>
                <Option value="87">+87</Option>
            </Select>
        </Form.Item>
    );

    const [isCreateAccountModalVisible, setIsCreateAccountModalVisible] = useState(false);
    const showModalCreateAccount = () => {
        setIsCreateAccountModalVisible(true);
        form.resetFields();
    };
    const handleOkCreateAccount = () => {
        setIsCreateAccountModalVisible(false);
    };

    const handleCancelCreateAccount = () => {
        setIsCreateAccountModalVisible(false);
    };
    const columns = [
        {
            title: 'Full Name',
            dataIndex: 'fullname',
            key: 'fullname',
            render: text => <a>{text}</a>,
        },
        {
            title: 'Phone Number',
            dataIndex: 'phonenumber',
            key: 'phonenumber',
            render: text => <a>{text}</a>,
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
            render: text => <a>{text}</a>,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render: text => <a>{text}</a>,
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            render: text => <a>{text}</a>,
        },
        {
            title: 'DOB',
            dataIndex: 'dob',
            key: 'dob',
            render: text => <a>{text}</a>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: text => <a>{text}</a>,
        },

        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button type="primary" shape="default" size={"large"} onClick={{}}>
                        Edit
                    </Button>
                </Space>
            ),
        },
    ];

    const data = [
        {
            fullname: '1',
            phonenumber: 'John Brown',
            gender: 'Man',
            email: 32,
            address: 'New York No. 1 Lake Park',
            dob: ['nice', 'developer'],
            status: 'a',
        },
        {
            fullname: '1',
            phonenumber: 'John Brown',
            gender: 'Man',
            email: 32,
            address: 'New York No. 1 Lake Park',
            dob: ['nice', 'developer'],
            status: 'a',
        },
        {
            fullname: '1',
            phonenumber: 'John Brown',
            gender: 'Man',
            email: 32,
            address: 'New York No. 1 Lake Park',
            dob: ['nice', 'developer'],
            status: 'a',
        },
    ];

    const config = {
        rules: [
            {
                type: 'object',
                required: true,
                message: 'Please select time!',
            },
        ],
    };
    return (<>

        <Row style={{ padding: 10 }}>
            <Col span={20}></Col>
            <Col span={4}>
                <Button type="primary" shape="round" size={"large"} onClick={showModalCreateAccount}>
                    Create Account
                </Button>
            </Col>
        </Row>
        <Table columns={columns} dataSource={data} />;
        <Modal title="Create Account" visible={isCreateAccountModalVisible} onOk={handleOkCreateAccount} onCancel={handleCancelCreateAccount}>
            <Form
                {...formItemLayout}
                form={form}
                name="register"
                onFinish={onFinishCreateAccount}
                initialValues={{
                    residence: ['zhejiang', 'hangzhou', 'xihu'],
                    prefix: '86',
                }}
                scrollToFirstError
            >
                <Form.Item
                    name="firstName"
                    label="First Name"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your first name!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="lastName"
                    label="Last Name"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your last name!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="phone"
                    label="Phone Number"
                    rules={[{ required: true, message: 'Please input your phone number!' }]}
                >
                    <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                    name="address"
                    label="Address"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your address!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item name="date-picker" label="DatePicker" {...config}>
                    <DatePicker />
                </Form.Item>
                <Form.Item
                    name="email"
                    label="E-mail"
                    rules={[
                        {
                            type: 'email',
                            message: 'The input is not valid E-mail!',
                        },
                        {
                            required: true,
                            message: 'Please input your E-mail!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                    hasFeedback
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="confirm"
                    label="Confirm Password"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Please confirm your password!',
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('The two passwords that you entered do not match!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="gender"
                    label="Gender"
                    rules={[{ required: true, message: 'Please select gender!' }]}
                >
                    <Select placeholder="select your gender">
                        <Option value="male">Male</Option>
                        <Option value="female">Female</Option>
                        <Option value="other">Other</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="role"
                    label="Role"
                    rules={[{ required: true, message: 'Please select role!' }]}
                >
                    <Select placeholder="select your role">
                        <Option value="a">a</Option>
                        <Option value="b">b</Option>
                        <Option value="c">c</Option>
                    </Select>
                </Form.Item>

                <Form.Item label="Captcha" extra="We must make sure that your are a human.">
                    <Row gutter={8}>
                        <Col span={12}>
                            <Form.Item
                                name="captcha"
                                noStyle
                                rules={[{ required: true, message: 'Please input the captcha you got!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Button>Get captcha</Button>
                        </Col>
                    </Row>
                </Form.Item>

                <Form.Item
                    name="agreement"
                    valuePropName="checked"
                    rules={[
                        {
                            validator: (_, value) =>
                                value ? Promise.resolve() : Promise.reject(new Error('Should accept agreement')),
                        },
                    ]}
                    {...tailFormItemLayout}
                >
                    <Checkbox>
                        I have read the <a href="">agreement</a>
                    </Checkbox>
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">
                        Register
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    </>)
}
export default AccountManager;