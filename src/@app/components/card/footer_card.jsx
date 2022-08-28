import { Row } from "antd"
import { Footer } from "antd/lib/layout/layout"

export const FooterCard = ({ isBackgroud = true }) => {
    return <Footer className={isBackgroud ? 'header' : ''} style={{ background: isBackgroud ? '' : 'white' }}>
        <Row align="middle" justify="end">
            Copyright © 2022 IKFTS teams. <br />
            Suppor email: Capstoneprojectfu2021@gmail.com<br />
            Phone number: 0775 051 234
        </Row>
    </Footer>
}