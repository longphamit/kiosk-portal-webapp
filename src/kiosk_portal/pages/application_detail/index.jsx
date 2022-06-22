import {
  Avatar,
  Button,
  Col,
  Descriptions,
  Form,
  Modal,
  Popconfirm,
  Row,
  Tag,
} from "antd";
import { useEffect, useState } from "react";
import Iframe from "react-iframe";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ROLE_ADMIN } from "../../../@app/constants/role";
import { localStorageGetReduxState } from "../../../@app/services/localstorage_service";
import { getApplicationServiceById } from "../../services/application_service";
import {
  approveAppPublishRequestService,
  getInprogressAppPublishRequestByAppIdService,
} from "../../services/app_publish_request_service";
import FormDenyAppPublishRequest from "./formDenyPublishRequest";
import "./styles.css";
const ApplicationDetailPage = () => {
  const { appId } = useParams();
  const [app, setApp] = useState();
  const [inprogressPublish, setInprogressPublish] = useState();
  const [isDenyAppPublishModalVisible, setDenyAppPublishModalVisible] =
    useState(false);
  const role = localStorageGetReduxState().auth.role;
  const getAppById = async () => {
    const res = await getApplicationServiceById(appId);
    setApp(res.data);
    console.log(res.data);
  };
  const getInprogressAppPublishRequestByAppId = async () => {
    try {
      const res = await getInprogressAppPublishRequestByAppIdService(appId);
      console.log(res.data);
      setInprogressPublish(res.data);
    } catch (e) {
      setInprogressPublish(null);
      console.log(e);
    }
  };
  useEffect(() => {
    getAppById();
    getInprogressAppPublishRequestByAppId();
  }, []);
  const approveAppPublishRequest = async () => {
    try {
      const res = await approveAppPublishRequestService(inprogressPublish.id);
      await getAppById();
      await getInprogressAppPublishRequestByAppId();
      toast.success("Approve publish app success");
    } catch (e) {
      console.log(e);
    }
  };
  const onDenySuccess = async () => {
    setDenyAppPublishModalVisible(false);
    await getInprogressAppPublishRequestByAppId();
    await getAppById();
    toast.success("Approve publish app success");
  };
  return (
    <>
      {app ? (
        <>
          <div id="account-info-panel">
            <Col span={24}>
              <Descriptions title="App Info">
                <Descriptions.Item
                  label="Name"
                  labelStyle={{ fontWeight: "bold" }}
                >
                  {app.name}
                </Descriptions.Item>
                <Descriptions.Item
                  label="Category"
                  labelStyle={{ fontWeight: "bold" }}
                >
                  {app.appCategoryName}
                </Descriptions.Item>
                <Descriptions.Item
                  label="Party"
                  labelStyle={{ fontWeight: "bold" }}
                >
                  {app.partyName}
                </Descriptions.Item>
                <Descriptions.Item
                  label="Party Email"
                  labelStyle={{ fontWeight: "bold" }}
                >
                  {app.partyEmail}
                </Descriptions.Item>
                <Descriptions.Item
                  label="Status"
                  labelStyle={{ fontWeight: "bold" }}
                >
                  {app.status === "available" ? (
                    <Tag color="green">{app.status}</Tag>
                  ) : (
                    <Tag color="red">{app.status}</Tag>
                  )}
                </Descriptions.Item>
                <Descriptions.Item>
                  <Avatar
                    size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                    icon={<img src={app.logo} />}
                  />
                </Descriptions.Item>
              </Descriptions>
            </Col>
            <Col>
              {role === ROLE_ADMIN ? (
                <>
                  <Row>
                    {inprogressPublish ? (
                      <>
                        <Popconfirm
                          title="Are you sure to approve this app?"
                          onConfirm={() => {
                            approveAppPublishRequest();
                          }}
                          onCancel={() => {}}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button
                            className="success-button"
                            style={{ margin: 10 }}
                          >
                            Approve Publish
                          </Button>
                        </Popconfirm>
                        <Popconfirm
                          title="Are you sure to deny this app?"
                          onConfirm={() => {
                            setDenyAppPublishModalVisible(true);
                          }}
                          onCancel={() => {}}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button
                            className="danger-button"
                            style={{ margin: 10 }}
                          >
                            Deny Publish
                          </Button>
                        </Popconfirm>
                      </>
                    ) : null}
                  </Row>
                </>
              ) : null}
            </Col>
          </div>
          <div className="app-description-portail">
            <Row>
              <Col span={24}>{app.description}</Col>
            </Row>
          </div>
          <div>
            <Row>
              <Col span={24}>
                <Iframe
                  url={app.link}
                  width="100%"
                  height="600px"
                  id="myId"
                  className="myClassname"
                  display="initial"
                  position="relative"
                />
              </Col>
            </Row>
          </div>
        </>
      ) : null}
      {inprogressPublish ? (
        <Modal
          title="Deny Application Publish Request"
          visible={isDenyAppPublishModalVisible}
          onCancel={() => {
            setDenyAppPublishModalVisible(false);
          }}
          footer={null}
        >
          <FormDenyAppPublishRequest
            onSuccess={onDenySuccess}
            requestId={inprogressPublish.id}
          />
        </Modal>
      ) : null}
    </>
  );
};
export default ApplicationDetailPage;
