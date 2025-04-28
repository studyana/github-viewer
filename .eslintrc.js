module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:prettier/recommended", // 必须放在最后，覆盖其他格式规则
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    // 自定义规则（可选）
    "no-console": "warn", // 禁止 console，但只警告
    "prettier/prettier": "error", // Prettier 格式问题报错
  },
};
