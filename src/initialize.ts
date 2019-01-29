import Utils from './Utils';

export const initialize = (): void => {
  Logger.log('initialize start');
  const rssSheetName: string = Utils.getRSSSheetName();
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(rssSheetName);
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet();
    sheet.setName(rssSheetName);
    const range = sheet.getRange('A1:D1');
    range.setBackground('yellow');
    const headers: string[] = new Array();
    headers.push('Notes');
    headers.push('URL');
    headers.push('RoomId');
    headers.push('LastUpdateDate');
    range.setValues([headers]);
  }
  const roomSheetName: string = Utils.getRoomSheetName();
  sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(roomSheetName);
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet();
    sheet.setName(roomSheetName);
    const range = sheet.getRange('A1:B1');
    range.setBackground('yellow');
    const headers: string[] = new Array();
    headers.push('Name');
    headers.push('RoomId');
    range.setValues([headers]);
  }
  Logger.log('initialize end');
};
