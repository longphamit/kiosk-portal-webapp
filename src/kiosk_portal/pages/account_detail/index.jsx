import { UserOutlined } from "@ant-design/icons";
import { Col, Collapse, Descriptions, Row, Tag } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { ROLE_LOCATION_OWNER, ROLE_SERVICE_PROVIDER } from "../../../@app/constants/role";
import ApplicationTable from "../../components/tables/app_table";
import KioskTable from "../../components/tables/kiosk_table";

import { getAccountByIdService } from "../../services/account_service";
import CustomBreadCumb from "../impl/breadcumb";
import { ACCOUNT_DETAILS_HREF, ACCOUNT_DETAILS_LABEL, ACCOUNT_MANAGER_HREF, ACCOUNT_MANAGER_LABEL } from "../impl/breadcumb_constant";
import "./styles.css"
const { Panel } = Collapse;
const AccountDetailPage = () => {
  const { partyId } = useParams()
  const { t } = useTranslation();
  const [accountDetail, setAccountDetail] = useState()
  const getAccountDetailById = async () => {
    const res = await getAccountByIdService(partyId)
    setAccountDetail(res.data)
    console.log(res.data)
  }
  useEffect(() => {
    getAccountDetailById()
  }, []);
  const breadCumbData = [
    {
      href: ACCOUNT_MANAGER_HREF,
      label: ACCOUNT_MANAGER_LABEL,
      icon: <UserOutlined />
    },
    {
      href: ACCOUNT_DETAILS_HREF,
      label: ACCOUNT_DETAILS_LABEL,
      icon: null
    },
  ]
  return (
    <>
    <CustomBreadCumb props={breadCumbData} />
      {
        accountDetail ?
          <>
            <div id="account-info-panel">
              <Col span={24}>
                <Descriptions title="Account Info">
                  <Descriptions.Item label="Name" labelStyle={{ fontWeight: "bold" }}>{accountDetail.lastName + " " + accountDetail.firstName}</Descriptions.Item>
                  <Descriptions.Item label="Email" labelStyle={{ fontWeight: "bold" }}>{accountDetail.email}</Descriptions.Item>
                  <Descriptions.Item label="Phone" labelStyle={{ fontWeight: "bold" }}>{accountDetail.phoneNumber}</Descriptions.Item>
                  <Descriptions.Item label="Role" labelStyle={{ fontWeight: "bold" }}>{accountDetail.roleName}</Descriptions.Item>
                  <Descriptions.Item label="Created By" labelStyle={{ fontWeight: "bold" }}>
                    {accountDetail.creatorMail}
                  </Descriptions.Item>
                  <Descriptions.Item label="Status" labelStyle={{ fontWeight: "bold" }}>{
                    accountDetail.status === "activate" ? (
                      <Tag color="green">{t("activate")}</Tag>
                    ) : (
                      <Tag color="red">{t("deactivate")}</Tag>
                    )
                  }</Descriptions.Item>
                </Descriptions>
              </Col>
            </div>
          </> : null
      }
      {
        accountDetail ? accountDetail.roleName === ROLE_LOCATION_OWNER ?
          (<><Collapse defaultActiveKey={["1"]}>
            <Panel
              header="Kiosks"
              key="1"
              style={{ color: "#ffff" }}
            >
              <KioskTable partyId={partyId} />
            </Panel>
          </Collapse></>)

          : accountDetail.roleName === ROLE_SERVICE_PROVIDER ?
            (<><Collapse defaultActiveKey={["1"]}>
              <Panel
                header="Applications"
                key="1"
                style={{ color: "#ffff" }}
              >
                <ApplicationTable partyId={partyId} />
              </Panel>
            </Collapse></>)
            : null : null
      }
    </>)
}
export default AccountDetailPage;