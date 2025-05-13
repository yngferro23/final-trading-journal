import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Calendar from './pages/Calendar';
import ChartReplayPage from './pages/ChartReplayPage';
import Layout from './components/layout/Layout';
import AddTrade from './pages/AddTrade';
import Settings from './pages/Settings';
import TradeHistory from './pages/TradeHistory';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import { TradeProvider } from './context/TradeContext';
import { AuthProvider, useAuth } from './context/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/*" element={
          <ProtectedRoute>
            <TradeProvider>
              <Layout>
                <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add-trade" element={<AddTrade />} />
          <Route path="/history" element={<TradeHistory />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/chart-replay" element={<ChartReplayPage />} />
          <Route path="/settings" element={<Settings />} />
                </Routes>
              </Layout>
            </TradeProvider>
          </ProtectedRoute>
        } />
      </Routes>
    </AuthProvider>
  );
};

export default App;
