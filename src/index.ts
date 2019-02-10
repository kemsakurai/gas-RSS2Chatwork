import { initialize } from './initialize';
import { createSchedule } from './createSchedule';
import { updateSchedule } from './updateSchedule';
import { inputToken } from './inputToken';
import { inputNumberOfDescription } from './inputNumberOfDescription';
import { getRooms } from './getRooms';
import { noticeUpdate } from './noticeUpdate';

function onOpen() {
  var lang = Session.getActiveUserLocale();
  let ui = SpreadsheetApp.getUi();
  ui.createMenu('gas-RSS2Chatwork')
    .addSubMenu(
      ui
        .createMenu(lang === 'ja' ? '初期設定' : 'Initial setting')
        .addItem(lang === 'ja' ? '設定シート作成' : 'Create config sheets', 'initialize')
        .addItem(lang === 'ja' ? 'Token設定' : 'Input token', 'inputToken')
        .addItem(lang === 'ja' ? 'ルーム一覧を取得' : 'Get rooms', 'getRooms')
        .addItem(
          lang === 'ja' ? 'descriptionの文字数設定' : 'Number of characters for description',
          'inputNumberOfDescription'
        )
    )
    .addSeparator()
    .addItem(lang === 'ja' ? '更新通知' : 'Notice update', 'noticeUpdate')
    .addItem(lang === 'ja' ? 'スケジュール実行' : 'Schedule', 'createSchedule')
    .addToUi();
}

declare let global: any;
global.onOpen = onOpen;
global.initialize = initialize;
global.inputToken = inputToken;
global.inputNumberOfDescription = inputNumberOfDescription;
global.getRooms = getRooms;
global.createSchedule = createSchedule;
global.updateSchedule = updateSchedule;
global.noticeUpdate = noticeUpdate;
