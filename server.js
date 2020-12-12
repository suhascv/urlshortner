require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const Database = require("@replit/database")
const db = new Database()
const bodyParser=require('body-parser');
var max=0
// Basic Configuration
const port = process.env.PORT || 3000;
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
})

app.post('/api/shorturl/new',urlencodedParser,function(req,res){
  console.log(req.body.url);
  let reg=/^https?:\/\/\w*/
  if(reg.test(req.body.url)){
  db.list().then(keys => {
    keys.sort(function(a, b){return b-a})
    db.set(keys[0]+1, req.body.url).then(() => {});
    res.json({original_url:req.body.url,short_url:keys[0]+1});
    });}
  else{
    res.json({error:'invalid url'})
  }
})

app.get('/api/shorturl/:key',function(req,res){
db.get(req.params.key).then(value => {
  res.redirect(value)
});

})

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});



app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
