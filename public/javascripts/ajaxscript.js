function addToFood(foodId){
    $.ajax({
        url:'/add-selectedfood/'+foodId,
        method:'get',
        success:(response)=>{
          // if(response.status){
        //        let count=$('#cart-count').html()
        //        count=parseInt(count)+1
        //        $('#cart-count').html(count)
        
           //}
        //    error: function(request, error) {
        //     console.log(arguments);
        //     alert(" Can't do because: " + error);
        // }
        // success: function () {
        //     alert(" Done ! ");
        // }

   // }
   console.log('fsdgfg============');
           alert(response)
        }
    })
}

// function deleteSelectedFood(seleFoodId){
//   console.log(seleFoodId,'dg=====');
//   $.ajax({
//     url:'/delete-selectedfood/'+seleFoodId,
//     method:'get',
//     success:(response)=>{
//       if(response.deletefood){
//         alert("one item removed")
//         location.reload()

//       }
//     }
//   })
// }