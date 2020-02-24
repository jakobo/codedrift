// required: initialize dotenv
require("dotenv").config();

const path = require("path");

module.exports = (/* phase, { defaultConfig } */) => {
  return {
    poweredByHeader: false,
    webpack: config => {
      config.resolve.alias["~"] = path.resolve(__dirname);

      config.module.rules.push({
        test: /\.md$/,
        use: "raw-loader",
      });

      return config;
    },
  };
};
