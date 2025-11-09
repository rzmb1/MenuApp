const express = require('express');
const { BadRequest, NotFound } = require('../errors/app-errors');
let { User } = require('./users');
const { validateUser, validatePatchUser } = require('./usersSchema');
const { validateIdEquality } = require('../middleware/validation');
const { handleAsyncError } = require('../errors/error-handler');
const jsonwebtoken = require("jsonwebtoken");
const { createCheckForRolesMiddleware } = require('../middleware/checkForRoles');

let router = express.Router();

router.get('/', createCheckForRolesMiddleware(["chef", "admin"]), handleAsyncError(async (req, res, _next) => {
    let users;
    if (req.query) {
        users = await User.find(req.query);
    } else
        users = await User.find();
    res.status(200).json(users);
}));

router.get('/byAuthenticationHeader', handleAsyncError(async (req, res, _next) => {
    let accessToken = req.headers["authorization"].substring(7);
    let decodedToken = jsonwebtoken.decode(accessToken, {});

    let user = await User.findOne({ oid: decodedToken.oid });
    if(!user) {
        user = new User({oid:decodedToken.oid,lastname:decodedToken.family_name,firstname:decodedToken.given_name,email:decodedToken.upn});
        await user.save();
    }
    res.status(200).json(user);
}));


router.get('/:id', createCheckForRolesMiddleware(["admin"]), handleAsyncError(async (req, res, _next) => {
    let user = await User.findById(req.params.id);
    if (!user)
        throw new NotFound(`user id "${req.params.id}" not found`);
    res.status(200).json(user);
}));

router.post('/', createCheckForRolesMiddleware(["admin"]), handleAsyncError(async (req, res, next) => {
    if (req.body._id) throw new BadRequest("_id must not be specified");
    const validation = validateUser(req.body, 'create');
    if (validation.error) throw new BadRequest(validation.error.message);
    let userWithSameName = await User.findOne({ 'email': req.body.email });
    if (userWithSameName != null) throw new BadRequest(`Email "${req.body.email}" already exists.`);
    let newUser = new User(req.body);
    await newUser.save();
    res.location(req.baseUrl + '/' + newUser._id);
    res.status(201).json(newUser);
}));

router.delete('/:id', createCheckForRolesMiddleware(["admin"]), handleAsyncError(async (req, res, _next) => {
    await User.findByIdAndDelete(req.params.id);
    res.status(204).send();
}));

router.patch('/:id', createCheckForRolesMiddleware(["admin"]), validateIdEquality, handleAsyncError(async (req, res, next) => {
    const validation = validatePatchUser(req.body);
    if (validation.error) {
        throw new BadRequest(validation.error.message);
    }
    let user = await User.findById(req.params.id);
    if (!user)
        throw new NotFound(`user id "${req.params.id}" not found`);
    let userWithSameName = await User.findOne({ 'Email': req.body.email });
    if (userWithSameName != null && userWithSameName._id != req.params.id) throw new BadRequest(`Email "${req.body.email}" already exists.`);
    // Update all parts
    for (let key in req.body) {
        // delete does not work, set field to undefined and it will be deleted
        if (req.body[key] === null)
            user[key] = undefined
        else
            user[key] = req.body[key];
    }
    await user.save();
    res.status(200).json(user);
}));

module.exports = router;