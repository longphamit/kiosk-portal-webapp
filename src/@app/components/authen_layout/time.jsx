import { ClockCircleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
const TimeView = () => {
  const [time, setTime] = useState(new Date().toLocaleString());
  useEffect(() => {
    setInterval(() => setTime(new Date().toLocaleString()), 1000);
  });
  return (
    <div
      style={{
        fontSize: 13,
        // fontWeight: "bold",
      }}
    >
      <ClockCircleOutlined style={{ marginRight: 10 }} />
      {time}
    </div>
  );
};
export default TimeView;
