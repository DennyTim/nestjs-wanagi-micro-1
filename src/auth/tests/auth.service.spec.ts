import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { UserEntity } from "../../users/user.entity";
import { UsersService } from "../../users/users.service";
import { mockedConfigService } from "../../utils/mocks/config.service";
import { mockedJwtService } from "../../utils/mocks/jwt.service";
import { AuthenticationService } from "../authentication.service";

const mockedUser: UserEntity = {
  id: 1,
  email: "user@email.com",
  name: "John",
  password: "hash",
  address: {
    id: 1,
    street: "streetName",
    city: "cityName",
    country: "countryName"
  }
};

describe("The AuthenticationService", () => {
  let authenticationService: AuthenticationService;
  let usersService: UsersService;
  let bcryptCompare: jest.Mock;
  let userData: Partial<UserEntity>;
  let findUser: jest.Mock;

  beforeEach(async () => {

    userData = {
      ...mockedUser
    };
    findUser = jest.fn().mockResolvedValue(userData);
    const usersRepository = { findOne: findUser };
    bcryptCompare = jest.fn().mockReturnValue(true);
    (bcrypt.compare as jest.Mock) = bcryptCompare;

    const module = await Test.createTestingModule({
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
    })
      .compile();
    authenticationService = await module.get(AuthenticationService);
    usersService = await module.get(UsersService);
  });

  describe("when accessing the data of authenticating user", () => {
    it("should attempt to get the user by email", async () => {
      const getByEmailSpy = jest.spyOn(usersService, "getByEmail");
      await authenticationService.getAuthenticatedUser("user@email.com", "strongPassword");
      expect(getByEmailSpy).toBeCalledTimes(1);
    });
  });

  describe("when accessing the data of authenticating user", () => {
    describe("and the provided password is not valid", () => {

      beforeEach(() => {
        bcryptCompare.mockReturnValue(false);
      });

      it("should throw an error", async () => {
        await expect(
          authenticationService.getAuthenticatedUser("user@email.com", "strongPassword")
        ).rejects.toThrow();
      });

    });

    describe("and the provided password is valid", () => {

      beforeEach(() => {
        bcryptCompare.mockReturnValue(true);
      });

      describe("and the user is found in the database", () => {

        beforeEach(() => {
          findUser.mockResolvedValue(userData);
        });

        it("should return the user data", async () => {
          const user = await authenticationService.getAuthenticatedUser("user@email.com", "strongPassword");
          expect(user).toBe(userData);
        });

      });

      describe("and the user is not found in the database", () => {

        beforeEach(() => {
          findUser.mockResolvedValue(undefined);
        });

        it("should throw an error", async () => {
          await expect(
            authenticationService.getAuthenticatedUser("user@email.com", "strongPassword")
          ).rejects.toThrow();
        });

      });
    });
  });
});
