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
            type: DataTypes.UUID,
            defaultValue: sequelize.UUIDV4,
            unique: true
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

    return Quiz;
}