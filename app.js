var express         = require("express"),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
     app            = express(),
     expressSanitizer = require("express-sanitizer"),
    methodOverride  = require("method-override");
    
// App config
mongoose.connect('mongodb://localhost:27017/blog', { useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(express.static("public"));
app.use(methodOverride("_method"));

mongoose.set('useFindAndModify', false);

//SCHEMA Setup
var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {type: Date, default: Date.now}
});

//mongoose/ model config
var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//         name: "testblog",
//         image: "https://images.pexels.com/photos/2102891/pexels-photo-2102891.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"  ,
//         body: "this is the first blog"
// }, function(err, blogs){
//         if(err){
//             console.log(err);
//         } else {
//                 console.log(blogs);
//         }
//     });
    
//RESTful routes

// INDEX ROUTE
app.get("/", function(req,res){
    res.redirect("/blogs");    
});

app.get("/blogs", function(req,res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log(err);
        } else {
            res.render("index.ejs", {blogs: blogs});        
        }
    });
        
});

//NEW - ROUTE

app.get("/blogs/new", function(req, res) {
  res.render("new"); 
});

//CREATE - ROUTE

app.post("/blogs", function(req,res){
    //create blogs
    req.body.blogs.body = req.sanitize(req.body.blogs.body);
    Blog.create(req.body.blogs, function(err, newBlog){
      if(err){
          res.render("index");
      } else {
          res.redirect("/blogs");
      }
    });
});

//SHOW - ROUTE
app.get("/blogs/:id", function(req, res) {
  Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else{
            res.render("show", {blog: foundBlog});
        }
  }); 
});

// EDIT - ROUTE
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err,foundBlog){
      if (err){
          res.redirect("/blogs");
      } else{
          res.render("edit", {blog : foundBlog});
      }
    });
});


// UPDATE - ROUTE
app.put("/blogs/:id", function(req, res){
      req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err,updatedBlog){
      if (err){
          res.redirect("/blogs");
      } else {
          res.redirect("/blogs/" + req.params.id);
      }
    });
    
  });


// DELETE ROUTE

app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndDelete(req.params.id, function(err,updatedBlog){
      if (err){
          res.redirect("/blogs");
      } else{
          res.redirect("/blogs");
      }
    });
    
  });
  
  //INITIATING SERVER
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("the server has started");
});


