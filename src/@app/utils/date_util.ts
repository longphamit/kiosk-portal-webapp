import moment from "moment";

export const convertDate = (stringToConvert:any) => {
    return moment(new Date(stringToConvert)).format("DD/MM/YYYY");
};

  

export  const getDate = (dateOfBirth: any) => {
    return moment(dateOfBirth);
};

export   const splitTimeString = (time:any) => {
    const timeSplit = time.split(".");
    return timeSplit[0];
  };