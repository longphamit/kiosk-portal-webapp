import {
  Button,
  Col,
  Descriptions,
  Empty,
  Image,
  Modal,
  Popconfirm,
  Row,
  Tabs,
  Tag,
} from "antd";
import { useEffect, useState } from "react";
import Iframe from "react-iframe";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ROLE_ADMIN,
  ROLE_SERVICE_PROVIDER,
} from "../../../@app/constants/role";
import { localStorageGetReduxState } from "../../../@app/services/localstorage_service";
import { getApplicationServiceById } from "../../services/application_service";
import {
  approveAppPublishRequestService,
  getInprogressAppPublishRequestByAppIdService,
} from "../../services/app_publish_request_service";
import CustomBreadCumb from "../../components/breadcumb/breadcumb";
import {
  APP_DETAILS_HREF,
  APP_DETAILS_LABEL,
} from "../../components/breadcumb/breadcumb_constant";
import FormDenyAppPublishRequest from "./formDenyPublishRequest";
import "./styles.css";
import { PREVIOUS_PATH } from "../../../@app/constants/key";
import CreateFeedbackModal from "./components/create_feedback_modal";
import UpdateFeedbackModal from "./components/update_feedback_modal";
import CustomRatingAndFeedback from "../../components/general/CustomRatingAndFeedback";
const ApplicationDetailPage = () => {
  const { id } = useParams();
  const { TabPane } = Tabs;
  const [appId, setAppId] = useState();
  const [isInstalled, setInstalled] = useState(false);
  const [app, setApp] = useState();
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [inprogressPublish, setInprogressPublish] = useState();
  const [listFeedback, setListFeedback] = useState([]);
  const [myFeedback, setMyFeedback] = useState();
  const [isDenyAppPublishModalVisible, setDenyAppPublishModalVisible] =
    useState(false);
  const role = localStorageGetReduxState().auth.role;
  const getAppById = async () => {
    let tempId = "";
    if (id.includes("installed")) {
      tempId = id.replaceAll("&&installed", "");
      setInstalled(true);
    } else {
      tempId = id;
    }
    setAppId(tempId);
    const res = await getApplicationServiceById(tempId);
    setApp(res.data);
    setMyFeedback(res.data.myFeedback);
    setListFeedback(res.data.listFeedback);
  };
  const getInprogressAppPublishRequestByAppId = async () => {
    try {
      if (role === ROLE_SERVICE_PROVIDER || role === ROLE_ADMIN) {
        const res = await getInprogressAppPublishRequestByAppIdService(appId);
        console.log(res.data);
        setInprogressPublish(res.data);
      }
    } catch (e) {
      setInprogressPublish(null);
      console.error(e);
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
      console.error(e);
    }
  };
  const onDenySuccess = async () => {
    setDenyAppPublishModalVisible(false);
    await getInprogressAppPublishRequestByAppId();
    await getAppById();
    toast.success("Approve publish app success");
  };
  const getApplicationPage = () => {
    const previousBreadCumb = JSON.parse(
      localStorage.getItem(PREVIOUS_PATH)
    ).data;
    previousBreadCumb.push(breadCumbData);
    return previousBreadCumb;
  };
  const breadCumbData = {
    href: APP_DETAILS_HREF,
    label: APP_DETAILS_LABEL,
    icon: null,
  };

  return (
    <>
      <CustomBreadCumb props={getApplicationPage()} />
      {app ? (
        <>
          <div id="account-info-panel">
            <Col span={24}>
              <Descriptions title="App Info" size="middle">
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
                <Descriptions.Item
                  label="Description"
                  labelStyle={{ fontWeight: "bold" }}
                >
                  {app.description}
                </Descriptions.Item>
                <Descriptions.Item>
                  <Image
                    size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 60 }}
                    src={app.logo}
                    sizes="small"
                    width={40}
                    height={40}
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
          <Tabs defaultActiveKey="1">
            <TabPane tab="App Preview" key="1">
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
            </TabPane>
            <TabPane tab="Feedbacks" key="2">
              <div id="feedback">
                {listFeedback.length != 0 ? (
                  <>
                    <Row span={24}>
                      <Col span={12}>
                        <h2>All Feedbacks</h2>
                        {listFeedback.map((e) => {
                          return <CustomRatingAndFeedback feedback={e} />;
                        })}
                      </Col>
                      {isInstalled === true ? (
                        <Col span={12}>
                          <h2>My Feedback</h2>
                          {myFeedback ? (
                            <>
                              <CustomRatingAndFeedback feedback={myFeedback} />
                              <Button
                                style={{ marginLeft: 80 }}
                                onClick={() => setUpdateModalVisible(true)}
                              >
                                Update Feedback
                              </Button>
                            </>
                          ) : (
                            <>
                              <Empty
                                image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                                imageStyle={{
                                  height: 60,
                                }}
                                style={{ float: "left" }}
                                description={<span>You are not feedback</span>}
                              >
                                <Button
                                  type="primary"
                                  onClick={() => setCreateModalVisible(true)}
                                >
                                  Feedback Now
                                </Button>
                              </Empty>
                            </>
                          )}
                        </Col>
                      ) : null}
                    </Row>
                  </>
                ) : (
                  <Empty>
                    <Button
                      type="primary"
                      onClick={() => setCreateModalVisible(true)}
                    >
                      Feedback Now
                    </Button>
                  </Empty>
                )}
              </div>
            </TabPane>
          </Tabs>
        </>
      ) : null}
      {appId ? (
        <>
          <CreateFeedbackModal
            setMyFeedback={setMyFeedback}
            setListFeedback={setListFeedback}
            appId={appId}
            handleCancelModal={() => {
              setCreateModalVisible(false);
            }}
            isModalVisible={createModalVisible}
          />
        </>
      ) : null}
      {myFeedback ? (
        <>
          <UpdateFeedbackModal
            setMyFeedback={setMyFeedback}
            setListFeedback={setListFeedback}
            appId={appId}
            feedbackModel={myFeedback}
            handleCancelModal={() => setUpdateModalVisible(false)}
            isModalVisible={updateModalVisible}
          />
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
