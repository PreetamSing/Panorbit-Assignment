import { Gender } from '@core/constants/gender';
import { Table } from '@core/constants/table';
import { QueryInterface, DataTypes } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up({ context: queryInterface }: { context: QueryInterface }) {
    // Following is a temporary fix for: https://github.com/sequelize/sequelize/issues/7902
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.createTable(
        Table.User,
        {
          email: {
            type: DataTypes.STRING,
            primaryKey: true,
          },
          country_code: {
            type: DataTypes.STRING(6),
            allowNull: false,
          },
          mobile: {
            type: DataTypes.STRING(11),
            allowNull: false,
          },
          first_name: {
            type: DataTypes.STRING(50),
            allowNull: false,
          },
          last_name: {
            type: DataTypes.STRING(50),
          },
          gender: {
            type: DataTypes.ENUM(...Object.values(Gender)),
            allowNull: false,
          },
          otp: {
            type: DataTypes.JSON,
            defaultValue: [],
          },
          email_verified_at: {
            type: DataTypes.DATE,
          },
          created_at: {
            allowNull: false,
            type: DataTypes.DATE,
          },
          updated_at: {
            allowNull: false,
            type: DataTypes.DATE,
          },
        },
        {
          transaction,
          uniqueKeys: {
            phone: {
              fields: ['country_code', 'mobile'],
            },
          },
        }
      );

      await transaction.commit();
    } catch (e) {
      await transaction.rollback();
      throw e;
    }
  },
  async down({ context: queryInterface }: { context: QueryInterface }) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.dropTable(Table.User, { transaction });

      await transaction.commit();
    } catch (e) {
      await transaction.rollback();
      throw e;
    }
  },
};
