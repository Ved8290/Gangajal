import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import BuyNow from './BuyNow/page';
import Home from './Home';
import PayNow from './PayNow/page';
import Payment from './Payment/page';
import Confirmation from './Payment/confirmation';
import AdminDashboard from './admin/orders';

const App = () => {
  return (
   <Router>

      {/* Routes */}
      <Routes>
        {/* Route for /buyNow page */}
        <Route path='/' element={<Home />} />
        <Route path="/buyNow" element={<BuyNow />} />
        <Route path='/PayNow' element={<PayNow />} />
        <Route path='/Payment' element={<Payment />} />
        <Route path='/Confirmation' element={<Confirmation /> } />
        <Route path='/Admin' element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
};



export default App;
