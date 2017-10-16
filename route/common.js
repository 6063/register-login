const express = require('express');
const mysql = require('mysql');


const db=mysql.createPool({host: 'localhost', user: 'root', password: '960906', database: 'blog'});



module.exports = function(){
 	var router = express.Router();
 	//普通账号注册
 	router.get('/zhuce', (req, res)=>{
  		res.render('zhuce.ejs', {});
	});
 	router.post('/zhuce',(req,res)=>{
   
  		var user = req.body.username;
  		var password = req.body.password;
  		console.log(user,password);

  		if(!user || !password){
  	   	 res.status(400).send('arg error').end();       
  		}else{
     	 db.query(`INSERT INTO yonghu_table (user, password) VALUE('${user}', '${password}')`, (err, data)=>{
      	    if(err){
       	     console.error(err);
         	   res.status(500).send('database error').end();
         	 }else{
          	  res.redirect('/common/denglu');
         	 }
      	  });
  		} 
	});


 	//普通账号登录
 	router.get('/denglu',(req,res)=>{
 	 res.render("denglu.ejs",{});
	});

	router.post('/denglu',(req,res)=>{
  		var username = req.body.username;
  		var password = req.body.password;
  		console.log(username,password);
  		db.query(`SELECT * FROM yonghu_table WHERE user='${username}'`,(err,data)=>{
    		if(err){
      			console.log(err);
      			res.status(500).send('database error').end();
   		 	}else{
      			if(data.length==0){
        			res.status(400).send('database meiyou').end();
     			}else{
        			if(data[0].password==password){
          				//成功
          				req.session['admin_id'] = data[0].ID;
                  console.log(data[0].ID);
                  //跳转到这个ID的信息里
         				res.redirect('http://localhost:8082');             
        			}else{
         				 res.redirect('http://localhost:8082/404');
       				}
     			}
  		    }
  		});
	});
 	return router;
 }