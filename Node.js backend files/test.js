const app=require('express')();

app.use(require('express').static('public'));

app.listen(process.env.PORT || 8080,()=> console.log("fuck this is heppining"));
app.get("/",function(req,res){
res.end("fuck this is true");
});