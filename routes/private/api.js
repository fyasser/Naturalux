const { isEmpty, times } = require("lodash");
const { v4 } = require("uuid");
const db = require("../../connectors/db");
const roles = require("../../constants/roles");
const { getSessionToken } = require('../../utils/session')
const getUser = async function (req) {
  const sessionToken = getSessionToken(req);
  if (!sessionToken) {
    return res.status(301).redirect("/");
  }
  console.log("hi", sessionToken);
  const user = await db.select("*")
  .from("naturalux.sessions")
  .where("token", sessionToken)
  .innerJoin("naturalux.users","naturalux.sessions.userid","naturalux.users.id")
  .innerJoin("naturalux.roles","naturalux.users.roleid","naturalux.roles.id")
  .first();
  // console.log("user =>", user);
  user.isNormal = user.roleid === roles.user;
  user.isAdmin = user.roleid === roles.admin;
  // console.log("user =>", user)
  return user;
};

module.exports = function (app) {
  // example
   app.get("/api/v1/hairproducts", async function (req, res) {

    try {
      // Query the database for hair products
      const hairproducts = await db.select("*").from("naturalux.products").where({ type: "hair product"});
  
      if (hairproducts.length === 0) {
        // Return a 404 status code and a message if no hair products are found
        return res.status(404).json({ error: "No hair products found" });
      }
  
      // Return the hair products with a 200 status code
      return res.status(200).json(hairproducts);
    } catch (error) {
      console.error(error);
      // Return a 500 status code for internal server errors
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/v1/lipcare", async function (req, res) {
    try{
    const lipcare=  await db.select("*").from("naturalux.products").where({ type: "lip care" });
    return res.status(200).json(lipcare);
  } catch (e) {
    console.log(e.message);
    return res.status(400).send("Could not get lip care products");
  }
  });

  //all products
  app.get("/api/v1/products", async function (req, res) {
    try{
    const allproducts=  await db.select("*").from("naturalux.products");
    return res.status(200).json(allproducts);
  } catch (e) {
    console.log(e.message);
    return res.status(400).send("Could not retrieve products");
  }
  });

  app.get("/api/v1/cart", async function (req, res) {
    try{
    const cart=  await db.select("*").from("naturalux.cart");
    return res.status(200).json(cart);
  } catch (e) {
    console.log(e.message);
    return res.status(400).send("Could not retrieve cart");
  }
  });

  //delete item from cart 

  app.delete("/api/v1/deletefromcart/:productid", async (req, res) =>{
    try {
      // Get the product ID to be deleted from the request parameters
      const productid = req.params.productid;
  
      // Perform the deletion from the cart table
      const deletedItem = await db('naturalux.cart')
        .where({ productsid: productid })
        .del();
  
      if (deletedItem) {
        return res.status(200).send("item deleted successfully");
      } else {
        return res.status(400).send("item not found");
      }
    } catch (error) {
      console.log(error.message);
      return res.status(400).send("Could not delete item from cart");
    }
  });


  //ADMINNN

  //edit product
  app.put("/api/v1/editproduct/:productid", async function (req, res) {
    const user = await getUser(req);
    if (user.isAdmin) {
      try {
        const productid = req.params.productid;
        const updatedProductAttributes = req.body;
        const updateStatements = {};
  
        if (updatedProductAttributes.name) {
          updateStatements.name = updatedProductAttributes.name;
        }
        if (updatedProductAttributes.type) {
          updateStatements.type = updatedProductAttributes.type;
        }
        if (updatedProductAttributes.description) {
          updateStatements.description = updatedProductAttributes.description;
        }
        if (updatedProductAttributes.price) {
          updateStatements.price = updatedProductAttributes.price;
        }
        if (updatedProductAttributes.quantity) {
          updateStatements.quantity = updatedProductAttributes.quantity;
        }
  
        const updatedProduct = await db('naturalux.products')
          .where({ id: productid })
          .update(updateStatements)
          .returning('*');
  
        if (updatedProduct.length === 0) {
          return res.status(400).send("Product not found");
        }
  
        return res.status(200).send("Product updated successfully");
      } catch (error) {
        console.log(error.message);
        return res.status(400).send("Could not edit product");
      }
    } else {
      return res.status(400).send("User is ineligible to edit");
    }
  });
  

//view orders 

app.get("/api/v1/vieworders", async function(req, res) {
  try {
    // Retrieve all rows from the "orders" table
    const orders = await db.select('*').from('naturalux.orders');

    return res.status(200).json(orders); // Return the orders as a JSON response
  } catch (error) {
    return res.status(400).send("Could not fetch orders");
  }
});
}