const express = require('express');
const { BadRequest, NotFound } = require('../errors/app-errors');
let { Image } = require('./image');
const { validateImage, validatePatchImage } = require('./imageSchema');
const { validateIdEquality } = require('../middleware/validation');
const { handleAsyncError } = require('../errors/error-handler');
const { createCheckForRolesMiddleware } = require('../middleware/checkForRoles');

let router = express.Router();

router.get('/', handleAsyncError(async (req, res, _next) => {
    let images;
    if (req.query) {
        images = await Image.find(req.query);
    } else
        images = await Image.find();
    res.status(200).json(images);
}));

router.get('/:id', handleAsyncError(async (req, res, _next) => {
    let image = await Image.findById(req.params.id);
    if (!image)
        throw new NotFound(`image id "${req.params.id}" not found`);
    res.status(200).json(image);
}));

router.post('/', createCheckForRolesMiddleware(["chef", "admin"]), handleAsyncError(async (req, res, _next) => {
    if (req.body._id) throw new BadRequest("_id must not be specified");
        const validation = validateImage(req.body, 'create');
        if (validation.error) throw new BadRequest(validation.error.message);
        let newImage = new Image(req.body);
        await newImage.save();
        res.location(req.baseUrl + '/' + newImage._id);
        res.status(201).json(newImage);
}));

router.delete('/:id', createCheckForRolesMiddleware(["admin"]), handleAsyncError(async (req, res, _next) => {
    await Image.findByIdAndDelete(req.params.id);
    res.status(204).send();
}));

router.patch('/:id', createCheckForRolesMiddleware(["admin"]), validateIdEquality,handleAsyncError(async (req, res, next) => {
    const validation = validatePatchImage(req.body);
        if (validation.error) {
            throw new BadRequest(validation.error.message);
        }
        let image = await Image.findById(req.params.id);
        if (!image) throw new NotFound(`image id "${req.params.id}" not found`);
        // Update all parts
        for (let key in validation.value) {
            // delete does not work, set field to undefined and it will be deleted
            if (validation.value[key] === null)
                image[key] = undefined
            else
                image[key] = validation.value[key];
        }
        await image.save();
        res.status(200).json(image);
}));

module.exports = router;