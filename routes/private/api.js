const { isEmpty, times } = require("lodash");
const { v4 } = require("uuid");
const db = require("../../connectors/db");
const roles = require("../../constants/roles");
const { getSessionToken } = require("../../utils/session");

const getUser = async function (req) {
  const sessionToken = getSessionToken(req);
  if (!sessionToken) {
    return res.status(301).redirect("/");
  }
  console.log("hi", sessionToken);

  const user = await db.select("*").from("naturalux.sessions").where("token", sessionToken).innerJoin("naturalux.users", "naturalux.sessions.userid", "naturalux.users.id").innerJoin("naturalux.roles", "naturalux.users.roleid", "naturalux.roles.id").first();
    console.log("haaa",user)
  

  // Define properties on the user object based on their role
  user.isNormal = user.roleid === roles.user;
  user.isAdmin = user.roleid === roles.admin;

  // console.log("user =>", user);
  return user;
};

module.exports = { getUser };

module.exports = function (app) {
  // example
  app.get("/users", async function (req, res) {
    try {
       const user = await getUser(req);
      const users = await db.select('*').from("naturalux.users")
        
      return res.status(200).json(users);
    } catch (e) {
      console.log(e.message);
      return res.status(400).send("Could not get users");
    }
   
  });
  //reset password <<farah>> , need to send an email for reset password
  app.put("/api/v1/password/reset", async function (req, res) {
    try {
      const { newPassword } = req.body;
      const user = await getUser(req);
      const useridn = user.userid;

      await db("naturalux.users")
        .where("id", useridn)
        .update({ password: newPassword });
      return res.status(200).send("Password reset successfully");
    } catch (e) {
      console.log(e.message);
      return res.status(400).send("Could not reset password");
    }
  });
  
  //show skincare products<<farah>>
  app.get("/api/v1/skincare", async function (req, res) {
    try {
      const skincareproducts = await db.select("*").from("naturalux.products").where("type", "skin care");
      return res.status(200).json({skincareproducts});

    } catch (e) {
      console.log(e.message);
      return res.status(400).send("error showing skincare products");
    }
  });
  //show bodycare products<<farah>>
  app.get("/api/v1/bodycare", async function (req, res) {
    try {
      const bodycareproducts = await db.select("*").from("naturalux.products").where("type", "body care");
      return res.status(200).json(bodycareproducts);

    } catch (e) {
      console.log(e.message);
      return res.status(400).send("error showing bodycare products");
    }
  });
//view a product <<farah>>
 app.get("/api/v1/products/:productid", async function (req, res) {
    try {
      const {productid} = req.params;
      const product = await db("naturalux.products").select('*').where({ id: productid});
      return res.status(200).json(product);


    } catch (e) {
      console.log(e.message);
      return res.status(400).send("error showing this product");
    }
  });
  //view all user's order
  app.get("/api/v1/orders/:userid", async function (req, res) {
    try {
      const {userid} = req.params;
      const orders = await db.select("*").from("naturalux.orders").where({userid : userid});
      return res.status(200).json(orders);

    } catch (e) {
      console.log(e.message);
      return res.status(400).send("cannot show user's orders");
    }
  });
  //admin<<farah>>
  //create new prodct 
  app.post("/api/v1/createproducts", async function (req, res) {
    const user = await getUser(req);
    const newproduct = {
      name: req.body.name,
      type: req.body.type,
      description: req.body.description,
      price: req.body.price,
      quantity: req.body.quantity,
    };
    
    if (user.isAdmin) {
      try {
        const [product] = await db("naturalux.products").insert(newproduct).returning("*");
        return res.status(200).send("product created successfully");
      } catch (e) {
        console.error(e.message);
        return res.status(400).send("Product could not be created.");
      }
    } else {
      return res.status(403).send("Please confirm you are an admin to create a product.");
    }
  });
  

  //delete product
  app.delete("/api/v1/deleteproduct/:productid", async function (req, res) {
    const user = await getUser(req);
    const {productid} = req.params;
    if (user.isAdmin) {
      try {
    await db("naturalux.products").where({id : productid}).del();
    return res.status(200).send("product deleted successfully");
      }
      catch(e){
        console.log(e.message);
        return res.status(400).send("product is not deleted");
      }
    }
    else{
      return res.status(400).send("please confirm you are an admin to delete product!");
    }
  });
  
  //edit order status
  //hal ha3ml haga momiza when the order is accepted/deleted wel kalam da ??
  app.put("/api/v1/editordersstatus/:orderid", async function (req, res) {
    const user = await getUser(req);
    const {orderid} = req.params;
    const {orderstatus} = req.body;
    if (user.isAdmin) {
      try {
        await db("naturalux.orders").where({id : orderid}).update({status:orderstatus});
        return res.status(200).send("order status is updated successfully");
      }
      catch(e){
        console.log(e.message);
        return res.status(400).send("order status is not updated");
      }
    }
    else{
      return res.status(400).send("please confirm you are an admin to update order status!");
    }
  });



      };
