/**
 * 1) User clicks signin or signup button and is redirected to the cognito hosted UI.
 * 2) User completes the signin or registration steps and is redirected back to callbackURL
 * 3) frontend recieves the jwt token and sends it to backend and based on the userid being present in the database or not => either a new user is created or his details are sent.
 */
