import { Col, Collapse, Row, Tag } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { ROLE_LOCATION_OWNER } from "../../../@app/constants/role";
import KioskTable from "../../components/tables/kiosk_table";

import { getAccountByIdService } from "../../services/account_service";
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
  return (
    <>
      {
        accountDetail ?
          <>
            <div id="account-info-panel">
              <Col span={24}>
                <Row className="info-row">
                  <Col span={2} className="info-title">
                    Name:
                  </Col>
                  <Col span={6}>
                    {accountDetail.lastName + " " + accountDetail.firstName}
                  </Col>
                  <Col span={2} className="info-title">
                    Email:
                  </Col>
                  <Col span={6}>
                    {accountDetail.email}
                  </Col>
                  <Col span={2} className="info-title">
                    Phone:
                  </Col>
                  <Col span={6}>
                    {accountDetail.phoneNumber}
                  </Col>
                </Row>

                <Row className="info-row">
                  <Col span={2} className="info-title">
                    Role:
                  </Col>
                  <Col span={6}>
                    {accountDetail.roleName}
                  </Col>
                  <Col span={2} className="info-title">
                    Created By:
                  </Col>
                  <Col span={6}>
                    {accountDetail.creatorMail}
                  </Col>
                  <Col span={2} className="info-title">
                    Status:
                  </Col>
                  <Col span={6}>
                    {
                      accountDetail.status === "active" ? (
                        <Tag color="green">{t("activate")}</Tag>
                      ) : (
                        <Tag color="red">{t("deactivate")}</Tag>
                      )
                    }
                  </Col>
                </Row>

              </Col>

            </div>
          </> : null
      }
      {
        accountDetail ? accountDetail.roleName === ROLE_LOCATION_OWNER ?
          <Collapse defaultActiveKey={["1"]}>
            <Panel
              header="Kiosks"
              key="1"
              style={{ color: "#ffff" }}
            >
              <KioskTable partyId={partyId} />
            </Panel>
          </Collapse>

          : null : null
      }
    </>)
}
export default AccountDetailPage;