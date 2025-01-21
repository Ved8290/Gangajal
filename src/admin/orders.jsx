import React, { useState, useEffect } from 'react';
import './Admin.css';
const dom='https://gangajal.vercel.app/';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [payStatus, setPayStatus] = useState("success"); // Default status is success

  // Fetch orders from backend API
  useEffect(() => {
    fetch(`${dom}/api/orders`)
      .then((response) => response.json())
      .then((data) => setOrders(data))
      .catch((error) => console.error('Error fetching orders:', error));
  }, []);

  // Handle checkbox selection
  const handleSelectOrder = (orderId) => {
    setSelectedOrders((prevSelectedOrders) => {
      if (prevSelectedOrders.includes(orderId)) {
        return prevSelectedOrders.filter((id) => id !== orderId);
      } else {
        return [...prevSelectedOrders, orderId];
      }
    });
  };

  // Handle update of payment status for selected orders
  const handleUpdatePaymentStatus = () => {
    if (selectedOrders.length === 0) {
      alert('Please select at least one order');
      return;
    }

    // Send request to update payment status for selected orders
    fetch(`${dom}/api/orders/payment-status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderIds: selectedOrders, paymentStatus: payStatus }),
    })
      .then((response) => response.json())
      .then((data) => {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            selectedOrders.includes(order._id)
              ? { ...order, paymentStatus: payStatus }
              : order
          )
        );
        alert('Payment status updated successfully');
      })
      .catch((error) => console.error('Error updating payment status:', error));
  };

  // Handle PDF download for selected orders
  const handleDownloadPDF = () => {
    if (selectedOrders.length > 0) {
      fetch(`${dom}/generate-pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderIds: selectedOrders }),
      })
        .then((response) => response.blob())
        .then((blob) => {
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = 'selected-orders.pdf';
          link.click();
        })
        .catch((error) => console.error('Error generating PDF:', error));
    } else {
      alert('Please select at least one order');
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div>
        <button onClick={handleUpdatePaymentStatus} style={{ marginBottom: '20px' }}>
          Update Payment Status
        </button>
        <button onClick={handleDownloadPDF} style={{ marginBottom: '20px' }}>
          Download Selected Orders as PDF
        </button>

        <div>
          <label>
            <input
              type="radio"
              name="paymentStatus"
              value="success"
              checked={payStatus === "success"}
              onChange={() => setPayStatus("success")}
            />
            Mark as Paid
          </label>
          <label>
            <input
              type="radio"
              name="paymentStatus"
              value="fail"
              checked={payStatus === "fail"}
              onChange={() => setPayStatus("fail")}
            />
            Mark as Not Paid
          </label>
        </div>
      </div>

      <table className="orders-table">
        <thead>
          <tr>
            <th>Select</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Address</th>
            <th>Payment Status</th>
            <th>Total Cost</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>
                <input
                  type="checkbox"
                  onChange={() => handleSelectOrder(order._id)}
                  checked={selectedOrders.includes(order._id)}
                />
              </td>
              <td>{order.name}</td>
              <td>{order.phone}</td>
              <td>{order.email}</td>
              <td>{order.fullAddress}</td>
              <td>
                <button
                  style={{
                    backgroundColor: order.paymentStatus === 'success' ? 'green' : 'red',
                    color: 'white',
                    padding: '5px 10px',
                    border: 'none',
                    borderRadius: '5px',
                  }}
                >
                  {order.paymentStatus === 'success' ? 'Payment Successful' : 'Payment Failed'}
                </button>
              </td>
              <td>{order.totalCost}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
