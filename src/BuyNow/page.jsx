import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BuyNow.css';

const BuyNow = () => {
  const navigate = useNavigate();

  // State to hold form data
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    pincode: '',
    state: '',
    postOffice: '', // To store selected PostOffice
    quantity: 1,
  });

  // State to hold error messages
  const [error, setError] = useState('');

  // State to handle language selection
  const [language, setLanguage] = useState('hi'); // 'hi' for Hindi, 'en' for English

  // State for PostOffice options
  const [postOffices, setPostOffices] = useState([]);

  // Function to handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Function to handle pincode change and auto-populate city and state
  const handlePincodeChange = async (e) => {
    const pincode = e.target.value;
    setFormData({
      ...formData,
      pincode: pincode,
    });

    if (pincode.length === 6) {
      try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = await response.json();

        if (data[0].Status === 'Success') {
          const { District, State, PostOffice } = data[0].PostOffice[0];
          setFormData((prevState) => ({
            ...prevState,
            city: District,
            state: State,
          }));

          // Populate PostOffice dropdown
          const postOfficeNames = data[0].PostOffice.map(post => post.Name);
          setPostOffices(postOfficeNames);
        } else {
          setError(language === 'hi' ? 'यह पिनकोड मान्य नहीं है!' : 'This pincode is invalid!');
          setPostOffices([]); // Clear post offices if pincode is invalid
        }
      } catch (error) {
        setError(language === 'hi' ? 'कनेक्शन समस्या है। कृपया पुनः प्रयास करें!' : 'Connection issue. Please try again!');
        setPostOffices([]); // Clear post offices in case of error
      }
    }
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form data
    if (!formData.name || !formData.phone || !formData.address || !formData.city || !formData.pincode || !formData.state || !formData.email || !formData.postOffice) {
      setError(language === 'hi' ? 'कृपया सभी जानकारी सही से भरें!' : 'Please fill out all fields!');
      return;
    }

    // Validate phone number (must be 10 digits)
    if (!/^\d{10}$/.test(formData.phone)) {
      setError(language === 'hi' ? 'कृपया सही 10 अंकों का फ़ोन नंबर डालें!' : 'Please enter a valid 10-digit phone number!');
      return;
    }

    // Validate email address
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      setError(language === 'hi' ? 'कृपया एक वैध ईमेल पता डालें!' : 'Please enter a valid email address!');
      return;
    }

    setError('');

    // Redirect to a confirmation or success page after submitting the form
    navigate('/PayNow', { state: { order: formData } });
  };

  const pricePerBottle = 100;
  const gst = 0.03; // 18% GST
  const totalCost = pricePerBottle * formData.quantity * (1 + gst);

  // Language toggle function
  const toggleLanguage = () => {
    setLanguage(language === 'hi' ? 'en' : 'hi');
  };

  return (
    <div className="buy-now-page">
      <div className="buy-now-container">
        {/* Language Toggle Button */}
        <button onClick={toggleLanguage} className="language-toggle-btn">
          {language === 'hi' ? 'Switch to English' : 'हिंदी में बदलें'}
        </button>

        <h1>{language === 'hi' ? 'गंगाजल खरीदें' : 'Buy Ganga Jal'}</h1>
        <p>{language === 'hi' ? 'अपना आदेश यहां से दें और पवित्र गंगाजल प्राप्त करें।' : 'Place your order here and receive the sacred Ganga Jal.'}</p>

        <form onSubmit={handleSubmit} className="order-form">
          {/* Name */}
          <div className="form-group">
            <label htmlFor="name">{language === 'hi' ? 'पूरा नाम:' : 'Full Name:'}</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={language === 'hi' ? 'अपना पूरा नाम डालें' : 'Enter your full name'}
              className="form-input"
            />
          </div>

          {/* Phone Number */}
          <div className="form-group">
            <label htmlFor="phone">{language === 'hi' ? 'फ़ोन नंबर:' : 'Phone Number:'}</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder={language === 'hi' ? 'अपना फ़ोन नंबर डालें' : 'Enter your phone number'}
              className="form-input"
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">{language === 'hi' ? 'ईमेल पता:' : 'Email Address:'}</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={language === 'hi' ? 'अपना ईमेल पता डालें' : 'Enter your email address'}
              className="form-input"
            />
          </div>

          {/* Address Section */}
          <h3>{language === 'hi' ? 'पता विवरण' : 'Address Details'}</h3>

          <div className="form-group">
            <label htmlFor="address">{language === 'hi' ? 'गली / घर का पता:' : 'Street / House Address:'}</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder={language === 'hi' ? 'अपना गली / घर का पता डालें' : 'Enter your street/house address'}
              className="form-input"
            />
          </div>


          <div className="form-group">
            <label htmlFor="pincode">{language === 'hi' ? 'पिनकोड:' : 'Pincode:'}</label>
            <input
              type="text"
              id="pincode"
              name="pincode"
              value={formData.pincode}
              onChange={handlePincodeChange}
              placeholder={language === 'hi' ? 'अपना पिनकोड डालें' : 'Enter your pincode'}
              className="form-input"
            />
          </div>


          <div className="form-group">
            <label htmlFor="city">{language === 'hi' ? 'शहर:' : 'City:'}</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder={language === 'hi' ? 'अपना शहर डालें' : 'Enter your city'}
              className="form-input"
              readOnly
            />
          </div>

         

          <div className="form-group">
            <label htmlFor="state">{language === 'hi' ? 'राज्य:' : 'State:'}</label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder={language === 'hi' ? 'अपना राज्य डालें' : 'Enter your state'}
              className="form-input"
              readOnly
            />
          </div>

          {/* PostOffice Dropdown */}
          <div className="form-group">
            <label htmlFor="postOffice">{language === 'hi' ? 'पोस्ट ऑफिस नाम:' : 'Post Office Name:'}</label>
            <select
              id="postOffice"
              name="postOffice"
              value={formData.postOffice}
              onChange={handleChange}
              className="form-input"
            >
              <option value="">{language === 'hi' ? 'पोस्ट ऑफिस चुनें' : 'Select Post Office'}</option>
              {postOffices.map((post, index) => (
                <option key={index} value={post}>
                  {post}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div className="form-group">
            <label htmlFor="quantity">{language === 'hi' ? 'मात्रा:' : 'Quantity:'}</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              min="1"
              value={formData.quantity}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          {/* Error Message */}
          {error && <p className="error">{error}</p>}

          {/* Submit Button */}
          <button type="submit" className="cta-btn">{language === 'hi' ? 'ऑर्डर अब' : 'Order Now'}</button>
        </form>

        {/* Price Details */}
        <div className="price-details">
          <h3>{language === 'hi' ? 'कुल कीमत' : 'Total Price'}</h3>
          <p>{language === 'hi' ? `₹${pricePerBottle} x ${formData.quantity} बोतल = ₹${pricePerBottle * formData.quantity}` : `₹${pricePerBottle} x ${formData.quantity} Bottle = ₹${pricePerBottle * formData.quantity}`}</p>
          <p>{language === 'hi' ? `Platform Charge (3%): ₹${(pricePerBottle * formData.quantity * gst).toFixed(2)}` : `Platform Charge (3%): ₹${(pricePerBottle * formData.quantity * gst).toFixed(2)}`}</p>
          <h2>{language === 'hi' ? `कुल मूल्य: ₹${totalCost.toFixed(2)}` : `Total Price: ₹${totalCost.toFixed(2)}`}</h2>
        </div>
      </div>
    </div>
  );
};

export default BuyNow;
