/** @type {import('@commitlint/types').UserConfig} */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Allow Spanish/English subjects without forced English casing
    'subject-case': [0],
  },
};
