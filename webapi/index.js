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

app.post("/movies", async (req, res) => {
  if (!req.query.title || !req.query.date || !req.query.points)
    return res.json({
      Error: `Undefned title, date and points`,
    });
  const movie = await Movies.create({
    title: req.query.title,
    releaseDate: req.query.date,
    image:
      req.query.image ||
      "https://wallpapers.com/images/high/grey-white-gradient-vertical-cover-36b0dza0un01a5ss.jpg",
    points: req.query.points,
  });
  res.json({ message: `Sucessfully created movie ${req.query.title}`, movie });
});

app.delete("/movies", async (req, res) => {
  let s_movie = await Movies.findOne({ where: { id: req.query.id || -1 } });
  if (!s_movie)
    return res.json({
      Error: `Not found movie with id: ${req.query.id || "underfined"}`,
    });

  const movie = await Movies.destroy({
    where: {
      id: req.query.id,
    },
    force: true,
  });
  res.json({ message: `Sucessfully deleted movie ${req.query.id}`, movie });
});

app.put("/movies", async (req, res) => {
  let s_movie = await Movies.findOne({ where: { id: req.query.id || -1 } });
  if (!s_movie)
    return res.json({
      Error: `Not found movie with id: ${req.query.id || "underfined"}`,
    });
  const movie = await Movies.update(
    {
      title: req.query.title || s_movie.title,
      releaseDate: req.query.date || s_movie.date,
      image: req.query.image || s_movie.image,
      points: req.query.points || s_movie.points,
    },
    {
      where: {
        id: req.query.id,
      },
    }
  );
  res.json({
    message: `Sucessfully updated movie ${req.query.id}`,
    movie: await Movies.findOne({ where: { id: req.query.id } }),
  });
});

app.get("/movies", async (req, res) => {
  const movies = await Movies.findAll();
  res.json(movies);
});

app.listen(5555);
