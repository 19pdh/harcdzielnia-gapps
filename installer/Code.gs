/**
 * Harcdzielnia - Instalator
 * Web app that copies a template Google Sheet and creates a linked form.
 */

// TODO: Replace with actual template sheet URL
const TEMPLATE_SHEET_URL = 'YOUR_TEMPLATE_SHEET_URL_HERE';

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Installer')
    .setTitle('Postaw swoją Harcdzielnię')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function setupNewInstance(instanceName) {
  // 1. Copy template sheet
  const template = SpreadsheetApp.openByUrl(TEMPLATE_SHEET_URL);
  const name = instanceName || ('Harcdzielnia - ' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd'));
  const copy = template.copy(name);

  // 2. Publish as CSV
  copy.setPublished(true);
  const csvUrl = copy.getUrl() + '/pub?output=csv';

  // 3. Create linked Google Form
  const form = FormApp.create(name + ' - zgłoś mundur');
  form.setDescription('Formularz zgłoszenia munduru do wymiany');
  form.setCollectEmail(true);

  // Add questions matching the sheet columns
  form.addMultipleChoiceItem()
    .setTitle('Co chcesz oddać?')
    .setChoiceValues(['Bluza mundurowa', 'Spodnie', 'Czapka', 'Pas', 'Koszula', 'Krawat / fular', 'Inne'])
    .setRequired(true);

  form.addTextItem()
    .setTitle('Nazwa + rozmiar')
    .setHelpText('Np. Bluza mundurowa 158cm')
    .setRequired(true);

  form.addTextItem()
    .setTitle('Zdjęcie')
    .setHelpText('Link do Google Drive')
    .setRequired(false);

  form.addTextItem()
    .setTitle('Opis')
    .setHelpText('Dodatkowe informacje o stanie munduru')
    .setRequired(false);

  form.addTextItem()
    .setTitle('Dane kontaktowe - jak odebrać?')
    .setHelpText('Email lub numer telefonu')
    .setRequired(true);

  // 4. Link form to the new sheet
  form.setDestination(FormApp.DestinationType.SPREADSHEET, copy.getId());

  // 5. Return URLs
  return {
    sheetUrl: copy.getUrl(),
    formUrl: form.getPublishedUrl(),
    csvUrl: csvUrl,
    sheetId: copy.getId(),
  };
}
