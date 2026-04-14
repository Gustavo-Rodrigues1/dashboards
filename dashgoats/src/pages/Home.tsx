import Header from '../components/Header';
import Chart from '../components/Chart';

const Home = () => {
  return (
    <div>
        <Header/>
        <h1 className="text-4xl font-bold mb-4">Welcome to the Home Page</h1>
        <div className="shadow-card grid grid-cols-2 mx-80 my-28 justify-between items-center rounded-[5rem]">
        </div>
        <Chart/>
    </div>
  );
};

export default Home;