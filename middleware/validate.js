const validator = require("../helpers/validate");

const saveContact = (req, res, next) => {
  const validationRule = {
    user_id: "required|string",
    name: "required|string",
    description: "required|string",
    priority: "required|string",
    due_date: "required|Date",
    status: "required|boolean",
    created_at: "required|Date",
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: "Validation failed",
        data: err,
      });
    } else {
      next();
    }
  });
};

module.exports = {
  saveTask,
};
