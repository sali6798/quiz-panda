const bcrypt = require("bcrypt");

module.exports = function (sequelize, DataTypes) {
    const User = sequelize.define("User", {
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [8],
                notEmpty: true
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
                notEmpty: true
            }
        }
    });

    User.beforeCreate(user => {
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
    })

    User.associate = function (models) {
        User.belongsToMany(models.Quiz, { through: 'QuizUser' });
        User.hasMany(models.Quiz, {
            foreignKey: {
                name: "creatorId",
                allowNull: false
            }
        });
        User.hasMany(models.Staged);
    }

    return User;
}