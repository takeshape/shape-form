const {BABEL_ENV} = process.env;
module.exports = {
  "presets": [
    "@babel/preset-react",
    [
      "@babel/preset-env",
      {
        "modules": BABEL_ENV === 'es' ? false : BABEL_ENV,
        "targets": {
          "browsers": [
            "last 2 versions"
          ]
        }
      }
    ],
    "@babel/preset-typescript"
  ],
  "plugins": [
    [
      "@babel/plugin-transform-runtime",
      {
        "regenerator": true
      }
    ],
    "@babel/plugin-syntax-dynamic-import",
    "@babel/plugin-syntax-import-meta",
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-json-strings",
    [
      "@babel/plugin-proposal-decorators",
      {
        "legacy": true
      }
    ],
    "@babel/plugin-proposal-function-sent",
    "@babel/plugin-proposal-export-namespace-from",
    "@babel/plugin-proposal-numeric-separator",
    "@babel/plugin-proposal-throw-expressions"
  ],
  "env": {
    "test": {
      "sourceMaps": "inline",
      "presets": [
        "@babel/preset-react",
        [
          "@babel/preset-env",
          {
            "targets": {
              "node": "8.10"
            }
          }
        ],
        "@babel/preset-typescript"
      ],
      "plugins": [
        "babel-plugin-dynamic-import-node",
        "@babel/plugin-syntax-dynamic-import",
        "@babel/plugin-syntax-import-meta",
        "@babel/plugin-proposal-class-properties",
        "@babel/plugin-proposal-json-strings",
        [
          "@babel/plugin-proposal-decorators",
          {
            "legacy": true
          }
        ],
        "@babel/plugin-proposal-function-sent",
        "@babel/plugin-proposal-export-namespace-from",
        "@babel/plugin-proposal-numeric-separator",
        "@babel/plugin-proposal-throw-expressions"
      ]
    }
  }
};
