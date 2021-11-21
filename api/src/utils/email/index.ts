import nodemailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';

/**
 * Activate less secure app access
 * https://myaccount.google.com/lesssecureapps?pli=1&rapt=AEjHL4NHNkDMb6lRSCEyVlMjepDPgIPAnasrh4lNZKMM7UgB8OyKpnltOwH_tDDpR3vMfRb8vKPYTyIiv-muM0E3cNzZDf0vmw
 */
/**
 *
 * @param email
 * @param token
 * @returns boolean
 */
const sendMail = (email: string, token: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
      user: process.env.GMAIL,
      pass: process.env.GMAILPASS,
    },
  });

  let mailOptions = {
    from: process.env.GMAIL,
    to: email,
    subject: 'Account confirmation',
    text: 'Please confirm your email',
    html: `
			<table align="center" style="font-family: Arial, Helvetica, sans-serif; text-align:center; border-collapse:separate; border-radius:25px; width:600;" >
				<tr>
					<td bgcolor="#F64D08;" style="padding: 3em; color: #ffffff;border: solid 1px #ffffff; border-radius: 1rem;" >
						<h1>Hello <b>${email} welcome to  Matcha</b></h1>
						<h3 style="font-style: oblique;">You were registered successfully!</h3>
						<h3 style="font-style: oblique;">Please click the link bellow to confirm your account!</h3>
						<a style="text-decoration: none; color: #04db1a;" href="http://localhost:3000/account-activate?token=${token}">Confirm account!</a>
						<p>Matcha &#169; 2021 by&nbsp;<span style="text-decoration: underline; color: #81f753;" >esouza</span>&nbsp;&amp;&nbsp;<span style="text-decoration: underline; color: #81f753;" >jyeo</span>&nbsp;All Rights Reserved.</p>
					</td>
				</tr>
			</table>
		`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return false;
    }
    return true;
  });
  return false;
};

const sendResetPasswordMailToken = (
  name: string,
  email: string,
  token: string
) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
      user: process.env.GMAIL,
      pass: process.env.GMAILPASS,
    },
  });

  let mailOptions = {
    from: process.env.GMAIL,
    to: email,
    subject: 'Reset password',
    text: 'Please confirm your request',
    html: `
			<table align="center" style="font-family: Arial, Helvetica, sans-serif; text-align:center; border-collapse:separate; border-radius:25px; width:600;" >
				<tr>
					<td bgcolor="#fd297b" style="padding: 3em; color: #ffffff;border: solid 1px #ffffff; border-radius: 1rem;" >
						<h1>Hello <b>${name}</b></h1>
						<h3 style="font-style: oblique;">We received a reset password request to the account linked to this email</h3>
            <h3 font-style: oblique;>If you didn't request this, you should look into what happened.</h3>
						<h3 style="font-style: oblique;">Please click the link bellow to confirm your new password.</h3>
            <a style="text-decoration: none; color: #dadd0a;" href="http://localhost:3000/account-activate?token=${token}">Confirm request!</a>
            <p>Matcha &#169; 2021 by&nbsp;<span style="text-decoration: underline; color: #81f753;" >esouza</span>&nbsp;&amp;&nbsp;<span style="text-decoration: underline; color: #81f753;" >jyeo</span>&nbsp;All Rights Reserved.</p>
					</td>
				</tr>
			</table>
		`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return false;
    }
    return true;
  });
  return false;
};

export { sendMail, sendResetPasswordMailToken };
