import Utils from "./Utils";
export const inputToken = (): void => {
  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt("ChatWork の API Token を入力してください。");
  const token = response.getResponseText();
  // getSelectedButtonでクリックされたボタンの情報を取得できる。入力値なしか×ボタンをクリックされたかの確認をしている
  if (token == "" || response.getSelectedButton() == ui.Button.CLOSE) {
    return;
  }
  Utils.setChatworkToken(token);
  ui.alert("入力した値を ChatWork の API Token として設定しました。");
};
