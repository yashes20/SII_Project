const { check } = require('express-validator');
 
exports.signupValidation = [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail().normalizeEmail({ gmail_remove_dots: true }),
    check('password', 'Password must be between 6 and 10 characters').isLength({ min: 6 , max: 10})
]

exports.registerValidation = [
    check('fullName', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail().normalizeEmail({ gmail_remove_dots: true }),
    check('password', 'Password must be between 6 and 10 characters').isLength({ min: 6 , max: 10}),
    check('gender', 'Gender is required').not().isEmpty()
]
 
exports.loginValidation = [
     check('email', 'Please include a valid email').isEmail().normalizeEmail({ gmail_remove_dots: true }),
     check('password', 'Password must be between 6 and 10 characters').isLength({ min: 6, max: 10})
 
]

exports.userValidation = [
    check('email', 'Please include a valid email').isEmail().normalizeEmail({ gmail_remove_dots: true }),
    check('password')
    // if the new password is provided...
    .if(check('password', 'Password must be between 6 and 10 characters').exists({checkFalsy: true}))
    .isLength({ min: 6 , max: 10})
]

exports.newTaskValidation = [
    check('name', 'Name is required').not().isEmpty(),
    check('description', 'description is required').not().isEmpty(),
    check('category', 'category is required').not().isEmpty(),
    check('userCreation', 'userCreation is required').not().isEmpty(),
    check('dateAssignment', 'DateAssignment is required').not().isEmpty(),
    check('latitude')
    // if the latitude is provided...
    .if(check('latitude', 'Latitude is invalid').not().isLatLong())
]

exports.updateTaskValidation = [
    check('name', 'Name is required').not().isEmpty(),
    check('description', 'description is required').not().isEmpty(),
    check('category', 'category is required').not().isEmpty(),
    check('userCreation', 'userCreation is required').not().isEmpty(),
    check('dateAssignment', 'DateAssignment is required').not().isEmpty(),
    check('status', 'Status is required').not().isEmpty(),
    check('latitude')
    // if the latitude is provided...
    .if(check('latitude', 'Latitude is invalid').not().isLatLong())
]