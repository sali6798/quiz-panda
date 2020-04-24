$(document).ready(function () {
    let quizObj;

    $("#accesscodeForm").on("submit", function (event) {
        event.preventDefault();
        const accesscode = $("#accesscodeForm :input[name=accesscode]").val().trim();
        //GET request to retrieve quiz
        $.ajax({
            method: "GET",
            url: "/api/quiz/" + accesscode
        }).then(response => {
            //if the access code entered doesn't correspond to an existing quiz, throw an eror.
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
                //redirrect to the appropriate quiz
                quizObj = response;
                console.log(quizObj)
                location.href = "/quiz/" + accesscode
            }
        })
    })

    //submitAnswers onclick
    $("#submitAnswers").on("click", function (event) {
        event.preventDefault();
        //declare required variables
        let quizId;
        let correctAnswers = 0;
        //grab the required inputs
        let radios = document.querySelectorAll(".answerOption");
        //loop over the answers and check how many correct answers were chosen
        radios.forEach(radio => {
            if (radio.checked && Boolean(radio.dataset.correctanswer)) {
                //update answer count
                correctAnswers += 1
            }
        });
        //grab the quizID
        quizId = $(this).data("quizid");
        //Get request to see if the current user has taken the quiz before
        $.ajax({
            method: "GET",
            url: "/api/quizuser/" + quizId,
            dataType: "json"
        }).then(quizUser => {
            //if the user has not taken the quiz before, post their score to the QuizUser table
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
                    //redirrect to the leaderboard for the quiz
                    location.href = "/leaderboard/" + quizId
                })
            } else {
                //if the user has taken the quiz before, there will already be a record
                //PUT request to update the user's score in the table
                $.ajax({
                    method: "PUT",
                    url: "/api/quizuser/" + quizId,
                    data: {
                        hasTaken: true,
                        score: correctAnswers
                    }
                }).then(updatedQuizUser => {
                    //redirrect to the leaderboard for the quiz
                    location.href = "/leaderboard/" + quizId
                })
            }
        })
    })
})
