import { Button, Checkbox, Col, DatePicker, Form, Input, Modal, Pagination, Popconfirm, Row, Select, Space, Table } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { changeStatusAccountService, createAccountService, getListAccountService, getListRoleService } from "../../../@app/services/user_service";
import moment from 'moment';

const AccountManager = () => {
    const { Option } = Select;
    const { t } = useTranslation();
    const [listAccount, setListAccount] = useState([]);
    const [totalAccount, setTotalAccount] = useState(0);
    const [numAccountInPage, setNumAccountInPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [listRole, setListRole] = useState([]);
    const [isCreateAccountModalVisible, setIsCreateAccountModalVisible] = useState(false);
    const [form] = Form.useForm();

    const getListAccountFunction = async (currentPageToGetList, numInPage) => {
        try {
            await getListAccountService(currentPageToGetList, numInPage)
                .then(res => {
                    // const newArray = res.map((a) =>
                    //     console.log("a: " + a)

                    // )
                    // console.log("new Array: " + newArray);

                    setTotalAccount(res.data.metadata.total);
                    setListAccount(res.data.data);
                })
        } catch (error) {
            console.log(error);
        }
    }
    const listRoleFunction = async () => {
        try {
            await getListRoleService()
                .then(res => {
                    setListRole(res.data);
                })
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getListAccountFunction(currentPage, numAccountInPage);
        listRoleFunction();
    }, []);


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

    const onFinishCreateAccount = async (values) => {
        const newAccount = {
            "firstName": values.firstName,
            "lastName": values.lastName,
            "phoneNumber": values.phoneNumber,
            "email": values.email,
            "address": values.address,
            "dateOfBirth": values.dateOfBirth,
            "roleId": values.roleId
        }
        try {
            await createAccountService(newAccount).then(() => {
                getListAccountFunction(currentPage, numAccountInPage);
                setIsCreateAccountModalVisible(false);
                toast.success(t('toastSuccessCreateAccount'));
            });


        } catch (error) {
            console.log(error);
        }

    };

    const showModalCreateAccount = () => {
        setIsCreateAccountModalVisible(true);
        form.resetFields();
    };

    const handleCancelCreateAccount = () => {
        setIsCreateAccountModalVisible(false);
    };

    const handleChangeStatusAccount =async (record) =>{
        Modal.confirm({
            title:t('confirmChangeStatusAccount'), 
            okText:t('yes'),
            cancelText:t('no'),
            onOk:async () =>{{
                    try {
                        await changeStatusAccountService(record.id,null).then(()=>{
                            getListAccountFunction(currentPage, numAccountInPage);
                            toast.success(t('toastSuccessChangeStatus'));
                            } 
                        )
                    } catch (error) {
                        console.log(error);
                    }
                    
                }
            }
        })
    }

    const handleChangeNumberOfPaging = async (page, pageSize) => {
        setCurrentPage(page);
        await getListAccountFunction(page, numAccountInPage);
    }

    const converDate = (stringToConvert) => {
        return moment(new Date(stringToConvert)).format('DD/MM/YYYY');
    }
       

    const columns = [
        {
            title: t('firstname'),
            dataIndex: 'firstName',
            key: 'firstname',
            render: text => <a>{text}</a>,
        },
        {
            title: t('lastname'),
            dataIndex: 'lastName',
            key: 'lastname',
            render: text => <a>{text}</a>,
        },
        {
            title: t('phonenumber'),
            dataIndex: 'phoneNumber',
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
            dataIndex: 'dateOfBirth',
            key: 'dob',
            render: text => 
                <a>
                    {
                         converDate(text)
                    }
                </a>
            
           
        },
        {
            title: t('role'),
            dataIndex: 'roleName',
            key: 'role',
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
            render: (text, record,dataIndex) => (
                <Space size="middle">
                    <Button type="primary" shape="default" size={"large"} onClick={{}}>
                        {t('edit')}
                    </Button>
                    <Button type="primary" shape="default" size={"large"} name={record}
                        onClick={() => {
                            handleChangeStatusAccount(record)
                        }}>
                        {t('change-status')}
                    </Button>
                </Space>
            ),
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
        <Table columns={columns} dataSource={listAccount} pagination={false} />;
        <Pagination defaultCurrent={1} total={totalAccount} pageSize={5} onChange={handleChangeNumberOfPaging} />;
        <Modal title={t('createaccount')} visible={isCreateAccountModalVisible} onCancel={handleCancelCreateAccount}
            footer={null}
        >
            <Form
                {...formItemLayout}
                form={form}
                name="register"
                onFinish={onFinishCreateAccount}
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
                    name="phoneNumber"
                    label={t('phonenumber')}
                    rules={[
                        {
                            pattern: new RegExp("^[+0]{0,2}(91)?[0-9]{10}$"),
                            message: t('formatphonenumber')
                        },
                        {
                            required: true,
                            message: t('reqphonenumber')
                        }
                    ]}
                >
                    <Input style={{ width: '100%' }} />
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
                <Form.Item name="dateOfBirth" label={t('dob')} {...config} >
                    <DatePicker
                        placeholder={t('selectdob')}
                        format="DD/MM/YYYY"
                        allowClear={false}
                        style={{
                            height: "auto",
                            width: "auto",
                        }}
                    />
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
                        <Option value="male">{t('male')}</Option>
                        <Option value="female">{t('female')}</Option>
                        <Option value="other">{t('other')}</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="roleId"
                    label={t('role')}
                    rules={[{ required: true, message: t('reqrole') }]}
                >
                    <Select placeholder={t('selectrole')} >
                        {listRole.map((item) => {
                            return <Option value={item.id}>{item.name}</Option>
                        })}
                    </Select>
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