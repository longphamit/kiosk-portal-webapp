
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
                    {currentTemplate.status === 'deleted' ? <p style={{ fontStyle: 'italic', color: 'red' }}>*This template has been deleted</p> :
                        <a href={"../edit-template?id=" + currentTemplate.id} target="_blank">View the template's details</a>
                    }
                </>) : (<Skeleton />)
            }
        </>);
}
export default TemplateKioskDetail;