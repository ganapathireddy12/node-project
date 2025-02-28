import React, { useEffect, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import axios from "axios";
import { io } from 'socket.io-client';

const port = process.env.REACT_APP_SERVER_PORT;

function BranchWiseChart() {
  const [data, setData] = useState({
    xAxis: [{ scaleType: "band", data: [] }],
    series: [{ data: [] }],
  });

  const [isLoading, setIsLoading] = useState(true); // State to handle loading

  const baseUrl = process.env.REACT_APP_SERVER_PORT;

  // Fetch data function
  const fetchData = () => {
    axios
      .get(`${baseUrl}/count-by-department?Department=YES&EventDate=YES`)
      .then((res) => {
        console.log("DATA", res.data);
        setData(res.data);
        setIsLoading(false); // Set loading to false once data is fetched
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    // Fetch data initially
    fetchData();

    // Connect to the Socket.IO server
    const socket = io(port); // Replace with the correct port if needed

    // Listen for the "new-registration" event
    socket.on("new-registration", () => {
      console.log("New registration detected");
      fetchData(); // Re-fetch data on new registration
    });

    // Cleanup the socket connection on unmount
    return () => {
      socket.off("new-registration"); // Remove the event listener
      socket.disconnect(); // Disconnect the socket
    };
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center", flexDirection: "column" }}>
      <h4
        className="chart-title"
        style={{ marginBottom: 20, alignSelf: "center", marginTop: 20 }}
      >
        Branch Wise Count
      </h4>
      {isLoading ? (
        <p style={{ textAlign: "center" }}>Loading chart data...</p>
      ) : (
        <BarChart
          xAxis={data.xAxis}
          series={data.series}
          width={window.innerWidth * 0.6}
          height={400}
        />
      )}
    </div>
  );
}

export default BranchWiseChart;
