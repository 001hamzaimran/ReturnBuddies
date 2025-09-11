
import transporter from "../Email/Email.config.js"


const sendVerficationEmail = async (email, verificationCode) => {


  try {
    await transporter.sendMail({
      from: `"RETURNBUDDIES" <${process.env.Email_Sender}>`,
      to: email,
      subject: "Verify your Email",
      text: "Verify your Email",
      html: `
      <div style="background-color:#f9f7fc; padding: 40px; font-family: Arial, sans-serif; color: #333;">
        <div style="max-width: 600px; margin: auto; background-color: #fff; border-radius: 12px; box-shadow: 0 0 10px rgba(138, 43, 226, 0.2); overflow: hidden;">
          <div style="background: linear-gradient(90deg, #7e3ff2, #9d4edd); padding: 24px 32px; color: white; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Welcome to RETURNBUDDIES</h1>
            <p style="margin: 4px 0 0; font-size: 16px;">Your trusted delivery partner</p>
          </div>
          <div style="padding: 32px;">
            <h2 style="font-size: 20px; color: #7e3ff2;">Verify Your Email</h2>
            <p style="font-size: 16px; line-height: 1.5;">
              Thanks for signing up! To get started, please verify your email address using the code below:
            </p>
            <div style="margin: 24px 0; text-align: center;">
              <span style="display: inline-block; font-size: 28px; font-weight: bold; background: #f3e8ff; color: #7e3ff2; padding: 12px 24px; border-radius: 8px; letter-spacing: 4px;">
                ${verificationCode}
              </span>
            </div>
            <p style="font-size: 14px; color: #666;">
              If you didn't request this, you can safely ignore this email.
            </p>
          </div>
          <div style="background-color: #f3e8ff; padding: 16px 32px; text-align: center; font-size: 12px; color: #555;">
            &copy; ${new Date().getFullYear()} RETURNBUDDIES. All rights reserved.
          </div>
        </div>
      </div>
  `,
    });



    return { success: true };
  } catch (error) {
    console.log("Email error", error);
    return {
      success: false,
      message: "Email not sent",
      error,
    };
  }
};

export default sendVerficationEmail


const LabelIssueEmail = async (email, labelIssue) => {
  try {
    await transporter.sendMail({
      from: `"RETURNBUDDIES" <${process.env.Email_Sender}>`,
      to: email,
      subject: "Label Issue Report - RETURNBUDDIES",
      text: `Dear user, we detected an issue: ${labelIssue}`,
      html: `
      <div style="background-color:#f9f7fc; padding: 40px; font-family: Arial, sans-serif; color: #333;">
        <div style="max-width: 600px; margin: auto; background-color: #fff; border-radius: 12px; box-shadow: 0 0 10px rgba(138, 43, 226, 0.2); overflow: hidden;">
          
          <!-- Header -->
          <div style="background: linear-gradient(90deg, #7e3ff2, #9d4edd); padding: 24px 32px; color: white; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">RETURNBUDDIES</h1>
            <p style="margin: 4px 0 0; font-size: 16px;">Your trusted delivery partner</p>
          </div>
          
          <!-- Body -->
          <div style="padding: 32px;">
            <h2 style="font-size: 20px; color: #7e3ff2;">Label Issue Detected</h2>
            <p style="font-size: 16px; line-height: 1.5;">
              We’ve identified the following issue with your shipment label:
            </p>
            <div style="margin: 24px 0; text-align: center;">
              <span style="display: inline-block; font-size: 18px; font-weight: bold; background: #f3e8ff; color: #7e3ff2; padding: 12px 24px; border-radius: 8px;">
                ${labelIssue}
              </span>
            </div>
            <p style="font-size: 14px; color: #666;">
              Please review and update the label information at your earliest convenience.
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f3e8ff; padding: 16px 32px; text-align: center; font-size: 12px; color: #555;">
            &copy; ${new Date().getFullYear()} RETURNBUDDIES. All rights reserved.
          </div>
        </div>
      </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.log("Email error", error);
    return {
      success: false,
      message: "Email not sent",
      error,
    };
  }
};

const ExtraChargeEmail = async (email, extraCharge) => {
  try {
    await transporter.sendMail({
      from: `"RETURNBUDDIES" <${process.env.Email_Sender}>`,
      to: email,
      subject: "Extra Charge Notification - RETURNBUDDIES",
      text: `Dear user, an extra charge of $${extraCharge} has been applied to your account.`,
      html: `
      <div style="background-color:#f9f7fc; padding: 40px; font-family: Arial, sans-serif; color: #333;">
        <div style="max-width: 600px; margin: auto; background-color: #fff; border-radius: 12px; box-shadow: 0 0 10px rgba(138, 43, 226, 0.2); overflow: hidden;">
          
          <!-- Header -->
          <div style="background: linear-gradient(90deg, #7e3ff2, #9d4edd); padding: 24px 32px; color: white; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">RETURNBUDDIES</h1>
            <p style="margin: 4px 0 0; font-size: 16px;">Your trusted delivery partner</p>
          </div>
          
          <!-- Body -->
          <div style="padding: 32px;">
            <h2 style="font-size: 20px; color: #7e3ff2;">Extra Charge Notification</h2>
            <p style="font-size: 16px; line-height: 1.5;">
              An extra charge of $${extraCharge} has been applied to your account.
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f3e8ff; padding: 16px 32px; text-align: center; font-size: 12px; color: #555;">
            &copy; ${new Date().getFullYear()} RETURNBUDDIES. All rights reserved.
          </div>
        </div>
      </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.log("Email error", error);
    return {
      success: false,
      message: "Email not sent",
      error,
    };
  }
};

export { LabelIssueEmail, ExtraChargeEmail }