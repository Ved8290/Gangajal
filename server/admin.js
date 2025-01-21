const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const pdf = require('html-pdf');
const app = express();
const port = 5001;

// Middleware to handle JSON and multipart/form-data (file uploads)
app.use(express.json());
app.use(cors());

// Set up multer for file uploads
const storage = multer.memoryStorage();  // Store file in memory as Buffer
const upload = multer({ storage: storage });

// MongoDB connection string
const mongoURI = 'mongodb+srv://vedmahajan8290:gangajal1234@gangajal.1648h.mongodb.net/?retryWrites=true&w=majority&appName=gangajal';

// MongoDB connection
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true ,serverSelectionTimeoutMS: 50000})
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// Define Order schema
const orderSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  address: String,
  city: String,
  pincode: Number,
  quantity: Number,
  totalCost: Number,
  fullAddress: String,
  screenshot: { type: Buffer }, // Store the screenshot as binary data
  paymentStatus: { type: String, enum: ['success', 'fail'], required: true } // Payment Status (success/fail)
});

// Create Order model
const Order = mongoose.model('Order', orderSchema);

// Route to handle the payment data and save order
app.post('/Payment', upload.single('screenshot'), async (req, res) => {
  try {
    const { orderData, paymentStatus } = req.body;
    const screenshot = req.file;

    const order = JSON.parse(orderData);
    const newOrder = new Order({
      ...order,
      screenshot: screenshot.buffer, // Store file buffer
      paymentStatus, // Add payment status
    });

    await newOrder.save();
    res.json({ success: true, message: 'Order saved successfully!' });
  } catch (error) {
    console.error('Error saving order:', error);
    res.status(500).json({ success: false, message: 'Error saving order.' });
  }
});

// API endpoint to fetch all orders with payment status, latest first
app.get('/api/orders', async (req, res) => {
  try {
    // Fetch all orders from the MongoDB database, ordered by latest first
    const orders = await Order.find().sort({ _id: -1 }); // Sort by descending order (_id is automatically generated in MongoDB)
    
    // Send the orders data with screenshot and payment status to the frontend
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// API endpoint to generate PDF from selected orders (printable format)
app.post('/generate-pdf', async (req, res) => {
  try {
    const selectedOrderIds = req.body.orderIds; // Array of selected order IDs
    const orders = await Order.find({ '_id': { $in: selectedOrderIds } });

    const htmlContent = `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
            }
            h1 {
              text-align: center;
              color: #333;
            }
            .order-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            .order-table th, .order-table td {
              padding: 10px;
              text-align: left;
              border: 1px solid #ddd;
            }
            .order-table th {
              background-color: #f4f4f4;
            }
            .order-table td {
              background-color: #fff;
            }
            .order-summary {
              margin-top: 20px;
              padding: 10px;
              border: 1px solid #ddd;
              background-color: #f9f9f9;
            }
            .order-summary h3 {
              margin-top: 0;
            }
            .address-info {
              margin-top: 10px;
            }
            .bold {
              font-weight: bold;
            }
            .payment-status {
              text-align: center;
              margin-top: 20px;
              padding: 10px;
              font-size: 18px;
              background-color: #f4f4f4;
              border: 1px solid #ddd;
            }
          </style>
        </head>
        <body>
          <h1>Customer Orders</h1>

          <div class="order-summary">
            <h3>Order Information:</h3>
            <table class="order-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>City</th>
                  <th>Pincode</th>
                  <th>Quantity</th>
                  <th>Total Cost</th>
                  <th>Payment Status</th>
                </tr>
              </thead>
              <tbody>
                ${orders.map(order => `
                  <tr>
                    <td>${order.name}</td>
                    <td>${order.phone}</td>
                    <td>${order.email}</td>
                    <td>${order.fullAddress}</td>
                    <td>${order.city}</td>
                    <td>${order.pincode}</td>
                    <td>${order.quantity}</td>
                    <td>${order.totalCost}</td>
                    <td>${order.paymentStatus === 'success' ? 'Paid' : 'Failed'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="address-info">
            <h3 class="bold">Shipping Information:</h3>
            ${orders.map(order => `
              <div>
                <p><span class="bold">Name:</span> ${order.name}</p>
                <p><span class="bold">Phone:</span> ${order.phone}</p>
                <p><span class="bold">Email:</span> ${order.email}</p>
                <p><span class="bold">Full Address:</span> ${order.fullAddress}</p>
                <p><span class="bold">City:</span> ${order.city}</p>
                <p><span class="bold">Pincode:</span> ${order.pincode}</p>
                <hr />
              </div>
            `).join('')}
          </div>

          <div class="payment-status">
            <p><strong>Payment Status:</strong> ${orders[0].paymentStatus === 'success' ? 'Paid' : 'Failed'}</p>
          </div>

        </body>
      </html>
    `;

    pdf.create(htmlContent).toBuffer((err, buffer) => {
      if (err) {
        return res.status(500).json({ message: 'Error generating PDF' });
      }
      res.type('pdf');
      res.send(buffer);
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ message: 'Error generating PDF' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
