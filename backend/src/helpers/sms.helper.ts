import { SNS } from 'aws-sdk';

class SNSHelper {
  private SNS: SNS;

  constructor() {
    this.SNS = new SNS();
  }

  async Send(input: { phone: string; message: string }) {
    const { phone, message } = input;
    await this.SNS.publish({
      Message: message,
      PhoneNumber: phone,
    }).promise();
  }
}

export default new SNSHelper();
