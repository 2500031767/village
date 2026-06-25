import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Home from './pages/Home';
import About from './pages/About';
import Census from './pages/Census';
import Agriculture from './pages/Agriculture';
import Education from './pages/Education';
import Healthcare from './pages/Healthcare';
import Infrastructure from './pages/Infrastructure';
import Schemes from './pages/Schemes';
import Issues from './pages/Issues';
import Notifications from './pages/Notifications';
import BusinessDirectory from './pages/BusinessDirectory';
import Gallery from './pages/Gallery';
import NRI from './pages/NRI';
import DigitalServices from './pages/DigitalServices';
import AIInsights from './pages/AIInsights';
import Survey from './pages/Survey';
import Contact from './pages/Contact';
import Login from './pages/Login';

import AdminDashboard from './pages/AdminDashboard';
import VillageHighlights from './pages/VillageHighlights';
import UserDashboard from './pages/UserDashboard';
import Awards from './pages/Awards';
import './index.css';




import { useState } from 'react';

function App() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Router>
      <div className="app-layout">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <main className={`main-content ${collapsed ? 'collapsed' : ''}`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/census" element={<Census />} />
            <Route path="/agriculture" element={<Agriculture />} />
            <Route path="/education" element={<Education />} />
            <Route path="/healthcare" element={<Healthcare />} />
            <Route path="/infrastructure" element={<Infrastructure />} />
            <Route path="/schemes" element={<Schemes />} />
            <Route path="/issues" element={<Issues />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/businesses" element={<BusinessDirectory />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/nri" element={<NRI />} />
            <Route path="/services" element={<DigitalServices />} />
            <Route path="/insights" element={<AIInsights />} />
            <Route path="/highlights" element={<VillageHighlights />} />
            <Route path="/awards" element={<Awards />} />
            <Route path="/survey" element={<Survey />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/login" element={<Login />} />


            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
