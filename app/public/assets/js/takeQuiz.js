$(document).ready(function () {
    let quizObj;

    $("#accesscodeForm").on("submit", function (event) {
        event.preventDefault();
        const accesscode = $("#accesscodeForm :input[name=accesscode]").val().trim();

        $.ajax({
            method: "GET",
            url: "/api/quiz/" + accesscode
        }).then(response => {
            if (response === null) {
                if ($("#accesscodeForm").siblings()[3]) {
                    $("#accesscodeForm").siblings()[3].remove();
                }
                
                const errorMsg = $("<p>").text("This access code does not exist!").addClass("formError");
                
                // append it to the div after the form element
                $("#takeQuiz").append(errorMsg);

                // add red border to input element
                $("#takeQuiz").addClass("invalidInput");
            }
            else {
                quizObj = response;
                console.log(quizObj)
                location.href = "/quiz"
            }
        })
    })

    
    
})


//     $("#").on("submit", function (event) {
//         event.preventDefault();
//         const  = $("#").val();
//         const  = {
//             : $("#").val(),
//             : $("#").val()
//         }
//        $.ajax({
//            method:"GET",
//            data:,
//            url:`/api/takequiz/${}`
//        }).then(data=>{
//            location.href = `/takequiz/${}`
//        })
//     })

// $("#").on("submit", function (event) {
//     event.preventDefault();
//     const  = {
//         : $("#").val(),
//         : $("#").val()
//     }
//    $.ajax({
//        method:"POST",
//        data:,
//        url:"/api/takequiz"
//    }).then(data=>{
//        location.href = "/"
//    })
// })


// get request to quiz to get all of them
//  data attr for access code
//  