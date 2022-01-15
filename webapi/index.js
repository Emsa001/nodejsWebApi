const express = require("express");
const cors = require("cors");
const { Sequelize, Model, DataTypes } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "mysql",
  host: "localhost",
  username: "root",
  password: "",
  database: "movies",
});

class Movies extends Model {}
Movies.init(
  {
    title: DataTypes.STRING,
    releaseDate: DataTypes.STRING,
    image: DataTypes.STRING,
    points: DataTypes.DOUBLE,
  },
  { sequelize, modelName: "movies" }
);

async function init_database() {
  await sequelize.authenticate();
  await sequelize.sync();

  console.log("connected to database");
}

init_database().catch((error) => console.log(error));

const app = express();

app.use(cors());

/*app.get("/create-movie", async (req, res) => {
  const movie = await Movies.create({
    title: `Movie 1`,
    releaseDate: "19.05.2005",
    image:
      "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTfyoVPjY_kCTpEDw7oUySjrgBP25iiC0DxfICJ5VH4SkuVlWHI",
    points: 7.6,
  });
  res.json(movie);
});*/

app.get("/", async (req, res) => {
  const movies = await Movies.findAll();
  res.json(movies);
});
app.listen(5555);
