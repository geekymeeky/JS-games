    var ran_num=Math.floor(Math.random()*100)+1
        var lives=1;

        document.getElementById('submit-btn').onclick=function(){
            var guessed_num=document.getElementById('num').value;

            if(ran_num==guessed_num){
                alert("Hurray You Guessed it Right!! in "+lives+" guesses");
            }
            else if(ran_num>guessed_num){
                lives++;
                alert("Sorry!! Your Guess was too low :(   Try Again!!");
            }
            else if(ran_num<guessed_num){
                lives++;
                alert("Sorry!! Your Guess was too High :(   Try Again!!");
            }
        }
