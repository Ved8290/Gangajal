const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const pdf = require('html-pdf');  // To generate PDF files
const app = express();
const port = 5000;

// Middleware to handle JSON and multipart/form-data (file uploads)
app.use(express.json());
app.use(cors());

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Set the destination folder where the images will be saved
    const uploadDir = './uploads/';
    
    // Check if the folder exists, if not, create it
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    
    cb(null, uploadDir);  // Folder where the files will be stored
  },
  filename: (req, file, cb) => {
    // Store file with its original name
    cb(null, Date.now() + path.extname(file.originalname));  // Unique filename
  }
});
const upload = multer({ storage: storage });

// MongoDB connection string
const mongoURI = 'mongodb+srv://vedmahajan8290:gangajal1234@gangajal.1648h.mongodb.net/?retryWrites=true&w=majority&appName=gangajal';

// MongoDB connection
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 50000 })
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// Define Order schema
const orderSchema = new mongoose.Schema({
  paymentStatus: { type: String, default: 'pending' },
  name: String,
  phone: String,
  email: String,
  address: String,
  city: String,
  pincode: Number,
  quantity: Number,
  totalCost: Number,
  fullAddress: String,
  screenshot: { type: String }, // Path to the screenshot
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
      screenshot: screenshot.path, // Save the file path to MongoDB
      paymentStatus, // Add payment status
    });

    await newOrder.save();
    res.json({ success: true, message: 'Order saved successfully!' });
  } catch (error) {
    console.error('Error saving order:', error);
    res.status(500).json({ success: false, message: 'Error saving order.' });
  }
});

// API endpoint to fetch all orders
app.get('/api/orders', async (req, res) => {
  try {
    // Fetch all orders from the MongoDB database
    const orders = await Order.find();

    // Send the orders data including screenshot paths to the frontend
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// Serve images from the 'uploads' folder as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

app.patch('/api/orders/payment-status', async (req, res) => {
    try {
      const { orderIds, paymentStatus } = req.body;
      const updatedOrders = await Order.updateMany(
        { _id: { $in: orderIds } },
        { paymentStatus }
      );
      res.json({ success: true, message: 'Payment status updated successfully' });
    } catch (error) {
      console.error('Error updating payment status:', error);
      res.status(500).json({ message: 'Error updating payment status' });
    }
  });
  

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
