const getWelcomeEmailHTML = (userName) => {
    const frontendUrl = process.env.FRONTEND_URL || 'https://rely-tailors.vercel.app';

    return `
    <!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Rely Tailors!</title>

        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Marcellus&display=swap" rel="stylesheet">

        <style>
            /* Basic styles */
            body {
                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                -webkit-font-smoothing: antialiased;
                margin: 0;
                padding: 0;
                background-color: #f4f7f6;
            }

            /* Responsive styles for mobile */
            @media screen and (max-width: 600px) {
                .container {
                    width: 100% !important;
                }

                .feature-col {
                    display: block !important;
                    width: 100% !important;
                    padding: 20px 0 !important;
                }

                .header-title {
                    font-size: 28px !important;
                }
            }
        </style>
    </head>

    <body style="margin: 0; padding: 0; background-color: #f4f7f6;">
        <div
            style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
            A special welcome offer awaits you. Let's begin your style journey.
        </div>

        <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
                <td style="padding: 20px 0;">
                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" class="container"
                        style="border-collapse: collapse; background-color: #ffffff; border: 1px solid #e0e0e0;">
                        <tr>
                            <td align="center" style="padding: 40px 0 30px 0; background-color: #ffffff;">
                                <h1 class="header-title"
                                    style="font-family: 'Marcellus', serif; font-size: 36px; font-weight: normal; letter-spacing: 1px; color: #1a2a40; margin: 0;">
                                    Rely Tailors
                                </h1>
                                <p
                                    style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; color: #b58500; margin: 5px 0 0 0; letter-spacing: 1px;">
                                    CUSTOM TAILORING
                                </p>
                            </td>
                        </tr>

                        <tr>
                            <td style="padding: 20px 30px 20px 30px; text-align: center; border-top: 1px solid #e0e0e0;">
                                <h2
                                    style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 28px; font-weight: 300; margin: 0; color: #1a2a40;">
                                    Welcome, ${userName}!</h2>
                                <p
                                    style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 1.6; margin: 15px 0 0 0; color: #555555;">
                                    We're honored to have you with us. At Rely Tailors, we believe that true style comes
                                    from a perfect fit. Get ready to experience clothing that is crafted exclusively for
                                    you.
                                </p>
                            </td>
                        </tr>

                        <tr>
                            <td style="padding: 20px 30px;">
                                <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%"
                                    style="background-color: #f9f9f9; border: 1px solid #e8e8e8; border-radius: 8px;">
                                    <tr>
                                        <td
                                            style="padding: 30px; text-align: center; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
                                            <p style="font-size: 16px; margin: 0; color: #555555;">As a token of our
                                                appreciation, enjoy</p>
                                            <p style="font-size: 32px; font-weight: bold; margin: 10px 0; color: #b58500;">
                                                15% OFF YOUR FIRST ORDER</p>
                                            <p style="font-size: 16px; margin: 10px 0 20px 0; color: #555555;">Use this code
                                                at checkout:</p>
                                            <p
                                                style="font-family: monospace; font-size: 22px; font-weight: bold; letter-spacing: 3px; background-color: #ffffff; border: 2px dashed #cccccc; padding: 12px 25px; display: inline-block; margin: 0; border-radius: 5px; color: #1a2a40;">
                                                WELCOME15
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <tr>
                            <td align="center" style="padding: 20px 30px 40px 30px;">
                                <table border="0" cellspacing="0" cellpadding="0">
                                    <tr>
                                        <td align="center" style="border-radius: 5px;" bgcolor="#1a2a40">
                                            <a href="${frontendUrl}" target="_blank"
                                                style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: bold; color: #ffffff; text-decoration: none; border-radius: 5px; padding: 15px 35px; border: 1px solid #1a2a40; display: inline-block;">
                                                Start Your Style Journey
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <tr>
                            <td style="padding: 0 15px 30px 15px; background-color: #ffffff;">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                        <td align="center" width="33.33%" class="feature-col" style="padding: 20px 10px;">
                                            <p
                                                style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 15px; font-weight: bold; color: #1a2a40; margin:0; border-top: 3px solid #b58500; padding-top: 15px;">
                                                Bespoke Fits</p>
                                        </td>
                                        <td align="center" width="33.33%" class="feature-col" style="padding: 20px 10px;">
                                            <p
                                                style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 15px; font-weight: bold; color: #1a2a40; margin:0; border-top: 3px solid #b58500; padding-top: 15px;">
                                                Premium Fabrics</p>
                                        </td>
                                        <td align="center" width="33.33%" class="feature-col" style="padding: 20px 10px;">
                                            <p
                                                style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 15px; font-weight: bold; color: #1a2a40; margin:0; border-top: 3px solid #b58500; padding-top: 15px;">
                                                Expert Craftsmanship</p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <tr>
                            <td bgcolor="#1a2a40"
                                style="padding: 30px; text-align: center; color: #ffffff; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
                                <p style="margin: 0 0 15px 0; font-size: 14px;">Follow us for style inspiration</p>
                                <p style="font-size: 14px; margin: 0 0 20px 0;">
                                    <a href="https://www.instagram.com/reliance_tailor_s?igsh=c3JsZWtxY25jM3Zr" style="color: #ffffff; text-decoration: none; margin: 0 8px;">Instagram</a>
                                    &nbsp;|&nbsp;
                                    <a href="#" style="color: #ffffff; text-decoration: none; margin: 0 8px;">Facebook</a>
                                    &nbsp;|&nbsp;
                                    <a href="#" style="color: #ffffff; text-decoration: none; margin: 0 8px;">Twitter</a>
                                </p>
                                <p style="margin: 20px 0 0 0; font-size: 12px; color: #aaaaaa; line-height: 1.5;">
                                    You received this email because you signed up on our website.
                                    <br>
                                    Rely Tailors | Dhanbad, Style City, 12345
                                    <br><br>
                                    <a href="#" style="color: #aaaaaa; text-decoration: underline;">Unsubscribe</a> | <a
                                        href="#" style="color: #aaaaaa; text-decoration: underline;">Privacy Policy</a>
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

const getOrderConfirmationHTML = (userName, order) => {
    const itemsHTML = order.orderItems.map(item => `
    <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
        <strong>${item.name}</strong><br>
        <span>Price: ₹${item.price.toFixed(2)}</span>
    </div>
  `).join('');

    return `
    <h1>Thank you for your order, ${userName}!</h1>
    <p>We've received your order #${order._id} and will begin processing it shortly.</p>
    <h2>Order Summary:</h2>
    ${itemsHTML}
    <div style="padding: 10px 0; font-size: 1.2em;">
        <strong>Total: ₹${order.totalPrice.toFixed(2)}</strong>
    </div>
    <p>You will be notified once your order status is updated.</p>
    <p>Thanks for shopping with Rely Tailors!</p>
  `;
};

const getOrderStatusUpdateHTML = (userName, order) => {
    return `
    <h1>Hi ${userName},</h1>
    <p>We have an update on your order #${order._id}.</p>
    <p>The status is now: <strong>${order.orderStatus}</strong></p>
    <p>We will notify you again with any further updates.</p>
    <p>Thanks for shopping with Rely Tailors!</p>
  `;
};

module.exports = {
    getWelcomeEmailHTML,
    getOrderConfirmationHTML,
    getOrderStatusUpdateHTML
};