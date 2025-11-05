import mongoose from "mongoose";
import dotenv from "dotenv";
import Element from "./models/Element.js";

dotenv.config();

const elements = [
  {
    name: "wc-button",
    framework: "Lit",
    rating: 4.8,
    demoUrl: "/demos/wc-button/index.html",
    docsUrl: "https://lit.dev/",
    description: "Custom button component built with Lit."
  },
  {
    name: "fancy-card",
    framework: "Stencil",
    rating: 4.5,
    demoUrl: "/demos/fancy-card/index.html",
    docsUrl: "https://stenciljs.com/",
    description: "Card component built with Stencil."
  },
  {
    name: "vue-counter",
    framework: "Vue Custom Element",
    rating: 4.0,
    demoUrl: "/demos/vue-counter/index.html",
    docsUrl: "https://vuejs.org/guide/extras/web-components.html",
    description: "Simple Vue counter as a web component."
  }
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Element.deleteMany();
    await Element.insertMany(elements);
    console.log("Database seeded successfully");
    process.exit(0);
  } catch (err) {
    console.error("Error while seeding database:", err.message);
    process.exit(1);
  }
};

seed();
