import React, { useEffect, useState } from "react";
import { List, message, Avatar, Spin, Badge, Popover } from "antd";

import InfiniteScroll from "react-infinite-scroller";
import { getPartyNotificationService } from "../../../kiosk_portal/services/party_notification_service";
import { NotificationOutlined } from "@ant-design/icons";

const NotificationView =()=> {
  const [data,setData]= useState([]);
  const [loading,setLoading] = useState(false);
  const [hasMore,setHasMore] = useState(true);
  const [page,setPage]= useState(1);
  const [total,setTotal] = useState(0);
  const [unseen,setUnseen] = useState(0)

  useEffect(() => {
    console.log("abc")
    fetchData(res => {
      setData(res.data)
      setTotal(res.metadata.total)
    });
  });

  const fetchData =async ()=> {
    let data=data;
    console.log("abcdd")
     await getPartyNotificationService(2,page).then(
      (result)=>{
        console.log(result)
      if(data.length===0){
        setData(result.data.data);
        setPage(page+1);
        setTotal(result.data.metadata.total)
        setLoading(false)
        setUnseen(result.data.metadata.unseenNoti)
      }else {
        result.data.data.map((result)=>{
          data.push(result);
        })
        setData(data);
        setPage(page+1);
        setTotal(result.data.metadata.total)
        setLoading(false)
        setUnseen(result.data.metadata.unseenNoti)
      }
      
     }).catch((error)=>{
      console.log(error);
      setHasMore(false);
      setLoading(false);
      return;
     })
     
  };

  const handleInfiniteOnLoad =async () => {
    setLoading(true);
    await Promise.all(
      fetchData(),
    )
  };

    return (
      <>
      <Badge count={unseen}>
          <Avatar shape="square" icon={<NotificationOutlined />} />
            <Popover
        style={{ width: 500, maxHeight: 10 }}
        content={
          <div className="demo-infinite-container" style={{ overflow: 'auto', padding: '8px 24px', height: '250px'}}>
          <InfiniteScroll
            initialLoad={false}
            pageStart={0}
            loadMore={handleInfiniteOnLoad}
            hasMore={!loading && hasMore}
            useWindow={false}
          >
            <List
              dataSource={data}
              renderItem={item => (
                <List.Item key={item.id}>
                  <List.Item.Meta
                    avatar={
                      <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                    }
                    title={<p>{item.notiTitle}</p>}
                  />
                  <div>Content</div>
                </List.Item>
              )}
            >
              {loading && hasMore && (
                <div className="demo-loading-container">
                  <Spin />
                </div>
              )}
            </List>
          </InfiniteScroll>
        </div>
        }
        title="Title"
        trigger="click"
      />
      </Badge>
      </>
    );
    
}

export default NotificationView;
