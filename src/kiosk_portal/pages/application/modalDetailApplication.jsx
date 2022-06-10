import { Form, Input } from "antd";
import { formItemLayout } from "../../layouts/form_layout";

const FormDetailApplication = (itemcurrent) => {
  const [form] = Form.useForm();
  const { TextArea } = Input;
  return (
    <>
      {itemcurrent ? (
        <Form
          {...formItemLayout}
          form={form}
          name="register"
          scrollToFirstError
          onFinish={test}
          // initialValues={{
          //   appCategoryName: itemcurrent.itemcurrent.appCategoryName,
          //   description: itemcurrent.itemcurrent.description,
          //   link: itemcurrent.itemcurrent.link,
          //   logo: itemcurrent.itemcurrent.logo,
          //   name: itemcurrent.itemcurrent.name,
          //   partyEmail: itemcurrent.itemcurrent.partyEmail,
          //   partyName: itemcurrent.itemcurrent.partyName,
          //   status: itemcurrent.itemcurrent.status,
          // }}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            {/* <Input readOnly defaultValue={itemcurrent.itemcurrent.name} /> */}
            <a>{itemcurrent.itemcurrent.name}</a>
          </Form.Item>
          <Form.Item
            label="Category"
            name="appCategoryName"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            {/* <Input
              readOnly
              defaultValue={itemcurrent.itemcurrent.appCategoryName}
            /> */}
            <a>{itemcurrent.itemcurrent.appCategoryName}</a>
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            {/* <TextArea
              readOnly
              defaultValue={itemcurrent.itemcurrent.description}
            /> */}
            <a>{itemcurrent.itemcurrent.description}</a>
          </Form.Item>
          <Form.Item
            label="App Link"
            name="link"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            {/* <Input readOnly defaultValue={itemcurrent.itemcurrent.link} /> */}
            <a>{itemcurrent.itemcurrent.link}</a>
          </Form.Item>
          <Form.Item
            label="Party Email"
            name="partyEmail"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            {/* <Input readOnly defaultValue={itemcurrent.itemcurrent.partyEmail} /> */}
            <a>{itemcurrent.itemcurrent.partyEmail}</a>
          </Form.Item>
          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            {/* <Input readOnly defaultValue={itemcurrent.itemcurrent.status} /> */}
            <a>{itemcurrent.itemcurrent.status}</a>
          </Form.Item>
          <Form.Item
            label="Party Name"
            name="partyName"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            {/* <Input readOnly defaultValue={itemcurrent.itemcurrent.partyName} /> */}
            <a>{itemcurrent.itemcurrent.partyName}</a>
          </Form.Item>
          <Form.Item
            name="logo"
            label="Logo"
            rules={[
              {
                required: true,
                message: "Please choose application logo!",
              },
            ]}
          >
            <img
              style={{ height: 80, weight: 80 }}
              src={itemcurrent.itemcurrent.logo}
            />
          </Form.Item>
        </Form>
      ) : null}
    </>
  );
};
export default FormDetailApplication;
