import {
    Button,
    Checkbox,
    Col,
    DatePicker,
    Form,
    Input,
    Modal,
    Pagination,
    Row,
    Select,
    Space,
    Table,
    TimePicker,
  } from "antd";
  import { useEffect, useState } from "react";
  import { useTranslation } from "react-i18next";
  import { toast } from "react-toastify";
  import {
    changeStatusAccountService,
    createAccountService,
    createScheduleService,
    getListAccountService,
    getListScheduleService,
    searchAccountService,
    updateAccountService,
  } from "../../../@app/services/user_service";
  import moment from "moment";
import { localStorageGetUserIdService } from "../../../@app/services/localstorage_service";
  
  const ScheduleManager = () => {
    const { RangePicker } = DatePicker;
    const { Option } = Select;
    const { t } = useTranslation();
    const [listSchedule, setListSchedule] = useState([]);
    const [totalSchedule, setTotalSchedule] = useState(0);
    const [numScheduleInPage, setNumScheduleInPage] = useState(5);
    const [isSearch, setIsSearch] = useState(false);
    const [querySearch, setQuerySearch] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentItem, setCurrentItem] = useState(null);
    const [dateStartaa,setDateStartaa]=useState(null);
    const [isCreateScheduleModalVisible, setIsCreateScheduleModalVisible] =
      useState(false);
    const [isEditScheduleModalVisible, setIsEditScheduleModalVisible] =
      useState(false);
    const [isAdvancedSearchModalVisible, setIsAdvancedSearchModalVisible] =
      useState(false);
    const [form] = Form.useForm();
    const getListScheduleFunction = async (currentPageToGetList, numInPage) => {
      try {
        if (isSearch) {
          querySearch.page = currentPageToGetList;
          await searchAccountService(querySearch).then((res) => {
            // setTotalSchedule(res.data.metadata.total);
            // setListSchedule(res.data.data);
          });
        }else {
            await getListScheduleService(currentPageToGetList, numInPage).then(
                (res) => {
                    
                //   setTotalSchedule(res.data.metadata.total);
                  setListSchedule(res.data);
                }
              );
        }
        return;
      } catch (error) {
        console.log(error);
      }
    };
  
    useEffect(() => {
      getListScheduleFunction(currentPage, numScheduleInPage);
    }, []);
  
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
  
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };
    const onFinishEditAccount = async (values) => {
      const updateAccount = {
        id: values.id,
        firstName: values.firstName,
        lastName: values.lastName,
        phoneNumber: values.phoneNumber,
        address: values.address,
        dateOfBirth: values.dateOfBirth,
      };
      try {
        await updateAccountService(updateAccount).then(() => {
          getListScheduleFunction(currentPage, numScheduleInPage);
          setIsCreateScheduleModalVisible(false);
          toast.success(t("toastsuccesscreateschedule"));
          setIsEditScheduleModalVisible(false);
        });
      } catch (error) {
        console.log(error);
      }
    };
    const onFinishAdvancedSearch = async (values) => {
      const search = {
        firstName: values.firstName,
        lastName: values.lastName,
        phoneNumber: values.phoneNumber,
        email: values.email,
        address: values.address,
        size: numScheduleInPage,
        page: 1,
      };
      try {
        await searchAccountService(search).then((res) => {
          setTotalSchedule(res.data.metadata.total);
          setListSchedule(res.data.data);
          setIsSearch(true);
          setQuerySearch(search);
        });
      } catch (error) {
        console.log(error);
        setTotalSchedule(0);
        setListSchedule([]);
      }
    };
    const onFinishSearch = async (values) => {
      let firstName = "";
      let lastName = "";
      let phoneNumber = "";
      let email = "";
      let address = "";
      switch (values.type) {
        case "FirstName":
          firstName = values.searchString;
          break;
        case "LastName":
          lastName = values.searchString;
          break;
        case "PhoneNumber":
          phoneNumber = values.searchString;
          break;
        case "Email":
          email = values.searchString;
          break;
        case "Address":
          address = values.searchString;
          break;
      }
      const search = {
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
        email: email,
        address: address,
        size: numScheduleInPage,
        page: 1,
      };
      try {
        await searchAccountService(search).then((res) => {
          setTotalSchedule(res.data.metadata.total);
          setListSchedule(res.data.data);
          setIsSearch(true);
          setQuerySearch(search);
        });
      } catch (error) {
        console.log(error);
        setTotalSchedule(0);
        setListSchedule([]);
      }
    };
    const showModalEditSchedule = () => {
      setIsEditScheduleModalVisible(true);
    };
  
    const formatDatePicker=(str)=> {
        var date = new Date(str),
          mnth = ("0" + (date.getMonth() + 1)).slice(-2),
          day = ("0" + date.getDate()).slice(-2);
        return [date.getFullYear(), mnth, day].join("-");
      }
    
      const formatTimePicker=(str)=>{
        var date = new Date(str);
        var    hours  = ("0" + date.getHours()).slice(-2);
        var    minutes = ("0" + date.getMinutes()).slice(-2);
        var    second = ("0" + date.getSeconds()).slice(-2);
        return [hours, minutes,second ].join(":");
      }

    const handleCancelEditSchedule = () => {
      setIsEditScheduleModalVisible(false);
    };
    const onFinishCreateSchedule = async (values) => {
        var today=new Date();
        const invalidMsg=[];
        var check=true;
      try {
          if(today-values.timeStart>0 ||today-values.timeEnd>0){
            invalidMsg.push("Time start and time end need to after today \n");
            check=false;
          }
          if(values.dateStart-values.dateEnd>0){
            invalidMsg.push("Date start need to before or match with date end\n");
            check=false;
          }
          if(values.timeStart-values.timeEnd>0){
            invalidMsg.push("Time start need to before or match with time end\n");
            check=false;
          }
          if(check){
            const newSchedule = {
                name: values.name,
                dateStart: formatDatePicker(values.dateStart),
                dateEnd: formatDatePicker(values.dateEnd),
                partyId: localStorageGetUserIdService(),
                timeStart: formatTimePicker(values.timeStart),
                timeEnd: formatTimePicker(values.timeEnd),
                dayOfWeek: values.dayOfWeek.join('-'),
            };
            await createScheduleService(newSchedule).then(() => {
                getListScheduleFunction(currentPage, numScheduleInPage);
                setIsCreateScheduleModalVisible(false);
                toast.success(t("toastsuccesscreateschedule"));
            });
          }else{
            var errormsg=invalidMsg.join("-");
            toast.error(errormsg)
          }
      } catch (error) {
        console.log(error);
      }
    };
  
    const showModalCreateSchedule = () => {
      setIsCreateScheduleModalVisible(true);
      form.resetFields();
    };
  
    const handleCancelCreateSchedule = () => {
      setIsCreateScheduleModalVisible(false);
    };
    const showModalAdvancedSearchSchedule = () => {
      setIsAdvancedSearchModalVisible(true);
      form.resetFields();
    };
    const handleCloseModalAdvancedSearchSchedule = () => {
      setIsAdvancedSearchModalVisible(false);
    };
    const handleChangeStatusSchedule = async (record) => {
      Modal.confirm({
        title: t("confirmChangeStatusAccount"),
        okText: t("yes"),
        cancelText: t("no"),
        onOk: async () => {
          {
            try {
              await changeStatusAccountService(record.id, null).then(() => {
                getListScheduleFunction(currentPage, numScheduleInPage);
                toast.success(t("toastsuccesschangestatus"));
              });
            } catch (error) {
              console.log(error);
            }
          }
        },
      });
    };
  
    const handleChangeNumberOfPaging = async (page, pageSize) => {
      setCurrentPage(page);
      await getListScheduleFunction(page, numScheduleInPage);
    };
  
    const convertDate = (stringToConvert) => {
      return moment(new Date(stringToConvert)).format("DD/MM/YYYY");
    };

    const getDate = (dateOfBirth) => {
      return moment(dateOfBirth);
    };
    const types = [
      {
        name: "FirstName",
        label: "First Name",
      },
      {
        name: "LastName",
        label: "Last Name",
      },
      {
        name: "PhoneNumber",
        label: "Phone Number",
      },
      {
        name: "Email",
        label: "Email",
      },
      {
        name: "Address",
        label: "Address",
      },
    ];
    const columns = [
      {
        title: t('name'),
        dataIndex: "name",
        key: "name",
        render: (text) => <a>{text}</a>,
      },
      {
        title: t('dayofweek'),
        dataIndex: "dayOfWeek",
        key: "dayOfWeek",
        render: (text) => <a>{text}</a>,
      },
      {
        title: t('datestart'),
        dataIndex: "dateStart",
        key: "dateStart",
        render: (text) => <a>{convertDate(text)}</a>,
      },
      {
        title: t('dateend'),
        dataIndex: "dateEnd",
        key: "dateEnd",
        render: (text) => <a>{convertDate(text)}</a>,
      },
      {
        title: t('timestart'),
        dataIndex: "stringTimeStart",
        key: "stringTimeStart",
        render: (text) => <a>{text}</a>,
      },
      {
        title: t('timeend'),
        dataIndex: "stringTimeEnd",
        key: "stringTimeEnd",
        render: (text) => <a>{text}</a>,
      },
      {
        title: t("status"),
        dataIndex: "status",
        key: "status",
        render: (text, record, dataIndex) =>
          record.status === "on" ? (
            <a style={{ color: "green" }}>{t("active")}</a>
          ) : (
            <a style={{ color: "red" }}>{t("deactivate")}</a>
          ),
      },
  
      {
        title: t("action"),
        key: "action",
        render: (text, record, dataIndex) => (
          <Space size="middle">
            <Button
              type="primary"
              shape="default"
              size={"large"}
              onClick={() => {
                setCurrentItem(record);
                showModalEditSchedule();
              }}
            >
              {t("edit")}
            </Button>
            {record.roleName === "Admin" ? (
              <Button
                type="primary"
                shape="default"
                size={"large"}
                name={record}
                disabled="false"
                onClick={() => {
                  handleChangeStatusSchedule(record);
                }}
              >
                {t("change-status")}
              </Button>
            ) : (
              <Button
                type="primary"
                shape="default"
                size={"large"}
                name={record}
                onClick={() => {
                  handleChangeStatusSchedule(record);
                }}
              >
                {t("change-status")}
              </Button>
            )}
          </Space>
        ),
      },
    ];

    const prefixSearch = (
      <Form.Item name="type" noStyle>
        <Select defaultValue="FirstName">
          {types.map((item) => {
            return <Option value={item.name}>{item.label}</Option>;
          })}
        </Select>
      </Form.Item>
    );
    return (
      <>
        <Row style={{ padding: 10 }}>
          <Col span={13}>
            <Form
              form={form}
              name="search"
              onFinish={onFinishSearch}
              initialValues={{
                type: "FirstName",
                searchString: "",
              }}
            >
              <Row>
                <Col span={16}>
                  <Form.Item name="searchString" style={{ marginTop: 5 }}>
                    <Input
                      addonBefore={prefixSearch}
                      style={{ width: "100%" }}
                      placeholder="Search..."
                      value=""
                    />
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Form.Item>
                    <Button
                      htmlType="submit"
                      style={{ marginLeft: 10, borderRadius: 5 }}
                      type="primary"
                      size={"large"}
                    >
                      Search
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Col>
  
          <Col span={3}>
            <Button
              style={{ marginLeft: 10 }}
              type="danger"
              shape="round"
              size={"large"}
              onClick={showModalAdvancedSearchSchedule}
            >
              Advanced Search
            </Button>
          </Col>
          <Col span={3}></Col>
          <Col span={4}>
            <Button
              type="primary"
              shape="round"
              size={"large"}
              onClick={showModalCreateSchedule}
            >
              {t("createschedule")}
            </Button>
          </Col>
        </Row>
        <Table columns={columns} dataSource={listSchedule} pagination={false} />
        <Pagination
          defaultCurrent={1}
          total={totalSchedule}
          pageSize={5}
          onChange={handleChangeNumberOfPaging}
        />
  
        <Modal
          title={t("createschedule")}
          visible={isCreateScheduleModalVisible}
          onCancel={handleCancelCreateSchedule}
          footer={null}
        >
          <Form
            {...formItemLayout}
            form={form}
            name="register"
            onFinish={onFinishCreateSchedule}
            scrollToFirstError
          >
            <Form.Item
              name="name"
              label={t("name")}
              rules={[
                {
                  required: true,
                  message: t("reqnameschedule"),
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="dateStart" label={t("datestart")}
            rules={[
                {
                  required: true,
                  message: t("reqdatestartschedule"),
                },
              ]}>
            
                
            <DatePicker
              placeholder={t("selecttime")}
              format="DD/MM/YYYY"
              allowClear={false}
              style={{
                height: "auto",
                width: "auto",
              }}
              
              onChange={(newDate) =>setDateStartaa(moment(newDate).format("yyyy-MM-dd"))}
            />
          </Form.Item>
          <Form.Item name="dateEnd" label={t("dateend")} 
            rules={[
                {
                  required: true,
                  message: t("reqdateendschedule"),
                },
              ]}>
            <DatePicker
              placeholder={t("selecttime")}
              format="DD/MM/YYYY"
              allowClear={false}
              style={{
                height: "auto",
                width: "auto",
              }}
            />
          </Form.Item>
            <Form.Item name="timeStart" label={t('timestart')} 
            rules={[
                {
                  required: true,
                  message: t("reqtimestartschedule"),
                },
              ]}>
                <TimePicker allowClear={false}/>
            </Form.Item>
            <Form.Item name="timeEnd" label={t('timeend')} 
            rules={[
                {
                  required: true,
                  message: t("reqtimeendschedule"),
                },
              ]}>
                <TimePicker allowClear={false}/>
            </Form.Item>
            <Form.Item name="dayOfWeek" label={t('dayofweek')}>
                <Checkbox.Group style={{ width: '100%' }} onChange={{}}>
                    <Row>
                    <Col span={8}>
                        <Checkbox value="Monday">{t('monday')}</Checkbox>
                    </Col>
                    <Col span={8}>
                        <Checkbox value="Tuesday">{t('tuesday')}</Checkbox>
                    </Col>
                    <Col span={8}>
                        <Checkbox value="Wednesday">{t('wednesday')}</Checkbox>
                    </Col>
                    <Col span={8}>
                        <Checkbox value="Thursday">{t('thursday')}</Checkbox>
                    </Col>
                    <Col span={8}>
                        <Checkbox value="Friday">{t('friday')}</Checkbox>
                    </Col>
                    <Col span={8}>
                        <Checkbox value="Saturday">{t('saturday')}</Checkbox>
                    </Col>
                    <Col span={8}>
                        <Checkbox value="Sunday">{t('sunday')}</Checkbox>
                    </Col>
                    </Row>
                </Checkbox.Group>
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit">
                {t("btncreateschedule")}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="Advanced Search"
          visible={isAdvancedSearchModalVisible}
          onCancel={handleCloseModalAdvancedSearchSchedule}
          footer={null}
        >
          <Form
            {...formItemLayout}
            form={form}
            name="advancedSearch"
            onFinish={onFinishAdvancedSearch}
            scrollToFirstError
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 14 }}
            initialValues={{
              address: "",
              email: "",
              firstName: "",
              lastName: "",
              phoneNumber: "",
            }}
          >
            <Form.Item name="firstName" label={t("firstname")}>
              <Input />
            </Form.Item>
            <Form.Item name="lastName" label={t("lastname")}>
              <Input />
            </Form.Item>
            <Form.Item name="phoneNumber" label={t("phonenumber")}>
              <Input />
            </Form.Item>
            <Form.Item name="email" label={t("email")}>
              <Input />
            </Form.Item>
            <Form.Item name="address" label={t("address")}>
              <Input />
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
              <Space align="center">
                <Button align="center" type="primary" htmlType="submit">
                  Search
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
        {currentItem ? (
          <Modal
            key={currentItem.id}
            title={t("edit")}
            visible={isEditScheduleModalVisible}
            onCancel={handleCancelEditSchedule}
            footer={null}
          >
            <Form
              key={currentItem.id}
              {...formItemLayout}
              form={form}
              name="edit"
              onFinish={onFinishEditAccount}
              scrollToFirstError
              initialValues={{
                firstName: currentItem.firstName,
                lastName: currentItem.lastName,
                phoneNumber: currentItem.phoneNumber,
                address: currentItem.address,
                dateOfBirth: getDate(currentItem.dateOfBirth),
                id: currentItem.id,
              }}
            >
              <Form.Item name="id" hidden={true}>
                <Input type="hidden" />
              </Form.Item>
              <Form.Item
                name="firstName"
                label={t("firstname")}
                rules={[
                  {
                    required: true,
                    message: t("reqfirstname"),
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="lastName"
                label={t("lastname")}
                rules={[
                  {
                    required: true,
                    message: t("reqlastname"),
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="phoneNumber"
                label={t("phonenumber")}
                rules={[
                  {
                    pattern: new RegExp("^[+0]{0,2}(91)?[0-9]{10}$"),
                    message: t("formatphonenumber"),
                  },
                  {
                    required: true,
                    message: t("reqphonenumber"),
                  },
                ]}
              >
                <Input style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item
                name="address"
                label={t("address")}
                rules={[
                  {
                    required: true,
                    message: t("reqaddress"),
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item name="dateOfBirth" label={t("dob")} rules={[
                {
                  required: true,
                  message: t("reqname"),
                },
              ]}>
                <DatePicker
                  placeholder={t("selectdob")}
                  format="DD/MM/YYYY"
                  allowClear={false}
                  style={{
                    height: "auto",
                    width: "auto",
                  }}
                />
              </Form.Item>
              <Form.Item {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit">
                  Save
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        ) : null}
      </>
    );
  };
  export default ScheduleManager;
  