import { Table, Models } from '@core/constants/table';
import { Model, DataTypes as TDataTypes, Sequelize } from 'sequelize';
import { Country } from './country';

export class Countrylanguage extends Model {
  declare CountryCode: string;
  declare Language: string;
  declare IsOfficial: string;
  declare Percentage: number;

  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(_models: any) {
    // define association here
  }
}
module.exports.Countrylanguage = Countrylanguage;

module.exports = (sequelize: Sequelize, DataTypes: typeof TDataTypes) => {
  Countrylanguage.init(
    // NOTE: This user schema needs to be updated here, in User class above, as well as in migrations.
    {
      CountryCode: {
        type: DataTypes.CHAR(3),
        allowNull: false,
        defaultValue: '',
        references: {
          key: 'Code',
          model: Country,
        },
        primaryKey: true,
      },
      Language: {
        type: DataTypes.CHAR(30),
        allowNull: false,
        defaultValue: '',
        primaryKey: true,
      },
      IsOfficial: {
        type: DataTypes.ENUM('T', 'F'),
        allowNull: false,
        defaultValue: 'F',
      },
      Percentage: {
        type: DataTypes.FLOAT(4, 1),
        allowNull: false,
        defaultValue: 0.0,
      },
    },
    {
      sequelize,
      modelName: Models.Countrylanguage,
      tableName: Table.Countrylanguage,
      timestamps: false,
    }
  );
  return Countrylanguage;
};
