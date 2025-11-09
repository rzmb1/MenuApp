const express = require('express');
const { BadRequest, NotFound } = require('../errors/app-errors');
let { Notification } = require('./notifications');
const { validateNotification, validatePatchNotification } = require('./notificationsSchema');
const { validateIdEquality } = require('../middleware/validation');
let { User } = require('../users/users');
const { handleAsyncError } = require('../errors/error-handler');

let router = express.Router();


router.get('/', handleAsyncError(async (req, res, _next) => {
    let notifications;
    if (req.query) {
        notifications = await Notification.find(req.query);
    } else
        notifications = await Notification.find();
    res.status(200).json(notifications);
}));

router.get('/:id', handleAsyncError(async (req, res, _next) => {
    let notification = await Notification.findById(req.params.id);
    if (!notification)
        throw new NotFound(`notification id "${req.params.id}" not found`);
    res.status(200).json(notification);
}));

router.post('/', handleAsyncError(async (req, res, _next) => {
    if (req.body._id) throw new BadRequest("_id must not be specified");
    const { value, error } = validateNotification(req.body, 'create');
    if (error) throw new BadRequest(error.message);
    let user = await User.findById(value._idUser);
    if (!user) throw new BadRequest(`no user width id:${value._idUser} exists`);
    let newNotification = new Notification(value);
    await newNotification.save();
    res.location(req.baseUrl + '/' + newNotification._id);
    res.status(201).json(newNotification);
}));

router.delete('/:id', handleAsyncError(async (req, res, _next) => {
    await Notification.findByIdAndDelete(req.params.id);
    res.status(204).send();
}));

router.patch('/:id', validateIdEquality, handleAsyncError(async (req, res, _next) => {
    const { value, error } = validatePatchNotification(req.body);
    if (error) {
        throw new BadRequest(error.message);
    }
    let notification = await Notification.findById(req.params.id);
    if (!notification) throw new NotFound(`notification id "${req.params.id}" not found`);
    // Update all parts
    for (let key in value) {
        // delete does not work, set field to undefined and it will be deleted
        if (value[key] === null)
            notification[key] = undefined
        else
            notification[key] = value[key];
    }
    await notification.save();
    res.status(200).json(notification);
}));

module.exports = router;