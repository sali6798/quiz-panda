$(document).ready(function () {
    let quizObj = {};
    let stagedId = 0;
    let currentQuestionNum = 1;
    let accessCode = "";

    $("#createLanding").on("submit", function (event) {
        event.preventDefault();

        const quizName = $("#quizName").val().trim();

        if (quizName === "") {
            if ($("#quizName").parent().children()[2]) {
                $("#quizName").parent().children()[2].remove();
            }
            $("#quizName").addClass("invalidInput");
            // create a new message with font color red
            const errorMsg = $("<p class='cardTitles'>").text("Must enter a Quiz Title").addClass("formError");
            // append it to the div that holds the input element
            $("#quizName").parent().append(errorMsg);
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

            $(".createQuizContainer").addClass("hide");
            $(".unfinishedQuizContainer").addClass("hide");
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

    function displayFinishedQuiz() {
        $("#addQuestions").addClass("hide");
        $("#finalQuizContainer").removeClass("hide");

        $("#finalQuiz").empty();

        $.each(quizObj.questions, function (index) {
            const questionContainer = $("<div class='grid-x grid-padding-x'>");
            const titleDiv = $("<div class='cell shrink'>").css({ "display": "flex", "align-items": "center" });
            const title = $("<p>").text(`Question ${index + 1}: ${$(this)[0].title}`).css("font-weight", "bold");
            titleDiv.append(title);
            questionContainer.append(titleDiv);
            $.each($(this)[0].answers, function (index) {
                const answerDiv = $("<div class='cell shrink'>").css({ "display": "flex", "align-items": "center" });
                const answer = $("<p>").text(`Answer ${index + 1}: ${$(this)[0].answer}`);
                if ($(this)[0].correctAnswer) {
                    const correctAnswer = $("<span>").text(" Correct Answer").css("color", "green");
                    answer.append(correctAnswer);
                }
                answerDiv.append(answer)
                questionContainer.append(answerDiv)
            })

            const buttonDiv = $("<div class='cell shrink'>");
            const editButton = $(`<button class="editQBtn button" type='button' value=${index}>`).text("Edit");
            buttonDiv.append(editButton)
            questionContainer.append(buttonDiv)

            $("#finalQuiz").prepend(questionContainer)
        });

        $("#finalQuiz").append($(`<button id="finalSubmit" class="button cardTitles" type='button'>`).text("Create Quiz"))
    }


    $(document).on("click", "#finalSubmit", async function () {
        $("#finalQuizContainer").addClass("hide");
        $("#emailListContainer").removeClass("hide");
        console.log(quizObj)

        try {
            const createdQuiz = await $.ajax({
                method: "POST",
                data: quizObj,
                url: "/api/quiz"
            });
            console.log(createdQuiz);
            accessCode = createdQuiz.accessCode
            console.log(accessCode)

            await $.ajax({
                method: "DELETE",
                url: "/api/staged/" + stagedId
            });
        } catch (error) {
            console.log(error)
        }
    })

    $("#emailQuiz").on("click", async function (event) {
        event.preventDefault();
        const emailsArr = [];

        $(".emailItem").each(function (index) {
            emailsArr.push($(this).text())
        })

        const { firstName, lastName } = await $.ajax({
            method: "GET",
            url: "/api/users/id/" + $(":input[name=id]").data("id")
        })

        $.ajax({
            method: "POST",
            data: {
                emails: emailsArr,
                accessCode: accessCode,
                firstName: firstName,
                lastName: lastName
            },
            url: "/send"
        }).then(data => {
            console.log(data)
            location.href = "/profile"
        })
    })

    $(document).on("click", ".close", function () {
        $(`#emailList li:contains("${$(this).siblings().text()}")`).remove();
    })

    $("#emailListContainer :input[name=add]").on("click", function () {
        const email = $("#emailListContainer :input[name=email]");
        // check email is a valid format [A-Za-z0-9_-.]@[A-Za-z0-9_-.].[a-zA-Z]
        var valid = /^[\w\.-]+@[\w\.-]+\.[a-zA-Z]{2,7}$/g;
        if (!valid.test(email.val().trim())) {
            // remove existing message if it exists
            if (email.parent().children()[1]) {
                email.parent().children()[1].remove();
            }
            // create a new message with font color red
            const errorMsg = $("<p>").text("Not a valid email!").addClass("formError");
            // append it to the div that holds the input element
            email.parent().append(errorMsg);
            // add red border to input element
            email.addClass("invalidInput");
        }
        else {
            // remove message
            if (email.parent().children()[1]) {
                email.parent().children()[1].remove();
            }

            // remove red border
            email.removeClass("invalidInput");
            var item = $("<li class='listDisplay cardTitles'>");
            // create a span with the text as the city name
            var itemName = $("<span class='emailItem'>").text(email.val());
            // creates a 'x' button for deletion of item
            var button = $("<button type='button' class='close' aria-label='Close'>");
            var close = $("<span aria-hidden='true'>&times;</span>");

            button.append(close);
            item.append(itemName, button);

            $("#emailList").append(item)
        }

        $("#emailListContainer :input[name=email]").val("")
    })

    $(document).on("click", ".editQBtn", function () {
        $("#finalQuizContainer").addClass("hide");
        $("#addQuestions").removeClass("hide");

        const editQNum = parseInt($(this).val());
        currentQuestionNum = editQNum + 1;
        $("#questionNumber").text(currentQuestionNum);
        if (currentQuestionNum === 1) {
            $("#back").addClass("hide")
        }

        const editQuestion = quizObj.questions[editQNum];
        // console.log("=================================");
        // console.log("edit question");
        // console.log(editQuestion)

        $("#addQuestions :input[name=question]").val(editQuestion.title);
        $("#addQuestions :input[placeholder=Answer]").each(function (index) {
            $(this).val(editQuestion.answers[index].answer);
            if (editQuestion.answers[index].correctAnswer) {
                $(`:input[value=${index}]`).prop("checked", true);
            }
        })

    });

    function updateQuestion() {
        // console.log("=================================");
        // console.log("prev q");
        const currentQuestion = quizObj.questions[currentQuestionNum - 1];
        // console.log(currentQuestion);

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

        // console.log("=======================================")
        // console.log("updated q")
        // console.log(currentQuestion);
        // console.log(quizObj)
    }

    $("#next, #save, #finish").on("click", function (event) {
        event.preventDefault();

        if (checkInputs() === 5) {
            if (currentQuestionNum <= quizObj.questions.length) {
                updateQuestion();
            }
            else {
                // console.log("========================")
                // console.log("before next save fin add q")
                // console.log("current num", currentQuestionNum);
                // console.log("questions length", quizObj.questions.length);
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

                    switch ($(this).val()) {
                        case "next":
                            $(":input[name=question]").val("")
                            $("#addQuestions :input[placeholder=Answer]").each(function () {
                                $(this).val("");
                            })
                            // console.log("========================")
                            // console.log("inside staged 0")
                            // console.log("current num", currentQuestionNum)

                            $("#back").removeClass("hide");
                            $("#questionNumber").text(++currentQuestionNum);
                            // console.log("========================")
                            // console.log("updated num", currentQuestionNum)
                            break;
                        case "save":
                            location.href = "/profile"
                            break;
                        default:
                            displayFinishedQuiz();
                            break;
                    }
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
                    switch ($(this).val()) {
                        case "next":
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
                            $("#back").removeClass("hide");
                            // console.log("========================")
                            // console.log("inside PUT request")
                            // console.log("current num", currentQuestionNum)
                            $("#questionNumber").text(++currentQuestionNum);
                            // console.log("========================")
                            // console.log("updated num", currentQuestionNum)
                            break;
                        case "save":
                            location.href = "/profile"
                            break;
                        default:
                            displayFinishedQuiz();
                            break;
                    }
                }).catch(err => {
                    console.log(err)
                })
            }
        }
    });

    $("#back").on("click", function (event) {
        event.preventDefault();

        if (checkInputs() === 5) {
            if (currentQuestionNum < quizObj.questions.length ||
                (currentQuestionNum === quizObj.questions.length && quizObj.questions[currentQuestionNum - 1])) {
                updateQuestion();
            }
            else {
                // console.log("========================")
                // console.log("before back add q")
                // console.log("current num", currentQuestionNum);
                // console.log("questions length", quizObj.questions.length);
                addQuestion();
            }
            // console.log("========================")
            // console.log("inside back fn")
            // console.log("current num", currentQuestionNum)
            $("#questionNumber").text(--currentQuestionNum);
            // console.log("========================")
            // console.log("updated num", currentQuestionNum)
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

    $(document).on("click", ".editStaged", async function() {
        try {
            const quizData = await $.ajax({
                method: "GET",
                url: "/api/staged/" + $(this).val()
            })
            console.log(quizData)

            const parsedQuizData = JSON.parse(quizData.storedQuiz);

            quizObj.title = parsedQuizData.title;
            quizObj.canRetake = parsedQuizData.canRetake;
            quizObj.questions = parsedQuizData.questions;
            console.log(quizObj)

            const lastQuestion = parsedQuizData.questions[parsedQuizData.questions.length - 1];
            stagedId = $(this).val();
            currentQuestionNum = parsedQuizData.questions.length;

            $("#questionNumber").text(currentQuestionNum);
            if (currentQuestionNum === 1) {
                $("#back").addClass("hide")
            }

            $("#addQuestions :input[name=question]").val(lastQuestion.title);
            $("#addQuestions :input[placeholder=Answer]").each(function (index) {
                $(this).val(lastQuestion.answers[index].answer);
                if (lastQuestion.answers[index].correctAnswer) {
                    $(`:input[value=${index}]`).prop("checked", true);
                }
            })

            $(".createQuizContainer").addClass("hide");
            $(".unfinishedQuizContainer").addClass("hide");
            $("#addQuestions").removeClass("hide");
    
            
        } catch (error) {
            console.log(error)
        }
        
    })

    $(document).on("click", ".deleteStaged", async function () {
        try {
            await $.ajax({
                method: "DELETE",
                url: "/api/staged/" + $(this).val()
            });

            $(this).parent().parent().remove();
        } catch (error) {
            console.log(error)
        }
    })

    async function init() {
        $('a[href="/signup"]').children().text("Account");
        $('a[href="/signup"]').attr("href", "/account")

        $('a[href="/login"]').children().text("Log Out");
        $('a[href="/login"]').attr("href", "/logout")

        $('a[href="/"]').attr("href", "/profile") 

        try {
            const stagedQuizzes = await $.ajax({
                method: "GET",
                url: "/api/staged/user/" + $(":input[name=id]").data("id")
            })

            if (stagedQuizzes.length > 0) {
                // console.log(stagedQuizzes)
                stagedQuizzes.forEach(quiz => {
                    const parsedQuiz = JSON.parse(quiz.storedQuiz)
                    const row = $("<tr>");
                    const title = $("<td class='tdText'>").text(parsedQuiz.title);
                    const editTd = $("<td>");
                    const editButton = $(`<button class='button editStaged' value="${quiz.id}">`).text("Edit");
                    const deleteTd = $("<td>");
                    const deleteButton = $(`<button class='button deleteStaged' value="${quiz.id}">`).text("Delete");

                    editTd.append(editButton);
                    deleteTd.append(deleteButton);
                    row.append(title, editTd, deleteTd);
                    $("#stagedTable").append(row);
                });

                $(".unfinishedQuizContainer").removeClass("hide");

            }
        } catch (error) {
            console.log(error)
        }
    }

    init();


})