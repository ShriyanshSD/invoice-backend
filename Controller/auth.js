let auth_data = require('../Model/auth_schema');
let staff_data = require('../Model/staff_schema');
let jwt = require('jsonwebtoken');
let bcrypt = require('bcrypt');
let dotenv = require('dotenv');

dotenv.config();

let SECRET_KEY = process.env.SECRET_KEY;

let Signup = async (req, res) => {
  let { name, email, password, confirmPassword, role, staffId, fullName, gender, dateOfBirth, dateOfJoining, address, profilePhoto } = req.body;

  try {
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "password doesn't match" });
    }

    let existing_user = await auth_data.findOne({ email });
    if (existing_user) {
      return res.status(409).json({ success: false, message: 'User already exists' });
    }

    let hash_password = await bcrypt.hash(password, 10);
    let hash_confirmPassword = await bcrypt.hash(confirmPassword, 10);

    let data = await auth_data({
      name: name || fullName,
      email,
      password: hash_password,
      confirmPassword: hash_confirmPassword,
      role: role || 'staff'
    }).save();

    if (role === 'staff' || (name && email && staffId)) {
      let existingStaffProfile = await staff_data.findOne({ email });
      if (!existingStaffProfile) {
        await staff_data.create({
          staffId: Number(staffId || 0),
          fullName: fullName || name,
          email,
          gender: gender || '',
          dateOfBirth: dateOfBirth || '',
          dateOfJoining: dateOfJoining || '',
          address: address || '',
          profilePhoto: profilePhoto || '',
          name: fullName || name,
          role: 'staff',
          accountCreated: true
        });
      } else {
        await staff_data.findOneAndUpdate({ email }, { accountCreated: true, fullName: fullName || name, name: fullName || name });
      }
    }

    let token = jwt.sign({ email: data.email }, SECRET_KEY);
    return res.status(201).json({ success: true, message: 'Registration Successfull', token });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Something went wrong' });
  }
};

let Login = async (req, res) => {
  let { email, password } = req.body;

  try {
    let existing_user = await auth_data.findOne({ email });
    if (!existing_user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    let matched_password = await bcrypt.compare(password, existing_user.password);
    if (!matched_password) {
      return res.status(400).json({ success: false, message: 'Invalid Credentials' });
    }

    let token = jwt.sign({ email: existing_user.email }, SECRET_KEY);
    return res.status(200).json({
      success: true,
      message: 'Login Successfully',
      token,
      role: existing_user.role,
      email: existing_user.email
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Something went wrong' });
  }
};

let getProfile = async (req, res) => {
  try {
    let user = await auth_data.findOne({ email: req.user?.email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    let staffProfile = await staff_data.findOne({ email: user.email });
    let profileData = {
      fullName: staffProfile?.fullName || user.name || '',
      email: user.email,
      phone: user.phone || staffProfile?.phone || '',
      address: user.address || staffProfile?.address || '',
      gender: user.gender || staffProfile?.gender || '',
      dateOfBirth: user.dateOfBirth || staffProfile?.dateOfBirth || '',
      dateOfJoining: user.dateOfJoining || staffProfile?.dateOfJoining || '',
      profilePhoto: user.profilePhoto || staffProfile?.profilePhoto || '',
      role: user.role
    };

    return res.status(200).json({ success: true, data: profileData });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch profile' });
  }
};

let updateProfile = async (req, res) => {
  try {
    let user = await auth_data.findOne({ email: req.user?.email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    let payload = req.body || {};
    let updateData = {
      name: payload.fullName || user.name,
      email: payload.email || user.email,
      phone: payload.phone || user.phone || '',
      address: payload.address || user.address || '',
      gender: payload.gender || user.gender || '',
      dateOfBirth: payload.dateOfBirth || user.dateOfBirth || '',
      dateOfJoining: payload.dateOfJoining || user.dateOfJoining || '',
      profilePhoto: payload.profilePhoto || user.profilePhoto || ''
    };

    let updatedUser = await auth_data.findOneAndUpdate(
      { email: user.email },
      { $set: updateData },
      { new: true }
    );

    let staffProfile = await staff_data.findOne({ email: user.email });
    if (staffProfile) {
      await staff_data.findOneAndUpdate(
        { email: user.email },
        {
          $set: {
            fullName: payload.fullName || staffProfile.fullName || updatedUser.name,
            email: payload.email || staffProfile.email || updatedUser.email,
            phone: payload.phone || staffProfile.phone || '',
            address: payload.address || staffProfile.address || '',
            gender: payload.gender || staffProfile.gender || '',
            dateOfBirth: payload.dateOfBirth || staffProfile.dateOfBirth || '',
            dateOfJoining: payload.dateOfJoining || staffProfile.dateOfJoining || '',
            profilePhoto: payload.profilePhoto || staffProfile.profilePhoto || ''
          }
        },
        { new: true }
      );
    } else if (updatedUser.role === 'staff') {
      await staff_data.create({
        staffId: 0,
        fullName: payload.fullName || updatedUser.name,
        email: updatedUser.email,
        gender: payload.gender || '',
        dateOfBirth: payload.dateOfBirth || '',
        dateOfJoining: payload.dateOfJoining || '',
        address: payload.address || '',
        profilePhoto: payload.profilePhoto || '',
        name: payload.fullName || updatedUser.name,
        role: 'staff',
        accountCreated: true
      });
    }

    let profileData = {
      fullName: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone || '',
      address: updatedUser.address || '',
      gender: updatedUser.gender || '',
      dateOfBirth: updatedUser.dateOfBirth || '',
      dateOfJoining: updatedUser.dateOfJoining || '',
      profilePhoto: updatedUser.profilePhoto || ''
    };

    return res.status(200).json({ success: true, message: 'Profile updated successfully', data: profileData });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
};

module.exports = { Login, Signup, getProfile, updateProfile };
