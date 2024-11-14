
module.exports = {
    HOST: "localhost",
    USER: "odoo_user",
    PASSWORD: "abuya313",
    DB: "armonia2",
    PORT: "5433",
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };
/*
module.exports = {
    HOST: "localhost",
    USER: "postgres",
    PASSWORD: "postgres",
    DB: "Armonia",
    PORT: "5432",
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };
  */