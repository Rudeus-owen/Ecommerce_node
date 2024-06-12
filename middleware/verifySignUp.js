const User = require('../models/user.model');
//const ROLES = db.role;


const checkDuplicateUsernameOrEmail = async (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  try {
      const user = await User.findByUser(username, email);
      if (user.length > 0) {
          res.status(400).send({
              message: "Failed! Username/Email is already in use!"
          });
          return;
      }
      next();
  } catch (err) {
      res.status(500).send({
          message: "Internal server error"
      });
  }
};

checkRolesExisted = async (req, res, next) => {
      try{
        const role = await User.findOne({where: {name: req.body.roles}})
        if(!role){
          res.status(400).send({
            message: "Failed! Role does't exist in system!"
          });
          return;
        }
        next()
      }catch(e){
        res.status(500).send(e)
      }
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted
};

module.exports = verifySignUp;
