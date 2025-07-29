const express = require("express");
const app = express();
const port = 8080;
const wrapAsync = require('./utils/wrapAsync');
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const { wrap } = require("module");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", engine);
app.use(express.static("public"));



main()
  .then((res) => {
    console.log("connection done");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

app.get("/", (req, res) => {
  res.send("connections doneS!");
});

app.get("/testListing", (req, res) => {
  let newListing = new Listing({
    title: "New home in Tmkr",
    description: "its very well furnished with fully loaded docs",
    price: 1200,
    location: "Tmkur",
    country: "India",
  });

  newListing.save().then((res) => {
    console.log(res);
  });

  res.send("working!!!");
});

app.get("/listings", wrapAsync( async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}));

app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

app.get("/listings/:id", wrapAsync( async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  res.render("listings/show.ejs", { data: [listing] });
}));

// app.post("/listings",async (req,res)=>{
//     let x = req.body;

//     console.log(x);
//     let newListing = new Listing({
//         title:x.title,
//         description:x.description,
//         price:x.price,
//         image:x.image,
//         location:x.location,
//         country:x.country
//     })

//       newListing.save()
//       .then((res)=>{
//          console.log(res);
//      })
//     res.redirect("/listings");
// })
app.post("/listings",wrapAsync( async (req, res,next) => {

    let x = req.body;

    let newListing = new Listing({
      title: x.title,
      description: x.description,
      price: x.price,
      image: x.image,
      location: x.location,
      country: x.country,
    });

    await newListing.save();
    res.redirect("/listings");
  
  }
));

app.get("/listings/:id/edit", wrapAsync( async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
}));

app.put("/listings/:id", wrapAsync( async (req, res) => {
  let { id } = req.params;
  let updateData = req.body;

  console.log(updateData)
  await Listing.findByIdAndUpdate(id, updateData);
  res.redirect(`/listings/${id}`);
}));

app.delete("/listings/:id",wrapAsync (async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
}));

app.use((err,req,res,next)=>{
  res.send("Something went wrong");
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});