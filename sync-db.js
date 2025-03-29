const sequelize = require("./config/database");
const Gadget = require('./models/gadgets');
const User = require('./models/users');

(async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Database Synced: Gadget and User tables created');
    process.exit();
  } catch (error) {
    console.error('Error syncing database', error);
    process.exit(1);
  }
})();
