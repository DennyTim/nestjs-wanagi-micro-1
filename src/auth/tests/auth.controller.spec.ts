import {
  INestApplication,
  ValidationPipe
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import * as request from "supertest";
import { UserEntity } from "../../users/user.entity";
import { UsersService } from "../../users/users.service";
import { mockedConfigService } from "../../utils/mocks/config.service";
import { mockedJwtService } from "../../utils/mocks/jwt.service";
import { AuthenticationController } from "../authentication.controller";
import { AuthenticationService } from "../authentication.service";
import { mockedUser } from "./user.mock";

describe("The auth controller", () => {
  let app: INestApplication;
  let userData: UserEntity;

  beforeEach(async () => {
    userData = { ...mockedUser };

    const usersRepository = {
      create: jest.fn().mockResolvedValue(userData),
      save: jest.fn().mockReturnValue(Promise.resolve())
    };

    const module = await Test.createTestingModule({
      controllers: [AuthenticationController],
      providers: [
        UsersService,
        AuthenticationService,
        {
          provide: ConfigService,
          useValue: mockedConfigService
        },
        {
          provide: JwtService,
          useValue: mockedJwtService
        },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: usersRepository
        }
      ]
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe("when registering", () => {
    describe("and using valid data", () => {
      it("should respond with the data of the user without the password", () => {
        const expectedData = {
          ...userData
        };
        delete expectedData.password;
        return request(app.getHttpServer())
          .post("/auth/register")
          .send({
            email: mockedUser.email,
            name: mockedUser.name,
            password: "Student_aks3_3",
            phoneNumber: mockedUser.phoneNumber
          })
          .expect(201)
          .expect(expectedData);
      });
    });

    describe("and using invalid data", () => {
      it("should throw an error", () => {
        return request(app.getHttpServer())
          .post("/auth/register")
          .send({ name: mockedUser.name })
          .expect(400);
      });
    });
  });
});
