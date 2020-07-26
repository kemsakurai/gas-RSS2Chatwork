import Utils from "./Utils";

export const getRooms = (): void => {
  console.info("getRooms start");

  const token: string = Utils.getChatworkToken();
  Utils.checkNotEmpty(token, "token が 未設定です。token を設定してください。");
  const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    method: "get",
    headers: { "X-ChatWorkToken": token }
  };

  const response = Utils.fetchAsJson(
    "https://api.chatwork.com/v2/rooms",
    options
  );
  const values = [];
  for (const room of response) {
    const row = [];
    row.push(room["name"]);
    row.push(room["room_id"]);
    values.push(row);
  }
  const roomSheetName = Utils.getRoomSheetName();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    roomSheetName
  );

  // sheet clear
  let range = sheet.getRange(2, 1, sheet.getLastRow(), 2);
  range.clear();

  // set values
  range = sheet.getRange(2, 1, values.length, 2);
  range.setValues(values);
  console.info("getRooms end");
};
