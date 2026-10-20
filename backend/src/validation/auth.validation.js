import {body,oneOf,validationResult} from 'express-validator'

export const registerUserRules=[
    body("username")
    .trim()
    .isLength({min:3})
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain alphanumeric characters and underscores.'),

    body("email")
    .trim().isEmail().withMessage('Please provide a valid email address.')
    .normalizeEmail(),

    body("mobile")
    .trim()
    .isLength({min:10,max:10}).withMessage('must be 10 length'),

    body('password')
    .isLength({ min: 8 ,max:30}).withMessage('Password must be at least 8 characters long.')
    .matches(/\d/).withMessage('Password must contain at least one number.')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter.')
];

export const loginUserRules=[
    oneOf([
        body('email').trim()
        .isEmail().withMessage('provide valid email')
        .normalizeEmail(),

        body('username').trim()
        .isLength({min:3}).withMessage("minimum 3 character")
        .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain alphanumeric characters and underscores.')

    ]),
    body('password').trim()
    .isLength({min:8,max:30}).withMessage('Password must be at least 8 characters long.')
    .matches(/\d/).withMessage('Password must contain at least one number.')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter.')
];

export const forgetPasswordRules=[
    body('email').trim()
    .isEmail().withMessage('provide valid email')
    .normalizeEmail(),

    body("mobile")
    .trim()
    .isLength({min:10,max:10}).withMessage("must be 10 length"),

    body('password')
    .isLength({ min: 8 ,max:30}).withMessage('Password must be at least 8 characters long.')
    .matches(/\d/).withMessage('Password must contain at least one number.')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter.'),

    body('confirmPassword')
    .isLength({ min: 8 ,max:30}).withMessage('Password must be at least 8 characters long.')
    .matches(/\d/).withMessage('Password must contain at least one number.')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter.')
]

const handleValidationError=(req,res,next)=>{
    const error=validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({errors:error.array()});
    }
    next();
}

export default handleValidationError

