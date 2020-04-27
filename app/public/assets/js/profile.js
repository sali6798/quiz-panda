$(document).ready(function () {
  let accessCode;

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
        url: "/api/users/id/" + $(":input[name=user]").data("user")
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
        $("#emailListContainer").foundation("close");
      })
    }
    else {
      $("#emailListContainer").foundation("close");
    }

  });

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
      if (email.parent().children()[1]) {
        email.parent().children()[1].remove();
      }
      // red border on input element
      email.addClass("invalidInput");
      // append error underneath input with red color
      const errorMsg = $("<p>").text("Not a valid email!").addClass("formError");
      email.parent().append(errorMsg)
    }
    else {
      if (email.parent().children()[1]) {
        email.parent().children()[1].remove();
      }
      email.removeClass("invalidInput");

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

  });

  // opens modal with email input when invite button clicked
  $(document).on("click", ".invite", function () {
    $("#emailListContainer").foundation("open");
    accessCode = $(this).data("code");
  });

  // display all the quizzes create by the
  // logged in user on page load
  function loadCreatedQuizzes() {
    $.ajax({
      method: "GET",
      url: "/api/userquizzes",
    }).then(userInfo => {
      let userQuizzes = userInfo.userQuizzes;
      let userId = userInfo.id;
  
      for (let i = 0; i < userQuizzes.length; i++) {
        if (userQuizzes[i].id === userId) {
          let user = userQuizzes[i];
  
          for (let x = 0; x < user.Quizzes.length; x++) {
            let quiz = user.Quizzes[x];
  
            // if the user has created the quiz, generate HTML
            // to display the quiz name, access code, delete button,
            // leaderboard button and invite user button if the user has not
            // deleted the quiz, if they have only display the leaderboard button
            if (quiz.creatorId === userId) {
              $("#quizzesCreated").removeClass("hide");
              let quizzesCreatedHTML =
                `
                <hr>
                <div class="grid-padding-x grid-x " id="quizCreatedLeaderboard${quiz.id}">
                  <div class="cell small-12 medium-12 large-12 tdText quizTitle">
                    <h3>${quiz.title}</h3>
                  </div>
                 </div>`
              $("#quizzesCreatedInfo").append(quizzesCreatedHTML);
  
              if (quiz.isDeleted !== true) {
                let quizzesCreatedNotDeletedHTML =
                  `
                  <div class="cell small-12 medium-12 large-12 quizCreatedDelete">
                    <h4>Access code: ${quiz.accessCode}</h4>
                  </div>
                  <div class="cell">
                  <div class="multButtonsContainer">
                    <button class="button delete" data-id="${quiz.id}">Delete Quiz</button>
                    <a href="/leaderboard/${quiz.id}">
                      <button class="button">Leaderboard</button>
                    </a>
                    <button class="button invite" data-code="${quiz.accessCode}">Invite User</button>
                  </div>
                  </div>
                  `
  
                $(`#quizCreatedLeaderboard${quiz.id}`).append(quizzesCreatedNotDeletedHTML)
              } else {
                let quizzesCreatedDeletedHTML = `<div class="cell small-12 medium-12 large-12 ">
                <a href="/leaderboard/${quiz.id}">
                  <button class="button">Leaderboard</button>
                </a>
              </div>`
                $(`#quizCreatedLeaderboard${quiz.id}`).append(quizzesCreatedDeletedHTML)
              }
            }
          }
        }
      }
    });
  }

  // displays all the questions the user
  // has taken on page load
  function loadTakenQuizzes() {
    $.ajax({
      method: "GET",
      url: "/api/quizuser",
    }).then(userInfo => {
      let userQuizzes = userInfo.quizUsers;
      let userId = userInfo.id;
  
      for (let y = 0; y < userQuizzes.length; y++) {
        let quiz = userQuizzes[y];
  
        // checks if the user has taken the quiz but is not the creator of it and
        // if the quiz has not been deleted by the creator. Then creates a html
        // template for each quiz, displaying the quiz title, leaderboard button
        // and a retake button if the quiz is retakeable
        if (quiz.UserId === userId && quiz.Quiz.creatorId !== userId && !quiz.Quiz.isDeleted) {
          $("#quizzesTaken").removeClass("hide");
          let quizzesTakenHTML =
            `
            <hr>
            <div class="grid-padding-x grid-x " id="quizTakenLeaderboard${quiz.Quiz.id}">
              <div class="cell small-12 medium-12 large-4 tdText quizTitle">
                ${quiz.Quiz.title}
              </div>
              <div class="cell small-12 medium-6 large-4 ">
                <a href="/leaderboard/${quiz.Quiz.id}">
                  <button class="button">Leaderboard</button>
                </a>
              </div>
            </div>`
          $("#quizzesTakenInfo").append(quizzesTakenHTML);
  
          if (quiz.Quiz.canRetake === true) {
            let quizzesTakenRetakeHTML =
              `
              <div class="cell small-12 medium-6 large-4 quizCreatedDelete">
                <a href = "/quiz/${quiz.Quiz.accessCode}">
                  <button class="button" data-id="${quiz.Quiz.id}">Retake</button>
                </a>
              </div>`
            $(`#quizTakenLeaderboard${quiz.Quiz.id}`).append(quizzesTakenRetakeHTML)
          }
        }
      }
    });
  }
 
  // makes a DELETE request when delete is clicked,
  // reloads the page and now only displays the
  // leaderboard button for the quiz deleted
  $(document).on("click", ".delete", function (event) {
    event.preventDefault();
    let id = $(this).data("id");

    $.ajax({
      method: "DELETE",
      url: "/quiz/delete/" + id,
    }).then(deleted => {
      location.reload()
    })
  });


  loadCreatedQuizzes();
  loadTakenQuizzes();
});






