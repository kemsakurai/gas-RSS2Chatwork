import Utils from "./Utils";
export const inputNumberOfDescription = (): void => {
  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt(
    "Description の 最大文字数を設定してください。" +
      "\n" +
      "-1以下:制限なし、0:出力しない、1以上:最大文字数として設定"
  );
  const numberOfDescription = response.getResponseText();
  // getSelectedButtonでクリックされたボタンの情報を取得できる。入力値なしか×ボタンをクリックされたかの確認をしている

  if (
    numberOfDescription == "" ||
    response.getSelectedButton() == ui.Button.CLOSE
  ) {
    return;
  }
  if (isNaN(parseInt(numberOfDescription))) {
    ui.alert("入力値には数値を入力してください。");
    return;
  }
  Utils.setNumberOfDescription(numberOfDescription);
  ui.alert("入力した値をDescription の 最大文字数として設定しました。");
};
