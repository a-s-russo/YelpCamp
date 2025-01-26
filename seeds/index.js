import mongoose from "mongoose";
import { Campground } from "../models/campground.js";
import { cities } from "./cities.js";
import { places, descriptors } from "./seedHelpers.js";

const db = mongoose.connection;

mongoose.connect("mongodb://localhost:27017/yelp-camp");

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: `https://picsum.photos/400?random=${Math.random()}`,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin accumsan, urna sit amet scelerisque aliquam, urna neque aliquet sapien, vel rhoncus felis dolor sollicitudin quam. Quisque in purus malesuada, sodales mauris at, pretium tellus. Phasellus gravida ornare imperdiet. Curabitur hendrerit aliquet velit, nec sodales sapien ornare vitae. Vestibulum vitae dui gravida, ultricies leo ac, pretium purus. Cras tempus aliquam arcu, nec pretium dolor scelerisque a. Duis finibus tortor eget odio lacinia, et ullamcorper magna consectetur. Aenean scelerisque tellus libero, in malesuada dui hendrerit eu. Quisque vitae augue eget metus vestibulum imperdiet eu non risus. ",
      price,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
