import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './PayNow.css';

const PayNow = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { order } = location.state || {}; // Get order details from location state
  
  const [language, setLanguage] = useState('en'); // default is English
  
  const pricePerBottle = 100;
  const gst = 0.03;
  const totalCost = pricePerBottle * order.quantity * (1 + gst);

  // Function to handle UPI payment redirect
  const handlePayment = () => {
    navigate('/Payment', { state: { order } }); // Pass order state to Payment page
  };

  // Toggle between English and Hindi
  const toggleLanguage = () => {
    setLanguage((prevLang) => (prevLang === 'en' ? 'hi' : 'en'));
  };

  return (
    <div className="pay-now-page">
      <div className="pay-now-container">
        {/* Language Toggle Button */}
        <button onClick={toggleLanguage} className="language-toggle-btn">
          {language === 'en' ? 'Change to Hindi' : 'Change to English'}
        </button>

        <h1>{language === 'en' ? 'Pay for Your Ganga Jal Order' : 'अपने गंगाजल आदेश के लिए भुगतान करें'}</h1>

        <div className="order-summary">
          <h3>{language === 'en' ? 'Order Summary' : 'आदेश सारांश'}</h3>
          <p><strong>{language === 'en' ? 'Name:' : 'नाम:'} {order.name}</strong></p>
          <p><strong>{language === 'en' ? 'Phone:' : 'फ़ोन:'} {order.phone}</strong></p>
          <p><strong>{language === 'en' ? 'Email:' : 'ईमेल:'} {order.email}</strong></p>
          <p><strong>{language === 'en' ? 'Address:' : 'पता:'} {order.address}, {order.city}, {order.state}, {order.pincode}</strong></p>
          <p><strong>{language === 'en' ? 'Quantity:' : 'मात्रा:'} {order.quantity} Bottle(s)</strong></p>
          <p><strong>{language === 'en' ? 'Total Cost:' : 'कुल मूल्य:'} ₹{totalCost.toFixed(2)}</strong></p>
        </div>

        <div className="payment-section">
          <h3>{language === 'en' ? 'Payment Details' : 'भुगतान विवरण'}</h3>
          <p><strong>{language === 'en' ? 'Total Amount to be Paid:' : 'कुल राशि जिसे भुगतान करना है:'} ₹{totalCost.toFixed(2)}</strong></p>

          <button onClick={handlePayment} className="cta-btn">
            {language === 'en' ? 'Proceed to Payment' : 'भुगतान के लिए आगे बढ़ें'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PayNow;
