const { isEmpty } = require("lodash");
const { v4 } = require("uuid");
const db = require("../../connectors/db");
const roles = require("../../constants/roles");
module.exports = function (app) {
app.post("/api/v1/user", async function (req, res) {

    // Check if user already exists in the system
    const userExists = await db
      .select("*")
      .from("naturalux.users")
      .where("email", req.body.email);
    if (!isEmpty(userExists)) {
      return res.status(400).json("user exists");
    }

    const newUser = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: req.body.password,
      roleid: roles.user,
    };
    try {
      const user = await db("naturalux.users").insert(newUser).returning("*");

      return res.status(200).json(user );
    } catch (e) {
      console.log(e.message);
      return res.status(400).send("Could not register user");
    }
  });

  // Register HTTP endpoint to create new user
  // login code <<farah>>
 app.post("/api/v1/user/login", async function (req, res) {
  // Get user credentials from the JSON body
  const { email, password } = req.body;

  if (!email || !password) {
    // If email or password is missing, return an HTTP bad request code
    return res.status(400).send("Email and password are required");
  }

  // Validate the provided password against the password in the database
  const user = await db
    .select("*")
    .from("naturalux.users")
    .where("email", email)
    .first();

  if (!user) {
    // If the user doesn't exist, return a user-not-found response
    return res.status(400).send("User does not exist");
  }

  // Check if the password matches (consider using a secure password hashing library)
  if (user.password !== password) {
    // If the password is incorrect, return an unauthorized response
    return res.status(401).send("Password does not match");
  }

  // Set the expiry time as 15 minutes after the current time
  const token = v4();
  const currentDateTime = new Date();
  const expiresat = new Date(+currentDateTime + 9000000000); // expire in 15 minutes

  // Create a session containing information about the user and expiry time
  const session = {
    userid: user.id,
    token,
    expiresat,
  };

  try {
    await db("naturalux.sessions").insert(session);

    // In the response, set a cookie on the client with the name "session_token"
    // and the value as the UUID generated. Also set the expiration time.
    return res
      .cookie("session_token", token, { expires: expiresat })
      .status(200)
      .send("Login successful");
  } catch (e) {
    console.error(e);
    return res.status(500).send("Could not log in the user");
  }
});



   

}
