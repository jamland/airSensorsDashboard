// copy and rename this file as keys_dev.js
// insert credentials

const mongoUser = "";
const mongoPassword = "";
const dbName = "";
const mongoURI = `mongodb+srv://${mongoUser}:${mongoPassword}@${dbName}.mongodb.net/test?retryWrites=true&w=majority`;

module.exports = {
  mongoUser,
  mongoPassword,
  mongoURI
};
