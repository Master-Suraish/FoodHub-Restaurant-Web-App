export const verifyEmailTemplate = (verifyUrl: string) => {
  const orange500 = "#f97316"; 
  const slate900 = "#0f172a"; 
  const slate50 = "#f8fafc"; 

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Verify FoodHub Account</title>
  </head>
  <body style="margin:0; padding:0; background-color:#ffffff; font-family: 'Inter', system-ui, sans-serif;">
    <table align="center" width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
      <tr>
        <td align="center">
          
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
            <tr>
              <td align="center">
                <div style="font-size: 32px; font-weight: 900; letter-spacing: -1.5px; color: ${slate900}; text-decoration: none;">
                  Food<span style="color: ${orange500};">Hub</span>
                </div>
              </td>
            </tr>
          </table>

          <table width="550" cellpadding="0" cellspacing="0" 
            style="background-color: ${slate50}; 
                   border-top: 6px solid ${orange500}; 
                   border-radius: 32px; 
                   padding: 50px 40px; 
                   box-shadow: 0 20px 40px rgba(15, 23, 42, 0.05); 
                   border-left: 1px solid #e2e8f0; 
                   border-right: 1px solid #e2e8f0; 
                   border-bottom: 1px solid #e2e8f0;">
            
            <tr>
              <td align="center">
                <h2 style="color:${slate900}; font-size: 28px; font-weight: 900; margin-bottom:16px; margin-top: 0; letter-spacing: -0.5px;">
                  Verify your email
                </h2>
                
                <p style="color:#475569; font-size:16px; line-height:1.6; margin-bottom: 35px;">
                  Welcome to <strong>FoodHub</strong>! Click the button below to verify your account and start exploring the best meals in town.
                </p>

                <a href="${verifyUrl}" 
                   style="
                     background-color:${slate900};
                     color:#ffffff;
                     padding:20px 45px;
                     text-decoration:none;
                     font-size:14px;
                     font-weight: 900;
                     border-radius: 20px;
                     display:inline-block;
                     letter-spacing: 2px;
                     text-transform: uppercase;
                   ">
                  Verify My Account
                </a>
              </td>
            </tr>

            <tr>
              <td align="center" style="padding-top: 40px;">
                <p style="color:#94a3b8; font-size:12px;">
                  If the button doesn't work, use this link:<br>
                  <a href="${verifyUrl}" style="color:${orange500}; text-decoration: none; word-break: break-all;">${verifyUrl}</a>
                </p>
              </td>
            </tr>
          </table>

          <table width="550" cellpadding="0" cellspacing="0" style="margin-top: 30px;">
            <tr>
              <td align="center">
                <p style="color:#94a3b8; font-size:12px;">
                  © ${new Date().getFullYear()} <strong>FoodHub</strong>. All rights reserved.
                </p>
              </td>
            </tr>
          </table>

        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
};

export const orderConfirmationTemplate = (order: any) => {
  const USD_TO_PKR = 280;
  const priceInPKR = order.totalPrice * USD_TO_PKR;

  const orange500 = "#f97316"; 
  const slate900 = "#0f172a"; 
  const slate50 = "#f8fafc"; 

  const items = order.items
    .map(
      (item: any) => `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 12px 0; color: ${slate900}; font-size: 14px; font-weight: 600;">
          ${item.food.name}
        </td>
        <td align="right" style="padding: 12px 0; color: #64748b; font-size: 14px;">
          x${item.quantity}
        </td>
      </tr>`,
    )
    .join("");

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Order Confirmed - FoodHub</title>
  </head>
  <body style="margin:0; padding:0; background-color:#ffffff; font-family: 'Inter', system-ui, sans-serif;">
    <table align="center" width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
      <tr>
        <td align="center">
          
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
            <tr>
              <td align="center">
                <div style="font-size: 28px; font-weight: 900; letter-spacing: -1.5px; color: ${slate900};">
                  Food<span style="color: ${orange500};">Hub</span>
                </div>
              </td>
            </tr>
          </table>

          <table width="550" cellpadding="0" cellspacing="0" 
            style="background-color: ${slate50}; 
                   border-top: 6px solid ${orange500}; 
                   border-radius: 32px; 
                   padding: 40px; 
                   box-shadow: 0 20px 40px rgba(15, 23, 42, 0.05);
                   border: 1px solid #e2e8f0;">
            
            <tr>
              <td align="center" style="padding-bottom: 20px;">
                <div style="background-color: #f0fdf4; width: 60px; height: 60px; border-radius: 50%; display: inline-block; margin-bottom: 20px;">
                   <span style="font-size: 30px; line-height: 60px;">🎉</span>
                </div>
                <h2 style="color:${slate900}; font-size: 26px; font-weight: 900; margin: 0; letter-spacing: -0.5px;">
                  Order Confirmed!
                </h2>
                <p style="color:#64748b; font-size:14px; margin-top: 8px;">
                  Get ready! Your delicious meal is being prepared.
                </p>
              </td>
            </tr>

            <tr>
              <td style="background-color: #ffffff; border-radius: 20px; padding: 25px; border: 1px solid #e2e8f0;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="color: #94a3b8; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 8px;">
                      Order ID
                    </td>
                  </tr>
                  <tr>
                    <td style="color: ${slate900}; font-size: 14px; font-weight: 700; padding-bottom: 20px; border-bottom: 1px dashed #e2e8f0;">
                      #${order._id}
                    </td>
                  </tr>
                  
                  <tr>
                    <td style="padding-top: 20px;">
                       <table width="100%" cellpadding="0" cellspacing="0">
                          ${items}
                       </table>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding-top: 25px;">
                       <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${slate900}; border-radius: 14px; padding: 15px 20px;">
                          <tr>
                            <td style="color: #94a3b8; font-size: 13px; font-weight: 600;">Total Amount</td>
                            <td align="right" style="color: #ffffff; font-size: 18px; font-weight: 900;">
                               $${order.totalPrice.toFixed(2)}
                            </td>
                          </tr>
                          <tr>
                             <td colspan="2" align="right" style="color: ${orange500}; font-size: 12px; font-weight: 700; padding-top: 4px;">
                                approx. PKR ${priceInPKR.toLocaleString()}
                             </td>
                          </tr>
                       </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td align="center" style="padding-top: 30px;">
                <p style="color:#64748b; font-size:14px; margin: 0;">
                  Thank you for ordering with ❤️
                </p>
              </td>
            </tr>
          </table>

          <table width="550" cellpadding="0" cellspacing="0" style="margin-top: 30px;">
            <tr>
              <td align="center">
                <p style="color:#94a3b8; font-size:12px;">
                  © ${new Date().getFullYear()} <strong>FoodHub</strong>. All rights reserved.
                </p>
              </td>
            </tr>
          </table>

        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
};
