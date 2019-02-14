import Utils from './Utils';
import RSS2Chatwork from './RSS2Chatwork';
import { FeedItem } from './FeedParser';
import FeedParser from './FeedParser';

export const noticeUpdate = (): void => {
  let sheet: GoogleAppsScript.Spreadsheet.Sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    Utils.getRSSSheetName()
  );
  let range: GoogleAppsScript.Spreadsheet.Range = sheet.getRange(2, 1, sheet.getLastRow() - 1, 4);
  let feedList: any[][] = range.getValues();
  let lastUpdateDates: any[] = new Array();
  for (let feed of feedList) {
    // roomId、feedUrl の設定がなければ、処理の対象外
    if (feed[0] == '' || feed[1] == '' || feed[2] == '') {
      lastUpdateDates.push('');
      continue;
    }
    let feedParser: FeedParser = new FeedParser(feed[1]);
    let rss2Chatwork: RSS2Chatwork = new RSS2Chatwork(
      feed[2],
      feed[3] == '' ? Utils.getYesterday() : new Date(feed[3]),
      feed[0]
    );
    let entries: FeedItem[] = feedParser.parseFeed();
    let lastUpdateDate: Date = rss2Chatwork.postMessage(entries);
    lastUpdateDates.push([lastUpdateDate]);
  }
  let targetRange = sheet.getRange(2, 4, sheet.getLastRow() - 1, 1);
  targetRange.setValues(lastUpdateDates);
};
