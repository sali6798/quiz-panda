$(document).ready(function () {
    $("#addQuestions").addClass("hide");
    let quizObj = {};
    let stagedId = 0;
    // let questionNumber = 0;
    let currentQuestionNum = 1;

    $("#createLanding").on("submit", function (event) {
        event.preventDefault();

        const quizName = $("#quizName").val().trim();

        if (quizName === "") {
            if ($("#quizName").parent().siblings()[1]) {
                $("#quizName").parent().siblings()[1].remove();
            }
            $("#quizName").addClass("invalidInput");
            // create a new message with font color red
            const errorMsg = $("<p>").text("Must enter a Quiz Title").addClass("formError");
            // append it to the div that holds the input element
            $("#quizName").parent().parent().append(errorMsg);
        }
        else {
            quizObj.title = quizName;

            if ($("input[name=retakeable]:checked").val() === "no") {
                quizObj.canRetake = false;
            }
            else {
                quizObj.canRetake = true;
            }

            quizObj.questions = [];

            $("#createLanding").addClass("hide");
            $("#unfinishedQuiz").addClass("hide");
            $("#addQuestions").removeClass("hide");
            $("#questionNumber").text(currentQuestionNum);
            $("#back").addClass("hide");
        }
    });

    // $("#addQuestions :input[type=text]").on("blur", function () {
    //     const value = $(this)

    //     if (value.val().trim() === "") {
    //         value.siblings().remove();
    //         value.addClass("invalidInput");
    //         // create a new message with font color red
    //         const errorMsg = $("<p>").text("Must enter a value").addClass("formError");
    //         // append it to the div that holds the input element
    //         value.parent().append(errorMsg);
    //     }
    //     else {
    //         value.siblings().remove();
    //         value.removeClass("invalidInput")
    //     }
    // });

    function checkInputs() {
        let validCount = 0;

        $("#addQuestions :input[type=text]").each(function () {
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
                validCount++;
            }
        })

        return validCount;
    }

    function addQuestion() {
        let newQuestion = {};
        let answersArr = [];
        newQuestion.title = $("#addQuestions :input[name=question]").val().trim();
        $("#addQuestions :input[placeholder=Answer]").each(function () {
            let answerObj = {};
            answerObj.answer = $(this).val().trim();
            answersArr.push(answerObj);
        })

        const index = parseInt($(":input[name=answers]:checked").val())
        answersArr[index].correctAnswer = true;

        newQuestion.answers = answersArr;
        quizObj.questions.push(newQuestion)

        console.log("================================");
        console.log("added q");
        console.log(newQuestion);
        console.log(quizObj);
    }

    function updateQuestion() {
        console.log("=================================");
        console.log("prev q");
        console.log(currentQuestionNum)
        const currentQuestion = quizObj.questions[currentQuestionNum - 1];
        console.log(currentQuestion);

        const newAnswersArr = [];
        $("#addQuestions :input[placeholder=Answer]").each(function () {
            let answerObj = {};
            answerObj.answer = $(this).val().trim();
            newAnswersArr.push(answerObj);
        })

        currentQuestion.title = $("#addQuestions :input[name=question]").val().trim();
        const index = parseInt($(":input[name=answers]:checked").val())
        newAnswersArr[index].correctAnswer = true;
        currentQuestion.answers = newAnswersArr;

        console.log("=======================================")
        console.log("updated q")
        console.log(currentQuestion);
        console.log(quizObj)
    }

    $("#next, #save").on("click", function (event) {
        event.preventDefault();

        if (checkInputs() === 5) {
            if (currentQuestionNum <= quizObj.questions.length) {
                updateQuestion();
            }
            else {
                addQuestion();
            }
            if (stagedId === 0) {
                $.ajax({
                    method: "POST",
                    data: {
                        storedQuiz: JSON.stringify(quizObj, "\t", null)
                    },
                    url: "/api/staged"
                }).then((data) => {
                    stagedId = data.id;
                    if ($(this).val() === "next") {
                        $(":input[name=question]").val("")
                        $("#addQuestions :input[placeholder=Answer]").each(function () {
                            $(this).val("");
                        })

                        $("#back").removeClass("hide");
                        $("#questionNumber").text(++currentQuestionNum);
                    }
                    else {
                        location.href = "/profile"
                    }
                    // console.log("stagedId", stagedId)
                }).catch(err => {
                    console.log(err)
                })
            }
            else {
                $.ajax({
                    method: "PUT",
                    data: {
                        storedQuiz: JSON.stringify(quizObj, "\t", null)
                    },
                    url: "/api/staged/" + stagedId
                }).then((data) => {
                    console.log(data)
                    if ($(this).val() === "next") {
                        if (currentQuestionNum < quizObj.questions.length) {
                            const nextQuestion = quizObj.questions[currentQuestionNum];
                            $("#addQuestions :input[name=question]").val(nextQuestion.title);
                            $("#addQuestions :input[placeholder=Answer]").each(function (index) {
                                $(this).val(nextQuestion.answers[index].answer);
                                if (nextQuestion.answers[index].correctAnswer) {
                                    $(`:input[value=${index}]`).prop("checked", true);
                                }
                            })
                        }
                        else {
                            $(":input[name=question]").val("")
                            $("#addQuestions :input[placeholder=Answer]").each(function () {
                                $(this).val("");
                            })
                        }

                        $("#questionNumber").text(++currentQuestionNum);
                    }
                    else {
                        location.href = "/profile"
                    }
                }).catch(err => {
                    console.log(err)
                })
            }
        }
    });

    // $("#back").on("click", function () {
    //     $("#questionNumber").text(--currentQuestionNum);
    //     if (currentQuestionNum === 1) {
    //         $("#back").addClass("hide")
    //     }
    //     const prevQuestion = quizObj.questions[quizObj.questions.length - 1];
    //     $("#addQuestions :input[name=question]").val(prevQuestion.title);
    //     $("#addQuestions :input[placeholder=Answer]").each(function (index) {
    //         $(this).val(prevQuestion.answers[index].answer);
    //         // console.log(prevQuestion.answers[index].answer);
    //         if (prevQuestion.answers[index].correctAnswer) {
    //             // console.log(index)
    //             $(`:input[value=${index}]`).prop("checked", true);
    //         }
    //     })
    // })

    $("#back").on("click", function (event) {
        event.preventDefault();

        if (checkInputs() === 5) {
            // addQuestion();
            if (currentQuestionNum < quizObj.questions.length) {
                updateQuestion();
            }
            else {
                addQuestion();
            }
            $("#questionNumber").text(--currentQuestionNum);
            if (currentQuestionNum === 1) {
                $("#back").addClass("hide")
            }
            const prevQuestion = quizObj.questions[currentQuestionNum - 1];
            $("#addQuestions :input[name=question]").val(prevQuestion.title);
            $("#addQuestions :input[placeholder=Answer]").each(function (index) {
                $(this).val(prevQuestion.answers[index].answer);
                if (prevQuestion.answers[index].correctAnswer) {
                    $(`:input[value=${index}]`).prop("checked", true);
                }
            })
        }
    });


})