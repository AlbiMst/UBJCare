import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import supabase from './supabaseClient';
import Login from './components/Login';
import Register from './components/Register';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import HomePage from './pages/HomePage';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={user ? <Navigate to={user.user_metadata.role === 'admin' ? '/admin-dashboard' : '/dashboard'} /> : <Login setUser={setUser} />} />
        <Route path="/register" element={user ? <Navigate to={user.user_metadata.role === 'admin' ? '/admin-dashboard' : '/dashboard'} /> : <Register setUser={setUser} />} />
        <Route path="/dashboard" element={user ? (user.user_metadata.role === 'admin' ? <Navigate to="/admin-dashboard" /> : <UserDashboard user={user} />) : <Navigate to="/login" />} />
        <Route path="/admin-dashboard" element={user ? (user.user_metadata.role === 'admin' ? <AdminDashboard user={user} /> : <Navigate to="/dashboard" />) : <Navigate to="/login" />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;