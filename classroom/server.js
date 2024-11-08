const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const session = require("express-session");
const flash = require("connect-flash");
const path =require("path");
// const cookieParser = require("cookie-parser");


// app.use(cookieParser());

// app.get("/getcookies",(req,res) => {
//     res.cookie("greet", "namaste");
//     res.cookie("madeIn", "india");
//     res.send("sent you someone cookies!");
// });

// app.get("/greet", (req,res) => {
//     let {name = "anonymous"} = req.cookies;
//     res.send(`hii ${ name}`);
// })

// app.get("/",(req,res) => {
//     console.dir(req.cookies);
//     res.send("hii i am root");
// });

// app.use("/users", users);
// app.use("/posts", posts);
app.set("view-engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use((req,res,next) => {
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    next();
});

const sessionOptions = {
    secret: "mysupersecretstring",
    resave: false,
    saveUninitialized: true
    }


    app.use(session(sessionOptions));
    app.use(flash());

    app.get("/register", (req, res) => {
        let {name = "anonymous"} = req.query;
        req.session.name = name;
        if(name === "anonymous") {
            req.flash("error", "user not registered");
        } else {
            req.flash("success", "user registered successfully!")
        }
       
        res.redirect("/hello");
    });

    app.get("/hello", (req, res) => {
        //console.log(req.flash("success"));
       res.render("page.ejs", {name: req.session.name });
    });

// app.get("/reqcount", (req, res) => {
//     if(req.session.count) {
//         req.session.count++;
//     } else {
//         req.session.count = 1;
//     }
//     res.send(`you sent a request ${req.session.count} times`);
// });

// app.get("/test", (req,res) => {
//     res.send("test successful!");
// });

app.listen(3000, () => {
    console.log("server is listening the port 3000")
});