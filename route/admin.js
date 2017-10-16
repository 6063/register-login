 const express = require('express');
 const common=require('../libs/md5.js');
 const mysql = require('mysql');


const db=mysql.createPool({host: 'localhost', user: 'root', password: '960906', database: 'blog'});



 module.exports = function(){
 	var router = express.Router();
 	router.get('/login',(req,res)=>{
 		res.render('admin/admin_user.ejs',{});
 	});
 	router.post('/login',(req,res)=>{
 		var username = req.body.username;
 		var password = req.body.password;
 		var password1 = common.md5(password+common.MD5_SUFFIX);
 		db.query(`SELECT * FROM user_table WHERE username='${username}'`,(err,data)=>{
 			console.log(data[0].password);
 			if(err){
 				console.log(err);
 				res.status(500).send('database error').end();
 			}else{
 				if(data.length==0){
 					res.status(400).send('database meiyou').end();
 				}else{
 					if(data[0].password==password1){
 						//成功
 						req.session['admin_id'] = data[0].ID;
 						res.redirect('http://localhost:8082/custom');						
 					}else{
 						res.redirect('http://localhost:8082/404');
 					}
 				}
 			}
 		}); 		
 	}); 	
 	return router;
 }