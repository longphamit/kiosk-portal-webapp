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
} from "antd";

import "./notification_styles.css"
import { getPartyNotificationService } from "../../../kiosk_portal/services/party_notification_service";
import { NotificationOutlined } from "@ant-design/icons";
import VirtualList from "rc-virtual-list";

const ContainerHeight = 450;
const NotificationView = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [unseen, setUnseen] = useState(0);

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
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const onScroll = async (e) => {
    console.log(e.currentTarget)
    console.log("scrollHeight " + e.currentTarget.scrollHeight);
    console.log("scrollTop " + Math.ceil(e.currentTarget.scrollTop));
    if (
      e.currentTarget.scrollHeight - Math.ceil(e.currentTarget.scrollTop) ===
      ContainerHeight
    ) {
      setLoading(true);
      console.log("hahaha");
      await fetchData();
    }
  };

  return (
    <>
      <Badge count={unseen}>
        <Popover
          placement="bottom"
          title={"notifications"}
          content={
            <div style={{ overflow: "auto", padding: 8 }}>
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
                            <div
                              style={{
                                padding: 5,
                                width: 250,
                              }}
                            >
                              <div style={{fontWeight:"bold"}}>{item.notiTitle}</div>
                              <div style={{textOverflow:"ellipsis",width:200,overflow: "hidden"}}>zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz</div>
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
          <Avatar shape="square" icon={<NotificationOutlined />} />
        </Popover>
      </Badge>
    </>
  );
};

export default NotificationView;
