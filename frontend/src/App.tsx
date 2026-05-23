import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/auth/login';
import Signup from './pages/auth/signup';
import Checkout from './pages/checkouts/Checkout';

function App() {
  return (
    <Router>
      <div className="bg-slate-950 min-h-screen text-white flex flex-col justify-between selection:bg-blue-500/30">
        
        <Navbar />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="checkout"  element={<Checkout />}      />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
        
        <Footer />
        
      </div>
    </Router>
  );
}

export default App;