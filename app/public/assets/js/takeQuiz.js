$(document).ready(function () {
    let quizObj;

    $("#accesscodeForm").on("submit", function (event) {
        event.preventDefault();
        const accesscode = $("#accesscodeForm :input[name=accesscode]").val().trim();

        if (accesscode) {
            //GET request to retrieve quiz
            $.ajax({
                method: "GET",
                url: "/api/quiz/" + accesscode
            }).then(response => {
                //if the access code entered doesn't correspond to an existing quiz, throw an eror.
                if (response === null) {
                    $("#accessCodeError").empty();

                    const errorMsg = $("<p>").text("This access code does not exist!").addClass("formError");

                    // append it to the div
                    $("#accessCodeError").append(errorMsg);
                    // add red border to input element
                    $("#accesscodeForm :input[name=accesscode]").addClass("invalidInput") 
                }
                else {
                    //redirrect to the appropriate quiz
                    quizObj = response;
                    console.log(quizObj)
                    location.href = "/quiz/" + accesscode
                }
            })
        }
        else {
            console.log("no access")
            $("#accessCodeError").empty();
            const errorMsg = $("<p>").text("This access code does not exist!").addClass("formError");

            // append it to the div
            $("#accessCodeError").append(errorMsg);
            $("#accesscodeForm :input[name=accesscode]").addClass("invalidInput")
        }

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
<<<<<<< HEAD
    
    $(".delete").on("click", function(event){
        event.preventDefault();
        let id = $(this).data("id");
        $.ajax({
            method:"DELETE",
            url:"/quiz/delete/"+id,
        }).then(deleted=>{
            location.reload()
        })

    })
=======

    function init() {
        $('a[href="/signup"]').children().text("Account");
        $('a[href="/signup"]').attr("href", "/account")

        $('a[href="/login"]').children().text("Log Out");
        $('a[href="/login"]').attr("href", "/logout")

        $('a[href="/"]').attr("href", "/profile")
    }

    init();
>>>>>>> development
})
