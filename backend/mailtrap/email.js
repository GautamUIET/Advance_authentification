import { MailtrapClient } from "mailtrap";
import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailtemplate.js"
import { mailtrapClient,sender } from "./mailtrap.config.js"

export const sendVerificationEmail = async(email,verificationToken) =>{
   const recipient = [{email}];

   try{
    const response = await mailtrapClient.send({
        from: sender,
        to: recipient,
        subject:'Verify your Email',
        html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}",verificationToken),
        category: "Email verification"
    })
    console.log("Email Send Successfully");
   }

   catch(error){
    console.log(`Email sent successfully`,error);
    throw new Error(`Error sending verification Email: ${error}`)

   }
}

export const sendWelcomeEmail = async(email,name) =>{
    const reciepent = [{ email}];

   try{
    const res = await mailtrapClient.send({
        from: sender,
        to: reciepent,
        template_uuid: "b045c101-9d75-456d-8e92-e6a78ebdb79a",
        template_variables :{
        name: name,
        company_info_name : "Auth Company",
        },
    });
    console.log("Welcome Email sent successfully",res);
   }

   catch(error){
        console.error("Error sending email", error)
         throw new Error(`Error sending welcome email : ${email}`)
   }
}

export const sendPasswordResetEmail = async(email,resetURL) =>{
    const reciepent = [{email}];
    try{
        const response = await mailtrapClient.send({
            from: sender,
            to: reciepent,
            subject: "Reset your password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}",resetURL),
            category : "PASSWORD - Reset"
        })
       console.log("Mail send successfuly")
    }
    catch(error){
        console.error("Error sending password reset email", error);
    }
}



export const sendResetSuccessEmail = async (email) => {
	const recipient = [{ email }];

	try {
		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			subject: "Password Reset Successful",
			html: PASSWORD_RESET_SUCCESS_TEMPLATE,
			category: "Password Reset",
		});

		console.log("Password reset email sent successfully", response);
	} catch (error) {
		console.error(`Error sending password reset success email`, error);

		throw new Error(`Error sending password reset success email: ${error}`);
	}
};