import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  BarElement,
  CategoryScale,
  Chart,
  Filler,
  LinearScale,
  LineElement,
  PointElement,
  TimeScale,
} from "chart.js";
import { Button, Select, MenuItem, Box } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import { DatePicker } from "@mui/x-date-pickers";
import LineChart from "../ApexLineChart/ApexLineChart";
import moment from "moment";

// Register scales
Chart.register(
  LinearScale,
  TimeScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Filler
);

// Define types for the chart data
interface BarChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  }[];
}

// Define the filters type
interface Filters {
  age: string;
  gender: string;
  startDate: any;
  endDate: any;
}

export interface LineChartDataObject {
  totalTimeSpent: number;
  count: number;
  date: string;
}

const Dashboard: React.FC = () => {
  const [barData, setBarData] = useState<BarChartData>({
    labels: [],
    datasets: [],
  });

  const [lineData, setLineData] = useState<LineChartDataObject[]>([]);

  const [filters, setFilters] = useState<Filters>({
    age: "15-25",
    gender: "Male",
    startDate: moment("01-10-2022", "DD-MM-YYYY"),
    endDate: moment("08-10-2022", "DD-MM-YYYY"),
  });

  // Function to get initial filters from URL or cookies
  const getInitialFilters = (): Filters => {
    // Check URL parameters first
    const urlParams = new URLSearchParams(window.location.search);
    const urlAge = urlParams.get("age");
    const urlGender = urlParams.get("gender");
    const urlStartDate = urlParams.get("startDate");
    const urlEndDate = urlParams.get("endDate");

    // Check cookies if no URL params
    const savedFilters = Cookies.get("filters");

    if (urlAge && urlGender && urlStartDate && urlEndDate) {
      return {
        age: urlAge,
        gender: urlGender,
        startDate: moment(urlStartDate, "DD-MM-YYYY"),
        endDate: moment(urlEndDate, "DD-MM-YYYY"),
      };
    }

    if (savedFilters) {
      const parsedSavedFilters = JSON.parse(savedFilters);
      return {
        ...parsedSavedFilters,
        startDate: moment(parsedSavedFilters.startDate, "DD-MM-YYYY"),
        endDate: moment(parsedSavedFilters.endDate, "DD-MM-YYYY"),
      };
    }

    return filters;
  };

  const logoutHandler = () => {
    Cookies.remove("authToken");
    window.location.href = "/login";
  };

  // Function to generate shareable URL
  const generateShareableUrl = () => {
    const baseUrl = window.location.origin + window.location.pathname;
    const urlParams = new URLSearchParams({
      age: filters.age,
      gender: filters.gender,
      startDate: filters.startDate.format("DD-MM-YYYY"),
      endDate: filters.endDate.format("DD-MM-YYYY"),
    });

    const shareableUrl = `${baseUrl}?${urlParams.toString()}`;

    // Copy to clipboard
    navigator.clipboard.writeText(shareableUrl);
  };

  const fetchBarData = async () => {
    const { age, gender, startDate, endDate } = filters;

    try {
      const response = await axios.get("http://localhost:5000/api/data", {
        params: { age, gender, startDate, endDate },
      });

      const data = response.data;
      setBarData({
        labels: data
          .sort((a: any, b: any) => a.feature.localeCompare(b.feature))
          .map((item: any) => item.feature),
        datasets: [
          {
            label: "Total Time Spent",
            data: data.map((item: any) => item.totalTimeSpent),
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching bar chart data:", error);
    }
  };

  const fetchLineData = async (feature: string) => {
    const { age, gender, startDate, endDate } = filters;

    try {
      const response = await axios.get(
        "http://localhost:5000/api/time-trend-data",
        {
          params: { feature, age, gender, startDate, endDate },
        }
      );

      const data = response.data;
      setLineData(data);
    } catch (error) {
      console.error("Error fetching line chart data:", error);
    }
  };

  const handleBarClick = (elements: any) => {
    if (elements.length > 0) {
      const feature = barData.labels[elements[0].index];
      fetchLineData(feature);
    }
  };

  // Update filters with saving to cookies
  const updateFilters = (newFilters: Partial<Filters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);

    // Save to cookies
    Cookies.set(
      "filters",
      JSON.stringify({
        ...updatedFilters,
        startDate: updatedFilters.startDate.format("DD-MM-YYYY"),
        endDate: updatedFilters.endDate.format("DD-MM-YYYY"),
      })
    );
  };

  useEffect(() => {
    // Get initial filters from URL or cookies
    const initialFilters = getInitialFilters();
    setFilters(initialFilters);

    fetchBarData();

    return () => {
      setBarData({ labels: [], datasets: [] });
      setLineData([]);
    };
  }, []);

  return (
    <Box
      sx={{
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="outlined" onClick={logoutHandler}>
          Logout
        </Button>
      </Box>
      <Box
        mb={2}
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <DatePicker
          format="DD-MM-YYYY"
          label="Start Date"
          value={filters.startDate}
          onChange={(newValue) =>
            updateFilters({
              startDate: newValue ? moment(newValue) : null,
            })
          }
        />
        <DatePicker
          format="DD-MM-YYYY"
          label="End Date"
          value={filters.endDate}
          onChange={(newValue) =>
            updateFilters({
              endDate: newValue ? moment(newValue) : null,
            })
          }
        />
        <Select
          value={filters.age}
          onChange={(e) => updateFilters({ age: e.target.value })}
        >
          <MenuItem value="15-25">15-25</MenuItem>
          <MenuItem value=">25">&gt;25</MenuItem>
        </Select>
        <Select
          value={filters.gender}
          onChange={(e) => updateFilters({ gender: e.target.value })}
        >
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
        </Select>
        <Button onClick={fetchBarData} variant="outlined">
          Apply Filters
        </Button>
        <Button
          onClick={generateShareableUrl}
          variant="contained"
          color="primary"
        >
          Copy Share URL
        </Button>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "2rem",
          flexWrap: "wrap",
        }}
      >
        <Box width="48%" sx={{ width: { xs: "90%", sm: "48%" } }}>
          <Bar
            id="bar-chart-unique"
            data={barData}
            options={{
              indexAxis: "y",
              responsive: true,
              onClick: (_, elements) => handleBarClick(elements),
            }}
            redraw={true}
          />
        </Box>

        <Box sx={{ width: { xs: "90%", sm: "48%" } }}>
          <LineChart lineData={lineData} />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
