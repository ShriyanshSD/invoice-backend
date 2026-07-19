let mongoose = require('mongoose');

let auth_schema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  confirmPassword: { type: String, required: true },
  role: { type: String, required: true, default: 'staff' },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  gender: { type: String, default: '' },
  dateOfBirth: { type: String, default: '' },
  dateOfJoining: { type: String, default: '' },
  profilePhoto: { type: String, default: '' }
});

let auth_data = mongoose.model('auth_data', auth_schema);

module.exports = auth_data;
