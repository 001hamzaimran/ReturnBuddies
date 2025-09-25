// import transporter from "../Email/Email.config.js";
import { sendMail } from "../Email/Email.config.js";

const sendVerificationEmail = async (email, verificationCode) => {
  try {
    await sendMail({
      to: email,
      subject: "Verify your Email - RETURNBUDDIES",
      text: `Thanks for signing up! Please verify your email using this code: ${verificationCode}`,
      html: `
     <div class="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden border border-purple-100">
      <!-- Header -->
      <div
        class="bg-gradient-to-r from-purple-600 to-purple-500 px-6 py-4 text-center text-white"
      >
        <div class="flex justify-center mb-2">
          <img src="https://cdn-icons-png.flaticon.com/512/535/535239.png" 
            alt="ReturnBuddies" 
            style="width:25px; height:25px; margin-right: 8px; margin-top: 1px; filter: brightness(0) invert(1);" />
          <h1 class="text-2xl font-semibold text-white">ReturnBuddies</h1>
        </div>
        <p class="text-white text-sm">Your trusted delivery partner</p>
      </div>
      
      <!-- Body Content -->
      <div class="px-6 py-8">
        <div class="text-center mb-6">
          <i class="fas fa-envelope text-purple-500 text-4xl mb-3"></i>
          <h2 class="text-xl font-semibold text-purple-600">Verify Your Email</h2>
        </div>
        
        <p class="text-gray-700 mb-4 text-center">
          Thanks for signing up! To get started, please verify your email address using the code below:
        </p>
        
        <div class="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6 text-center">
          <span class="text-purple-700 font-semibold text-xl tracking-widest">${verificationCode}</span>
        </div>
        
        <p class="text-gray-600 text-sm text-center mb-6">
          If you didn’t request this, you can safely ignore this email.
        </p>
        
        <div class="border-t border-gray-200 pt-6 mt-6">
          <p class="text-gray-600 text-sm text-center mb-4">
            Need help? Visit our website for more info or contact us.
          </p>
          <div class="flex justify-center space-x-4">
            <a href="#" class="text-purple-600 hover:text-purple-800 text-sm">
              <i class="fas fa-globe mr-1"></i> Website
            </a>
            <a href="#" class="text-purple-600 hover:text-purple-800 text-sm">
              <i class="fas fa-phone mr-1"></i> Contact
            </a>
          </div>

          <!-- Social Icons --> 
          <div class="flex space-x-3 mt-4">
            <a href="#" class="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-blue-600 hover:text-white text-gray-700 transition-all duration-300 hover:-translate-y-1">
                <i class="fa-brands fa-facebook-f"></i>
            </a>
            <a href="#" class="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-pink-600 hover:text-white text-gray-700 transition-all duration-300 hover:-translate-y-1">
                <i class="fa-brands fa-instagram"></i>
            </a>
            <a href="#" class="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-blue-400 hover:text-white text-gray-700 transition-all duration-300 hover:-translate-y-1">
                <i class="fa-brands fa-twitter"></i>
            </a>
            <a href="#" class="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-red-600 hover:text-white text-gray-700 transition-all duration-300 hover:-translate-y-1">
                <i class="fa-brands fa-youtube"></i>
            </a>
            <a href="#" class="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-black hover:text-white text-gray-700 transition-all duration-300 hover:-translate-y-1">
                <i class="fa-brands fa-tiktok"></i>
            </a>
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div class="bg-purple-50 px-6 py-4 text-center">
        <p class="text-gray-500 text-xs">© ${new Date().getFullYear()} ReturnBuddies. All rights reserved.</p>
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
     <div class="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden border border-purple-100">
      <!-- Header -->
    <div
    class="bg-gradient-to-r from-purple-600 to-purple-500 px-6 py-4 text-center text-white"
  >
    <div class="flex justify-center mb-2">
      <img src="https://cdn-icons-png.flaticon.com/512/535/535239.png" 
      alt="ReturnBuddies" 
      style="width:25px; height:25px; margin-right: 8px; margin-top: 1px; filter: brightness(0) invert(1);" />
 
      <h1 class="text-2xl font-semibold text-white">ReturnBuddies</h1>
    </div>
    <p class="text-white text-sm">Your trusted delivery partner</p>
  </div>
      
      <!-- Body Content -->
      <div class="px-6 py-8">
          <div class="text-center mb-6">
              <h2 class="text-xl font-semibold text-purple-600">Label Issue Detected</h2>
          </div>
          
          <p class="text-gray-700 mb-4 text-center">
              We've identified the following issue with your shipment label:
          </p>
          
          <div class="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6 text-center">
              <span class="text-purple-700 font-semibold text-lg">${labelIssue}</span>
          </div>
          
          <p class="text-gray-600 text-sm text-center mb-6">
              Please review and update the label information at your earliest convenience.
          </p>
          
          <div class="border-t border-gray-200 pt-6 mt-6">
              <p class="text-gray-600 text-sm text-center mb-4">
                  We're here to help if you need it. Visit our website for more info or contact us.
              </p>
              <div class="flex justify-center space-x-4">
                  <a href="#" class="text-purple-600 hover:text-purple-800 text-sm">
                      <i class="fas fa-globe mr-1"></i> Website
                  </a>
                  <a href="#" class="text-purple-600 hover:text-purple-800 text-sm">
                      <i class="fas fa-phone mr-1"></i> Contact
                  </a>
              </div>

              <!-- Social Icons --> 
              <div class="flex space-x-3 mt-4">
                <a href="#" class="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-blue-600 hover:text-white text-gray-700 transition-all duration-300 hover:-translate-y-1">
                    <i class="fa-brands fa-facebook-f"></i>
                </a>
                <a href="#" class="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-pink-600 hover:text-white text-gray-700 transition-all duration-300 hover:-translate-y-1">
                    <i class="fa-brands fa-instagram"></i>
                </a>
                <a href="#" class="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-blue-400 hover:text-white text-gray-700 transition-all duration-300 hover:-translate-y-1">
                    <i class="fa-brands fa-twitter"></i>
                </a>
                <a href="#" class="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-red-600 hover:text-white text-gray-700 transition-all duration-300 hover:-translate-y-1">
                    <i class="fa-brands fa-youtube"></i>
                </a>
                <a href="#" class="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-black hover:text-white text-gray-700 transition-all duration-300 hover:-translate-y-1">
                    <i class="fa-brands fa-tiktok"></i>
                </a>
            </div>
          </div>
      </div>
      
      <!-- Footer -->
      <div class="bg-purple-50 px-6 py-4 text-center">
          <p class="text-gray-500 text-xs">© ${new Date().getFullYear()} ReturnBuddies. All rights reserved.</p>
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

const ExtraChargeEmail = async (to, extraCharge) => {
  try {
    await sendMail({
      to,
      subject: "Extra Charge Notification - RETURNBUDDIES",
      text: `Dear user, an extra charge of $${extraCharge} has been applied to your account.`,
      html: `
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e9d5ff; overflow: hidden; box-shadow: 0 4px 6px rgba(126, 63, 242, 0.1); font-family: Arial, sans-serif;">
        <!-- Header -->
        <div style="background: linear-gradient(90deg, #7e3ff2, #9d4edd); padding: 24px; text-align: center; color: white; font-family: Arial, sans-serif;">
          <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 8px; font-family: Arial, sans-serif;">
            <img src="https://cdn-icons-png.flaticon.com/512/535/535239.png" 
              alt="ReturnBuddies" 
              style="width: 25px; height: 25px; margin-right: 8px; filter: brightness(0) invert(1); font-family: Arial, sans-serif;" />
            <h1 style="font-size: 24px; font-weight: 600; margin: 0; color: white; font-family: Arial, sans-serif;">ReturnBuddies</h1>
          </div>
          <p style="color: #f0e7ff; font-size: 14px; margin: 0; font-family: Arial, sans-serif;">Your trusted delivery partner</p>
        </div>
        
        <!-- Body Content -->
        <div style="padding: 32px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 24px; font-family: Arial, sans-serif;">
            <h2 style="font-size: 20px; font-weight: 600; color: #7e3ff2; margin: 0 0 8px 0; font-family: Arial, sans-serif;">Extra Charge Notification</h2>
          </div>
          
          <p style="color: #374151; text-align: center; margin-bottom: 16px; font-family: Arial, sans-serif;">
            An extra charge has been applied to your account:
          </p>
          
          <div style="background-color: #faf5ff; border: 1px solid #e9d5ff; border-radius: 8px; padding: 16px; margin-bottom: 24px; text-align: center; font-family: Arial, sans-serif;">
            <span style="color: #7e3ff2; font-weight: 600; font-size: 18px; font-family: Arial, sans-serif;">$${extraCharge}</span>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; text-align: center; margin-bottom: 24px; font-family: Arial, sans-serif;">
            Please review your account for more details. If you have any questions, reach out to our support team.
          </p>
          
          <div style="border-top: 1px solid #e5e7eb; padding-top: 24px; margin-top: 24px; font-family: Arial, sans-serif;">
            <p style="color: #6b7280; font-size: 14px; text-align: center; margin-bottom: 16px; font-family: Arial, sans-serif;">
              We're here to help if you need it. Visit our website for more info or contact us.
            </p>
            <div style="display: flex; justify-content: center; gap: 16px; font-family: Arial, sans-serif;">
              <a href="#" style="color: #7e3ff2; font-size: 14px; text-decoration: none; font-family: Arial, sans-serif;">Website</a>
              <a href="#" style="color: #7e3ff2; font-size: 14px; text-decoration: none; font-family: Arial, sans-serif;">Contact</a>
            </div>

            <!-- Social Icons -->
            <div style="display: flex; justify-content: center; gap: 12px; margin-top: 16px; font-family: Arial, sans-serif;">
              <a href="#" style="display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; background-color: #f3f4f6; color: #374151; text-decoration: none; font-family: Arial, sans-serif;">FB</a>
              <a href="#" style="display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; background-color: #f3f4f6; color: #374151; text-decoration: none; font-family: Arial, sans-serif;">IG</a>
              <a href="#" style="display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; background-color: #f3f4f6; color: #374151; text-decoration: none; font-family: Arial, sans-serif;">TW</a>
              <a href="#" style="display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; background-color: #f3f4f6; color: #374151; text-decoration: none; font-family: Arial, sans-serif;">YT</a>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #faf5ff; padding: 16px; text-align: center; font-family: Arial, sans-serif;">
          <p style="color: #6b7280; font-size: 12px; margin: 0; font-family: Arial, sans-serif;">© ${new Date().getFullYear()} ReturnBuddies. All rights reserved.</p>
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
