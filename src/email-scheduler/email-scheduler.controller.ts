import {
  Body,
  Controller,
  Post,
  UseGuards
} from "@nestjs/common";
import { JwtAuthenticationGuard } from "../auth/guards/jwt-authentication.guard";
import EmailSchedulerDto from "./dto/email-scheduler.dto";
import { EmailSchedulerService } from "./email-scheduler.service";

@Controller("email-scheduling")
export class EmailSchedulerController {
  constructor(private readonly emailScheduling: EmailSchedulerService) {
  }

  @Post("schedule")
  @UseGuards(JwtAuthenticationGuard)
  async scheduleEmail(@Body() emailSchedule: EmailSchedulerDto) {
    this.emailScheduling.scheduleEmail(emailSchedule);
  }
}
