const {
  shareAll,
  withModuleFederationPlugin,
} = require("@angular-architects/module-federation/webpack");

module.exports = withModuleFederationPlugin({
  name: "host",

  shared: {
    ...shareAll({
      singleton: true,
      strictVersion: true,
      requiredVersion: "auto",
    }),
    "@angular/router": {
      singleton: true,
      strictVersion: true,
      requiredVersion: false,
    },
    "@angular/core": {
      singleton: true,
      strictVersion: true,
      requiredVersion: false,
    },
    "@angular/common": {
      singleton: true,
      strictVersion: true,
      requiredVersion: false,
    },
    rxjs: {
      singleton: true,
      strictVersion: true,
      requiredVersion: false,
    },
  },
});
