import { initialize } from './initialize';
import { createSchedule } from './createSchedule';
import { updateSchedule } from './updateSchedule';
import { inputToken } from './inputToken';
import { getRooms } from './getRooms';
import { noticeUpdate } from './noticeUpdate';

function onOpen() {
  const menu = [
    { name: 'Initialize', functionName: 'initialize' },
    { name: 'Input token', functionName: 'inputToken' },
    { name: 'Get rooms', functionName: 'getRooms' },
    { name: 'Notice update', functionName: 'noticeUpdate' },
    { name: 'Schedule', functionName: 'createSchedule' }
  ];
  SpreadsheetApp.getActiveSpreadsheet().addMenu('gas-RSS2Chatwork', menu);
}

declare let global: any;
global.onOpen = onOpen;
global.initialize = initialize;
global.inputToken = inputToken;
global.getRooms = getRooms;
global.createSchedule = createSchedule;
global.updateSchedule = updateSchedule;
global.noticeUpdate = noticeUpdate;
