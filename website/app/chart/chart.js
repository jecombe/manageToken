// components/MyLineChart.tsx
"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Tooltip,
  PointElement,
  LineElement,
} from "chart.js";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

// Register ChartJS components using ChartJS.register
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
);
const VolumeChart = ({ data }) => {
    const [labels, setLabels] = useState([]);
    const [dataAsset, setDataAsset] = useState([]);

  useEffect(() => {
    const labels = data.map(item => item.timestamp);
    const volumes = data.map(item => Number(item.volume));
    setLabels(labels)
    setDataAsset(volumes)

    console.log(labels, volumes);
  }, [data]);

  return (
    <div>
      <Line
        data={{
          labels,
          datasets: [
            {
              data: dataAsset,
              backgroundColor: "purple",
            },
          ],
        }}
      />
    </div>
  )
};

export default VolumeChart;
