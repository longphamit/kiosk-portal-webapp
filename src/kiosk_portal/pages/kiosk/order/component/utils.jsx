import { randomColor } from "../../../../../@app/utils/chart_util";

export const rePerformChartData = (resData) => {
  if (Array.isArray(resData)) {
    const colors = resData.map((e) => randomColor());
    const data = {
      labels: resData.map((e) => e.serviceApplicationName),
      datasets: [
        {
          data: resData.map((e) => e.totalCommission),
          backgroundColor: colors,
          hoverBackgroundColor: colors,
        },
      ],
    };
    return data;
  }
  const colors = resData.labels.map((e) => randomColor());
  const data = {
    labels: resData.labels,
    datasets: [
      {
        data: resData.datasets,
        backgroundColor: colors,
        hoverBackgroundColor: colors,
      },
    ],
  };
  return data;
};

export const ChartTitleStyle = {
  fontSize: 18,
  fontWeight: "bold",
};
