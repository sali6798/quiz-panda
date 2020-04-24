module.exports = function (sequelize, DataTypes) {
    const Answer = sequelize.define("Answer", {
        answer: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        correctAnswer: DataTypes.BOOLEAN
    });

    Answer.associate = function (models) {
        Answer.belongsTo(models.Question, {
            foreignKey: {
                allowNull: false
            },
            onDelete: "CASCADE",
            hooks: true
        });
    }

    return Answer;
}