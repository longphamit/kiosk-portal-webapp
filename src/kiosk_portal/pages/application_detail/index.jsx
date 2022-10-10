import {
  Button,
  Col,
  Collapse,
  Descriptions,
  Empty,
  Image,
  Modal,
  Popconfirm,
  Row,
  Skeleton,
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
import { CommissionTabComponent } from "./components/comission_tab";
import { getMyApplicationById } from "../../services/party_service_application";
const ApplicationDetailPage = () => {
  const { id } = useParams();
  const { TabPane } = Tabs;
  const [appId, setAppId] = useState();
  const [isInstalled, setInstalled] = useState(false);
  const [app, setApp] = useState();
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [inprogressPublish, setInprogressPublish] = useState();
  const [listFeedback, setListFeedback] = useState();
  const [myFeedback, setMyFeedback] = useState();
  const [isDenyAppPublishModalVisible, setDenyAppPublishModalVisible] =
    useState(false);
  const role = localStorageGetReduxState().auth.role;
  const { Panel } = Collapse;
  const getAppById = async () => {
    let tempId = "";
    if (id.includes("installed")) {
      tempId = id.replaceAll("&&installed", "");
      checkAppIsInstalled(tempId);
    } else {
      tempId = id;
    }
    setAppId(tempId);
    try {
      const res = await getApplicationServiceById(tempId);
      setApp(res.data);
      setMyFeedback(res.data.myFeedback);
      setListFeedback(res.data.listFeedback);
    } catch (e) {
      console.error(e);
      setMyFeedback({});
      setListFeedback([]);
    }
  };
  const checkAppIsInstalled = async (applicationId) => {
    try {
      let res = await getMyApplicationById(applicationId);
      setInstalled(true);
    } catch (e) {
      console.error(e);
      setInstalled(false);
    }
  };
  const getInprogressAppPublishRequestByAppId = async () => {
    try {
      if (role === ROLE_SERVICE_PROVIDER || role === ROLE_ADMIN) {
        const res = await getInprogressAppPublishRequestByAppIdService(id);
        setInprogressPublish(res.data);
      }
    } catch (e) {
      setInprogressPublish(null);
      console.error(e);
    }
  };
  useEffect(() => {
    getInprogressAppPublishRequestByAppId();
    getAppById();
  }, []);
  const approveAppPublishRequest = async () => {
    try {
      const res = await approveAppPublishRequestService(inprogressPublish.id);
      await getAppById();
      await getInprogressAppPublishRequestByAppId();
      toast.success("Approve publish app success");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  const onDenySuccess = async () => {
    setDenyAppPublishModalVisible(false);
    await getInprogressAppPublishRequestByAppId();
    await getAppById();
    toast.success("Deny publish app success");
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
  const getButtonFeedback = () => {
    if (isInstalled && myFeedback === null)
      return (
        <>
          <Button type="primary" onClick={() => setCreateModalVisible(true)}>
            Feedback Now
          </Button>
        </>
      );
    return null;
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
                  label="installed users "
                  labelStyle={{ fontWeight: "bold" }}
                >
                  {app.userInstalled}
                </Descriptions.Item>
                <Descriptions.Item
                  label="Owner's Name"
                  labelStyle={{ fontWeight: "bold" }}
                >
                  {app.partyName}
                </Descriptions.Item>
                <Descriptions.Item
                  label="Owner's Email"
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
                  label="Is Affiliate"
                  labelStyle={{ fontWeight: "bold" }}
                >
                  {app.isAffiliate === true ? (
                    <Tag color="green">Yes</Tag>
                  ) : (
                    <Tag color="red">No</Tag>
                  )}
                </Descriptions.Item>

                <Descriptions.Item
                  label="Logo"
                  labelStyle={{ fontWeight: "bold" }}
                >
                  <Image
                    size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 60 }}
                    src={app.logo}
                    sizes="large"
                    width={40}
                    height={40}
                  />
                </Descriptions.Item>
              </Descriptions>
            </Col>
            <Col>
              {role ? (
                role === ROLE_ADMIN ? (
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
                ) : null
              ) : null}
            </Col>
          </div>
          <Tabs defaultActiveKey="1">
            <TabPane tab="Description" key="0">
              <Row>
                {app.banner ? (
                  <>
                    <Col span={12}>
                      <Row justify="center" align="middle">
                        <p style={{ fontWeight: "bold", fontSize: 18 }}>
                          APPLICATION BANNER
                        </p>
                      </Row>
                      <Row justify="center" align="middle">
                        <Image src={app.banner} sizes="large" />
                        <br />
                      </Row>
                    </Col>
                    <Col span={12}>
                      <Row justify="center" align="middle">
                        <p style={{ fontWeight: "bold", fontSize: 18 }}>
                          DESCRIPTION
                        </p>
                      </Row>
                      <Row style={{ margin: "0px 30px" }}>
                        <div
                          dangerouslySetInnerHTML={{ __html: app.description }}
                        />
                      </Row>
                    </Col>
                  </>
                ) : (
                  <Col span={24}>
                    <Row justify="center" align="middle">
                      <p style={{ fontWeight: "bold", fontSize: 18 }}>
                        DESCRIPTION
                      </p>
                    </Row>
                    <Row>
                      <div
                        dangerouslySetInnerHTML={{ __html: app.description }}
                      />
                    </Row>
                  </Col>
                )}
              </Row>
            </TabPane>
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
                {listFeedback ? (
                  listFeedback.length !== 0 ? (
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
                                <CustomRatingAndFeedback
                                  feedback={myFeedback}
                                />
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
                                  description={
                                    <span>You are not feedback</span>
                                  }
                                >
                                  <Button
                                    type="primary"
                                    onClick={() => setCreateModalVisible(true)}
                                  >
                                    {getButtonFeedback()}
                                  </Button>
                                </Empty>
                              </>
                            )}
                          </Col>
                        ) : null}
                      </Row>
                    </>
                  ) : (
                    <Empty>{getButtonFeedback()}</Empty>
                  )
                ) : (
                  <Skeleton />
                )}
              </div>
            </TabPane>
            {isInstalled ? (
              <>
                <TabPane tab="Revenue" key="3">
                  <CommissionTabComponent appId={appId} />
                </TabPane>
              </>
            ) : null}
          </Tabs>
        </>
      ) : (
        <Skeleton />
      )}
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
