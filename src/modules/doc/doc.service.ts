import { google } from 'googleapis';
import fs from 'fs';
import { oauth2 } from 'googleapis/build/src/apis/oauth2';


const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const FOLDER_ID = '1GXTyDEgrve7ot_sVh4NBCgmlbSt8WP9v'; 

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({ version: 'v3', auth: oauth2Client });

export const uploadFileToDrive = async (file: Express.Multer.File) => {
  try {
    console.log('--- DEBUG: Starting OAuth Upload ---');
    
    const response = await drive.files.create({
      requestBody: {
        name: `user_doc_${Date.now()}_${file.originalname}`,
        parents: [FOLDER_ID],
      },
      media: {
        mimeType: file.mimetype,
        body: fs.createReadStream(file.path),
      },
      fields: 'id, webViewLink', 
    });

   
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    console.log('--- DEBUG: Upload Success! ---');
    
    return response.data.webViewLink;
    
  } catch (error: any) {
    console.error('OAuth Upload Error:', error.response?.data || error.message);
    
    if (file.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    throw error;
  }
};