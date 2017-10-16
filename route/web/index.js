const express=require('express');
const mysql=require('mysql');

var db=mysql.createPool({host: 'localhost', user: 'root', password: '960906', database: 'blog'});

module.exports=function (){
  var router=express.Router();

  router.get('/get_yonghu', (req, res)=>{
    db.query('SELECT * FROM yonghu_table', (err, data)=>{
      if(err){
        console.error(err);
        res.status(500).send('database error').end();
      }else{
        res.send(data).end();
      }
    });
  });
  return router;
};
