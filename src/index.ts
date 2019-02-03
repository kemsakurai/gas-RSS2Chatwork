import { initialize } from './initialize';
import { createSchedule } from './createSchedule';
import { updateSchedule } from './updateSchedule';
import { inputToken } from './inputToken';
import { getRooms } from './getRooms';
import { noticeUpdate } from './noticeUpdate';

function onOpen() {
  let ui = SpreadsheetApp.getUi();
  ui.createMenu('gas-RSS2Chatwork')
    .addSubMenu(
      ui
        .createMenu('Initialize')
        .addItem('Create config sheets', 'initialize')
        .addItem('Input token', 'inputToken')
    )
    .addSeparator()
    .addItem('Notice update', 'noticeUpdate')
    .addItem('Schedule', 'createSchedule')
    .addToUi();
}

declare let global: any;
global.onOpen = onOpen;
global.initialize = initialize;
global.inputToken = inputToken;
global.getRooms = getRooms;
global.createSchedule = createSchedule;
global.updateSchedule = updateSchedule;
global.noticeUpdate = noticeUpdate;
