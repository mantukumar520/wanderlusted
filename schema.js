const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.string().required(),
    //     image: Joi.object({
    //   url: Joi.string().allow("").required(),
    //   filename: Joi.string().allow("").optional()
    // }).required()
     }).required()//.allow(""),
});


module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),     
    comment: Joi.string().required(),
  }).required()
}).options({ convert: true }); 