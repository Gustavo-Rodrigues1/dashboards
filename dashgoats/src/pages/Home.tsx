import Header from '../components/Header';
import CarouselAndTable from '../components/CarouselAndTable';
import Chart from '../components/Chart';
import { useF1Data } from '../hooks/HomeData';

const Home = () => {
  const { drivers, teams, races, loading, error } = useF1Data();

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-font/40 text-sm">Carregando dados...</p>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-red-500 text-sm">{error}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CarouselAndTable drivers={drivers} teams={teams} />
      <Chart drivers={drivers} teams={teams} races={races} />
    </div>
  );
};

export default Home;