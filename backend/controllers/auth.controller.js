import bcryptjs from 'bcryptjs';
import { User } from '../models/user.model.js';
import crypto from 'crypto';
import { generateTokenandSetCookie } from '../utils/generateTokenandSetCookie.js';
import { sendPasswordResetEmail, sendResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from '../mailtrap/email.js';
export const signup = async(req,res) =>{
    try{
       const{email,password,name} = req.body;
       if(!email || !password || !name){
        throw new Error("Please fill all the fields");
       }

       const userExistsalready = await User.findOne({email});

       if(userExistsalready){
        return res.status(400).json({ success:false ,message:"User already Exists"})
       }

       const hashedPasword = await bcryptjs.hash(password,10);
       const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
       const user = new User({
        email,
        password: hashedPasword,
        name,
        verificationToken,
        verificationTokenExpiresAt : Date.now() + 24*60*60*10000,
       })
       await  user.save();
       generateTokenandSetCookie(res,user._id);

       await sendVerificationEmail(user.email,verificationToken);

       res.status(201).json({
        success: "true",
        message : "User created Successfully",
        user:{
        ...user._doc,
        password : undefined
        },
       })
    }
    catch(error){
        return res.send({success:false ,message: error.message})
    }
}
export const verifyEmail = async(req,res) =>{
    try{
    const {code} = req.body;
    const user = await User.findOne({
        verificationToken: code,
        verificationTokenExpiresAt : ({$gt:  Date.now()})
    } 
    )
    if(!user){
        return res.status(400).json({
            success: false,
            message: "Invalid or expired verification code"
        })
    }
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined
        await user.save();

        await sendWelcomeEmail(user.email,user.name);

        res.status(200).json({

            success: "true",
            message : "Email Verified successfuly",
            user : {
                ...user._doc,
                password: undefined,
            }

        })
    }
    catch(error){
        return res.status(400).json({
            success: false,
            message: "Enter Valid code"
        })
    }

}


export const login = async(req,res) =>{
    try{
   const {email,password} = req.body;
   const user = await User.findOne({email});

   if(!user){
     return res.send({success:false ,message: "invalid-crediantials"})
   }

   const pass = await bcryptjs.compare(password,user.password)
   if(!pass){
      return res.send({success:false ,message: "wrong-password"})
   }

   generateTokenandSetCookie(res,user._id);

   user.lastLogin = new Date();

   await user.save();
       res.status(201).json({
        success: "true",
        message : "Login Successfully",
        user:{
        ...user._doc,
        password : undefined
        },
       })

    }

    catch(error){
        return res.send({success:false ,message: error.message})
    }


}

export const logout = async(req,res) =>{
    res.clearCookie("token");
    res.status(200).json({
            success: "true",
            message : "Logout Successfully",
    })

}


export const forgotPassword = async (req, res) => {
	const { email } = req.body;
	try {
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		// Generate reset token
		const resetToken = crypto.randomBytes(20).toString("hex");
		const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

		user.resetPasswordToken = resetToken;
		user.resetPasswordExpiresAt = resetTokenExpiresAt;

		await user.save();

		// send email
		await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

		res.status(200).json({ success: true, message: "Password reset link sent to your email" });
	} catch (error) {
		console.log("Error in forgotPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};


export const resetPassword = async (req, res) => {
	try {
		const { token } = req.params;
		const { password } = req.body;

		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpiresAt: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
		}

		
		const hashedPassword = await bcryptjs.hash(password, 10);

		user.password = hashedPassword;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpiresAt = undefined;
        
		await user.save();

		await sendResetSuccessEmail(user.email);

		res.status(200).json({ success: true, message: "Password reset successful" });
	} catch (error) {
		console.log("Error in resetPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};


export const checkAuth = async (req, res) => {
	try {
		const user = await User.findById(req.userId).select("-password");
		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		res.status(200).json({ success: true, user });
         
	} catch (error) {
		console.log("Error in checkAuth ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};