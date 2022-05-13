import { Button, Checkbox, Col, DatePicker, Form, Input, Modal, Row, Select, Space, Table } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";


const AccountManager = () => {
    const { Option } = Select;
    const { t } = useTranslation();
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
            title: t('fullname'),
            dataIndex: 'fullname',
            key: 'fullname',
            render: text => <a>{text}</a>,
        },
        {
            title: t('phonenumber'),
            dataIndex: 'phonenumber',
            key: 'phonenumber',
            render: text => <a>{text}</a>,
        },
        {
            title: t('gender'),
            dataIndex: 'gender',
            key: 'gender',
            render: text => <a>{text}</a>,
        },
        {
            title: t('email'),
            dataIndex: 'email',
            key: 'email',
            render: text => <a>{text}</a>,
        },
        {
            title: t('address'),
            dataIndex: 'address',
            key: 'address',
            render: text => <a>{text}</a>,
        },
        {
            title: t('dob'),
            dataIndex: 'dob',
            key: 'dob',
            render: text => <a>{text}</a>,
        },
        {
            title: t('status'),
            dataIndex: 'status',
            key: 'status',
            render: text => <a>{text}</a>,
        },

        {
            title: t('action'),
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button type="primary" shape="default" size={"large"} onClick={{}}>
                        {t('edit')}
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
                message: t('reqdob'),
            },
        ],
    };
    return (<>

        <Row style={{ padding: 10 }}>
            <Col span={20}></Col>
            <Col span={4}>
                <Button type="primary" shape="round" size={"large"} onClick={showModalCreateAccount}>
                    {t('createaccount')}
                </Button>
            </Col>
        </Row>
        <Table columns={columns} dataSource={data} />;
        <Modal title={t('createaccount')} visible={isCreateAccountModalVisible} onOk={handleOkCreateAccount} onCancel={handleCancelCreateAccount}>
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
                    label={t('firstname')}
                    rules={[
                        {
                            required: true,
                            message: t('reqfirstname'),
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="lastName"
                    label={t('lastname')}
                    rules={[
                        {
                            required: true,
                            message: t('reqlastname'),
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="phone"
                    label={t('phonenumber')}
                    rules={[{ required: true, message: t('reqphonenumber') }]}
                >
                    <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                    name="address"
                    label={t('address')}
                    rules={[
                        {
                            required: true,
                            message: t('reqaddress'),
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item name="date-picker" label={t('dob')} {...config}>
                    <DatePicker />
                </Form.Item>
                <Form.Item
                    name="email"
                    label={t('email')}
                    rules={[
                        {
                            type: 'email',
                            message: 'The input is not valid E-mail!',
                        },
                        {
                            required: true,
                            message: t('reqemail'),
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="password"
                    label={t('password')}
                    rules={[
                        {
                            required: true,
                            message: t('reqpassword'),
                        },
                    ]}
                    hasFeedback
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="confirm"
                    label={t('confirmpassword')}
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: t('reqconfpassword'),
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error(t('reqsamepassword')));
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="gender"
                    label={t('gender')}
                    rules={[{ required: true, message: t('reqgender') }]}
                >
                    <Select placeholder={t('selectgender')}>
                        <Option value="male">Male</Option>
                        <Option value="female">Female</Option>
                        <Option value="other">Other</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="role"
                    label={t('role')}
                    rules={[{ required: true, message: t('reqrole') }]}
                >
                    <Select placeholder={t('selectrole')}>
                        <Option value="a">a</Option>
                        <Option value="b">b</Option>
                        <Option value="c">c</Option>
                    </Select>
                </Form.Item>

                <Form.Item label={t('captcha')} extra={t('hintcaptcha')}>
                    <Row gutter={8}>
                        <Col span={12}>
                            <Form.Item
                                name="captcha"
                                noStyle
                                rules={[{ required: true, message: t('reqcaptcha') }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Button>{t('getcaptcha')}</Button>
                        </Col>
                    </Row>
                </Form.Item>

                <Form.Item
                    name="agreement"
                    valuePropName="checked"
                    rules={[
                        {
                            validator: (_, value) =>
                                value ? Promise.resolve() : Promise.reject(new Error(t('reqcheckbox'))),
                        },
                    ]}
                    {...tailFormItemLayout}
                >
                    <Checkbox>
                        {t('checkboxcreateaccount')}<a href="">{t('checkboxcreateaccount2')}</a>
                    </Checkbox>
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">
                        {t('register')}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    </>)
}
export default AccountManager;