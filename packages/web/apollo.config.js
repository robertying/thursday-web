const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
  path: path.resolve(process.cwd(), ".env.local"),
});

module.exports = {
  client: {
    includes: ["apis/**/*"],
    service: {
      name: "thursday",
      url: "https://api.thu.community/v1/graphql",
      headers: {
        "x-hasura-admin-secret": process.env.HASURA_GRAPHQL_ADMIN_SECRET,
      },
    },
  },
};
