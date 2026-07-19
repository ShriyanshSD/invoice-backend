let customer_data = require('../Model/customer_schema');

let addCustomer = async (req, res) => {
  try {
    let payload = req.body;
    let data = await customer_data({ ...payload, createdBy: req.user?.email || 'system' }).save();
    return res.status(201).json({ success: true, message: 'Customer added', data });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to add customer' });
  }
};

let getCustomers = async (req, res) => {
  try {
    let data = await customer_data.find();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch customers' });
  }
};

let updateCustomer = async (req, res) => {
  try {
    let updated = await customer_data.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.status(200).json({ success: true, message: 'Customer updated', data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update customer' });
  }
};

let deleteCustomer = async (req, res) => {
  try {
    await customer_data.findByIdAndDelete(req.params.id);
    return res.status(200).json({ success: true, message: 'Customer deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete customer' });
  }
};

module.exports = { addCustomer, getCustomers, updateCustomer, deleteCustomer };
