import { Line } from "react-chartjs-2";
import { useQuery } from "@tanstack/react-query";
import customFetch from "../utils/customFetch";
import Wrapper from "../assets/wrapper/Stats";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement);
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
const fetchWeeklySales = async () => {
  const { data } = await customFetch.get("/orders/stats");
  return data.weeklySales;
};
const WeeklySales = () => {
  const { data = [], isLoading } = useQuery({
    queryKey: ["weeklySales"],
    queryFn: fetchWeeklySales,
  });

  if (isLoading) return <p className='loading'></p>;

  //const labels = data.map((item) => new Date(item.date).toLocaleDateString());
  const salesData = data.map((item) => parseFloat(item.total_sales));

  // Use custom format "DD/MM/YYYY"
  const labels = data.map((item) => {
    const parsed = dayjs(item.date, "DD/MM/YYYY");
    return parsed.isValid() ? parsed.format("ddd, MMM D") : "Invalid Date";
  });
  const chartData = {
    labels,
    datasets: [
      {
        label: "Total Sales ($)",
        data: salesData,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.3,
      },
    ],
  };
  return (
    <Wrapper>
      <div className='chart-container'>
        <h3>Weekly Sales</h3>
        <Line data={chartData} />
      </div>
    </Wrapper>
  );
};

export default WeeklySales;
