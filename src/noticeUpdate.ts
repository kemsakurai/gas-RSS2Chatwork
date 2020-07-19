import Utils from "./Utils";
import RSS2Chatwork from "./RSS2Chatwork";
import { FeedItem } from "./FeedParser";
import FeedParser from "./FeedParser";

export const noticeUpdate = (): void => {
  const sheet: GoogleAppsScript.Spreadsheet.Sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    Utils.getRSSSheetName()
  );
  const range: GoogleAppsScript.Spreadsheet.Range = sheet.getRange(
    2,
    1,
    sheet.getLastRow() - 1,
    4
  );
  const feedList: any[][] = range.getValues();
  const lastUpdateDates: any[] = [];
  for (const feed of feedList) {
    // roomId、feedUrl の設定がなければ、処理の対象外
    if (feed[0] == "" || feed[1] == "" || feed[2] == "") {
      lastUpdateDates.push("");
      continue;
    }
    const feedParser: FeedParser = new FeedParser(feed[1]);
    const rss2Chatwork: RSS2Chatwork = new RSS2Chatwork(
      feed[2],
      feed[3] == "" ? Utils.getYesterday() : new Date(feed[3]),
      feed[0]
    );
    const entries: FeedItem[] = feedParser.parseFeed();
    const lastUpdateDate: Date = rss2Chatwork.postMessage(entries);
    lastUpdateDates.push([lastUpdateDate]);
  }
  const targetRange = sheet.getRange(2, 4, sheet.getLastRow() - 1, 1);
  targetRange.setValues(lastUpdateDates);
};
