import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EmailModule } from "../email/email.module";
import { EmailSchedulerController } from "./email-scheduler.controller";
import { EmailSchedulerService } from "./email-scheduler.service";

@Module({
  imports: [
    ConfigModule,
    EmailModule
  ],
  controllers: [EmailSchedulerController],
  providers: [EmailSchedulerService]
})
export class EmailSchedulerModule {
}
