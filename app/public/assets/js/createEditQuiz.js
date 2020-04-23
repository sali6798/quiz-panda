$(document).ready(function () {
    let quizObj = {
        title: "",
        canRetake: true,
        questions: [{
            title: "",
            answers: [
                // {answer: correctAnswer:}
            ]
        }]
    };

    $("#createLanding").on("submit", function (event) {
        event.preventDefault();

        const quizName = $("#quizName").val().trim();

        if (quizName === "") {
            console.log(quizName)
            // console.log($("#quizName").parent().parent())
            if ($("#quizName").parent().siblings()[1]) {
                $("#quizName").parent().siblings()[1].remove();
            }
            $("#quizName").addClass("invalidInput");
            // create a new message with font color red
            const errorMsg = $("<p>").text("Must enter a Quiz Title").addClass("formError");
            // append it to the div that holds the input element
            $("#quizName").parent().parent().append(errorMsg);
            // $("#quizName").parent().parent().append(errorMsg)
        }
        else {
            quizObj.title = quizName;

            if ($("input[name=retakeable]:checked").val() === "no") {
                quizObj.canRetake = false;
            }
            else {
                quizObj.canRetake = true;
            }
    
            // quizObj.canRetake = $("input[name=retakeable]:checked").val();
            console.log(quizObj)
            $("#createLanding").addClass("hide");
            $("#addQuestions").removeClass("hide");
        }
    })

    // $("input[name=question], input[name=question], input[name=question], input[name=question], input[name=question]")

    $("#addQuestions :input[type=text]").on("blur", function() {
        const value = $(this)

        if (value.val().trim() === "") {
            value.siblings().remove();
            value.addClass("invalidInput");
            // create a new message with font color red
            const errorMsg = $("<p>").text("Must enter a value").addClass("formError");
            // append it to the div that holds the input element
            value.parent().append(errorMsg);
        }
        else {
            value.siblings().remove();
            value.removeClass("invalidInput")
        }
    });



    $("#next, #save").on("click", function(event) {
        event.preventDefault();
        let newQuestion = {};
        $("input[name=question]")
        
    })


})