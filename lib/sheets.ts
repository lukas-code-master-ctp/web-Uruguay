import { google } from 'googleapis'
import { cache } from 'react'

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
})

const sheets = google.sheets({ version: 'v4', auth })
const SHEET_ID = process.env.GOOGLE_SHEET_ID!

export const readSheet = cache(async (range: string): Promise<string[][]> => {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range,
  })
  return (res.data.values ?? []) as string[][]
})

export async function writeLeadToSheet(values: string[]): Promise<void> {
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: 'leads!A:F',
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [values] },
  })
}
