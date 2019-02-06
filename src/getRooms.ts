import Utils from './Utils';

export const getRooms = (): void => {
  console.info('getRooms start');

  let token: string = Utils.getChatworkToken();
  Utils.checkNotEmpty(token, 'token が 未設定です。token を設定してください。');
  const options: Object = {
    method: 'get',
    headers: { 'X-ChatWorkToken': token }
  };

  let response = Utils.fetchAsJson('https://api.chatwork.com/v2/rooms', options);
  let values = new Array();
  for (let room of response) {
    let row = new Array();
    row.push(room['name']);
    row.push(room['room_id']);
    values.push(row);
  }
  const roomSheetName = Utils.getRoomSheetName();
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(roomSheetName);

  // sheet clear
  let range = sheet.getRange(2, 1, sheet.getLastRow(), 2);
  range.clear();

  // set values
  range = sheet.getRange(2, 1, values.length, 2);
  range.setValues(values);
  console.info('getRooms end');
};
