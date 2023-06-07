import sgMail from '@sendgrid/mail'
let api = process.env.SEND_GRID_API_KEY

// const api = "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"
console.log(api);

sgMail.setApiKey(api)


export const sendMail = async (name, email, password) => {
    try {
        console.log(email, password);
        const msg = {
            to: email, // Change to your recipient
            from: 'mystartuptv.india@gmail.com', // Change to your verified sender
            subject: 'Your New Password',
            // text: 'and easy to do anywhere, even with Node.js',
            text: 'Your current password below',
            html: `
            <div>
               <h2> Hi ${name}</h2>
               <br/>

               <h4>Your Current Password is : ${password}</h4>

               <p>
                go to website  change your password 
               </p>

               <br/>


            </div>
            `,
        }
        const resp = await sgMail.send(msg)
        console.log(resp);

        return true;

    } catch (error) {
        return false
    }
}