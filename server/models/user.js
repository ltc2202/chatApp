const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
  email: {
    required: true,
    type: String,
    minlength: 1,
    unique: true,
    validator: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  name: {
    required: true,
    type: String,
    minlength: 1,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

UserSchema.methods.toJSON = function() {
  var user = this;
  var userObj = user.toObject();

  return _.pick(userObj, ['name', 'email']);
};

UserSchema.methods.generateAuthToken = function() {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({
    _id:user._id.toHexString(),
    access
  }, 'secret').toString();

  user.tokens.push({access, token});

  return user.save().then(() => {
    return token;
  });
};

UserSchema.statics.findByEmail = function (email, password) {
  var User = this;

  return User.findOne({email}).then((user) => {
    if(!user) {
      return Promise.reject();
    }
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if(res) {
          resolve(user);
        } else {
          reject(err);
        }
      });
    });
  });
};

UserSchema.statics.findByInfo = function (info, password) {
  var User = this;
  return User.findOne({name: info}).then((user) => {
    if(!user) {
      return User.findOne({email: info}).then((user) => {
        if(!user) {
          return Promise.reject();
        }
        return new Promise((resolve, reject) => {
          bcrypt.compare(password, user.password, (err, res) => {
            if(res) {
              resolve(user);
            } else {
              reject(err);
            }
          });
        });
      })
    }
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if(res) {
          resolve(user);
        } else {
          reject(err);
        }
      });
    });
  });
};


UserSchema.statics.findByName = function (name, password) {
  var User = this;

  return User.findOne({name}).then((user) => {
    if(!user) {
      return Promise.reject();
    }
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if(res) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
  });
};

UserSchema.pre('save', function(next) {
  var user = this;

  if(user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err,hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
      next();
  }
});

var UserModel = mongoose.model('User', UserSchema);

module.exports = {UserModel};
