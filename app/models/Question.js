module.exports = function (sequelize, DataTypes) {
    const Question = sequelize.define("Question", {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }
    });

    Question.associate = function (models) {
        Question.belongsTo(models.Quiz, {
            foreignKey: {
                allowNull: false
            }
        });
        Question.hasMany(models.Answer, {
            onDelete: "CASCADE"
        });
    }

    return Question;
}