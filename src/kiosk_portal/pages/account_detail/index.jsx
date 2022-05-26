import { Button, Col, Collapse, Form, Input, Modal, Pagination, Row, Select, Space, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { PRIMARY_COLOR } from "../../../@app/constants/colors";
import { getListKioskService } from "../../services/kiosk_service";
import "./styles.css"
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
const searchTypeKiosk = [
  {
    name: "Name",
    label: "Name",
  }
];
const { Option } = Select;
const { Panel } = Collapse;
const AccountDetailPage = () => {
  const { partyId } = useParams()
  const [listKiosk, setListKiosk] = useState([])
  const [kioskTotal, setKioskTotal] = useState(0)
  const [kioskPage, setKioskPage] = useState(0)
  const [kioskPageSize, setKioskPageSize] = useState(5)
  const [kioskLocations, setKioskLocations] = useState()
  const [currentKiosk, setCurrentKiosk] = useState()
  const [isCreateKioskModalVisible, setIsCreateKioskModalVisible] = useState(false)
  const { t } = useTranslation();
  const [searchKioskForm,createKioskForm]=Form.useForm()
  const kioskColumn = [
    {
      title: t("id"),
      dataIndex: "id",
      key: "id",
      render: (text) => <a>{text}</a>,
    },
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
          <Tag color={"green"}>{t("active")}</Tag>
        ) : (
          <Tag color={"red"}>{t("deactivate")}</Tag>
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
  
  const handlePaginationKioskTable = async (page, pageSize) => {
    setKioskPage(page);
    await getListKiosk(page, kioskPageSize);
  };
  const getListKiosk = async (partyId, kioskPage, kioskPageSize) => {
    getListKioskService(partyId, kioskPage, kioskPageSize).then(({ data }) => {
      setListKiosk(data.data)
      setKioskPage(data.metadata.page)
      setKioskTotal(data.metadata.total)
      setKioskPageSize(data.metadata.size)
    })
  }
  const onFinishSearchKiosk=()=>{

  }
  const prefixSearchKiosk = (
    <Form.Item name="type" noStyle>
      <Select defaultValue="Name">
        {searchTypeKiosk.map((item) => {
          return <Option value={item.name}>{item.label}</Option>;
        })}
      </Select>
    </Form.Item>
  );
  useEffect(() => {
    getListKiosk(partyId, kioskPage, kioskPageSize)
  }, []);
  return (<>
    <Collapse defaultActiveKey={['1']} >
      <Panel header="Kiosks" key="1" style={{color:"#ffff",fontWeight:"bold"}}>
        <div >

          <Row style={{ padding: 10 }}>
            <Col span={15}>
              <Form
                form={searchKioskForm}
                name="search"
                onFinish={onFinishSearchKiosk}
                initialValues={{
                  type: "Name",
                  searchString: "",
                }}
              >
                <Row>
                  <Col span={14}>
                    <Form.Item name="searchString" style={{ marginTop: 5 }}>
                      <Input
                        addonBefore={prefixSearchKiosk}
                        style={{ width: "100%" }}
                        placeholder="Search..."
                        value=""
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
                  <Col span={3}>
                    <Button
                      type="danger"
                      size={"large"}
                      onClick={()=>{}}

                    >
                      Advanced Search
                    </Button>
                  </Col>

                </Row>
              </Form>
            </Col>
            <Col span={5} />
            <Col span={4}>
              <Button
                className="success-button"
                size={"large"}
                onClick={() => { setIsCreateKioskModalVisible(true) }}
              >
                {t("createkiosk")}
              </Button>
            </Col>
          </Row>
          <Col span={24}>
            <Table columns={kioskColumn} dataSource={listKiosk} pagination={false} />
          </Col>
          <Pagination
            defaultCurrent={kioskPage}
            total={kioskTotal}
            pageSize={kioskPageSize}
            onChange={handlePaginationKioskTable}
          />
        </div>
      </Panel>
    </Collapse>
    <Modal
      title={t("createkiosk")}
      visible={isCreateKioskModalVisible}
      onCancel={() => { setIsCreateKioskModalVisible(false) }}
      footer={null}
    >
      <Form
        {...formItemLayout}
        form={createKioskForm}
        name="CreateKiosk"
        onFinish={() => { }}
        initialValues={{ "name": "kiosk" + "-" + (kioskTotal + 1) }}
        scrollToFirstError
      >
        <Form.Item
          name="name"
          label={t("name")}
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          name={t("location")}
          label={t("location")}
        >
          <Select placeholder="Select province">
            <Option value="Zhejiang">Zhejiang</Option>
            <Option value="Jiangsu">Jiangsu</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  </>)
}
export default AccountDetailPage;