import { google } from 'googleapis';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;
const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;

/**
 * Initializes Google OAuth2 client with saved credentials
 */
export function getOAuth2Client() {
  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    throw new Error('Google OAuth credentials (CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN) missing in environment variables.');
  }

  const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET
  );

  oauth2Client.setCredentials({
    refresh_token: REFRESH_TOKEN,
  });

  return oauth2Client;
}

/**
 * Creates a Google Drive Resumable Upload Session URL.
 * The returned session URL allows direct PUT requests from the browser
 * directly to Google Drive without passing binary data through Vercel serverless functions.
 */
export async function createResumableUploadSession(
  filename: string,
  mimeType: string,
  fileSize: number
): Promise<string> {
  if (!FOLDER_ID) {
    throw new Error('GOOGLE_DRIVE_FOLDER_ID missing in environment variables.');
  }

  const auth = getOAuth2Client();
  const tokenResponse = await auth.getAccessToken();
  const accessToken = tokenResponse.token;

  if (!accessToken) {
    throw new Error('Failed to retrieve valid access token from Google OAuth refresh token.');
  }

  // Sanitize filename and create unique timestamped name
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const safeFilename = `nisankare_${timestamp}_${filename.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

  const metadata = {
    name: safeFilename,
    parents: [FOLDER_ID],
  };

  // Call Google Drive API to initiate resumable upload session
  const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json; charset=UTF-8',
      'X-Upload-Content-Type': mimeType,
      'X-Upload-Content-Length': fileSize.toString(),
    },
    body: JSON.stringify(metadata),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Google Drive Resumable Upload Session creation failed:', errorText);
    throw new Error(`Google Drive API error (${response.status}): ${response.statusText}`);
  }

  const locationUrl = response.headers.get('location');
  if (!locationUrl) {
    throw new Error('Google Drive API did not return a session location URL.');
  }

  return locationUrl;
}
