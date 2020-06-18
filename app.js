const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fetch = require("node-fetch");

const app = express();

// Bodyparser Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Static folder
app.use(express.static(path.join(__dirname, "public")));

// Signup Route
app.post("/signup", (req, res) => {
  console.log(req.body);
  const { firstName, lastName, email } = req.body;

  // Make sure fields are filled
  if (!firstName || !lastName || !email) {
    res.redirect("/fail.html");
    return;
  }

  // Construct req data
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const postData = JSON.stringify(data);

  fetch("https://us10.api.mailchimp.com/3.0/lists/5cd10fa4d2", {
    method: "POST",
    headers: {
      Authorization: "auth 7e5a35c9b61a6fe243ad790e7f7c07c9-us10",
    },
    body: postData,
  })
    .then(
      res.statusCode === 200
        ? res.redirect("/success.html")
        : res.redirect("/fail.html")
    )
    .catch((err) => console.log(err));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server started on ${PORT}`));
