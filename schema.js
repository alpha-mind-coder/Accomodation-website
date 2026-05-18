const Joi = require("joi");

// module.exports = {
//   listingschema: Joi.object({

//     listing: Joi.object({
//       title: Joi.string().required(),
//       description: Joi.string().required(),
//       location: Joi.string().required(),
//       country: Joi.string().required(),
//       price: Joi.number().required().min(0),
//       image: Joi.string().allow("", null),
//     }).required()

//   })
// };
// its same as the lower one where in existing module.exports object we are adding listingSchema object we could have done just listing key and would have not used listingSchma key but as we may add more schema validations like reviewSchema UserSchema therefore made a one more outside of it to keep the code clean

module.exports.listingSchema=Joi.object({
  listing:Joi.object({
    title:Joi.string().required(),
    description:Joi.string().required(),
    location:Joi.string().required(),
    country:Joi.string().required(),
    price:Joi.number().required().min(0),
    image:Joi.string().allow("",null),
  }).required()
});

module.exports.reviewSchema=Joi.object({
  review:Joi.object({

    comment:Joi.string().required(),
    rating:Joi.number().required().min(0).max(5),
    
  }).required()
})