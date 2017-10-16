var myApp = angular.module('myApp',[]);
myApp.controller('SignUpController',function($scope,$http){
	
	$scope.userdata={};

	$scope.submitForm = function(){
		
		if($scope.signUpForm.$invalid){//这里能在$scope里调用signUpForm是因为前台里用了ng-submit
			alert("检查你的信息");
		}else{
			alert("提交成功");
		}
	};
	$scope.isSame=function(a,b){
        if(a==b) alert(12);
    };

	$http.get('/get_yonghu').then(function (res){
		$scope.yonghu=res.data;
	},function (){
		alert('获取数据失败');
	});
	console.log($scope.userdata);

//$scope.yonghu这个是数据库取出来的用户密码
//$scope.userdata这个是用户输入的用户密码


	
}); 

myApp.directive('compare',function(){
	/*第一种写法return{
        restrict:'AE',
        scope:{  //独立scope
            orgText:"=compare"  //scope的=绑定策略，获取的是compare的属性值
        },
        require:'ngModel',
        link:function (scope,element,attr,controller) {
            //給控制器添加验证规则，即往$validators属性里添加
            controller.$validators.compare=function (v) {  //这里的v就是确认密码
                return v==scope.orgText;
            }
            //监听密码有没有改变，有改变了控制器就继续验证确认密码和它是否相等
            scope.$watch('orgText',function () {  //orgText是密码的值
                controller.$validate();  // $validate()是控制器所有验证规则的方法
            })
        }
    }*/
	var o=[];
	o.strict='AE';
	o.scope={
		orgText: '=compare'
	};
	o.require = 'ngModel';
	o.link=function(sco, ele, att, con){
		con.$validators.compare = function(v){
			return v == sco.orgText;
		}
		sco.$watch('orgText',function(){
			con.$validate();
		});
	}
	return o;


});