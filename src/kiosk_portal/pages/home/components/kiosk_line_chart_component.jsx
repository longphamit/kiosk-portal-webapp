import { Col, Row, Skeleton } from "antd";
import { useEffect, useState } from "react";
import "./../styles.css";
import { getListKioskService } from "../../../services/kiosk_service";
import { USER_ID } from "../../../../@app/constants/key";
import { KioskYearLineChartComponent } from "./kiosk_year_line_chart_component";
import { KioskMonthLineChartComponent } from "./kiosk_month_line_chart_component";
export const KioskLineChartComponent = ({ span }) => {
    const [kiosks, setKiosks] = useState();
    const [isLoadingKiosks, setLoadingKiosks] = useState(false);

    const getAllKiosk = async () => {
        try {
            setLoadingKiosks(true);
            let res = await getListKioskService(
                "", localStorage.getItem(USER_ID), "",
                "", "", "", 0, 1);
            setKiosks(res.data.data);
        } catch (e) {
            console.error(e);
            setKiosks([]);
        } finally {
            setLoadingKiosks(false);
        }
    };
    useEffect(() => {
        getAllKiosk();
    }, []);

    return (
        <>
            <Row>
                <Col span={12}>
                    {!isLoadingKiosks ?
                        < KioskYearLineChartComponent kiosks={kiosks} colSpan={span} /> :
                        <Skeleton />
                    }
                </Col>
                <Col span={12}>
                    {!isLoadingKiosks ?
                        <KioskMonthLineChartComponent kiosks={kiosks} colSpan={span} /> :
                        <Skeleton />
                    }
                </Col>
            </Row>
        </>
    );
};
