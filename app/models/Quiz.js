const uniqid = require("uniqid");

module.exports = function (sequelize, DataTypes) {
    const Quiz = sequelize.define("Quiz", {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        accessCode: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        canRetake: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        isDeleted: {
            type: DataTypes.BOOLEAN
        }
    });

    Quiz.associate = function (models) {
        Quiz.belongsToMany(models.User, { 
            through: 'QuizUser'
        });
        Quiz.belongsTo(models.User, {
            foreignKey: {
                name: "creatorId",
                allowNull: false
            },
            onDelete: "CASCADE",
            hooks: true
        });
        Quiz.hasMany(models.Question);
    }

    Quiz.beforeCreate(function(quiz) {
        quiz.accessCode = uniqid();
    })

    return Quiz;
}