$(document).ready(function () {

    $.ajax({
        method: "GET",
        url: "/api/quizuser",
    }).then(quizInfo => {
        console.log(quizInfo);

        let quizUsers = quizInfo.quizUsers;
        console.log(quizUsers);

        let userId = quizInfo.id;
        console.log(quizInfo.id);

        console.log(quizUsers[0].Quiz.title);




        for (let i = 0; i < quizUsers.length; i++) {

            if (quizUsers[i].Quiz.creatorId != userId) {
                $("#quizzesTaken").removeClass("hide");
                let quizzesTakenHTML = `<tr>
        <td class="tdText">${quizUsers[i].Quiz.title}</td>
        <td>
          <a href="/leaderboard/${quizUsers[i].QuizId}">
            <button class="button">Leaderboard</button>
          </a>
        </td>
        <td>
          <a href="/quiz/${quizUsers[i].Quiz.accessCode}">
            <button class="button">Retake</button>
          </a>
        </td>
      </tr>`
                console.log("quizzesTakenHTML: " + quizzesTakenHTML);

                $("#quizzesTakenInfo").append(quizzesTakenHTML);
            } else {
                console.log("nope");

            }

        }

    })



})