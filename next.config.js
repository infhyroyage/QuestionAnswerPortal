const withInterceptStdout = require("next-intercept-stdout");

// 下記URLの通り、Next.jsでRecoilを使用すると「Duplicate atom key」と続く意味のないエラーメッセージが出力され続けるため、
// next-intercept-stdoutを使用して、そのエラーメッセージを表示しないように設定する
// https://github.com/facebookexperimental/Recoil/issues/733
module.exports = withInterceptStdout(
  {
    basePath: process.env.GITHUB_ACTIONS ? "/QuestionAnswerPortal" : undefined,
    assetPrefix: process.env.GITHUB_ACTIONS
      ? "/QuestionAnswerPortal/"
      : undefined,
    reactStrictMode: false,
  },
  (text) => (text.includes("Duplicate atom key") ? "" : text)
);
