import { Table, Models } from '@core/constants/table';
import { Model, DataTypes as TDataTypes, Sequelize } from 'sequelize';
import { OtpCodeType } from '@core/constants/otp-code-type';
import { Gender } from '@core/constants/gender';

export class User extends Model {
  declare email: string;
  declare country_code: string;
  declare mobile: string;
  declare first_name: string;
  declare last_name: string | null;
  declare gender: Gender;
  declare otp: {
    code_type: OtpCodeType;
    referenceCode: string;
    code: string;
  }[];
  declare created_at: Date;
  declare updated_at: Date;

  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(_models: any) {
    // define association here
  }
}

module.exports = (sequelize: Sequelize, DataTypes: typeof TDataTypes) => {
  User.init(
    // NOTE: This user schema needs to be updated here, in User class above, as well as in migrations.
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
    },
    {
      sequelize,
      modelName: Models.User,
      tableName: Table.User,
      underscored: true,
    }
  );
  return User;
};
