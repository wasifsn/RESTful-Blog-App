var express         = require("express"),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
     app            = express();
    
mongoose.connect('mongodb://localhost:27017/yelp_camp', { useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//SCHEMA Setup
var blogSchema = new mongoose.Schema({
   name: String,
   image: String,
   body: String,
   created: Number
});

//mongoose object creation
var Blog = mongoose.model("blog", blogSchema);



app.listen(process.env.PORT, process.env.IP, function(){
    console.log("the server has started");
    
})