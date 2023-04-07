import { App } from '@core/globals'
import { SES } from 'aws-sdk'

class SESHelper {
  SES: SES

  constructor() {
    this.SES = new SES()
  }

  async CheckIdentities() {
    const result = await this.SES.listIdentities().promise()
    if (!result.Identities.includes(App.Config.AWS_SES_EMAIL_ID)) {
      throw new Error(
        `Configured AWS_SES_EMAIL_ID isn't verified on the console.
        Add the identity and try again.`
      )
    }
  }

  async Send(input: {
    to: string[]
    cc?: string[]
    from: string
    replyTo: string[]
    subject: string
    body: {
      html?: string
      text: string
    }
  }) {
    const {
      to,
      cc,
      from,
      replyTo,
      subject,
      body: { html, text },
    } = input
    const Body = {
      Text: {
        Charset: 'UTF-8',
        Data: text,
      },
      Html: {
        Charset: 'UTF-8',
        Data: html,
      },
    }
    if (!html) delete Body.Html
    return await this.SES.sendEmail({
      Destination: {
        ToAddresses: to,
        CcAddresses: cc ?? [],
      },
      Message: {
        Body,
        Subject: {
          Charset: 'UTF-8',
          Data: subject,
        },
      },
      Source: from,
      ReplyToAddresses: replyTo,
    }).promise()
  }
}

export default new SESHelper()
