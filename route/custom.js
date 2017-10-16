const express=require('express');
const common=require('../libs/common');
const mysql=require('mysql');

var db=mysql.createPool({host: 'localhost', user: 'root', password: '960906', database: 'blog'});

const pathLib=require('path');
const fs=require('fs');

module.exports=function (){
  var router=express.Router();

  router.get('/', function (req, res){
    switch(req.query.act){
      case 'del':      
        db.query(`SELECT * FROM article_table WHERE ID=${req.query.id}`, (err, data)=>{
          console.log(data[0].author_src);
          if(err){
            console.error(err);
            res.status(500).send('database error').end();
          }else{
            if(data.length==0){
              res.status(404).send('no this ----').end();
            }else{
              fs.unlink('static/upload/'+data[0].author_src, (err)=>{
                if(err){
                  console.error(err);
                  res.status(500).send('file opration error').end();
                }else{
                  db.query(`DELETE FROM article_table WHERE ID=${req.query.id}`, (err, data)=>{
                    if(err){
                      console.error(err);
                      res.status(500).send('database error').end();
                    }else{
                      res.redirect('/custom');
                    }
                  });
                }
              });
            }
          }
        });
        break;
      case 'mod':
        db.query(`SELECT * FROM article_table WHERE ID=${req.query.id}`, (err, data)=>{
          
          if(err){
            console.error(err);
            res.status(500).send('database error').end();
          }else if(data.length==0){
            res.status(404).send('no this ------').end();
          }else{
            db.query(`SELECT * FROM article_table`, (err, articles)=>{
              if(err){
                console.error(err);
                req.status(500).send('database error').end();
              }else{
                res.render('custom.ejs', {articles, mod_data: data[0]});
              }
            });
          }
        });
        break;
      default:
        db.query(`SELECT * FROM article_table`, (err, articles)=>{
          if(err){
            console.error(err);
            req.status(500).send('database error').end();
          }else{
            res.render('custom.ejs', {articles});
          }
        });
    }
  });
  router.post('/', function (req, res){
      var author=req.body.author;
      var title=req.body.title;
      var post_time=req.body.post_time;
      var content=req.body.content;
      var summery=req.body.summery;
      var n_like=req.body.n_like;
      

      if(req.files[0]){
        var ext=pathLib.parse(req.files[0].originalname).ext;

        var oldPath=req.files[0].path;
        var newPath=req.files[0].path+ext;

        var newFileName=req.files[0].filename+ext;
      }else{
        
        newFileName=null;


        
      }


    //if(newFileName)是用来保证upload文件夹里面的文件有后缀名

    if(newFileName){
      fs.rename(oldPath, newPath, (err)=>{
        if(err){
          console.error(err);
          console.log('-----file rename error--------');
          res.status(500).send('file opration error').end();
        }else{
          //文件重命名正确，进行以下的操作       
          if(req.body.mod_id){  //修改
            db.query(`UPDATE article_table SET author='${author}',title='${title}',author_src='${newFileName}',post_time='${post_time}',content='${content}',summery='${summery}', n_like='${n_like}' WHERE ID=${req.body.mod_id}`, (err)=>{
            if(err){
              console.error(err);
              res.status(500).send('database error').end();
            }else{
              res.redirect('/custom');
            }
          });
          }else{                //添加
            db.query(`INSERT INTO article_table \
               (author,title, author_src,post_time,content,summery,n_like)
                VALUES('${author}','${title}', '${newFileName}','${post_time}','${content}','${summery}', '${n_like}')`, (err, data)=>{
                if(err){
                    console.error(err);
                    res.status(500).send('database error').end();
                  }else{
                    res.redirect('/custom');
                    
                  }
            });
          }
        }
      });
    }else{
        //没有修改图片，直接更新
        if(req.body.mod_id){
          db.query(`UPDATE article_table SET author='${author}',title='${title}',post_time='${post_time}',content='${content}',summery='${summery}', n_like='${n_like}' WHERE ID=${req.body.mod_id}`, (err)=>{
            if(err){
              console.error(err);
              res.status(500).send('database error').end();
            }else{
              res.redirect('/custom');
            }
          });
        }else{
          //添加数据时，没有添加图片
          res.redirect('http://localhost:8082/404');
        }        
    }

  });

  return router;
};
