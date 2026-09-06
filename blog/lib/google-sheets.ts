import { google } from "googleapis";

/**
 * Optional integration: appends new comments and newsletter subscribers to a
 * Google Sheet (two tabs in the same spreadsheet), so emails collected on the
 * site land somewhere you can use them (a mailing list, a CRM import, etc).
 * Leave the env vars unset and both functions below silently no-op — comments
 * and signups still save to the database normally either way.
 * See SETUP.md for how to create the service account and share a sheet with it.
 */
const useSheets = Boolean(
  process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY && process.env.GOOGLE_SHEET_ID
);

function getSheetsClient() {
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return google.sheets({ version: "v4", auth });
}

async function appendRow(tab: string, values: string[]) {
  if (!useSheets) return;
  try {
    const sheets = getSheetsClient();
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `${tab}!A:Z`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [values] },
    });
  } catch (err) {
    // Never let a Sheets outage block a comment/signup from saving.
    console.error(`Google Sheets sync to "${tab}" failed:`, err);
  }
}

export async function appendCommentToSheet(row: {
  name: string;
  email: string;
  comment: string;
  postTitle: string;
  createdAt: Date;
}) {
  const tab = process.env.GOOGLE_SHEET_NAME || "Sheet1";
  await appendRow(tab, [row.name, row.email, row.comment, row.postTitle, row.createdAt.toISOString()]);
}

export async function appendSubscriberToSheet(row: { email: string; source?: string | null; createdAt: Date }) {
  const tab = process.env.GOOGLE_SUBSCRIBERS_SHEET_NAME || "Subscribers";
  await appendRow(tab, [row.email, row.source || "", row.createdAt.toISOString()]);
}
