import Utils from "./Utils";

type FeedItem = {
  title: string;
  link: string;
  summary: string;
  time: Date;
};
export { FeedItem };

export default class FeedParser {
  feedUrl: string;
  /**
   * constructor
   * @param feedUrl
   */
  constructor(feedUrl: string) {
    this.feedUrl = feedUrl;
    Utils.checkNotEmpty(
      this.feedUrl,
      "feedUrl が 未設定です。feedUrl を設定してください。"
    );
  }
  /**
   * parseFeed
   */
  public parseFeed(): FeedItem[] {
    try {
      const document = Utils.fetchAsXmlDocument(this.feedUrl);
      const feedType = this.determineFeedType(document);
      if (feedType == "atom") {
        return this.parseAtom(document);
      } else if (feedType == "rss1") {
        return this.parseRSS10(document);
      } else if (feedType == "rss2") {
        return this.parseRSS20(document);
      } else {
        console.warn("Illegal feed format [URL]:%s", this.feedUrl);
        return [];
      }
    } catch (e) {
      console.warn(e);
      return [];
    }
  }

  private parseRSS10(document: GoogleAppsScript.XML_Service.Document) {
    const root = document.getRootElement();
    const rss = XmlService.getNamespace("http://purl.org/rss/1.0/");
    const dc = XmlService.getNamespace(
      "dc",
      "http://purl.org/dc/elements/1.1/"
    );
    const items = root.getChildren("item", rss);
    const feedItems: FeedItem[] = [];

    for (const i in items) {
      let link = items[i].getChild("link", rss).getText();
      link = Utils.decodeURIComponentSafety(link);
      const title = items[i].getChild("title", rss);
      const description = items[i].getChild("description", rss);
      const item: FeedItem = {
        title: Utils.getTextOrBlank(title),
        link: link,
        summary: Utils.getTextOrBlank(description),
        time: new Date(items[i].getChild("date", dc).getText())
      };
      feedItems.push(item);
    }
    return feedItems;
  }

  private parseRSS20(document: GoogleAppsScript.XML_Service.Document) {
    const root = document.getRootElement();
    const items = root.getChild("channel").getChildren("item");
    const feedItems: FeedItem[] = [];
    const parentPubDate = root.getChild("channel").getChild("pubDate");
    for (const i in items) {
      const item = items[i];
      let link = item.getChild("link").getText();
      link = Utils.decodeURIComponentSafety(link);
      const description = item.getChild("description");
      const title = item.getChild("title");
      const feedItem: FeedItem = {
        title: Utils.getTextOrBlank(title),
        link: link,
        summary: Utils.getTextOrBlank(description),
        time: new Date(this.getPubdate(item, parentPubDate).getText())
      };
      feedItems.push(feedItem);
    }
    return feedItems;
  }
  /**
   * getPubdate
   * @param item
   * @param parentPubDate
   */
  private getPubdate(
    item: GoogleAppsScript.XML_Service.Element,
    parentPubDate: GoogleAppsScript.XML_Service.Element
  ) {
    if (item.getChild("pubDate") != null) {
      return item.getChild("pubDate");
    }
    const dc = XmlService.getNamespace(
      "dc",
      "http://purl.org/dc/elements/1.1/"
    );
    if (item.getChild("date", dc) != null) {
      return item.getChild("date", dc);
    }
    return parentPubDate;
  }

  private parseAtom(document: GoogleAppsScript.XML_Service.Document) {
    const atomNS = XmlService.getNamespace("http://www.w3.org/2005/Atom");
    const entry = document.getRootElement().getChildren("entry", atomNS);
    const items: FeedItem[] = [];
    for (const i in entry) {
      let link = entry[i]
        .getChild("link", atomNS)
        .getAttribute("href")
        .getValue();
      if (link.match(/&url=(.*)&ct=ga/)) {
        link = Utils.decodeURIComponentSafety(link.match(/&url=(.*)&ct=ga/)[1]);
      } else {
        link = Utils.decodeURIComponentSafety(link);
      }
      const updated = entry[i].getChild("updated", atomNS).getText();
      let time = Utils.toDate(updated);
      if (time.toString() === "Invalid Date") {
        const pubDate = entry[i].getChild("pubDate", atomNS).getText();
        time = Utils.toDate(pubDate);
      }
      const title = entry[i].getChild("title", atomNS);
      const content = entry[i].getChild("content", atomNS);
      const item: FeedItem = {
        title: Utils.getTextOrBlank(title),
        link: link,
        summary: Utils.getTextOrBlank(content).replace(
          /&nbsp;|&raquo;|and more/g,
          " "
        ),
        time: time
      };
      items.push(item);
    }
    return items;
  }
  /**
   * determineFeedType
   * @param document
   */
  private determineFeedType(
    document: GoogleAppsScript.XML_Service.Document
  ): string {
    const atomNS = XmlService.getNamespace("http://www.w3.org/2005/Atom");
    const entry = document.getRootElement().getChildren("entry", atomNS);
    if (entry && entry.length > 0) {
      return "atom";
    }
    const rssNS = XmlService.getNamespace("http://purl.org/rss/1.0/");
    const item = document.getRootElement().getChildren("item", rssNS);
    if (item && item.length > 0) {
      return "rss1";
    }
    const channel = document.getRootElement().getChild("channel");
    if (channel) {
      const item = channel.getChildren("item");
      if (item && item.length > 0) {
        return "rss2";
      }
    }
    return "other";
  }
}
