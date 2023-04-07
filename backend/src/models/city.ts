import { Table, Models } from '@core/constants/table';
import {
  Model,
  DataTypes as TDataTypes,
  Sequelize,
  CreationOptional,
} from 'sequelize';
import { Country } from './country';

export class City extends Model {
  declare ID: CreationOptional<number>;
  declare Name: string;
  declare CountryCode: string;
  declare District: string;
  declare Population: number;

  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(_models: any) {
    // define association here
  }
}
module.exports.City = City;

module.exports = (sequelize: Sequelize, DataTypes: typeof TDataTypes) => {
  City.init(
    // NOTE: This user schema needs to be updated here, in User class above, as well as in migrations.
    {
      ID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      Name: {
        type: DataTypes.CHAR(35),
        allowNull: false,
        defaultValue: '',
      },
      CountryCode: {
        type: DataTypes.CHAR(3),
        allowNull: false,
        defaultValue: '',
        references: {
          key: 'Code',
          model: Country,
        },
      },
      District: {
        type: DataTypes.CHAR(20),
        allowNull: false,
        defaultValue: '',
      },
      Population: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: Models.City,
      tableName: Table.City,
      timestamps: false,
    }
  );
  return City;
};
