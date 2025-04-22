const {DataTypes} = require("sequelize");
const {sequelize} = require("../sequelize");

const ItemAccount = sequelize.define(
    "ItemAccount",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        item_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            foreignKey: true,
        },
        account_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            foreignKey: true,
        },
        section_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            foreignKey: true,
            allowNull: true,
        },
        link: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        last_minute: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        last_chapter: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        done: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        notes: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        favourite_parts: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        story_rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        scenery_rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        ending_rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        public: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    },
    {
        tableName: "ItemAccount",
        timestamps: true,
    }
);

module.exports = ItemAccount;
