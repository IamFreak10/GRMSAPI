export const getBaseEmailTemplate = (data: any) => {
  const invoiceTable = data.invoiceDetails
    ? `
        <div style="margin: 25px 0; border: 1px solid #e0e0e0; border-radius: 12px; padding: 20px; background: #fdfdfd; text-align: left; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);">
            <h3 style="color: #2e7d32; margin-top: 0; font-size: 16px; border-bottom: 2px solid #81c784; display: inline-block; padding-bottom: 5px; text-transform: uppercase; letter-spacing: 1px;">Payment Summary</h3>
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 14px; color: #444;">
                <tr>
                    <td style="padding: 10px 0; color: #757575;">Transaction ID</td>
                    <td style="padding: 10px 0; text-align: right; font-weight: 600; font-family: monospace; color: #333;">${data.invoiceDetails.txnId}</td>
                </tr>
                <tr style="border-top: 1px solid #eee;">
                    <td style="padding: 15px 0; font-weight: bold; color: #1b5e20; font-size: 16px;">Total Amount</td>
                    <td style="padding: 15px 0; text-align: right; font-weight: 800; color: #1b5e20; font-size: 18px;">${data.invoiceDetails.totalAmount} <span style="font-size: 12px;">BDT</span></td>
                </tr>
            </table>
        </div>
    `
    : '';

  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            @media only screen and (max-width: 600px) {
                .container { width: 100% !important; border-radius: 0 !important; }
                .content { padding: 25px !important; }
                .header { padding: 30px 20px !important; }
                .button { width: 100% !important; box-sizing: border-box; }
            }
        </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f0f4f3; -webkit-text-size-adjust: none;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f0f4f3; padding: 40px 10px;">
            <tr>
                <td align="center">
                    <div class="container" style="max-width: 600px; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 15px 35px rgba(0,0,0,0.08); border: 1px solid #e8e8e8;">
                        <div class="header" style="background: linear-gradient(135deg, #43a047 0%, #1b5e20 100%); padding: 50px 40px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">${data.title}</h1>
                        </div>
                        
                        <div class="content" style="padding: 45px 40px; text-align: center;">
                            <h2 style="color: #1b5e20; font-size: 22px; margin-bottom: 15px; font-weight: 700;">Hello, ${data.userName}!</h2>
                            <p style="font-size: 16px; color: #555; line-height: 1.7; margin-bottom: 25px;">${data.description}</p>
                            
                            ${invoiceTable}
                            
                            <div style="margin: 35px 0 10px 0;">
                                <a href="${data.buttonLink}" class="button"
                                   style="background: #2e7d32; color: #ffffff; padding: 18px 45px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block; font-size: 16px; box-shadow: 0 5px 15px rgba(46,125,50,0.3); transition: all 0.3s ease;">
                                   ${data.buttonText}
                                </a>
                            </div>
                            
                            <p style="font-size: 13px; color: #999; margin-top: 30px;">If you have any questions, just reply to this email.</p>
                        </div>
                        
                        <div style="background: #fcfcfc; padding: 25px; text-align: center; border-top: 1px solid #f0f0f0; font-size: 12px; color: #9e9e9e; letter-spacing: 0.5px;">
                            © 2026 <strong>Grmsa App</strong>. All rights reserved. <br>
                            <span style="color: #ccc; margin-top: 5px; display: inline-block;">Your Trusted Document Solution</span>
                        </div>
                    </div>
                </td>
            </tr>
        </table>
    </body>
    </html>`;
};
