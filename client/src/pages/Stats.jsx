import { WeeklySales, WeeklyUsers } from "../components";
import Wrapper from "../assets/wrapper/Stats";
const Stats = () => {
  return (
    <Wrapper>
      <div className='main-container'>
        <WeeklyUsers />
        <WeeklySales />
      </div>
    </Wrapper>
  );
};

export default Stats;
