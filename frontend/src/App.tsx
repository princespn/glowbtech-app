import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/auth/login';
import Signup from './pages/auth/signup';

function App() {
  return (
    <Router>
      <div className="bg-slate-950 min-h-screen text-white flex flex-col justify-between selection:bg-blue-500/30">
        
        <Navbar />
        
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Future dynamic category/product paths plug in directly here */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
        
        <Footer />
        
      </div>
    </Router>
  );
}

export default App;