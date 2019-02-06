const UTF8_URI = new RegExp(
  '%[0-7][0-9A-F]|' +
    '%C[2-9A-F]%[89AB][0-9A-F]|%D[0-9A-F]%[89AB][0-9A-F]|' +
    '%E[0-F](?:%[89AB][0-9A-F]){2}|' +
    '%F[0-7](?:%[89AB][0-9A-F]){3}|' +
    '%F[89AB](?:%[89AB][0-9A-F]){4}|' +
    '%F[CD](?:%[89AB][0-9A-F]){5}',
  'ig'
);

export default class Utils {
  public static fetchAsJson(url: string, requestOptions: any) {
    const response = UrlFetchApp.fetch(url, requestOptions);
    return JSON.parse(response.getContentText());
  }

  public static fetchAsXmlDocument(url: string) {
    const response = UrlFetchApp.fetch(url);
    return XmlService.parse(response.getContentText());
  }
  /**
   * setChatworkToken
   * @param token
   */
  public static setChatworkToken(token: string): void {
    PropertiesService.getScriptProperties().setProperty('CHATWORK_TOKEN', token);
  }
  /**
   * getChatworkToken
   */
  public static getChatworkToken(): string {
    return PropertiesService.getScriptProperties().getProperty('CHATWORK_TOKEN');
  }

  /**
   * getYesterday
   */
  public static getYesterday(): Date {
    let now: Date = new Date();
    let yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    return yesterday;
  }
  /**
   * checkNotEmpty
   */
  public static checkNotEmpty(value: string, message: string) {
    if (typeof value === 'undefined' || value == '') {
      throw new Error(message);
    }
  }
  /**
   * getRSSSheetName
   */
  public static getRSSSheetName(): string {
    return 'RSS';
  }

  /**
   * getRoomSheetName
   */
  public static getRoomSheetName(): string {
    return 'Room';
  }
  /**
   * getMethodName
   */
  public static getMethodName() {
    let err = new Error();
    return /at \w+\.(\w+)/.exec(err.stack.split('\n')[2])[1];
  }
  /**
   * decodeURIComponentSafety
   * @param link
   */
  public static decodeURIComponentSafety(link: string): string {
    let result = link.replace(UTF8_URI, function(whole) {
      return decodeURIComponent(whole);
    });
    return result;
  }
  /**
   * getTextOrBlank
   */
  public static getTextOrBlank(element): string {
    let result = '';
    if (element) {
      // htmlタグを除去する
      result = element.getText().replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '');
    }
    return result;
  }
  /**
   * toDate
   * @param updated
   */
  public static toDate(updated: string): Date {
    let time = new Date(updated);
    if (time.toString() === 'Invalid Date') {
      time = new Date(
        updated
          .replace('T', ' ')
          .replace('Z', ' GMT')
          .replace(/-/g, '/')
      );
    }
    return time;
  }
}
