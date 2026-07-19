let express = require('express');
let multer = require('multer');
let path = require('path');
let fs = require('fs');
let { Signup, Login, getProfile, updateProfile } = require('../Controller/auth');
let { addCustomer, getCustomers, updateCustomer, deleteCustomer } = require('../Controller/customer_controller');
let { createInvoice, getInvoices, getInvoiceById, updateInvoice, deleteInvoice, getDashboardSummary, getPaymentReports } = require('../Controller/invoice_controller');
let { getStaff, addStaff, updateStaff, deleteStaff } = require('../Controller/staff_controller');
let jwt = require('jsonwebtoken');
let dotenv = require('dotenv');

dotenv.config();

let uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

let storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    let safeName = file.originalname.replace(/\s+/g, '_');
    cb(null, `${Date.now()}-${safeName}`);
  }
});

let upload = multer({ storage });

let router = express.Router();
let SECRET_KEY = process.env.SECRET_KEY;

let authMiddleware = (req, res, next) => {
  let token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Token missing' });
  }
  try {
    let decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

router.post('/api/login', Login);
router.post('/api/signup', Signup);
router.get('/api/profile', authMiddleware, getProfile);
router.put('/api/profile', authMiddleware, updateProfile);
router.patch('/api/profile', authMiddleware, updateProfile);
router.post('/api/profile', authMiddleware, updateProfile);
router.post('/api/upload', authMiddleware, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'File upload failed' });
  }
  let fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  return res.status(201).json({ success: true, url: fileUrl });
});
router.get('/api/dashboard-summary', authMiddleware, getDashboardSummary);
router.post('/api/customers', authMiddleware, addCustomer);
router.get('/api/customers', authMiddleware, getCustomers);
router.put('/api/customers/:id', authMiddleware, updateCustomer);
router.delete('/api/customers/:id', authMiddleware, deleteCustomer);
router.post('/api/invoices', authMiddleware, createInvoice);
router.get('/api/invoices', authMiddleware, getInvoices);
router.get('/api/invoices/:id', authMiddleware, getInvoiceById);
router.put('/api/invoices/:id', authMiddleware, updateInvoice);
router.delete('/api/invoices/:id', authMiddleware, deleteInvoice);
router.get('/api/payment-reports', authMiddleware, getPaymentReports);
router.get('/api/staff', authMiddleware, getStaff);
router.post('/api/staff', authMiddleware, addStaff);
router.put('/api/staff/:id', authMiddleware, updateStaff);
router.delete('/api/staff/:id', authMiddleware, deleteStaff);

module.exports = router;
