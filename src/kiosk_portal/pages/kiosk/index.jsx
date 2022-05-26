import { Button, Col, Form, Input, Modal, Pagination, Row, Space, Table } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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
const KioskPage = () =>{
    const [listKiosk,setListKiosk]= useState([])
    const [kioskTotal,setKioskTotal]=useState()
    const [kioskPage,setKioskPage]=useState()
    const [kioskPageSize,setKioskPageSize] =useState()
    const [currentKiosk,setCurrentKiosk] =useState()
    const [isCreateKioskModalVisible,setIsCreateKioskModalVisible]=useState(false)
    const { t } = useTranslation();
    const [createKioskForm] = Form.useForm();
    const kioskColumn = [
        {
          title: t("name"),
          dataIndex: "name",
          key: "name",
          render: (text) => <a>{text}</a>,
        },
        {
          title: t("status"),
          dataIndex: "status",
          key: "status",
          render: (text, record, dataIndex) =>
            record.status === "active" ? (
              <a style={{ color: "green" }}>{t("active")}</a>
            ) : (
              <a style={{ color: "red" }}>{t("deactivate")}</a>
            ),
        },
        {
          title: t("action"),
          key: "action",
          render: (text, record, dataIndex) => (
            <Space size="middle">
              <Button
                type="primary"
                shape="default"
                size={"large"}
                onClick={() => {
                 
                }}
              >
                {t("edit")}
              </Button>
              {record.roleName === "Admin" ? (
                <Button
                  type="primary"
                  shape="default"
                  size={"large"}
                  name={record}
                  disabled="false"
                  onClick={() => {
                    
                  }}
                >
                  {t("change-status")}
                </Button>
              ) : (
                <Button
                  type="primary"
                  shape="default"
                  size={"large"}
                  name={record}
                  onClick={() => {
                   
                  }}
                >
                  {t("change-status")}
                </Button>
              )}
            </Space>
          ),
        },
      ];

    const getListKiosk =()=>{

    }  
    useEffect(() => {
       
      }, []);  
    return (<>
    <Row style={{ padding: 10 }}>
    <Col span={4}>
          <Button
            type="primary"
            size={"large"}
            onClick={()=>{setIsCreateKioskModalVisible(true)}}
          >
            {t("createkiosk")}
          </Button>
    </Col>
    <Col span={24}>
    <Table columns={kioskColumn} dataSource={listKiosk} pagination={false} />
    </Col>
    <Pagination
        defaultCurrent={1}
        total={10}
        pageSize={5}
        onChange={()=>{}}
      />
    </Row>
    <Modal
        title={t("createaccount")}
        visible={isCreateKioskModalVisible}
        onCancel={()=>{setIsCreateKioskModalVisible(false)}}
        footer={null}
      >
        <Form
          {...formItemLayout}
          form={createKioskForm}
          name="CreateKiosk"
          onFinish={()=>{}}
          scrollToFirstError
        >
          <Form.Item
            name="firstName"
            label={t("firstname")}
            rules={[
              {
                required: true,
                message: t("reqfirstname"),
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="lastName"
            label={t("lastname")}
            rules={[
              {
                required: true,
                message: t("reqlastname"),
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            label={t("phonenumber")}
            rules={[
              {
                pattern: new RegExp("^[+0]{0,2}(91)?[0-9]{10}$"),
                message: t("formatphonenumber"),
              },
              {
                required: true,
                message: t("reqphonenumber"),
              },
            ]}
          >
            <Input style={{ width: "100%" }} />
          </Form.Item>
          </Form>
    </Modal>



    </>)
}
export default KioskPage;