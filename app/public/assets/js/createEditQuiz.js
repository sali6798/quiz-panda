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
        // red border on input element
        inputElement.addClass("invalidInput");
        // append error underneath input with red color
        const errorMsg = $("<p>").text(message).addClass("formError");
        inputElement.parent().append(errorMsg)
    }

    // remove message from underneath input element
    function removeErrorMessage(inputElement, errorElement) {
        if (errorElement) {
            errorElement.remove();
        }
        inputElement.removeClass("invalidInput");
    }

    // take new quiz name from user and then display the 
    // form to add the questions and answers, the start
    // of building the whole quiz object
    $("#createLanding").on("submit", function (event) {
        event.preventDefault();

        const quizName = $("#quizName").val().trim();

        // quiz name cannot be empty
        if (quizName === "") {
            displayErrorMessage($("#quizName"), $("#quizName").parent().children()[2], "Must enter a Quiz Title");
        }
        else {
            quizObj.title = quizName;

            // gets which option is chosen for if the quiz can be retaken
            if ($("input[name=retakeable]:checked").val() === "no") {
                quizObj.canRetake = false;
            }
            else {
                quizObj.canRetake = true;
            }

            // an empty array for the questions and answers to be
            // stored in later
            quizObj.questions = [];

            $(".createQuizContainer").addClass("hide");
            // closes modal
            $('#createLandingContainer').foundation('close');
            $(".unfinishedQuizContainer").addClass("hide");
            $("#addQuestions").removeClass("hide");
            $("#questionNumber").text(currentQuestionNum);
            $("#back").addClass("hide");
        }
    });

    // checks if the user has given an input for all the
    // input elements in the add question form
    function checkInputs() {
        let validCount = 0;

        // loops through all the input elements in addQuestions form
        $("#addQuestions :input[type=text]").each(function () {
            const value = $(this)

            // error message if there is no input
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

    
    // creates a question object with a title and the answers to
    // be added to the questions array in the quizObj
    function addQuestion() {
        let newQuestion = {};
        let answersArr = [];
        // add question title
        newQuestion.title = $("#addQuestions :input[name=question]").val().trim();
        
        // loop through all the answers and add it to the array
        $("#addQuestions :input[placeholder=Answer]").each(function () {
            let answerObj = {};
            answerObj.answer = $(this).val().trim();
            answersArr.push(answerObj);
        })

        // finds the radio that was checked and set it's corresponding
        // answer as the correct answer
        const index = parseInt($(":input[name=answers]:checked").val())
        answersArr[index].correctAnswer = true;

        // add the answers to the question, and the question
        // the quiz object
        newQuestion.answers = answersArr;
        quizObj.questions.push(newQuestion)
    }

    // display all the questions and its answers on the page
    // for the user to review before final creation
    function displayFinishedQuiz() {
        $("#addQuestions").addClass("hide");
        $("#finalQuizContainer").removeClass("hide");

        $("#finalQuiz").empty();

        // loop through all the questions
        $.each(quizObj.questions, function (index) {
            // div to hold a question and its answers
            const questionContainer = $("<div class='grid-x grid-padding-x'>");
            // div to hold the question title
            const titleDiv = $("<div class='cell'>").css({ "display": "flex", "align-items": "center" });
            // create a p element to hold the question number and title
            const title = $("<p>").text(`Question ${index + 1}: ${$(this)[0].title}`).css("font-weight", "bold");
            titleDiv.append(title);
            questionContainer.append(titleDiv);
            
            // loop through all the answers for the current question
            $.each($(this)[0].answers, function (index) {
                // div to hold an answer
                const answerDiv = $("<div class='cell'>").css({ "display": "flex", "align-items": "center" });
                const answer = $("<p>").text(`Answer ${index + 1}: ${$(this)[0].answer}`);
                
                // display if the current answer is the correct answer
                if ($(this)[0].correctAnswer) {
                    const correctAnswer = $("<span>").text(" Correct Answer").css("color", "green");
                    answer.append(correctAnswer);
                }
                answerDiv.append(answer)
                questionContainer.append(answerDiv)
            })

            // add a edit button to the end of the question
            const buttonDiv = $("<div class='cell shrink'>");
            const editButton = $(`<button class="editQBtn button" type='button' value=${index}>`).text("Edit");
            buttonDiv.append(editButton)
            questionContainer.append(buttonDiv)

            // append question
            $("#finalQuiz").append(questionContainer)
        });

        // add submit button after all the questions 
        $("#finalQuiz").append($(`<button id="finalSubmit" class="button cardTitles" type='button'>`).text("Create Quiz"))
    }

    // make a POST request to craete a new quiz entry
    // in the database and delete the quiz from the
    // staged quizzes
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

    // sends an email to the addresses that the
    // user enters
    $("#emailQuiz").on("click", async function (event) {
        event.preventDefault();
        const emailsArr = [];

        // loops through all the entered emails
        $(".emailItem").each(function (index) {
            emailsArr.push($(this).text())
        })

        if (emailsArr.length > 0) {
            // get the name of the logged in user
            const { firstName, lastName } = await $.ajax({
                method: "GET",
                url: "/api/users/id/" + $(":input[name=id]").data("id")
            })
    
            // send user's name, quiz access code and list of emails
            // to the server
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
                // when emails sent bring user back to
                // the profile page
                location.href = "/profile"
            })
        }

    })

    // deletes the email the user wants deleted from the list of emails 
    $(document).on("click", ".close", function () {
        // searches the list of emails and see if it matches the 
        // email the delete button was clicked on
        $(`#emailList li:contains("${$(this).siblings().text()}")`).remove();
    })

    // when the add button is clicked for the email, validates it and then
    // appends it to the list
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
            // create a span with the text as the email
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

    // loads the given question object into the question
    // and answers input elements and checks the radio
    // for the correct answer
    function loadQuestion(questionObj) {
        $("#questionNumber").text(currentQuestionNum);
        // don't display back button on the first question
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

    // when the edit button is clicked for a question
    // it displays the add question form opulated with
    // the chosen question's values
    $(document).on("click", ".editQBtn", function () {
        $("#finalQuizContainer").addClass("hide");
        $("#addQuestions").removeClass("hide");

        const editQNum = parseInt($(this).val());
        currentQuestionNum = editQNum + 1;

        loadQuestion(quizObj.questions[editQNum]);
    });

    // replaces the values the current question has with the
    // new values given in the input elements
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

    // displays an empty form when the user
    // wants to add a new question
    function newQuestion() {
        $(":input[name=question]").val("")
        $("#addQuestions :input[placeholder=Answer]").each(function () {
            $(this).val("");
        })

        $("#back").removeClass("hide");
        $("#questionNumber").text(++currentQuestionNum);
    }

    // switch for when next, save or finish buttons are clicked
    function buttonActionSwitch(...values) {
        switch (values[0]) {
            case "next":
                // if value length is 2, it is the execution for when
                // next when a user has gone back to look at previous questions
                if (values.length === 2) {
                    // if the user is not at the last question added
                    // it loads values for the next question
                    if (currentQuestionNum < quizObj.questions.length) {
                        const nextQuestion = quizObj.questions[currentQuestionNum];
                        $("#questionNumber").text(++currentQuestionNum);
                        loadQuestion(nextQuestion);
                        $("#back").removeClass("hide");
                    }
                    // user at the last question added so
                    // will display empty form to add new question
                    else {
                        newQuestion();
                    }
                }
                // just made the first question, can
                // only make a new question 
                else {
                    newQuestion();
                }

                break;
            case "save":
                // current quiz saved now bring user back
                // to their profile page
                location.href = "/profile"
                break;
            default:
                // if the user clicks finish, display
                // all of their questions for review
                displayFinishedQuiz();
                break;
        }
    }

    // make a POST request for the first question to
    // create an entry for staged quizzes 
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

    // update the value for the stored quiz with the
    // quizObj that has new values
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

    // updates or adds a new question, make the new changes in the quiz
    // object and then update the stored quiz in the database
    $("#next, #save, #finish").on("click", function (event) {
        event.preventDefault();

        if (checkInputs() === 5) {
            (currentQuestionNum <= quizObj.questions.length) ? updateQuestion() : addQuestion();

            stagedId === 0 ? saveFirstQuestion($(this).val()) : updateStagedQuiz($(this).val());
        }
    });

    // saves the current question first and then 
    // loads the previous question
    $("#back").on("click", function (event) {
        event.preventDefault();

        if (checkInputs() === 5) {
            // updates the question if it is a previous question or if 
            // it is the last question that was added
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

    // loads the last question in the staged quiz the
    // user wants to edit
    $(document).on("click", ".editStaged", async function () {
        try {
            const quizData = await $.ajax({
                method: "GET",
                url: "/api/staged/" + $(this).val()
            })

            // parse the stored quiz and build the quizObj
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

    // delete a staged quiz, removes from the database
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

    // displays all the staged quizzes the user has
    // on page load for /createquiz
    async function loadStagedQuizzes() {
        try {
            const stagedQuizzes = await $.ajax({
                method: "GET",
                url: "/api/staged/user/" + $(":input[name=id]").data("id")
            })

            // only display if user has staged quizzes
            if (stagedQuizzes.length > 0) {
                stagedQuizzes.forEach(quiz => {
                    const parsedQuiz = JSON.parse(quiz.storedQuiz);
                    // const row = $("<tr>");
                    // const title = $("<td class='tdText'>").text(parsedQuiz.title);
                    // const editTd = $("<td>");
                    // const editButton = $(`<button class='button editStaged' value="${quiz.id}">`).text("Edit");
                    // const deleteTd = $("<td>");
                    // const deleteButton = $(`<button class='button deleteStaged' value="${quiz.id}">`).text("Delete");
                    const stagedQuizHTML =
                        `
                    <hr>
                    <div class="grid-padding-x grid-x " id="quizCreatedLeaderboard${quiz.id}">
                        <div class="cell small-12 medium-4 large-4 tdText quizTitle">
                            <h3>${parsedQuiz.title}</h3>
                        </div>
                        <div class="cell small-12 medium-4 large-4 quizCreatedDelete">
                            <button class='button editStaged' value="${quiz.id}">Edit</button>
                        </div>
                        <div class="cell small-12 medium-4 large-4 quizCreatedDelete">
                            <button class='button deleteStaged' value="${quiz.id}">Delete Quiz</button>
                        </div>
                    </div>`
                    // editTd.append(editButton);
                    // deleteTd.append(deleteButton);
                    // row.append(title, editTd, deleteTd);
                    // $("#stagedTable").append(row);
                    $(".stagedTable").append(stagedQuizHTML);
                });

                $(".unfinishedQuizContainer").removeClass("hide");

            }
        } catch (error) {
            console.log(error)
        }
    }

    // load staged and change navbar on page load
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