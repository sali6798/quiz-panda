

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
                location.href = "/quiz/" + accesscode
            }
        })
    })

    //submitAnswers onclick
    $("#submitAnswers").on("click", function (event) {
        let quizId;
        event.preventDefault();
        let correctAnswers = 0;
        let radios = document.querySelectorAll(".answerOption");

        radios.forEach(radio => {

            if (radio.checked && Boolean(radio.dataset.correctanswer)) {
                correctAnswers += 1
            }
        });
        console.log("correct anwers: " + correctAnswers);

        quizId = $(this).data("quizid");

        console.log("quizID: " + quizId);

        $.ajax({
            method: "GET",
            url: "/api/quizuser/" + quizId,
            dataType: "json"
        }).then(quizUser => {
            console.log("Get result", quizUser);

            if (quizUser === null) {
                $.ajax({
                    method: "POST",
                    url: "/api/quizuser",
                    data: {
                        QuizId: quizId,
                        hasTaken: true,
                        score: correctAnswers
                    }
                }).then(newQuizUser => {
                    console.log("NewQuizUser: ", newQuizUser);
                    console.log("/leaderboard/" + quizId);

                    location.href = "/leaderboard/" + quizId

                })
            } else {
                $.ajax({
                    method: "PUT",
                    url: "/api/quizuser/" + quizId,
                    data: {
                        hasTaken: true,
                        score: correctAnswers
                    }
                }).then(updatedQuizUser => {
                    console.log("updatedQuizUser: ", updatedQuizUser);
                    console.log("/leaderboard/" + quizId);

                    location.href = "/leaderboard/" + quizId
                })
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