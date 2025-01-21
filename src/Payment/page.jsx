import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
//import './Payment.css';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { order } = location.state || {}; // Get order details from location state

  if (!order) {
    navigate('/'); // If no order data, navigate back to home page
    return null;
  }

  const [selectedFile, setSelectedFile] = useState(null); // State for managing the file upload

  // Function to handle file input change (file selection)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    console.log('Uploaded file:', file);
  };

  // Function to handle form submit (for uploading screenshot and sending data to the server)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Please upload a screenshot for verification.');
      return;
    }

    // Prepare order data to send to the server
    const orderData = {
      name: order.name,
      phone: order.phone,
      quantity: order.quantity,
      address: `${order.address} AT POST ${order.postOffice} ${order.city} pincode - ${order.pincode} , ${order.state}`,
      totalCost: (100 * order.quantity * 1.03).toFixed(2),
      fullAddress: `${order.address} AT POST ${order.postOffice} ${order.city} pincode - ${order.pincode}`,
      email: order.email,
      city: order.city,
      state: order.state,
      postOffice: order.postOffice,
      pincode:order.pincode
      
    };

    // Send the order data and screenshot to the backend
    saveOrder(orderData);
  };

  const saveOrder = async (orderData) => {
    try {
      const formData = new FormData();
      formData.append('orderData', JSON.stringify(orderData));
      formData.append('screenshot', selectedFile);

      // Send the order data and file to the backend
      const response = await fetch('http://localhost:5000/Payment', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        navigate('/confirmation', { state: { orderData } });
      } else {
        alert('Error saving order!');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Error submitting order.');
    }
  };

  const fullAddress = `${order.address} AT POST ${order.postOffice} ${order.city} pincode - ${order.pincode}`;
  const totalcost1=(100 * order.quantity * 1.18).toFixed(2);
  const upiLink = `https://getupilink.com/upi/8767375114@ptsbi?am=${totalcost1}`; // UPI payment link

  return (
    <div className="payment-page">
      <div className="payment-container">
        <h1>Proceed with UPI Payment</h1>

        <div className="order-summary">
          <h3>Order Summary</h3>
          <p><strong>Name:</strong> {order.name}</p>
          <p><strong>Phone:</strong> {order.phone}</p>
          <p><strong>Quantity:</strong> {order.quantity} Bottle(s)</p>
          <p><strong>Address:</strong> {fullAddress}</p>
          <p><strong>Total Cost:</strong> ₹{(100 * order.quantity * 1.18).toFixed(2)}</p>
        </div>

        <div className="upi-payment-info">
          <h2>UPI Payment</h2>
          <p>Please make the payment using the link below:</p>
          <iframe
            src={upiLink}
            width="100%"
            height="500px"
            style={{ border: '1px solid #ccc' }}
            title="UPI Payment"
          ></iframe>
          <p>Once the payment is complete, please upload a screenshot for verification.</p>

          {/* Upload Screenshot Form */}
          <form onSubmit={handleSubmit}>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ margin: '10px 0' }}
            />
            <br />
            <button type="submit" className="cta-btn">
              Confirm Payment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Payment;
