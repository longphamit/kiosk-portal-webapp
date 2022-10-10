import { useEffect, useState } from "react";
import { List, Avatar, Badge, Popover, Divider, Col, Row, Modal } from "antd";
import moment from "moment";
import "./notification_styles.css";
import {
  getPartyNotificationService,
  updateStatusNotificationService,
} from "../../../kiosk_portal/services/party_notification_service";
import { BellFilled } from "@ant-design/icons";
import VirtualList from "rc-virtual-list";
import CustomRowItem from "../../../kiosk_portal/components/general/CustomRowItem";
import useSelector from "../../hooks/use_selector";
const labelCol = 4;
const wrapperCol = 20;
const ContainerHeight = 450;
const NotificationView = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [unseen, setUnseen] = useState(0);
  const [detailNotiModalVisible, setDetailNotiModalVisible] = useState(false);
  const [currentNoti, setCurrentNoti] = useState();
  const { listNotification } = useSelector((state) => state.home_view);
  useEffect(() => {
    fetchData();
  }, [listNotification]);

  const fetchData = async () => {
    try {
      const res = await getPartyNotificationService(5, page);
      setData(data.concat(res.data.data));
      setUnseen(res.data.metadata.unseenNoti);
      setPage(page + 1);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const onScroll = async (e) => {
    if (
      e.currentTarget.scrollHeight - Math.ceil(e.currentTarget.scrollTop) ===
      ContainerHeight
    ) {
      setLoading(true);
      await fetchData();
    }
  };
  const readTheNotification = async (id) => {
    try {
      let res = await updateStatusNotificationService(JSON.stringify(id));
      const newState = data.map((obj) => {
        if (obj.id === id) {
          return { ...obj, status: "seen" };
        }
        return obj;
      });
      setData(newState);
      setUnseen(unseen - 1);
    } catch (e) {
      console.error(e);
    }
  };
  const readNotification = async (item) => {
    if (item.status === "unseen") {
      readTheNotification(item.id);
    }
  };
  const openDetailNotiModal = (item) => {
    setDetailNotiModalVisible(!detailNotiModalVisible);
    if (!detailNotiModalVisible) {
      readNotification(item);
    }
    setCurrentNoti(item);
  };
  const closeDetailNotiModal = () => {
    setDetailNotiModalVisible(false);
  };
  const getSting = (str) => {
    if (str.length > 20) {
      return str.substr(0, 20) + "...";
    }
    return str;
  };
  return (
    <>
      <Badge count={unseen}>
        <Popover
          placement="bottom"
          title={"Notifications"}
          content={
            <div style={{ overflow: "auto", width: 230 }}>
              <VirtualList
                data={data}
                itemHeight={15}
                itemKey="email"
                height={ContainerHeight}
                onScroll={onScroll}
              >
                {(item) => (
                  <div>
                    <div className="notiItem">
                      <List.Item key={item.id}>
                        <Row>
                          <Col>
                            <Row>
                              <Col
                                style={{ width: 200 }}
                                onClick={() => {
                                  openDetailNotiModal(item);
                                }}
                              >
                                <label
                                  style={{ fontWeight: "bold" }}
                                  htmlFor=""
                                >
                                  {getSting(item.notiTitle)}
                                </label>
                                <br />
                                {getSting(item.notiContent)}
                              </Col>
                              <Col style={{ width: 30, padding: 10 }}>
                                {item.status === "unseen" ? (
                                  <Badge
                                    color="#108ee9"
                                    style={{ float: "right" }}
                                    onClick={() => readTheNotification(item.id)}
                                  />
                                ) : null}
                              </Col>
                            </Row>
                          </Col>
                          <Col></Col>
                        </Row>
                      </List.Item>
                    </div>
                    <Divider />
                  </div>
                )}
              </VirtualList>
            </div>
          }
          trigger="click"
        >
          <Avatar
            shape="circle"
            style={{ background: "#fff" }}
            icon={<BellFilled style={{ color: "#000" }} />}
          />
        </Popover>
      </Badge>
      {currentNoti ? (
        <>
          <Modal
            title="Notification Details"
            visible={detailNotiModalVisible}
            footer={[]}
            onCancel={() => closeDetailNotiModal()}
          >
            <CustomRowItem
              contentType="input"
              label="Time"
              content={moment(currentNoti.notiCreateDate).format(
                "DD/MM/YYYY hh:mm"
              )}
              labelCol={labelCol}
              wrapperCol={wrapperCol}
            />
            <CustomRowItem
              contentType="input"
              label="Title"
              content={currentNoti.notiTitle}
              labelCol={labelCol}
              wrapperCol={wrapperCol}
            />
            <CustomRowItem
              contentType="input"
              label="Content"
              content={currentNoti.notiContent}
              labelCol={labelCol}
              wrapperCol={wrapperCol}
            />
          </Modal>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default NotificationView;
