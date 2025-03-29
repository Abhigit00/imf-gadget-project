const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');


const Gadget = sequelize.define("Gadget",{
  id:{type:DataTypes.UUID,defaultValue:DataTypes.UUIDV4,primaryKey:true,

  },
  name:{type:DataTypes.STRING,allowNull:false,},
  status:{type:DataTypes.ENUM("Available","Deployed","Destroyed","Decommissioned"),

  },
});


module.exports = Gadget;