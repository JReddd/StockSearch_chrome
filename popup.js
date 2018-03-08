

$(function(){

  $("#star").prop("disabled",true);

  //getQuote
    $("#getQuote").click(function(){
      quote = $("#quote").val();
      ajaxCall();
      checkFav();

    })

    function ajaxCall(){

      inFavList = false;
      //table
      $.ajax({

        url : 'http://cs-server.usc.edu:37394/hw8_backend/index.php',
        type : 'GET',
        data : {
          'stock_symbolTable': quote
        },
        dataType:'json',
        success : function(data) {
          $("#star").prop("disabled",false);
          symbol = data['Stock Ticker Symbol'];
          lastPrice = data['Last Price'];
          change = data['Change'];
          changePercent = data['Change Percent'];
          timeStamp = data['TimeStamp'];
          openPrice = data['Open'];
          close = data['Close'];
          daysRange = data['Days Range'];
          volume = data['Volume'];
          volumeN = data['VolumeN'];
          //fill the stock details table
          $("#symbolTable").html(symbol);
          $("#lpTable").html(lastPrice);

          if(change > 0){
            $("#changeTable").html(change + ' (' + changePercent + ')' + "<img src='http://cs-server.usc.edu:37394/hw8Images/Up.png' width='15' height='15'>");
            $("#changeTable").css('color','green');
          } else if(change < 0) {
            $("#changeTable").html(change + ' (' + changePercent + ')' + "<img src='http://cs-server.usc.edu:37394/hw8Images/Down.png' width='15' height='15'>");
            $("#changeTable").css('color','red');
          } else {
            $("#changeTable").html("0.00 (0.00%)");
          }
          
          $("#timeTable").html(timeStamp);
          $("#rangeTable").html(daysRange);
          $("#volumeTable").html(volume); 

        },
        // error : function(request,error)
        // {
          
        // }

      });
    }

    //check if the company is in the favorite list
    function checkFav(){

      for(var i = 0; i < localStorage.length; i++)    //******* length
        {
            var key = localStorage.key(i);              //******* key()

            if(key.indexOf("companies") == 0) {
                var value = localStorage.getItem(key);  //******* getItem()
                // console.log(value);
                valueJson = JSON.parse(value);

                for (var j = 0; j < valueJson.length; j++){

                  if (valueJson[j]['symbol'] == quote) {
                    $("#starBt").attr("class","glyphicon glyphicon-star");
                    inFavList = true;
                    break;
                  }

                }

            }
        }
        //empty the star button
        if(!inFavList){
          $("#starBt").attr("class","glyphicon glyphicon-star-empty");
        }
    }

    //press the clear button
    $("#clear").click(function(){

      $("#symbolTable").html("");
      $("#lpTable").html("");
      $("#changeTable").html("");   
      $("#timeTable").html("");
      $("#rangeTable").html("");
      $("#volumeTable").html("");

    })

    //press the star button
    $("#star").click(function(){
      
      if (!inFavList) {

        $("#starBt").attr("class","glyphicon glyphicon-star");
            inFavList = true;

            if ($("#tableFav tr:last-child .changeFav").html().charAt(0) == "-"){
              $("#tableFav tr:last-child .changeFav").addClass("changeFavN");
              $("#tableFav tr:last-child .changeFav").append("<img src='http://cs-server.usc.edu:37394/hw8Images/Down.png' width='15' height='15'>");
            } else {
              $("#tableFav tr:last-child .changeFav").addClass("changeFavP");
              $("#tableFav tr:last-child .changeFav").append("<img src='http://cs-server.usc.edu:37394/hw8Images/Up.png' width='15' height='15'>");
            }
      
        //symbol in favorite list is clicked  
        $("#tableFav tr:last-child .symbolFav a").click(function(e){
          var symbol = this.textContent;
          e.preventDefault();
          inFavList = false;
          quote = symbol;

          ajaxCall();
          checkFav();
          return false;
        });

      } else{

        $("#starBt").attr("class","glyphicon glyphicon-star-empty");
            inFavList = false;
      
      }
      
    });

    //css for Change in Favorite table
    $(".changeFav").each(function(){
      if ((this.textContent).charAt(0) == "-"){
        $(this).addClass("changeFavN");
        $(this).append("<img src='http://cs-server.usc.edu:37394/hw8Images/Down.png' width='15' height='15'>");
      } else {
        $(this).addClass("changeFavP");
        $(this).append("<img src='http://cs-server.usc.edu:37394/hw8Images/Up.png' width='15' height='15'>");
      }
    });

    //symbol in favorite list is clicked  
    $(".symbolFav a").click(function(e){
      var symbol = this.textContent;
      e.preventDefault();
      inFavList = false;
      quote = symbol;
      ajaxCall();
      checkFav();
      return false;
    }); 

})

