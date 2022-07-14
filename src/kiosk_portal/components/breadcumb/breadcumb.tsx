import React, { ReactElement, useEffect, useState } from "react";
import { Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { HOME_PAGE_PATH } from "../../constants/path_constants";



interface CustomBreadCumbProps {
    href: string,
    label: string
    icon: ReactElement
}

interface ListBreadCumbProps {
    props: CustomBreadCumbProps[]
}
const CustomBreadCumb: React.FC<ListBreadCumbProps> = (props) => {
    return (
        <Breadcrumb style={{marginBottom:10}}>
            <Breadcrumb.Item href={HOME_PAGE_PATH}>
                <HomeOutlined />
            </Breadcrumb.Item>
            {props.props.map((e: CustomBreadCumbProps) => (
                <Breadcrumb.Item href={e.href}> {e.icon} <span>{e.label}</span> </Breadcrumb.Item>
            ))}
        </Breadcrumb>
    );
}

export default CustomBreadCumb;
