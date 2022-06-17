$(document).ready(function(){
    $("#signup-form").validate({
        errorClass:"err",
     rules:{
        name:{
            required:true,
            minlength:4,
            maxlength:15,
            namevalidation:true
        },
        address:{
            required:true
         },
         phonenumber:{
            required:true,
            minlength:10,
            maxlength:15
         },
         email:{
            required:true,
            email:true
        },
        password:{
            required:true,
            minlength:3,
            strongePassword:true
           
        }
        // , repw:{
        //     required:true,
        //     equalTo:"#password"
        // }
       
       
        // street:{
        //     required:true
        //  },
        //  pincode:{
        //     required:true
        //  },city:{
        //     required:true
        //  },country:{
        //     required:true
        //  },  
       // },
        

      
       
     },
     messages:{
         name:{
             required:"Please enter your name",
             minlength:"At least 4 characters required",
             maxlength:"Maximum 15 characters are allowed"
         },
         address:{
                required:"please enter your address"
             },
             phonenumber:{
                required:"Please enter your phone number",
                minlength:"Enter 10 numbers",
                maxlength:"Number should be less than or equal to 15 numbers"
               }, 
               email:{
                required:"Please enter your email id",
                email:"Enter a valid email"
            }
            // ,  
            // repw:{
            //     required:"confirm password",
            //     equalTo:"Password doesn't matches"
            // } 
        //  lname:{
        //     required:"please enter your last name"
        //  },
       
        // hname:{
        //     required:"please enter your house name"
        // },
        // street:{
        //     required:"please enter your street"
        // },
        // pincode:{
        //     required:"please enter your pincode"
        // },
        // city:{
        //     required:"please enter your city"
        // },country:{
        //     required:'please enter your country'
        // },
         
        
        
        //  password:"Please enter your password",
        
     }
    })
    $.validator.addMethod("namevalidation", function(value, element) {
        return /^[A-Za-z]+$/.test(value);
},
  "Sorry,only alphabets are allowed"
);
//     $("#booking-form").validate({
//         guestcount:{
//             required:true,
//          }, 

//          messages:{
//             phonenumber:{
//                 required:"Please enter count of the guest",
//                }, 
//          }

//     })
//     $.validator.addMethod("numbervalidation", function(value, element) {
//         return /^[0-9]+$/.test(value);
// },
//   "Sorry,only numbers are allowed"
// );

   
//    $.validator.addMethod("strongePassword", function(value,element) {
//     return /^[A-Za-z0-9\d=!\-@._]$/.test(value) && /[a-z]/.test(value) && /\d/.test(value) && /[A-Z]/.test(value);
//     },
//     "The password must contain at least 1 number,1 lower case letter, and 1 upper case letter"
//     ); 
  
})