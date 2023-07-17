//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser: true});
const itemsSchema = {
  name: String
};
//it  is a schema created

const Item = mongoose.model("Item", itemsSchema);
//it is a model created with the help of schema

const item1 = new Item({
  name: "Welcome to your todolist!"

});

const item2 = new Item({
  name: "Hit the + button to add a new item"

});

const item3 = new Item({
  name: "<--Hit this to delete the item"

});

const defaultItems = [item1, item2, item3];


app.get("/", function (req, res) {

  Item.find()
    .then(function (foundItems) {
      if (foundItems.length === 0) {

        Item.insertMany(defaultItems).then(function () {
          console.log("successfully save the data to db");
        })
          .catch(function (err) {
            console.log(err)
          });
        // res.redirect("/");
      } else {
        res.render("list", { listTitle: "Today", newListItems: foundItems });
      }

    })
    .catch(function (err) {
      console.log(err);
    })
}

)
app.post("/", function (req, res) {

  const itemName = req.body.newItem;
  const item = new Item({
    name: itemName
  });

  item.save();
  res.redirect("/");

});

app.post("/delete", function (req, res) {
  const checkItemId = (req.body.checkbox).trim();
  // console.log(req.body.checkbox);

  Item.findByIdAndRemove(checkItemId).then(function () {
    console.log("successfully deleted");
    res.redirect("/");
  })
    .catch(function (err) {
      console.log(err)
    })
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
