module.exports = function (sequelize, DataTypes) {
    const Staged = sequelize.define("Staged", {
        storedQuiz: DataTypes.TEXT
    }, {
        freezeTableName: true
    });

    Staged.associate = function (models) {
        Staged.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            },
            onDelete: "CASCADE",
            hooks: true
        });
    }

    return Staged;
}