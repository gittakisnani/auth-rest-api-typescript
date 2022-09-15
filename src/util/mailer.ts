import nodeMailer, { SendMailOptions} from 'nodemailer'
import config from 'config'
import logger from './logger'

// async function createTextCreds() {
//     const creds = await nodeMailer.createTestAccount();
//     console.log(creds)
// }

// createTextCreds()

const smtp = config.get<{
    user: string,
    pass: string,
    hsot: string,
    port: number,
    secure: boolean
}>('smtp')


const transporter = nodeMailer.createTransport({
    ...smtp, 
    auth: { user: smtp.user, pass: smtp.pass }
})

export default async function sendEmail(payload: SendMailOptions) {
    transporter.sendMail(payload, (err, info) => {
        if(err) {
            logger.error(err, 'Error sending email')
            return;
        }
        logger.info(`Preview Url: ${nodeMailer.getTestMessageUrl(info)}`)
    })
}

