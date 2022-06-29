import { UserEntity } from "../../users/user.entity";

export const mockedUser: UserEntity = {
  id: 1,
  email: "user@email.com",
  name: "John",
  password: "Student_aks3_3",
  phoneNumber: "+48123123123",
  address: {
    id: 1,
    street: "streetName",
    city: "cityName",
    country: "countryName"
  }
};
