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

const fetchWeeklyUsers = async () => {
  const { data } = await customFetch.get("/users/stats");
  return data.weeklyUsers;
};
const WeeklyUsers = () => {
  const { data = [], isLoading } = useQuery({
    queryKey: ["weeklyUsers"],
    queryFn: fetchWeeklyUsers,
  });

  if (isLoading) return <p>Loading user chart...</p>;

  const labels = data.map((item) => new Date(item.date).toLocaleDateString());
  const userData = data.map((item) => parseInt(item.total_users));

  const chartData = {
    labels,
    datasets: [
      {
        label: "New Users",
        data: userData,
        fill: false,
        borderColor: "rgb(255, 99, 132)",
        tension: 0.3,
      },
    ],
  };

  return (
    <Wrapper>
      <div className='chart-container'>
        <h3>Weekly Registered Users</h3>
        <Line data={chartData} />
      </div>
    </Wrapper>
  );
};

export default WeeklyUsers;
