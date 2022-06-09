import { AutoComplete, Button, Col, Form, Pagination, Row, Select, Space, Table } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getListAppCategoryService } from "../../services/app_category_service";


const AppCategoryPage = () => {
    const [appCategoryList, setAppCategoryList] = useState([])
    const [appCategoryPage,setAppCategoryPage]=useState(1)
    const [appCategoryPageSize,setAppCategoryPageSize]=useState(5)
    const [appCategoryPageTotal,setAppCategoryPageTotal]=useState(0)
    const { t } = useTranslation()
    const { form } = Form.useForm()
    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (text) => <a>{text}</a>,
        },

        {
            title: "Logo",
            dataIndex: "logo",
            key: "logo",
            render: (text) => <img style={{ height: 80, weight: 80 }} src={text} />,
        },
    ];
    const getAppCategoryList = async () => {
        getListAppCategoryService();
    }
    useEffect(async () => {
        getAppCategoryList(appCategoryPage,appCategoryPageSize);
    }, []);


    return (
        <>
            <Row style={{ padding: 10 }}>
                <Col span={15}>
                    <Form
                        form={form}
                        name="search"
                        //   onFinish={onFinishSearch}
                        initialValues={{
                            type: "FirstName",
                            searchString: "",
                        }}
                    >
                        <Row>
                            <Col span={10}>
                                <Form.Item name="searchString" style={{ marginTop: 5 }}>
                                    <AutoComplete
                                        style={{ width: "100%" }}
                                        options={[]}
                                        placeholder="Search..."
                                        filterOption={(inputValue, option) =>
                                            option.value
                                                .toUpperCase()
                                                .indexOf(inputValue.toUpperCase()) !== -1
                                        }
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={3}>
                                <Form.Item>
                                    <Button
                                        htmlType="submit"
                                        style={{ marginLeft: 10, borderRadius: 5 }}
                                        type="primary"
                                        size={"large"}
                                    >
                                        Search
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Col>
                <Col span={5} />
                <Col span={4}>
                    <Button
                        className="success-button"
                        size={"large"}
                        onClick={() => { }}
                    >
                        Create app category
                    </Button>
                </Col>
            </Row>
            <Table
                columns={columns}
                dataSource={appCategoryList}
                pagination={false}
            />
            <Pagination
                defaultCurrent={1}
                total={0}
                pageSize={5}
                onChange={() => { }}
            />
        </>

    );
};
export default AppCategoryPage;
