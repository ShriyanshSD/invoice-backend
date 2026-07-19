let invoice_data = require('../Model/invoice_schema');
let customer_data = require('../Model/customer_schema');

let createInvoice = async (req, res) => {
  try {
    let { invoiceNumber, customerId, customerName, customerEmail, customerPhone, customerAddress, invoiceDate, dueDate, status, paymentMethod, products, subtotal, sgst, cgst, igst, totalGst, discount, discountType, grandTotal, notes, createdBy } = req.body;

    if (!invoiceNumber || !customerId || !customerName || !invoiceDate || !dueDate) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    let existingInvoice = await invoice_data.findOne({ invoiceNumber });
    if (existingInvoice) {
      return res.status(409).json({ success: false, message: 'Invoice number already exists' });
    }

    let invoice = await invoice_data.create({
      invoiceNumber,
      customerId,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      invoiceDate,
      dueDate,
      status: status || 'Draft',
      paymentMethod,
      products,
      subtotal,
      sgst,
      cgst,
      igst,
      totalGst,
      discount,
      discountType,
      grandTotal,
      notes,
      createdBy
    });

    return res.status(201).json({ success: true, message: 'Invoice created successfully', data: invoice });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Failed to create invoice' });
  }
};

let getInvoices = async (req, res) => {
  try {
    let data = await invoice_data.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch invoices' });
  }
};

let getInvoiceById = async (req, res) => {
  try {
    let invoice = await invoice_data.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }
    return res.status(200).json({ success: true, data: invoice });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch invoice' });
  }
};

let updateInvoice = async (req, res) => {
  try {
    let invoice = await invoice_data.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }
    return res.status(200).json({ success: true, message: 'Invoice updated', data: invoice });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update invoice' });
  }
};

let deleteInvoice = async (req, res) => {
  try {
    let invoice = await invoice_data.findByIdAndDelete(req.params.id);
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }
    return res.status(200).json({ success: true, message: 'Invoice deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete invoice' });
  }
};

let getDashboardSummary = async (req, res) => {
  try {
    let customerCount = await customer_data.countDocuments();
    let invoiceCount = await invoice_data.countDocuments();
    let paidInvoices = await invoice_data.countDocuments({ paymentStatus: 'Paid' });
    let pendingInvoices = await invoice_data.countDocuments({ paymentStatus: 'Unpaid' });
    let overdueInvoices = await invoice_data.countDocuments({ status: 'Overdue' });
    
    let revenue = await invoice_data.aggregate([{ $group: { _id: null, total: { $sum: '$grandTotal' } } }]);
    let paidRevenue = await invoice_data.aggregate([{ $match: { paymentStatus: 'Paid' } }, { $group: { _id: null, total: { $sum: '$grandTotal' } } }]);
    
    return res.status(200).json({
      success: true,
      summary: {
        customers: customerCount,
        invoices: invoiceCount,
        paidInvoices,
        pendingInvoices,
        overdueInvoices,
        totalRevenue: revenue[0]?.total || 0,
        paidRevenue: paidRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to load summary' });
  }
};

let getPaymentReports = async (req, res) => {
  try {
    let reports = await invoice_data.find().select('invoiceNumber customerName status paymentStatus amountPaid grandTotal dueDate createdAt').sort({ createdAt: -1 });
    
    let groupedByStatus = {
      paid: reports.filter(r => r.paymentStatus === 'Paid'),
      pending: reports.filter(r => r.paymentStatus === 'Unpaid'),
      overdue: reports.filter(r => r.status === 'Overdue'),
      partiallyPaid: reports.filter(r => r.paymentStatus === 'Partially Paid')
    };

    return res.status(200).json({ success: true, data: { allReports: reports, groupedByStatus } });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch payment reports' });
  }
};

module.exports = { createInvoice, getInvoices, getInvoiceById, updateInvoice, deleteInvoice, getDashboardSummary, getPaymentReports };
