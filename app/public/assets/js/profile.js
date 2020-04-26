$(document).ready(function () {

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

          if (quiz.creatorId === userId) {
            $("#quizzesCreated").removeClass("hide");
            let quizzesCreatedHTML =
              `<hr>
              <div class="grid-padding-x grid-x " id="quizCreatedLeaderboard${quiz.id}">
                <div class="cell small-12 medium-12 large-4 tdText quizTitle">
                ${quiz.title}
                </div>
                <div class="cell small-12 medium-6 large-4 ">
                  <a href="/leaderboard/${quiz.id}">
                    <button class="button">Leaderboard</button>
                  </a>
                </div>
              </div>`
            $("#quizzesCreatedInfo").append(quizzesCreatedHTML);
            
            if (quiz.isDeleted !== true) {
              let quizzesCreatedDeleteHTML =
                `<div class="cell small-12 medium-6 large-4 quizCreatedDelete">
                  <button class="button delete" data-id="${quiz.id}">Delete</button>
                </div>`

              $(`#quizCreatedLeaderboard${quiz.id}`).append(quizzesCreatedDeleteHTML)
            }
          }
        }
      }
    }
  })

  $.ajax({
    method: "GET",
    url: "/api/quizuser",
  }).then(userInfo => {
    let userQuizzes = userInfo.quizUsers;
    let userId = userInfo.id;
    
    for (let y = 0; y < userQuizzes.length; y++) {
      let quiz = userQuizzes[y];

      if (quiz.Quiz.creatorId !== userId && quiz.UserId !== userId) {
        $("#quizzesTaken").removeClass("hide");
        let quizzesTakenHTML =
          `<hr>
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
            `<div class="cell small-12 medium-6 large-4 quizCreatedDelete">
              <a href = "/quiz/${quiz.Quiz.accessCode}">
                <button class="button" data-id="${quiz.Quiz.id}">Retake</button>
              </a>
            </div>`
          $(`#quizTakenLeaderboard${quiz.Quiz.id}`).append(quizzesTakenRetakeHTML)
        }
      }
    }
  })
})


