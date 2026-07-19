let mongoose = require('mongoose');

let invoice_schema = mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true },
  customerId: { type: String, required: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String },
  customerPhone: { type: String },
  customerAddress: { type: String },
  invoiceDate: { type: String, required: true },
  dueDate: { type: String, required: true },
  status: { type: String, enum: ['Draft', 'Sent', 'Pending', 'Paid', 'Overdue', 'Cancelled'], default: 'Draft' },
  paymentStatus: { type: String, enum: ['Unpaid', 'Partially Paid', 'Paid'], default: 'Unpaid' },
  paymentMethod: { type: String, enum: ['Cash', 'Card', 'Bank Transfer', 'Cheque', 'Other'], default: 'Cash' },
  paymentDate: { type: String },
  amountPaid: { type: Number, default: 0 },
  notes: { type: String },
  products: [{
    itemName: { type: String, required: true },
    description: { type: String },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    gstRate: { type: Number, default: 18 },
    amount: { type: Number }
  }],
  subtotal: { type: Number, default: 0 },
  sgst: { type: Number, default: 0 },
  cgst: { type: Number, default: 0 },
  igst: { type: Number, default: 0 },
  totalGst: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  discountType: { type: String, enum: ['Percentage', 'Fixed'], default: 'Fixed' },
  grandTotal: { type: Number, default: 0 },
  currency: { type: String, default: 'INR' },
  createdBy: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('invoice_data', invoice_schema);
