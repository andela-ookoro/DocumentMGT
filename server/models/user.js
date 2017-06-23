import bcrypt from 'bcrypt';

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    lname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: {
          args: ['^[a-z]+$', 'i'],
          msg: 'last name should contain only  alphabets'
        },
        len: {
          arg: [2, 20],
          msg: 'last name should contain between 2 to 20 letters'
        }
      }
    },
    fname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: {
          args: ['^[a-z]+$', 'i'],
          msg: 'first name should contain only alphabets'
        },
        len: {
          arg: [2, 20],
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
        len: {
          arg: [10, 20],
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
      defaultValue: 1,
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
    instanceMethods: {},
    hooks: {
      beforeCreate(newuser) {
        /**
         * create random string
         * with base 36, and collected the last 10 characters
         */
          // const randomWord = Math.random().toString(36).substring(2);
          // let password, hashPassword;

          // hash the random string
        return bcrypt.hash(newuser.password, 10).then((randomWordHash) => {
          newuser.password = randomWordHash;
          //   password = randomWordHash;

          //    //create hashpassword = hash(password)+ password
          //  return bcrypt.hash(newuser.password, 10).then((passwordHash) => {
          //     hashPassword = passwordHash + password;
          //     newuser.password = password;
          //     newuser.hashPassword = hashPassword;
          //   });
        });
      },
      beforeUpdate(newuser) {
        /**
         * create random string
         * with base 36, and collected the last 10 characters
         */
        // const randomWord = Math.random().toString(36).substring(2);
        // let password, hashPassword;
        // hash the random string
        return bcrypt.hash(user.password, 10).then((randomWordHash) => {
          newuser.password = randomWordHash;
        });
      }
    }
  });

  /**
     * get user fullname
     * @method
     * @returns {String} user fullname
  */
  user.prototype.getFullname = () => {
    console.log('came here......................', this);
    return `${this.fname} ${this.mname} ${this.lname}`;
};

   /**
   * verify plain password against user's hashed password
   * @method
   * @param {String} inputPassword - recieved password
   * @returns {Boolean} Validity of password
   */
  user.prototype.verifyPassword = (inputPassword) => {
    const userPassword = this.password;

    // create hashpassword and compare

    return bcrypt.hash(inputPassword, 10).then((hash) => {
      const hashPassword = hash + userPassword;
        // verify hashpassword
      if (user.hashPassword === hashPassword) {
        return user;
      }
      return false;
    }).catch(() =>
       false
    );
  };


  /**
     * generate user password and hashpassword
     * @method
     * @returns {String} user fullname
  */
  user.prototype.generatePassword = () => {
     /**
      * create random string
      * with base 36, and collected the last 10 characters
      */
    const randomWord = Math.random().toString(36).substring(2);
    let password, hashPassword;

      // hash the random string
    bcrypt.hash(randomWord, 10).then((randomWordhash) => {
      password = randomWordhash;
        // create hashpassword = hash(password)+ password
      bcrypt.hash(this.password, 10).then((hash) => {
        hashPassword = hash + password;
        this.password = password;
        this.hashPassword = hashPassword;
      });
    });
  };
  return user;
};
