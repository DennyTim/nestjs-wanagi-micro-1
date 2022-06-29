export const mockedConfigService = {
  get(key: string) {
    switch (key) {
      case "JWT_EXPIRATION_TIME": {
        return "3600";
      }
      case "JWT_SECRET": {
        return "sdfgthyy65432wedcfvbhnjyu76543q2wsdcvbnhmjyu654";
      }
      case "POSTGRES_HOST": {
        return "localhost";
      }
      case "POSTGRES_PORT": {
        return "5432";
      }
      case "POSTGRES_USER": {
        return "admin";
      }
      case "POSTGRES_PASSWORD": {
        return "admin";
      }
      case "POSTGRES_DB": {
        return "nestjs";
      }
      case "PORT": {
        return "5000";
      }
    }
  }
};
