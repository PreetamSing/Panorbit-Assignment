import { Table, Models } from '@core/constants/table';
import {
  Model,
  DataTypes as TDataTypes,
  Sequelize,
  CreationOptional,
} from 'sequelize';

export class Country extends Model {
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
module.exports.Country = Country;

module.exports = (sequelize: Sequelize, DataTypes: typeof TDataTypes) => {
  Country.init(
    // NOTE: This user schema needs to be updated here, in User class above, as well as in migrations.
    {
      Code: {
        type: DataTypes.CHAR(3),
        allowNull: false,
        defaultValue: '',
        primaryKey: true,
      },
      Name: {
        type: DataTypes.CHAR(52),
        allowNull: false,
        defaultValue: '',
      },
      Continent: {
        type: DataTypes.ENUM(
          'Asia',
          'Europe',
          'North America',
          'Africa',
          'Oceania',
          'Antarctica',
          'South America'
        ),
        allowNull: false,
        defaultValue: 'Asia',
      },
      Region: {
        type: DataTypes.CHAR(26),
        allowNull: false,
        defaultValue: '',
      },
      SurfaceArea: {
        type: DataTypes.FLOAT(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      IndepYear: {
        type: DataTypes.SMALLINT,
        defaultValue: null,
      },
      Population: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      LifeExpectancy: {
        type: DataTypes.FLOAT(3, 1),
        defaultValue: null,
      },
      GNP: {
        type: DataTypes.FLOAT(10, 2),
        defaultValue: null,
      },
      GNPOld: {
        type: DataTypes.FLOAT(10, 2),
        defaultValue: null,
      },
      LocalName: {
        type: DataTypes.CHAR(45),
        allowNull: false,
        defaultValue: '',
      },
      GovernmentForm: {
        type: DataTypes.CHAR(45),
        allowNull: false,
        defaultValue: '',
      },
      HeadOfState: {
        type: DataTypes.CHAR(60),
        defaultValue: null,
      },
      Capital: {
        type: DataTypes.INTEGER,
        defaultValue: null,
      },
      Code2: {
        type: DataTypes.CHAR(2),
        allowNull: false,
        defaultValue: '',
      },
    },
    {
      sequelize,
      modelName: Models.Country,
      tableName: Table.Country,
      timestamps: false,
    }
  );
  return Country;
};
