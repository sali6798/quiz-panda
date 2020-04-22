$(document).ready(function () {
    let validUsername = false;
    let validPassword = false;
    let validEmail = false;
    let validName = false;

    function displayErrorMessage(element, message, validVar) {
        element.parent().siblings().remove();
        const errorMsg = $("<p>").text(message).addClass("formError");
        element.parent().parent().append(errorMsg);
        element.addClass("invalidInput");
        if (validVar !== null) {
            validVar = false;
            console.log(validVar)
        }
    }

    function removeErrorMessage(element, validVar) {
        element.parent().siblings().remove();
        element.removeClass("invalidInput");
        if (validVar !== null) {
            validVar = true;
            console.log(validVar)
        }
    }


    $("#signupForm :input[name=firstName], #signupForm :input[name=lastName]").blur(function () {
        const name = $(this).val().trim();

        if (name === "") {
            // $(this).parent().siblings().remove();
            // const errorMsg = $("<p>").text("Must enter a name!").addClass("formError");
            // $(this).parent().parent().append(errorMsg);
            // $(this).addClass("invalidInput");
            // validName = false;
            displayErrorMessage($(this), "Must enter a name!", validName);
        }
        else {
            // $(this).parent().siblings().remove();
            // $(this).removeClass("invalidInput");
            // validName = true;
            removeErrorMessage($(this), validName);
        }
    })

    $("#signupForm :input[name=username]").blur(function () {
        const username = $(this).val().trim();

        $.ajax({
            method: "GET",
            url: "/api/users/" + username
        }).then(response => {
            if (response !== null) {
                // $(this).parent().siblings().remove();
                // const errorMsg = $("<p>").text("Username is already taken!").addClass("formError");
                // $(this).parent().parent().append(errorMsg);
                // $(this).addClass("invalidInput");
                // validUsername = false;
                displayErrorMessage($(this), "Username is already taken!", validUsername);
            }
            else {
                // $(this).parent().siblings().remove();
                // $(this).removeClass("invalidInput");
                // validUsername = true;
                removeErrorMessage($(this), validUsername);
            }
        })
    })

    $("#signupForm :input[name=password]").blur(function () {
        const password = $(this);
        const confirmPassword = $("#signupForm :input[name=confirmPassword]");

        if (password.val().length < 8) {
            // password.parent().siblings().remove();
            // const errorMsg = $("<p>").text("Password must be at least 8 characters!").addClass("formError");
            // password.parent().parent().append(errorMsg);
            // password.addClass("invalidInput");

            displayErrorMessage(password, "Password must be at least 8 characters!", null);
            password.val("");
            confirmPassword.attr("readonly", true);
        }
        else {
            // password.parent().siblings().remove();
            // password.removeClass("invalidInput");
            removeErrorMessage(password, null);
            confirmPassword.attr("readonly", false);
        }
    });

    $("#signupForm :input[name=password], #signupForm :input[name=confirmPassword]").blur(function () {
        const password = $("#signupForm :input[name=password]");
        const confirmPassword = $("#signupForm :input[name=confirmPassword]");
        if (password.val() !== confirmPassword.val()) {
            // confirmPassword.parent().siblings().remove();
            // confirmPassword.addClass("invalidInput");
            // const errorMsg = $("<p>").text("Passwords do not match!").addClass("formError");
            // confirmPassword.parent().parent().append(errorMsg);
            // validPassword = false;

            displayErrorMessage(confirmPassword, "Passwords do not match!", validPassword);
            confirmPassword.val("");
            password.addClass("invalidInput");
        }
        else {
            password.removeClass("invalidInput");
            removeErrorMessage(confirmPassword, validPassword);
            // confirmPassword.removeClass("invalidInput");
            // confirmPassword.parent().siblings().remove();
            // validPassword = true;
        }
    });

    $("#signupForm :input[name=email]").blur(function () {
        const email = $(this);

        // check email is a valid format ____@____.____
        var valid = /^[\w\.-]+@[\w\.-]+\.[a-zA-Z]{2,7}$/g;
        if (!valid.test(email.val().trim())) {
            // email.parent().siblings().remove();
            // email.addClass("invalidInput");
            // const errorMsg = $("<p>").text("Not a valid email!").addClass("formError");
            // email.parent().parent().append(errorMsg);
            // validEmail = false;
            displayErrorMessage(email, "Not a valid email!", validEmail);
        }
        else {
            // email.removeClass("invalidInput");
            // email.parent().siblings().remove();
            // validEmail = true;
            removeErrorMessage(email, validEmail);
        }
    });

    $("#signupForm").on("submit", function (event) {
        event.preventDefault();
        console.log("inside submit")
        console.log(validName && validUsername && validPassword && validEmail)
        if (validName && validUsername && validPassword && validEmail) {
            console.log("hello")
            const newUser = {
                firstName: $("#signupForm :input[name=firstName]").val().trim(),
                lastName: $("#signupForm :input[name=lastName]").val().trim(),
                username: $("#signupForm :input[name=username]").val().trim(),
                password: $("#signupForm :input[name=password]").val(),
                email: $("#signupForm :input[name=email]").val().trim()
            }

            $.ajax({
                method: "POST",
                data: newUser,
                url: "/api/users"
            }).then(() => {
                location.href = "/profile"
            }).catch(err => {
                console.log(err);

            })
        }
    });

    $("#loginForm").on("submit", function (event) {
        event.preventDefault();
        const user = {
            username: $("#loginForm :input[name=username]").val().trim(),
            password: $("#loginForm :input[name=password]").val()
        }

        $.ajax({
            method: "POST",
            data: user,
            url: "/login"
        }).then(data => {
            location.href = "/profile"
        }).catch(err => {
            console.log(err);
            // if log in does not exist, display error message
            $("#loginError").text("Username or password is wrong!");
            $("#loginForm :input[name=password]").val("");
        })
    })
})