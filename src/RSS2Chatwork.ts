import Utils from "./Utils";
import { FeedItem } from "./FeedParser";

export default class RSS2Chatwork {
  roomId: string;
  lastUpdateDate: Date;
  token: string;
  feedDesc: string;

  /**
   * constructor
   * @param roomId
   * @param feedUrl
   * @param lastUpdateDate
   * @param feedDesc
   */
  constructor(roomId: string, lastUpdateDate: Date, feedDesc: string) {
    this.roomId = roomId;
    this.lastUpdateDate = lastUpdateDate;
    this.feedDesc = feedDesc;
    this.token = Utils.getChatworkToken();
    Utils.checkNotEmpty(
      this.token,
      "token が 未設定です。token を設定してください。"
    );
  }

  /**
   * getFeedSummaryOrBlank
   * @param feedItem
   */
  private getFeedSummaryOrBlank(feedItem: FeedItem) {
    const numberOfDescription = Utils.getNumberOfDescription();
    let summary;
    if (numberOfDescription <= -1) {
      summary = feedItem.summary;
    } else if (numberOfDescription == 0) {
      summary = "";
    } else {
      summary =
        feedItem.summary === ""
          ? ""
          : Utils.truncate(feedItem.summary, numberOfDescription);
    }
    return summary === "" ? "" : "[hr]" + summary;
  }

  /**
   * postMessage
   * @param feeds
   */
  public postMessage(feeds: FeedItem[]): Date {
    let updateDate: Date = this.lastUpdateDate;
    for (const feedItem of feeds) {
      let message;
      // msレベルでの誤差が発生するので、1秒加算しておく
      if (this.lastUpdateDate.getTime() + 1000 >= feedItem.time.getTime()) {
        continue;
      } else {
        const dateString: string = Utilities.formatDate(
          feedItem.time,
          "JST",
          "yyyy-MM-dd HH:mm:ss"
        );
        message =
          "[info][title]" +
          feedItem.title +
          "\n[" +
          dateString +
          "][/title]" +
          feedItem.link +
          this.getFeedSummaryOrBlank(feedItem) +
          "[hr]" +
          this.feedDesc +
          "[/info]";
      }
      if (message == "") {
        continue;
      }
      const payload = {
        body: message,
        self_unread: "1"
      };
      const options: Object = {
        method: "post",
        headers: { "X-ChatWorkToken": this.token },
        payload: payload
      };
      try {
        Utils.fetchAsJson(
          "https://api.chatwork.com/v2/rooms/" + this.roomId + "/messages",
          options
        );
      } catch (e) {
        if (e.errors == "Rate limit exceeded") {
          return updateDate;
        }
      }
      if (updateDate.getTime() <= feedItem.time.getTime()) {
        updateDate = feedItem.time;
      }
    }
    return updateDate;
  }
}
