import { queueData } from "../types";
import { formatHours, getISODate } from "../utils";

const nodemailer = require('nodemailer');

class MailService {
	transporter: any;

	constructor() {
		this.transporter = nodemailer.createTransport({
			host: process.env.SMTP_HOST,
			port: process.env.SMTP_PORT,
			secure: false,
			auth: {
					user: process.env.SMTP_USER,
					pass: process.env.SMTP_PASSWORD
			}
		})
	}

	async sendActivationMail(to: string, link: string) {
		await this.transporter.sendMail({
			from: process.env.SMTP_USER,
			to,
			subject: 'Активация аккаунта на ' + process.env.API_URL,
			text: '',
			html:
				`
					<div
					style="background-color: #2F80ED; padding: 32px; font-size: 20px; font-family: Roboto; color: #fff; border-radius: 10px; box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.1); width: 50%;"
						>
					<h2 style="margin: 0; margin-bottom: 20px; text-align: center; background-color: #86CD82; color: #fff; padding: 8px 16px; border-radius: 8px;">Активация аккаунта Миграционной службы ТюмГУ</h2>
					<div style="width: 100%;">
						<span>Для активации аккаунта перейдите по ссылке:</span>
						<div style="margin: 8px auto;">
							<a style="background-color: #fff; color: #2F80ED; padding: 4px 8px; border-radius: 8px;" href="${link}">${link}</a>
						</div>
					</div>
				</div>
				`
		})
	};

	async sendReminderMail(to: string, hours: number, row: queueData) {
		await this.transporter.sendMail({
			from: process.env.SMTP_USER,
			to,
			subject: `Приём через ${formatHours(hours)} | Миграционная служба ТюмГУ`,
			text: '',
			html:
				`
					<div
						style="background-color: #2F80ED; padding: 32px; font-size: 20px; font-family: Roboto; color: #fff; border-radius: 10px; box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.1); width: 50%;"
					>
						<h2 style="margin: 0; margin-bottom: 20px; text-align: center; background-color: #86CD82; color: #fff; padding: 8px 16px; border-radius: 8px;">Приём через ${formatHours(hours)}</h2>
						<div style="width: 100%;">
							<span>Время и место:</span>
							<div style="margin: 8px auto;">
								<span>Дата:</span>
								<span style="background-color: #fff; color: #2F80ED; padding: 4px 8px; border-radius: 8px;">${getISODate(new Date(row.queue_date).getTime())}</span>
								<span style="background-color: #fff; color: #2F80ED; padding: 4px 8px; border-radius: 8px;">${row.queue_time}</span>
							</div>
							<div style="margin: 8px auto;">
								<span>Место:</span>
								<span style="background-color: #fff; color: #2F80ED; padding: 4px 8px; border-radius: 8px;">
									ул. Ленина, 23, офис 201
								</span>
							</div>
						</div>
					</div>
				`
		})
	}
}

export default new MailService;