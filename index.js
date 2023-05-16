const express = require('express');
const mysql = require('mysql2');

const app = express();


app.set("view engine", "ejs");
app.use(express.urlencoded({extended : true}))

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "12345678",
    database: "crud"
  });
 

  connection.connect((err) => {
    if (err)
    {
        console.log('Could Not Connect to Database',err);
    }    
    else
    {
        console.log('DataBase Connected Successfully');
    }
  });




app.get('/',(req , res)=>{
    res.render('home.ejs');
})

app.get('/product',(req ,res)=>{
    res.render('product.ejs')
})



//CATEGORY ROUTES

//Category================>
app.get('/category',(req ,res)=>{
    let sql = "SELECT * FROM category";
    let query = connection.query(sql, (err, rows) => {
        if (err) 
        {
        console.log(err);    
        } else {
            res.render('category.ejs',{users : rows})
        }
    })
})
// ===============>

//Add Category
app.get('/addCategory',(req,res)=>{
  res.render('addCategory.ejs')
})

app.post("/add/category", (req, res) => {
   let CategoryName = req.body.Category_Name;
    let CategoryId = req.body.Category_Id;
    let sql = `INSERT INTO category(Category_Id,Category_Name) values(${CategoryId},'${CategoryName}')`;
  let query = connection.query(sql, (err, results) => {
    if (err) throw err;
    res.redirect("/");
  });
});

//Delete Category==================>
app.get("/delete/:id", (req, res) => {
    const id = req.params.id;
    let sql = `delete FROM category where Category_Id=${id}`;
    let query = connection.query(sql, (err, rows) => {
      if (err) throw err;
      res.redirect("/");
    });
});
// ===============>

//Update Category=================>
  app.get("/update/:id", (req, res) => {
    const id = req.params.id;
    let sql = `select * FROM category where Category_Id=${id}`;
    let query = connection.query(sql, (err, rows) => {
      if (err) throw err;
      res.render("editCategory.ejs", { user: rows[0] });
    });
  });

  app.post("/modify", (req, res) => {
    const Id = req.body.CategoryId;
    const name = req.body.CategoryName;
    let sql = `update category set Category_Name = '${name}'  where Category_Id='${Id}'`;
    console.log(sql,Id,name);
    let query = connection.query(sql, (err, results) => {
      if (err) throw err;
      res.redirect("/");
    });
  });

  // ===============>

  //Show Related Products
  app.get("/category/:id", (req, res) => {
    const id = req.params.id;
    const sql = `SELECT * FROM product where Category_Id=${id}`;
    // res.send(sql)
    let query = connection.query(sql, (err, rows) => {
      if (err) throw err;
      res.render("relatedProduct.ejs", {
        users: rows,
        
      });
    });
  });


  //Show All Products with Pagination.
  app.get("/products", (req, res) => {
    const pageSize = req.query.pageSize || 10; 
    const page = req.query.page || 1; 
    const offset = (page - 1) * pageSize;
    const sql = `SELECT product.Product_ID, product.Product_Name, category.Category_Id, category.Category_Name
                 FROM product INNER JOIN category ON product.Category_Id = category.Category_Id
                 LIMIT ${pageSize} OFFSET ${offset}`;
    connection.query(sql, (error, results) => {
      if (error) throw error;
      else
      {
        res.render('product.ejs',{ data : results })
      }
    });
  });
  
  app.get("/next/:no", (req, res) => {
    const no = req.params.no;
    const pageSize = req.query.pageSize || 10; // default page size is 10
    const page = req.query.page || no; // default page is 1
    const offset = (page - 1) * pageSize;
    const sql = `SELECT product.Product_ID, product.Product_Name, category.Category_Id, category.Category_Name
                 FROM product INNER JOIN category ON product.Category_Id = category.Category_Id
                 LIMIT ${pageSize} OFFSET ${offset}`;
    connection.query(sql, (error, results) => {
      if (error) throw error;
      else
      {
        res.render('product.ejs',{ data : results })
      }
    });
  });


  //Delete Products
  app.get("/deleteproduct/:id", (req, res) => {
    const id = req.params.id;
    let sql = `delete FROM product where Product_ID=${id}`;
    let query = connection.query(sql, (err, rows) => {
      if (err) throw err;
      res.redirect("/");
    });
});

app.get("/edit/:id", (req, res) => {
  const id = req.params.id;
  let sql = `Select * from product where Product_ID = ${id}`;
  let query = connection.query(sql, (err, result) => {
    if (err) throw err;
    res.render("editProduct.ejs", { user: result[0] });
  });
});

app.post("/update/product", (req, res) => {
  const Id = req.body.CategoryId;
  const name = req.body.CategoryName;
  const prodName = req.body.ProductName;
  const prodId = req.body.ProductId;
  let sql = `update product set Product_Name = '${prodName}',Category_Id = '${Id}',Category_Name = '${name}' where Product_ID ='${prodId}'`;
  console.log(sql,Id,name);
  let query = connection.query(sql, (err, results) => {
    if (err) throw err;
    res.redirect("/");
  });
});



app.listen('8080',function(){
    console.log('Server Started at Port 8080');
})