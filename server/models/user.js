'use strict';

import  bcrypt from 'bcrypt';

module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define('user', {
    lname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
         is: {
           args: ["^[a-z]+$",'i'],
           msg: 'last name should contain only  alphabets'
        }, 
        len:{
          arg: [2,20],
          msg: 'last name should contain between 2 to 20 letters'
        }
      }
    },
    fname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
         is: {
           args: ["^[a-z]+$",'i'],
           msg: 'first name should contain only alphabets'
        }, 
        len:{
          arg: [2,20],
          msg: 'first name should contain between 2 to 20 letters'
        }
      }
    },
    mname: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      defaultValue: false,
      unique: true,
      validate: {
         isEmail: {
           msg: 'Invalid email format'
        },
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
         len:{
          arg: [10,20],
          msg: 'password should contain between 10 to 20 characters'
        },
      }
    },
    hashPassword: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    roleId: {
      type: DataTypes.INTEGER,
      defaultValue: 2,
      references: {
        model: 'role',
        key: 'id',
        as: 'roleId',
      },
    },
  }, {
    classMethods: {
      associate: (models) => {
        // has parent table Role
        user.belongsTo(models.role, {
          foriegnKey: 'roleId',
          onDelete: 'CASCADE',
        });

        // user can have many documents
        user.hasMany(models.document, {
          foriegnKey: 'userId',
          as: 'documents',
          onDelete: 'CASCADE',
        });
      }
    },
    instanceMethods: {
      /**
       * verify plain password against user's hashed password
       * @method
       * @param {String} password
       * @returns {Boolean} Validity of password
       */
      verifyPassword(password){
        const userPassword =  this.password;

        //create hashpassword and compare 
        bcrypt.hash(password, 10).then((hash) => {
          hashPassword = hash + userPassword;
          // verify hashpassword
          if (user.hashPassword === hashPassword) {
            return user;
          }
          return false
        });
      },
      /**
         * get user fullname
         * @method
         * @returns {String} user fullname
      */
      getFullname() {
        return `${this.fname} ${this.mname} ${this.lname}`;
      },
      /**
         * generate user password and hashpassword
         * @method
         * @returns {String} user fullname
      */
      generatePassword() {
        /**
         * create random string
         * with base 36, and collected the last 10 characters
         */
          const randomWord = Math.random().toString(36).substring(2);
          let password, hashPassword;

          // hash the random string
          bcrypt.hash(randomWord, 10).then((hash) => {
            console.log('came here', randomWord);
            password = hash;
            //create hashpassword = hash(password)+ password
            bcrypt.hash(this.password, 10).then((hash) => {
              hashPassword = hash + password;
              console.log(hashPassword);
              this.password = password;
              this.hashPassword = hashPassword;
            });
          });
       }
     },
    hooks: {
      beforeCreate(newuser){
        /**
         * create random string
         * with base 36, and collected the last 10 characters
         */
          const randomWord = Math.random().toString(36).substring(2);
          let password, hashPassword;

          // hash the random string
          bcrypt.hash(randomWord, 10).then((randomWordHash) => {
            password = randomWordHash;
             console.log('passwordHash',password);
          });
          //create hashpassword = hash(password)+ password
           return  bcrypt.hash(newuser.password, 10).then((passwordHash) => {
              hashPassword = passwordHash + password;
              newuser.password = password;
              newuser.hashPassword = hashPassword;
            });
      }
    }
    
  });
  return user;
};