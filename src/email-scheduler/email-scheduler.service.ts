import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SchedulerRegistry } from "@nestjs/schedule";
import { CronJob } from "cron";
import { EmailService } from "../email/email.service";
import EmailSchedulerDto from "./dto/email-scheduler.dto";

@Injectable()
export class EmailSchedulerService {
  constructor(
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
    private readonly schedulerRegistry: SchedulerRegistry
  ) {
  }

  scheduleEmail(emailSchedule: EmailSchedulerDto) {
    const date = new Date(emailSchedule.date);
    const job = new CronJob(date, async () => {
      await this.emailService.sendMail({
        from: this.configService.get('EMAIL_USER'),
        to: emailSchedule.recipient,
        subject: emailSchedule.subject,
        text: emailSchedule.content
      });
    });

    this.schedulerRegistry.addCronJob(`${Date.now()}--${emailSchedule.subject}`, job);
    job.start();
  }
}
