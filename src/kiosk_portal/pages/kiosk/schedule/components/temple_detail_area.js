
import { Skeleton } from "antd";
import CustomRowItem from "../../../../components/general/CustomRowItem";

const TemplateKioskDetail = ({
    currentTemplate,
    labelCol,
    wapperCol
}) => {

    return (
        <>
            {currentTemplate ?
                (<>
                    <CustomRowItem label="Name" content={currentTemplate.name} contentType="input" wapperCol={wapperCol} labelCol={labelCol} />
                    <a href={"../edit-template?id=" + currentTemplate.id} target="_blank">View details the template</a>
                </>) : (<Skeleton />)
            }
        </>);
}
export default TemplateKioskDetail;