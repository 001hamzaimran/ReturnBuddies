// import transporter from "../Email/Email.config.js";
import { sendMail } from "../Email/Email.config.js";

const sendVerificationEmail = async (to, verificationCode) => {
  try {
    await sendMail({ 
      to,
      subject: "Verify your Email - RETURNBUDDIES",
      text: `Thanks for signing up! Please verify your email using this code: ${verificationCode}`,
      html: `
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e9d5ff; overflow: hidden; box-shadow: 0 4px 6px rgba(126, 63, 242, 0.1);">
    <!-- Header -->
    <div style="display: flex; justify-content: center; align-items: center; background: linear-gradient(90deg, #7e3ff2, #9d4edd); padding: 24px;">
        <img src="https://res.cloudinary.com/ds20thyax/image/upload/v1758874309/Logo-White_sjcygz.png" 
          alt="ReturnBuddies" 
          style="width: 250px; height: 35px; margin-right: 8px;" />
    </div>
    
    <!-- Body Content -->
    <div style="padding: 32px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h2 style="font-size: 20px; font-weight: 600; color: #7e3ff2; margin: 0 0 8px 0; font-family: 'Poppins', sans-serif;">Verify Your Email</h2>
      </div>
      
      <p style="color: #374151; text-align: center; margin-bottom: 16px; font-family: 'Poppins', sans-serif;">
        Thanks for signing up! To get started, please verify your email address using the code below:
      </p>
      
      <!-- Extra Charge Details -->
      <div style="background-color: #faf5ff; border: 1px solid #e9d5ff; border-radius: 8px; padding: 16px; margin-bottom: 24px; text-align: center; "> <span style="color: #7e3ff2; font-weight: 600; font-size: 18px; font-family: Arial, sans-serif;">$${verificationCode}</span> </div>
      
      <p style="color: #6b7280; font-size: 14px; text-align: center; margin-bottom: 24px; font-family: 'Poppins', sans-serif;">
        If you didn’t request this, you can safely ignore this email.
      </p>
      
      <div style="border-top: 1px solid #e5e7eb; padding-top: 24px; margin-top: 24px;">
        <p style="color: #6b7280; font-size: 14px; text-align: center; margin-bottom: 16px; font-family: 'Poppins', sans-serif;">
          We're here to help if you need it. Visit our 
          <a href="https://www.returnbuddies.com" style="color: #7e3ff2; text-decoration: none; font-family: 'Poppins', sans-serif;">Website</a> 
          or 
          <a href="https://www.returnbuddies.com/contact" style="color: #7e3ff2; text-decoration: none; font-family: 'Poppins', sans-serif;">Contact us</a>.
        </p>

        <!-- Social Icons -->
        <div style="display: flex; justify-content: center; gap: 12px; margin-top: 16px;">
          <a target="_blank" href="https://www.facebook.com/profile.php?id=61561992180995" style="display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; background-color: #f3f4f6; text-decoration: none;">
            <img src="https://cdn-icons-png.flaticon.com/512/2175/2175193.png" alt="Facebook" style="width:20px; height:20px;" />
          </a>
          <a href="https://www.instagram.com/returnbuddies/" target="_blank" style="display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; background-color: #f3f4f6; text-decoration: none;">
            <img src="https://cdn-icons-png.flaticon.com/512/1384/1384015.png" alt="Instagram" style="width:20px; height:20px;" />
          </a>
          <a href="https://x.com/returnbuddies" target="_blank" style="display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; background-color: #f3f4f6; text-decoration: none;">
            <img src="https://cdn-icons-png.flaticon.com/512/5969/5969020.png" alt="Twitter" style="width:20px; height:20px;" />
          </a>
          <a href="https://www.linkedin.com/company/returnbuddies" target="_blank" style="display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; background-color: #f3f4f6; text-decoration: none;">
            <img src="https://cdn-icons-png.flaticon.com/512/1384/1384014.png" alt="Linkedin" style="width:20px; height:20px;" />
          </a>
        </div>
      </div>
    </div>
    
    <!-- Footer -->
    <div style="background-color: #faf5ff; padding: 16px; text-align: center;">
      <p style="color: #6b7280; font-size: 12px; margin: 0; font-family: 'Poppins', sans-serif;">© ${new Date().getFullYear()} ReturnBuddies. All rights reserved.</p>
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

export default sendVerificationEmail;

const LabelIssueEmail = async (to, labelIssue) => {
  try {
    await sendMail({
      to,
      subject: "Label Issue Report - RETURNBUDDIES",
      text: `Dear user, we detected an issue: ${labelIssue}`,
      html: `
     <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e9d5ff; overflow: hidden; box-shadow: 0 4px 6px rgba(126, 63, 242, 0.1);">
    <!-- Header -->
    <div style="display: flex; justify-content: center; align-items: center; background: linear-gradient(90deg, #7e3ff2, #9d4edd); padding: 24px;">
        <img src="https://res.cloudinary.com/ds20thyax/image/upload/v1758874309/Logo-White_sjcygz.png" 
          alt="ReturnBuddies" 
          style="width: 250px; height: 35px; margin-right: 8px;" />
    </div>
    
    <!-- Body Content -->
    <div style="padding: 32px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h2 style="font-size: 20px; font-weight: 600; color: #7e3ff2; margin: 0 0 8px 0; font-family: 'Poppins', sans-serif;">Label Issue Detected</h2>
      </div>
      
      <p style="color: #374151; text-align: center; margin-bottom: 16px; font-family: 'Poppins', sans-serif;">
        We've identified the following issue with your shipment label:
      </p>
      
      <!-- Extra Charge Details -->
      <div style="background-color: #faf5ff; border: 1px solid #e9d5ff; border-radius: 8px; padding: 16px; margin-bottom: 24px; text-align: center; "> <span style="color: #7e3ff2; font-weight: 600; font-size: 18px; font-family: Arial, sans-serif;">$${labelIssue}</span> </div>
      
      <p style="color: #6b7280; font-size: 14px; text-align: center; margin-bottom: 24px; font-family: 'Poppins', sans-serif;">
        Please review and update the label information at your earliest convenience.
      </p>
      
      <div style="border-top: 1px solid #e5e7eb; padding-top: 24px; margin-top: 24px;">
     <p style="color: #6b7280; font-size: 14px; text-align: center; margin-bottom: 16px; font-family: 'Poppins', sans-serif;">
          We're here to help if you need it. Visit our 
          <a href="https://www.returnbuddies.com" style="color: #7e3ff2; text-decoration: none; font-family: 'Poppins', sans-serif;">Website</a> 
          or 
          <a href="https://www.returnbuddies.com/contact" style="color: #7e3ff2; text-decoration: none; font-family: 'Poppins', sans-serif;">Contact us</a>.
        </p>

        <!-- Social Icons -->
        <div style="display: flex; justify-content: center; gap: 12px; margin-top: 16px;">
          <a target="_blank" href="https://www.facebook.com/profile.php?id=61561992180995" style="display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; background-color: #f3f4f6; text-decoration: none;">
            <img src="https://cdn-icons-png.flaticon.com/512/2175/2175193.png" alt="Facebook" style="width:20px; height:20px;" />
          </a>
          <a href="https://www.instagram.com/returnbuddies/" target="_blank" style="display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; background-color: #f3f4f6; text-decoration: none;">
            <img src="https://cdn-icons-png.flaticon.com/512/1384/1384015.png" alt="Instagram" style="width:20px; height:20px;" />
          </a>
          <a href="https://x.com/returnbuddies" target="_blank" style="display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; background-color: #f3f4f6; text-decoration: none;">
            <img src="https://cdn-icons-png.flaticon.com/512/5969/5969020.png" alt="Twitter" style="width:20px; height:20px;" />
          </a>
          <a href="https://www.linkedin.com/company/returnbuddies" target="_blank" style="display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; background-color: #f3f4f6; text-decoration: none;">
            <img src="https://cdn-icons-png.flaticon.com/512/1384/1384014.png" alt="Linkedin" style="width:20px; height:20px;" />
          </a>
        </div>
      </div>
    </div>
    
    <!-- Footer -->
    <div style="background-color: #faf5ff; padding: 16px; text-align: center;">
      <p style="color: #6b7280; font-size: 12px; margin: 0; font-family: 'Poppins', sans-serif;">© ${new Date().getFullYear()} ReturnBuddies. All rights reserved.</p>
    </div>
  </div>`,
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

const ExtraChargeEmail = async (to, paymentIntent, extraCharge) => {
  try {
    await sendMail({
      to,
      subject: "Extra Charge Notification - RETURNBUDDIES",
      text: `Dear user, an extra charge of $${extraCharge} has been applied to your account.`,
      html: `
     <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e9d5ff; overflow: hidden; box-shadow: 0 4px 6px rgba(126, 63, 242, 0.1);">
    <!-- Header -->
    <div style="display: flex; justify-content: center; align-items: center; background: linear-gradient(90deg, #7e3ff2, #9d4edd); padding: 24px;">
        <img src="https://res.cloudinary.com/ds20thyax/image/upload/v1758874309/Logo-White_sjcygz.png" 
          alt="ReturnBuddies" 
          style="width: 250px; height: 35px; margin-right: 8px;" />
    </div>
    
    <!-- Body Content -->
    <div style="padding: 32px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h2 style="font-size: 20px; font-weight: 600; color: #7e3ff2; margin: 0 0 8px 0; font-family: 'Poppins', sans-serif;">Extra Charge Notification</h2>
      </div>
      
      <p style="color: #374151; text-align: center; margin-bottom: 16px; font-family: 'Poppins', sans-serif;">
       Hello,
      </p>
         <p style="color: #374151; text-align: center; margin-bottom: 16px; font-family: 'Poppins', sans-serif;">
       We wanted to let you know that an extra charge has been applied to your account.
      </p>
      
      <!-- Extra Charge Details -->
      <div style="background-color: #faf5ff; border: 1px solid #e9d5ff; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        
        <!-- Pickup Number -->
        <p style="margin: 8px 0; color: #374151; font-size: 14px; font-family: 'Poppins', sans-serif;">
          <strong>Pickup #:</strong> ${paymentIntent.metadata.pickupId}
        </p>
        
        <!-- Description for charge -->
        <p style="margin: 8px 0; color: #374151; font-size: 14px; font-family: 'Poppins', sans-serif;">
          <strong>Description:</strong> ${paymentIntent.description}
        </p>
        
        <!-- Amount -->
        <p style="margin: 8px 0; color: #7e3ff2; font-size: 18px; font-weight: 600; font-family: 'Poppins', sans-serif;">
          <strong>Amount:</strong> $${extraCharge}
        </p>
      </div>
      
      <p style="color: #6b7280; font-size: 14px; text-align: center; margin-bottom: 24px; font-family: 'Poppins', sans-serif;">
        Please review your account for more details. If you have any questions, reach out to our support team.
      </p>
      
      <div style="border-top: 1px solid #e5e7eb; padding-top: 24px; margin-top: 24px;">
     <p style="color: #6b7280; font-size: 14px; text-align: center; margin-bottom: 16px; font-family: 'Poppins', sans-serif;">
          We're here to help if you need it. Visit our 
          <a href="https://www.returnbuddies.com" style="color: #7e3ff2; text-decoration: none; font-family: 'Poppins', sans-serif;">Website</a> 
          or 
          <a href="https://www.returnbuddies.com/contact" style="color: #7e3ff2; text-decoration: none; font-family: 'Poppins', sans-serif;">Contact us</a>.
        </p>

        <!-- Social Icons -->
        <div style="display: flex; justify-content: center; gap: 12px; margin-top: 16px;">
          <a target="_blank" href="https://www.facebook.com/profile.php?id=61561992180995" style="display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; background-color: #f3f4f6; text-decoration: none;">
            <img src="https://cdn-icons-png.flaticon.com/512/2175/2175193.png" alt="Facebook" style="width:20px; height:20px;" />
          </a>
          <a href="https://www.instagram.com/returnbuddies/" target="_blank" style="display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; background-color: #f3f4f6; text-decoration: none;">
            <img src="https://cdn-icons-png.flaticon.com/512/1384/1384015.png" alt="Instagram" style="width:20px; height:20px;" />
          </a>
          <a href="https://x.com/returnbuddies" target="_blank" style="display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; background-color: #f3f4f6; text-decoration: none;">
            <img src="https://cdn-icons-png.flaticon.com/512/5969/5969020.png" alt="Twitter" style="width:20px; height:20px;" />
          </a>
          <a href="https://www.linkedin.com/company/returnbuddies" target="_blank" style="display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; background-color: #f3f4f6; text-decoration: none;">
            <img src="https://cdn-icons-png.flaticon.com/512/1384/1384014.png" alt="Linkedin" style="width:20px; height:20px;" />
          </a>
        </div>
      </div>
    </div>
    
    <!-- Footer -->
    <div style="background-color: #faf5ff; padding: 16px; text-align: center;">
      <p style="color: #6b7280; font-size: 12px; margin: 0; font-family: 'Poppins', sans-serif;">© ${new Date().getFullYear()} ReturnBuddies. All rights reserved.</p>
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

export { LabelIssueEmail, ExtraChargeEmail };
