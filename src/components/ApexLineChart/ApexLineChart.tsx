import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { LineChartDataObject } from "../AnalyticsDashboard/AnalyticsDashboard";

interface LineChart {
  lineData: LineChartDataObject[];
}

const LineChart = (props: LineChart) => {
  const { lineData } = props;

  // Preparing data for the chart
  const options: ApexOptions = {
    chart: {
      type: "line",
      height: 350,
    },
    xaxis: {
      type: "datetime",
      categories: lineData.map((item) => item.date),
      title: {
        text: "Date",
      },
    },
    yaxis: {
      title: {
        text: "Total Time Spent",
      },
    },
    title: {
      text: "Total Time Spent Per Day",
      align: "center",
    },
    markers: {
      size: 4,
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
  };

  const series = [
    {
      name: "Total Time Spent",
      data: lineData.map((item) => item.totalTimeSpent),
    },
  ];

  return (
    <div>
      <ReactApexChart
        options={options}
        series={series}
        type="line"
        height={350}
      />
    </div>
  );
};

export default LineChart;
