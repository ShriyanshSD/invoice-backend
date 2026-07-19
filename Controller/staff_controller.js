let auth_data = require('../Model/auth_schema');
let staff_data = require('../Model/staff_schema');

let getStaff = async (req, res) => {
  try {
    let data = await staff_data.find({}).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch staff' });
  }
};

let addStaff = async (req, res) => {
  try {
    let { staffId, fullName, email, gender, dateOfBirth, dateOfJoining, address, profilePhoto } = req.body;

    if (!staffId || !fullName || !email || !gender || !dateOfBirth || !dateOfJoining || !address || !profilePhoto) {
      return res.status(400).json({ success: false, message: 'All staff fields are required' });
    }

    let existingStaff = await staff_data.findOne({ $or: [{ staffId }, { email }] });
    if (existingStaff) {
      return res.status(409).json({ success: false, message: 'Staff already exists' });
    }

    let savedStaff = await staff_data.create({
      staffId: Number(staffId),
      fullName,
      email,
      gender,
      dateOfBirth,
      dateOfJoining,
      address,
      profilePhoto,
      name: fullName,
      role: 'staff'
    });

    return res.status(201).json({ success: true, message: 'Staff added successfully', data: savedStaff });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to add staff' });
  }
};

module.exports = { getStaff, addStaff };
