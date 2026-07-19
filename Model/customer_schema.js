let mongoose = require('mongoose');

let customer_schema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String },
  gstNumber: { type: String },
  createdBy: { type: String }
});

module.exports = mongoose.model('customer_data', customer_schema);
