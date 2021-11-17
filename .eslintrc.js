module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ["plugin:vue/vue3-essential", "@vue/airbnb"],
  parserOptions: {
    parser: "babel-eslint",
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    quotes: ["warn", "double"],
    "no-param-reassign": "off",
    "no-underscore-dangle": "off",
    "object-curly-newline": "off",
    "implicit-arrow-linebreak": "off",
    "import/prefer-default-export": "off",
  },
};
