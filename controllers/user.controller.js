const User = require('../models/user.model');
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const config = require("../config/auth.config");
exports.signup = async (req, res) => {
  try {
      const hashPass = await bcrypt.hash(req.body.password, 8);
      const { expiration_duration, expiration_unit } = req.body;

      // Calculate the expiration date only if both values are provided
      const expirationDate = (expiration_duration && expiration_unit)
          ? User.calculateExpirationDate(expiration_duration, expiration_unit)
          : null;

      const newUser = {
          username: req.body.username,
          email: req.body.email,
          password: hashPass,
          role: req.body.role,
          account_expiration_date: expirationDate
      };

      const user = await User.create(newUser);
      res.status(201).json({
          success: true,
          message: "User registered successfully!",
          data: user
      });
  } catch (err) {
      console.error("Error creating user:", err);
      res.status(500).json({
          message: "Internal server error"
      });
  }
};


exports.signin = (req, res) => {
  const email = req.body.email;
  User.verifyUser(email, async (err, user) => {
      if (err) {
          console.error("Error verifying user:", err);
          return res.status(500).json({ message: "Internal server error" });
      }

      if (user.length === 0) {
          return res.status(422).json({ message: "User not found." });
      }

      try {
          // Check password validity
          const passwordIsValid = await bcrypt.compare(req.body.password, user[0].password);
          if (!passwordIsValid) {
              return res.status(422).json({ accessToken: null, message: "Invalid password." });
          }

          // Generate access token
          const token = jwt.sign({ id: user[0].id }, config.secret, { expiresIn: 86400 }); // 24 hours expiration

          // Format account expiration date
          let accountExpirationDate;
          if (user[0].account_expiration_date instanceof Date) {
              accountExpirationDate = user[0].account_expiration_date.toISOString().split('T')[0];
          } else {
              accountExpirationDate = user[0].account_expiration_date;
          }

          // Set access token in cookie
          res.cookie('accessToken', token, { maxAge: 86400000, httpOnly: true });

          // Construct response
          const response = {
              id: user[0].id,
              email: user[0].email,
              role: user[0].role,
              accessToken: token,
              account_expiration_date: accountExpirationDate
          };

          // Send the response
          res.status(200).json(response);
      } catch (error) {
          console.error("Error signing in user:", error);
          return res.status(500).json({ message: "Internal server error" });
      }
  });
};


exports.getAllUsers = async (req, res) => {
  try {
    const regularUsers = await User.findAllRegularUsers();

    if (!regularUsers || regularUsers.length === 0) {
      return res.status(404).json({ message: "No regular users found!" });
    }

    return res.status(200).json({ success: true, users: regularUsers });
  } catch (error) {
    console.error("Error retrieving regular users:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllAdmins = async (req, res) => {
  try {
    const adminUsers = await User.findAllAdmin();

    if (!adminUsers || adminUsers.length === 0) {
      return res.status(404).json({ message: "No admin users found!" });
    }

    return res.status(200).json({ success: true, users: adminUsers });
  } catch (error) {
    console.error("Error retrieving admin users:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


exports.getUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    // Attempt to find the user with the specified ID
    const user = await User.findById(userId);
    
    // If the user is not found, return a 404 status with a message
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }
    
    // Respond with the found user
    res.status(200).send(user);
  } catch (err) {
    // Handle any errors
    console.error("Error retrieving user by ID:", err);
    res.status(500).send({ message: "Internal server error" });
  }
};





// Update user information
exports.updateUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const updatedUser = {
      username: req.body.username,
      email: req.body.email,
      role: req.body.role, 
    };

    const user = await User.findByIdAndUpdate(userId, updatedUser, { new: true }); 
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};



exports.updateUserPassword = async (req, res) => {
  const userId = req.params.id;
  const currentPassword = req.body.currentPassword;
  const newPassword = req.body.newPassword;

  try {
    // Check if the current password matches the user's password
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    const passwordIsValid = bcrypt.compareSync(currentPassword, user.password);
    if (!passwordIsValid) {
      return res.status(401).send({ message: "Invalid current password." });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 8);

    
    await User.updatePassword(userId, hashedPassword);

    res.status(200).send({ message: "Password updated successfully." });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};



exports.deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).send({ message: "User not found." });
    }
    res.status(200).send({ message: "User deleted successfully." });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};


exports.deleteAllUsers = async (req, res) => {
  try {
    await User.deleteAll(); 
    res.status(200).send({ message: "All users deleted." });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.getUserByUsername = async (req, res) => {
  const username = req.params.username;

  try {
    const userName = await User.findByUserName(username);
    
    if (!userName) {
      return res.status(404).send({ message: "User not found." });
    }
    
    res.status(200).send(userName);
  } catch (err) {
    console.error("Error retrieving user by username:", err);
    res.status(500).send({ message: "Internal server error" });
  }
};



