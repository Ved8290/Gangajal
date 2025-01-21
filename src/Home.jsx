import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import BuyNow from './BuyNow/page';
const Home = () => {
  return (

      <div className="App">
        {/* Hero Section */}
        <section className="hero-section" id="home">
          <div className="hero-overlay">
            <div className="hero-content">
              <h1>पवित्र गंगाजल</h1>
              <p>घर बैठे गंगाजल मंगवाए</p>
              {/* Link to /buyNow page */}
              <Link to="/buyNow" className="cta-btn">अभी खरीदें</Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="features-section">
          <h2>गंगाजल की विशेषताएँ</h2>
          <div className="features-list">
            <div className="feature">
              <img src="https://www.w3schools.com/w3images/forest.jpg" alt="Purity" />
              <h3>शुद्धता</h3>
              <p>100% प्राकृतिक और शुद्ध गंगाजल, सीधे गंगा नदी से लिया गया।</p>
            </div>
            <div className="feature">
              <img src="https://www.w3schools.com/w3images/mountains.jpg" alt="Health Benefits" />
              <h3>धार्मिक महत्व</h3>
              <p>गंगाजल का उपयोग पूजा, स्नान, और धार्मिक कार्यों के लिए किया जाता है।</p>
            </div>
            <div className="feature">
              <img src="https://www.w3schools.com/w3images/lights.jpg" alt="Health" />
              <h3>स्वास्थ्य लाभ</h3>
              <p>गंगाजल से शारीरिक और मानसिक शुद्धता मिलती है।</p>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section id="why-choose-us" className="why-choose-us-section">
          <h2>हमसे क्यों खरीदें?</h2>
          <div className="why-choose-us-list">
            <div className="reason">
              <h3>प्राकृतिक शुद्धता</h3>
              <p>हमारा गंगाजल 100% शुद्ध और प्राकृतिक है, बिना किसी मिलावट के।</p>
            </div>
            <div className="reason">
              <h3>स्वस्थ जीवन</h3>
              <p>गंगाजल आपके शारीरिक और मानसिक स्वास्थ्य के लिए लाभकारी है।</p>
            </div>
            <div className="reason">
              <h3>प्रमाणित स्रोत</h3>
              <p>हमारे गंगाजल को विश्वसनीय और प्रमाणित स्रोतों से प्राप्त किया जाता है।</p>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="pricing-section">
          <h2>कीमत</h2>
          <div className="pricing-details">
            <p><span className="price">₹100</span> <span className="original-price">₹200</span></p>
            <p>50% OFF! <span className="gst">+ GST</span></p>
            <p className="delivery-info"><strong>डिलीवरी भारत भर में की जाती है।</strong></p>
            {/* Link to /buyNow page */}
            <Link to="/buyNow" className="cta-btn">अभी खरीदें</Link>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="faq-section">
          <h2>अक्सर पूछे जाने वाले प्रश्न</h2>
          <div className="faq-list">
            <div className="faq-item">
              <h4>क्या गंगाजल का उपयोग पूजा में किया जा सकता है?</h4>
              <p>हां, गंगाजल का उपयोग पूजा, हवन, और धार्मिक कार्यों के लिए किया जाता है।</p>
            </div>
            <div className="faq-item">
              <h4>क्या गंगाजल से स्वास्थ्य लाभ होते हैं?</h4>
              <p>जी हां, गंगाजल पीने से शारीरिक और मानसिक शुद्धता मिलती है।</p>
            </div>
            <div className="faq-item">
              <h4>क्या यह गंगाजल शुद्ध है?</h4>
              <p>हमारा गंगाजल 100% शुद्ध और प्राकृतिक है, कोई मिलावट नहीं।</p>
            </div>
          </div>
        </section>

        {/* Footer Section */}
        <footer id="contact">
          <p>&copy; 2025 गंगाजल | सभी अधिकार सुरक्षित हैं।</p>
          <p>हमसे संपर्क करें: info@gangajal.com</p>
        </footer>
      </div>

      
    
  
  );
};



export default Home;
