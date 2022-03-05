// const { appRoles } = require("../../middleware/auth.js");

const appRoles = {
  Admin: "Admin",
  User: "user",
  HR: "HR",
};
const endPoints = {
  post:[appRoles.User,appRoles.HR]
};

module.exports = endPoints;
