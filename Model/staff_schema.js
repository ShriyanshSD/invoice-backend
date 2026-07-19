let mongoose = require('mongoose');

let staff_schema = mongoose.Schema({
  staffId: { type: Number, required: true, unique: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  gender: { type: String, required: true },
  dateOfBirth: { type: String, required: true },
  dateOfJoining: { type: String, required: true },
  address: { type: String, required: true },
  profilePhoto: { type: String, required: true },
  name: { type: String },
  role: { type: String, default: 'staff' },
  accountCreated: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

let staff_data = mongoose.model('staff_data', staff_schema);

module.exports = staff_data;
