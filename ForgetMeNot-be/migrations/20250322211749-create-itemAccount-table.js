'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ItemAccount', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      item_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      account_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      section_id: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      link: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      last_minute: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      last_chapter: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      done: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      notes: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      favourite_parts: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      story_rating: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      scenery_rating: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      ending_rating: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      public: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      image: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Add foreign key constraints
    await queryInterface.addConstraint('ItemAccount', {
      fields: ['item_id'],
      type: 'foreign key',
      name: 'fk_itemaccount_item',
      references: {
        table: 'Item',
        field: 'item_id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('ItemAccount', {
      fields: ['account_id'],
      type: 'foreign key',
      name: 'fk_itemaccount_account',
      references: {
        table: 'Account',
        field: 'account_id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('ItemAccount', {
      fields: ['section_id'],
      type: 'foreign key',
      name: 'fk_itemaccount_section',
      references: {
        table: 'Section',
        field: 'section_id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ItemAccount');
  }
};
