const getSecret = () => PropertiesService.getScriptProperties().getProperty("SECRET_KEY") || "DEFAULT_SECRET";
const START_DATE = new Date("2024-01-01T00:00:00Z").getTime() / 1000;
// Base29 Alphabet (excluding O, 0, I, L, 1, Q, V)
const ALPHABET = "23456789ABCDEFGHJKMNPRSTUWXYZ";

function getSecretHash(secret) {
  let hash = 0;
  for (let i = 0; i < secret.length; i++) {
    hash = (hash << 5) - hash + secret.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function encodeTimestamp(timestampMs) {
  const unixSeconds = Math.floor(timestampMs / 1000);
  let value = unixSeconds - START_DATE;
  if (value < 0) value = 0;

  const secretHash = getSecretHash(getSecret());
  // Add a check digit based on the secret content to prevent guessing
  const checkDigitValue = (value + secretHash) % ALPHABET.length;

  let encoded = "";
  let temp = value;
  while (temp > 0) {
    encoded = ALPHABET[temp % ALPHABET.length] + encoded;
    temp = Math.floor(temp / ALPHABET.length);
  }

  // Pad if too short, for example min 4 chars
  while (encoded.length < 4) {
    encoded = ALPHABET[0] + encoded;
  }

  encoded += ALPHABET[checkDigitValue];
  return encoded;
}

function decodeCode(code) {
  if (code.length < 2) return null; // Needs at least one char and one check digit

  const checkChar = code.slice(-1);
  const dataChars = code.slice(0, -1);

  let value = 0;
  for (let i = 0; i < dataChars.length; i++) {
    const char = dataChars[i];
    const index = ALPHABET.indexOf(char);
    if (index === -1) return null;
    value = value * ALPHABET.length + index;
  }

  const secretHash = getSecretHash(getSecret());
  const expectedCheckDigitValue = (value + secretHash) % ALPHABET.length;
  if (ALPHABET[expectedCheckDigitValue] !== checkChar) {
    return null; // Invalid check digit
  }

  return (value + START_DATE) * 1000;
}

function parseDate(dateStr) {
  // Standard JS parse, replacing space with T for strict ISO 8601 parsing of YYYY-MM-DD HH:mm:ss
  return new Date(String(dateStr).replace(' ', 'T'));
}

function onFormSubmit(e) {
  // Keeping function declaration for compatibility with existing triggers,
  // but removing email logic as requested.
  // Codes are now generated on the fly by the frontend fetching from doPost endpoint.
}

function doPost(e) {
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);

  // Handling CORS via generic response as GAS doPost doesn't easily support OPTIONS preflight for custom headers
  // But standard form data or simple POSTs will work.

  try {
    const params = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = sheet.getDataRange().getValues();

    if (params.action === "getRecentCodes") {
      const oneHourAgoMs = new Date().getTime() - (60 * 60 * 1000);
      let recentItems = [];

      for (let i = 1; i < data.length; i++) {
        const rowTimestampStr = data[i][0]; // Column A
        if (!rowTimestampStr) continue;

        const rowDate = parseDate(rowTimestampStr);
        const rowTimeMs = rowDate.getTime();

        if (!isNaN(rowTimeMs)) {
          // Check if item was added within the last hour
          if (rowTimeMs >= oneHourAgoMs) {
            recentItems.push({
              id: Math.floor(rowTimeMs / 1000).toString(),
              code: encodeTimestamp(rowTimeMs)
            });
          }
        }
      }

      return output.setContent(JSON.stringify({ success: true, codes: recentItems }));
    }

    const code = params.code;

    if (!code) {
      return output.setContent(JSON.stringify({ success: false, error: "Brak kodu" }));
    }

    const timestampMs = decodeCode(code.toUpperCase());

    if (!timestampMs) {
      return output.setContent(JSON.stringify({ success: false, error: "Nieprawidłowy kod" }));
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = sheet.getDataRange().getValues();

    let rowToUpdate = -1;
    // Assume headers are in row 1, data starts from row 2 (index 1)
    for (let i = 1; i < data.length; i++) {
      const rowTimestampStr = data[i][0]; // Column A
      if (!rowTimestampStr) continue;

      const rowDate = parseDate(rowTimestampStr);
      if (!isNaN(rowDate.getTime())) {
        // Allow a small drift of max 1 second just in case string parsing causes minor millisecond loss
        if (Math.abs(rowDate.getTime() - timestampMs) <= 1000) {
          rowToUpdate = i + 1; // 1-based indexing for sheets
          break;
        }
      }
    }

    if (rowToUpdate === -1) {
      return output.setContent(JSON.stringify({ success: false, error: "Nie znaleziono munduru dla tego kodu" }));
    }

    // We assume there's a column for "Status" or similar, or we append it.
    // Let's assume we use an existing column named "Status" or add it if not found,
    // or simply delete the row or clear it. The user said: "change status to picked up".
    // Let's find "Odebrane" column.
    const headers = data[0];
    let statusColIndex = headers.indexOf("Odebrane");

    if (statusColIndex === -1) {
      // If no "Odebrane" column exists, create it at the end
      statusColIndex = headers.length;
      sheet.getRange(1, statusColIndex + 1).setValue("Odebrane");
    }

    // Set the cell content to something non-empty to mark as taken
    sheet.getRange(rowToUpdate, statusColIndex + 1).setValue("Tak");

    return output.setContent(JSON.stringify({ success: true }));

  } catch (error) {
    return output.setContent(JSON.stringify({ success: false, error: error.toString() }));
  }
}
