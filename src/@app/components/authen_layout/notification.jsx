import React, { useEffect, useState } from "react";
import {
  List,
  message,
  Avatar,
  Spin,
  Badge,
  Popover,
  Divider,
  Col,
  Row,
  Modal,
  notification,
} from "antd";

import "./notification_styles.css"
import { getPartyNotificationService, updateStatusNotificationService } from "../../../kiosk_portal/services/party_notification_service";
import { BellFilled, NotificationOutlined, SmileOutlined } from "@ant-design/icons";
import VirtualList from "rc-virtual-list";
import CustomRowItem from "../../../kiosk_portal/components/general/CustomRowItem";
const labelCol = 4;
const wrapperCol = 20
const ContainerHeight = 450;
const NotificationView = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [unseen, setUnseen] = useState(0);
  const [detailNotiModalVisible, setDetailNotiModalVisible] = useState();
  const [currentNoti, setCurrentNoti] = useState();
  useEffect(() => {
    fetchData();
  }, []);

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
      const newState = data.map(obj => {
        if (obj.id === id) {
          return { ...obj, status: 'seen' };
        }
        return obj;
      });
      setData(newState);
      setUnseen(unseen - 1);

    } catch (e) {
      console.error(e)
    }
  }
  const readAndClose = async () => {
    if (currentNoti.status === 'unseen') {
      readTheNotification(currentNoti.id);
      setDetailNotiModalVisible(false)
    }
  }
  const openDetailNotiModal = (item) => {
    setDetailNotiModalVisible(true);
    setCurrentNoti(item)
  }
  const closeDetailNotiModal = () => {
    setDetailNotiModalVisible(false);
  }
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

                            <div style={{ fontWeight: "bold" }}>
                              <label htmlFor="" onClick={() => { openDetailNotiModal(item) }}>{item.notiTitle}</label>

                              {item.status === "unseen" ?
                                <Badge color="#108ee9" style={{ float: 'right' }} onClick={() => readTheNotification(item.id)} />
                                : null}
                            </div>
                            <div style={{ textOverflow: "ellipsis", width: 200, overflow: "hidden" }} onClick={() => { openDetailNotiModal(item) }}>
                              {item.notiContent}
                            </div>

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
          <Avatar shape="circle" style={{ background: "#fff" }} icon={<BellFilled style={{ color: "#000" }} />} />
        </Popover>
      </Badge>
      {currentNoti ?
        <>
          <Modal
            title="Notification Details"
            visible={detailNotiModalVisible}
            onOk={() => readAndClose()}
            onCancel={() => closeDetailNotiModal()}
          >
            <CustomRowItem contentType='input' label='Time' content={currentNoti.notiCreateDate} labelCol={labelCol} wrapperCol={wrapperCol} />
            <CustomRowItem contentType='input' label='Title' content={currentNoti.notiTitle} labelCol={labelCol} wrapperCol={wrapperCol} />
            <CustomRowItem contentType='input' label='Content' content={currentNoti.notiContent} labelCol={labelCol} wrapperCol={wrapperCol} />
          </Modal>
        </> : <></>
      }
    </>
  );
};

export default NotificationView;
