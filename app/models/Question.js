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
            },
            onDelete: "CASCADE",
            hooks: true
        });
        Question.hasMany(models.Answer);
    }

    return Question;
}