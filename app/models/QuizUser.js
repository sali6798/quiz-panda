module.exports = function (sequelize, DataTypes) {
    const QuizUser = sequelize.define("QuizUser", {
        hasTaken: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        score: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    });

    QuizUser.associate = function (models) {
        QuizUser.belongsTo(models.User);
        QuizUser.belongsTo(models.Quiz);
    }

    return QuizUser;
}