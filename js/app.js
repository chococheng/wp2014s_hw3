(function(){
	Parse.initialize("ISriuKUp7KVYy27O19vC6QAHqfDHYFkMcOwTGim1", "YETmf3aqkimBhbzmXa9BdopoDOKUcNejbi4iZVpZ");
	var templates = {};
    ["loginView", "evaluationView", "updateSuccessView"].forEach(function (e) {
    	templateCode = document.getElementById(e).text;
    	templates[e] = doT.template(templateCode);
  	});
	
	var handlers = {
		navbar: function(){
			var currentUser = Parse.User.current();
			if(currentUser){
				document.getElementById("loginButton").style.display="none";
				document.getElementById("evaluationButton").style.display="block";
				document.getElementById("logoutButton").style.display="block";
			}
			else{
				document.getElementById("loginButton").style.display="block";
				document.getElementById("evaluationButton").style.display="none";
				document.getElementById("logoutButton").style.display="none";

			}
			document.getElementById("logoutButton").addEventListener("click",function(){
				
				window.location.hash="login/";
				Parse.User.logOut();
				handlers.navbar();
			})

		},
		loginView: function(){

			//var logintpl=document.getElementById("loginView").text;
			//document.getElementById("content").innerHTML=doT.template(logintpl);
			document.getElementById("content").innerHTML=templates.loginView();

			var checkId=function(msgbox,student_id){
				if(!TAHelp.getMemberlistOf(student_id)){
					msgbox.innerHTML="The student is not one of the class students.";
					msgbox.style.display="block";
					return false;
					
				}
				else{
					msgbox.style.display="none";
					return true;
					
				}

			};
			var message=function(msgbox,words){
				msgbox.innerHTML=words;
				msgbox.style.display="block";
			};

			//檢查登入id是否為修課學生
			document.getElementById("form-signin-student-id").addEventListener("keyup",function(){
				var input_id=document.getElementById("form-signin-student-id").value;
				var msgbox=document.getElementById("form-signin-message");
				checkId(msgbox,input_id);
			});

			//檢查註冊id是否為修課學生
			document.getElementById("form-signup-student-id").addEventListener("keyup",function(){
				var input_id=document.getElementById("form-signup-student-id").value;
				var msgbox=document.getElementById("form-signup-message");
				checkId(msgbox,input_id);
			});

			//檢查註冊密碼是否相符
			document.getElementById("form-signup-password1").addEventListener("keyup",function(){
				var input_pass=document.getElementById("form-signup-password");
				var input_pass1=document.getElementById("form-signup-password1");
				var msgbox=document.getElementById("form-signup-message");

				if(input_pass.value===input_pass1.value){
					msgbox.style.display="none";
				}
				else{
					message(msgbox,"Passwords aren't mached");
					//message(msgbox,"Passwords aren't mached");
				}
				
			});

			//按下註冊鈕
			document.getElementById("form-signup").addEventListener("submit",function(){
				var msgbox=document.getElementById("form-signup-message");
				var input_id=document.getElementById("form-signup-student-id").value;
				var input_pass=document.getElementById("form-signup-password");
				var input_pass1=document.getElementById("form-signup-password1");
				
				if(checkId(msgbox,input_id)===false){
					return false;
				}
				if(input_pass.value===input_pass1.value){
					msgbox.style.display="none";
				}
				else{
					message(msgbox,"Passwords aren't mached");
					//message(msgbox,"Passwords aren't mached");
					return false;
				}

				var user = new Parse.User();
		        user.set("username", document.getElementById('form-signup-student-id').value);
		        user.set("password", document.getElementById('form-signup-password').value);
		        user.set("email", document.getElementById('form-signup-email').value);
		        user.signUp(null, {
			          success: function(user){
			            alert('success');
			          },
			          error: function(user, error){
			            alert('fail');
			          }
		        });
		      }, false);
			//按下登入鈕
			document.getElementById('form-signin').addEventListener('submit',function(){
				var msgbox=document.getElementById("form-signin-message");
				var input_id=document.getElementById("form-signin-student-id").value;
				var inpur_pass=document.getElementById("form-signin-password").value;
				if(checkId(msgbox,input_id)===false){
					return false;
				}
				Parse.User.logIn(input_id,inpur_pass, {
				  success: function(user) {
				    //console.log('login success');
					window.location.hash="peer-evaluation/";
					handlers.navbar();

				  },
				  error: function(user, error) {
				    // The login failed. Check error to see why.
				    console.log('login fail');
				  }
				});

			})


	   },
	   evaluationView: function(){
	   		var currentUser = Parse.User.current();
	   		if(currentUser){
	   			//var query = new Parse.Query(currentUser);
	   			var Evaluation = Parse.Object.extend('Evaluation');
	   			//var evaluation=new Evaluation();
	   			
	   			var currentUserId=currentUser.get("username");
	   			var team=TAHelp.getMemberlistOf(currentUserId);
	   			var teamMember=[];
	   			var query=new Parse.Query(Evaluation);
	   			query.equalTo("user",currentUser);
	   			query.first({
	   				success:function(result){
	   					//console.log(result);
					    //console.log(result.toJSON());
					    if(result===undefined){
					    	for(var i=0;i<team.length;i++){
	   						if(team[i].StudentId!=currentUserId){

	   							team[i].scores = ["0","0","0","0"];
	   							teamMember.push(team[i]);
	   							}	
	   						}
	   					}else{
	   						teamMember=result.toJSON().evaluation;
	   					}

					    
					    
	   					
	   					//console.log(result.get('evaluation'));
	   					if(result===undefined){
	   						var evaluationACL = new Parse.ACL();
						    evaluationACL.setPublicReadAccess(false);
						    evaluationACL.setPublicWriteAccess(false);
						    evaluationACL.setReadAccess(currentUser, true);
						    evaluationACL.setWriteAccess(currentUser, true);
	   						var evaluation=new Evaluation();
	   						//console.log(team[1].StudentId);
	   						/*for(var i=0;i<team.length;i++){
	   							if(team[i].StudentId!=currentUserId){
	   								team[i].scores = ["0","0","0","0"];
	   								teamMember.push(team[i]);
	   							}	
	   						}*/
	   			
	   						//console.log(teamMember);
	   						
							document.getElementById("content").innerHTML=templates.evaluationView(teamMember);
							document.getElementById("evaluationForm-submit").value="提出表單";

				   			//console.log(TAHelp.getMemberlistOf(currentUserId));
				   			document.getElementById('evaluationForm').addEventListener('submit', function(){
								for(var i=0; i<teamMember.length; i++){
					   				for(var j=0; j<teamMember[i].scores.length; j++){
					   					var el=document.getElementById("stu"+teamMember[i].StudentId+"-q"+j);
					   					var point=el.options[el.selectedIndex].value;
					   					teamMember[i].scores[j]=point;
					   				}
					   			}
					   			console.log(teamMember);
					   			//var evaluation=new Evaluation();
					   			

					   			evaluation.set("user",currentUser);
					   			evaluation.setACL(evaluationACL);	
					   			evaluation.set("evaluation",teamMember);
					   			evaluation.save(null,{
					   				success:function(object){
					   					var updatetpl=document.getElementById("updateSuccessView").text;
					   					document.getElementById("content").innerHTML=templates.updateSuccessView();

					   				},
									error:function(object,error){
					   					console.log('error');			
					   				}

					   			})

					   			
					   						
					   		})
				   			
	   					}
	   					else{
	   						//console.log(teamMember);
							
							document.getElementById("content").innerHTML=templates.evaluationView(teamMember);
							document.getElementById("evaluationForm-submit").value="修改表單";
							
							document.getElementById('evaluationForm').addEventListener('submit', function(){
								
									
								for(var i=0; i<teamMember.length; i++){
							   		for(var j=0; j<teamMember[i].scores.length; j++){
							   			var el=document.getElementById("stu"+teamMember[i].StudentId+"-q"+j);
							   			var point=el.options[el.selectedIndex].value;
							   			teamMember[i].scores[j]=point;
							   		}
							   	}
							  
							  	//var obj=result.toJSON();
							  	result.set("evaluation",teamMember);
						   		result.save(null,{
						   			success:function(){
						   				
						   				
						   				document.getElementById("content").innerHTML=templates.updateSuccessView();
						   			},
						   			error:function(){
						   				
						   			}
						   		})
						   	})

					   		
					   	}

	   				},
	   				error:function(result,error){

	   				}

	   			});
				
	   			
			}
	   		else{
	   			window.location.hash="login/";
	   			return false;
	   		}
	   }
	};
var App = Parse.Router.extend({
    routes: {
      "": "index",
      "peer-evaluation/": "evaluationView",
      "login/*redirect": "loginView",
    },
    index: handlers.evaluationView,
    evaluationView: handlers.evaluationView,
    loginView: handlers.loginView,
  });

  this.app = new App();
  Parse.history.start();
  handlers.navbar();

})();
