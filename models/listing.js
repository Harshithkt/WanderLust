const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    
  },

  description: {
    type: String,
  },
  image: {
  url: {
    type: String,
  },
  filename: String
},
//   image: {
//     type: String,
//     default:"https://unsplash.com/photos/mountains-emerge-from-the-shadows-under-a-dramatic-sky-ISezKSUL2gk",
//     set: (v) => (v === " " ? "https://unsplash.com/photos/mountains-emerge-from-the-shadows-under-a-dramatic-sky-ISezKSUL2gk" : v),
//   },
  price: {
    type: Number,
  },

  location: {
    type: String,
  },
  country: {
    type: String,
  },
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
