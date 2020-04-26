$(document).ready(function () {
    let quizObj = {};
    let stagedId = 0;
    let currentQuestionNum = 1;
    let accessCode = "";

    // displays error message for the input given
    function displayErrorMessage(inputElement, errorElement, message) {
        if (errorElement) {
            errorElement.remove();
        }

        inputElement.addClass("invalidInput");
        const errorMsg = $("<p>").text(message).addClass("formError");
        inputElement.parent().append(errorMsg)
    }

    function removeErrorMessage(inputElement, errorElement) {
        if (errorElement) {
            errorElement.remove();
        }
        inputElement.removeClass("invalidInput");
    }

    $("#createLanding").on("submit", function (event) {
        event.preventDefault();

        const quizName = $("#quizName").val().trim();

        if (quizName === "") {
            displayErrorMessage($("#quizName"), $("#quizName").parent().children()[2], "Must enter a Quiz Title");
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
            $('#createLandingContainer').foundation('close');
            $(".unfinishedQuizContainer").addClass("hide");
            $("#addQuestions").removeClass("hide");
            $("#questionNumber").text(currentQuestionNum);
            $("#back").addClass("hide");
        }
    });

    function checkInputs() {
        let validCount = 0;

        $("#addQuestions :input[type=text]").each(function () {
            const value = $(this)

            if (value.val().trim() === "") {
                displayErrorMessage(value, value.siblings()[1], "Must enter a value");
            }
            else {
                removeErrorMessage(value, value.siblings()[1]);
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
    }

    function displayFinishedQuiz() {
        $("#addQuestions").addClass("hide");
        $("#finalQuizContainer").removeClass("hide");

        $("#finalQuiz").empty();

        $.each(quizObj.questions, function (index) {
            const questionContainer = $("<div class='grid-x grid-padding-x'>");
            const titleDiv = $("<div class='cell'>").css({ "display": "flex", "align-items": "center" });
            const title = $("<p>").text(`Question ${index + 1}: ${$(this)[0].title}`).css("font-weight", "bold");
            titleDiv.append(title);
            questionContainer.append(titleDiv);
            $.each($(this)[0].answers, function (index) {
                const answerDiv = $("<div class='cell'>").css({ "display": "flex", "align-items": "center" });
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

            $("#finalQuiz").append(questionContainer)
        });

        $("#finalQuiz").append($(`<button id="finalSubmit" class="button cardTitles" type='button'>`).text("Create Quiz"))
    }


    $(document).on("click", "#finalSubmit", async function () {
        $("#finalQuizContainer").addClass("hide");
        $("#emailListContainer").removeClass("hide");

        try {
            const createdQuiz = await $.ajax({
                method: "POST",
                data: quizObj,
                url: "/api/quiz"
            });
            accessCode = createdQuiz.accessCode

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
            displayErrorMessage(email, email.parent().children()[1], "Not a valid email!")
        }
        else {
            removeErrorMessage(email, email.parent().children()[1]);

            var item = $("<li class='listDisplay cardTitles'>");
            // create a span with the text as the city name
            var itemName = $("<span class='emailItem'>").text(email.val());
            // creates a 'x' button for deletion of item
            var button = $("<button type='button' class='close' aria-label='Close'>");
            var close = $("<span aria-hidden='true'>&times;</span>");

            button.append(close);
            item.append(itemName, button);

            $("#emailList").append(item)
            $("#emailListContainer :input[name=email]").val("")
        }

    })

    function loadQuestion(questionObj) {
        $("#questionNumber").text(currentQuestionNum);
        if (currentQuestionNum === 1) {
            $("#back").addClass("hide")
        }

        $("#addQuestions :input[name=question]").val(questionObj.title);
        $("#addQuestions :input[placeholder=Answer]").each(function (index) {
            $(this).val(questionObj.answers[index].answer);
            if (questionObj.answers[index].correctAnswer) {
                $(`:input[value=${index}]`).prop("checked", true);
            }
        })
    }

    $(document).on("click", ".editQBtn", function () {
        $("#finalQuizContainer").addClass("hide");
        $("#addQuestions").removeClass("hide");

        const editQNum = parseInt($(this).val());
        currentQuestionNum = editQNum + 1;

        loadQuestion(quizObj.questions[editQNum]);
    });

    function updateQuestion() {
        const currentQuestion = quizObj.questions[currentQuestionNum - 1];

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

    }

    function newQuestion() {
        $(":input[name=question]").val("")
        $("#addQuestions :input[placeholder=Answer]").each(function () {
            $(this).val("");
        })

        $("#back").removeClass("hide");
        $("#questionNumber").text(++currentQuestionNum);
    }

    async function saveFirstQuestion(command) {
        try {
            const { id } = await $.ajax({
                method: "POST",
                data: {
                    storedQuiz: JSON.stringify(quizObj, "\t", null)
                },
                url: "/api/staged"
            });

            stagedId = id;
            buttonActionSwitch(command);
        } catch (error) {
            console.log(error)
        }
    }

    function buttonActionSwitch(...values) {
        switch (values[0]) {
            case "next":
                if (values.length === 2) {
                    if (currentQuestionNum < quizObj.questions.length) {
                        const nextQuestion = quizObj.questions[currentQuestionNum];
                        $("#questionNumber").text(++currentQuestionNum);
                        loadQuestion(nextQuestion);
                        $("#back").removeClass("hide");
                    }
                    else {
                       newQuestion();
                    }
                }
                else {
                    newQuestion();
                }
                
                break;
            case "save":
                location.href = "/profile"
                break;
            default:
                displayFinishedQuiz();
                break;
        }
    }

    async function updateStagedQuiz(command) {
        try {
            await $.ajax({
                method: "PUT",
                data: {
                    storedQuiz: JSON.stringify(quizObj, "\t", null)
                },
                url: "/api/staged/" + stagedId
            })

            buttonActionSwitch(command, "update")
        } catch (error) {
            console.log(error)
        }
    }

    $("#next, #save, #finish").on("click", function (event) {
        event.preventDefault();

        if (checkInputs() === 5) {
            (currentQuestionNum <= quizObj.questions.length) ? updateQuestion() : addQuestion();

            stagedId === 0 ? saveFirstQuestion($(this).val()) : updateStagedQuiz($(this).val());
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
                addQuestion();
            }
            
            --currentQuestionNum;
            const prevQuestion = quizObj.questions[currentQuestionNum - 1];
            loadQuestion(prevQuestion);
        }
    });

    $(document).on("click", ".editStaged", async function () {
        try {
            const quizData = await $.ajax({
                method: "GET",
                url: "/api/staged/" + $(this).val()
            })

            const parsedQuizData = JSON.parse(quizData.storedQuiz);

            quizObj.title = parsedQuizData.title;
            quizObj.canRetake = parsedQuizData.canRetake;
            quizObj.questions = parsedQuizData.questions;

            const lastQuestion = parsedQuizData.questions[parsedQuizData.questions.length - 1];
            stagedId = $(this).val();
            currentQuestionNum = parsedQuizData.questions.length;

            loadQuestion(lastQuestion);

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

    async function loadStagedQuizzes() {
        try {
            const stagedQuizzes = await $.ajax({
                method: "GET",
                url: "/api/staged/user/" + $(":input[name=id]").data("id")
            })

            if (stagedQuizzes.length > 0) {
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

    function init() {
        // navbar link change for logged in
        $('a[href="/signup"]').children().text("Profile");
        $('a[href="/signup"]').attr("href", "/profile");

        $('a[href="/login"]').children().text("Log Out");
        $('a[href="/login"]').attr("href", "/logout");

        $('a[href="/"]').attr("href", "/profile");

        loadStagedQuizzes();

    }

    init();
})