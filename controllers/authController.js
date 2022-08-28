const User = require('./../models/userModel');

exports.signUp = async function (req, res) {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json({
      status: 'Success',
      data: {
        User: newUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      Status: 'Fail',
      message: err,
    });
  }
};
