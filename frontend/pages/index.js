import Layout from '../components/Layout';
import TariffTable from '../components/TariffTable';


import ChatDockEnhanced from '../components/ChatDockEnhanced';
export default function Home() {
  return (
    <Layout>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-serif mb-4">Tariff Lens</h1>
          <TariffTable />
        </div>
        <div>
          <h2 className="text-2xl font-serif mb-4">AI Chat</h2>
          <ChatDockEnhanced />
        </div>
      </div>
    </Layout>
  );
}
