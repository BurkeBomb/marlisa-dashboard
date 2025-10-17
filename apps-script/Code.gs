const SHEET_NAME = 'Meeting Notes';

function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const records = data.slice(1).map(row => {
    let record = {};
    headers.forEach((h, i) => record[h] = row[i]);
    return record;
  });
  return ContentService.createTextOutput(JSON.stringify(records))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const body = JSON.parse(e.postData.contents);
    const timestamp = new Date().toLocaleString();
    const { notes = '', author = '', schemeRemarks = '' } = body;
    sheet.appendRow([timestamp, author, notes, schemeRemarks]);
    return ContentService.createTextOutput(JSON.stringify({ status: 'success', timestamp }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
