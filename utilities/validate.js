export const ValidateEmail = (email) => (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
//https://www.w3resource.com/javascript/form/email-validation.php

export const ValidatePhoneNumber = (phoneNumber) => (/^[0-9]{10}$/.test(phoneNumber))


export const ValidatePassword = (password) => (/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#\$%\^&\*])([a-zA-Z0-9!@#\$%\^&\*]{8,})$/.test(password))

    // return result is true or false
    // Contain at least 8 characters
    // contain at least 1 number
    // contain at least 1 special character !@#$%^&*
    // contain at least 1 lowercase character (a-z)
    // contain at least 1 uppercase character (A-Z)
    // contains only 0-9a-zA-Z!@#\$%\^&\*
    //https://stackoverflow.com/questions/14850553/javascript-regex-for-password-containing-at-least-8-characters-1-number-1-uppe
    //https://www.thepolyglotdeveloper.com/2015/05/use-regex-to-test-password-strength-in-javascript/
