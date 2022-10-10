import { Col, Collapse, Descriptions, Skeleton, Tag } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { ROLE_LOCATION_OWNER, ROLE_SERVICE_PROVIDER } from "../../../@app/constants/role";
import ApplicationTable from "../../components/tables/app_table";
import KioskTable from "../../components/tables/kiosk_table";
import { getAccountByIdService } from "../../services/account_service";
import CustomBreadCumb from "../../components/breadcumb/breadcumb";
import { ACCOUNT_DETAILS_HREF, ACCOUNT_DETAILS_LABEL, ACCOUNT_MANAGER_HREF, ACCOUNT_MANAGER_LABEL } from "../../components/breadcumb/breadcumb_constant";
import "./styles.css"
import { PREVIOUS_PATH } from "../../../@app/constants/key";
const { Panel } = Collapse;
const AccountDetailPage = () => {
  const { partyId } = useParams()
  const { t } = useTranslation();
  const [accountDetail, setAccountDetail] = useState()
  const getAccountDetailById = async () => {
    try {
      const res = await getAccountByIdService(partyId)
      setAccountDetail(res.data)
    } catch (e) {
      console.error(e);
      setAccountDetail({});
    }
  }
  const breadCumbData = [
    {
      href: ACCOUNT_MANAGER_HREF,
      label: ACCOUNT_MANAGER_LABEL,
      icon: null
    },
    {
      href: ACCOUNT_DETAILS_HREF,
      label: ACCOUNT_DETAILS_LABEL,
      icon: null
    },
  ]
  const getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      return value;
    };
  };

  useEffect(() => {
    getAccountDetailById();
    localStorage.setItem(PREVIOUS_PATH, JSON.stringify({ data: breadCumbData }, getCircularReplacer()));
  }, []);

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
                      <Tag color="green">Activate</Tag>
                    ) : (
                      <Tag color="red">Deactivate</Tag>
                    )
                  }</Descriptions.Item>
                </Descriptions>
              </Col>
            </div>

            {
              accountDetail.roleName === ROLE_LOCATION_OWNER ?
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
                  : null
            }
          </> : <Skeleton />
      }
    </>)
}
export default AccountDetailPage;