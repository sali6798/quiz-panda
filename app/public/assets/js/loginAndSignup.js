$(document).ready(function () {
    let validUsername = false;
    let validPassword = false;
    let validEmail = false;
    let validName = false;

    // display error message at the bottom of the input element
    // and outline the input in red, return false if it needs
    // to be validated
    function displayErrorMessage(element, message, needValidate) {
        // remove existing message if it exists
        if (element.parent().children()[2]) {
            element.parent().children()[2].remove();
        }

        // create a new message with font color red
        const errorMsg = $("<p>").text(message).addClass("formError");
        // append it to the div that holds the input element
        // element.parent().parent().append(errorMsg);
        element.parent().append(errorMsg);
        // add red border to input element
        element.addClass("invalidInput");
        if (needValidate) {
            return false;
        }
        return;
    }

    // remove error message and red outline and return true if
    // validation is needed
    function removeErrorMessage(element, needValidate) {
        // remove message
        if (element.parent().children()[2]) {
            element.parent().children()[2].remove();
        }
        // remove red border
        element.removeClass("invalidInput");
        if (needValidate) {
            return true;
        }
        return;
    }

    // checks immediately after user clicks out of first name input field or
    // last name input field if it is valid i.e. not an empty string
    $(".userInfoForm :input[name=firstName], .userInfoForm :input[name=lastName]").blur(function () {
        const name = $(this).val().trim();

        if (name === "") {
            validName = displayErrorMessage($(this), "Must enter a name!", true);
        }
        else {
            validName = removeErrorMessage($(this), true);
        }
    })

    // checks immediately after user clicks out of username input field if it 
    // is valid i.e. username has not been taken already
    $(".userInfoForm :input[name=username]").blur(function () {
        const username = $(this).val().trim();

        // make a GET request to see if the response from the server
        // is null or not. If it null, username is free to take, else
        // display an error message
        $.ajax({
            method: "GET",
            url: "/api/users/" + username
        }).then(response => {
            if (response !== null) {
                validUsername = displayErrorMessage($(this), "Username is already taken!", true);
            }
            else {
                validUsername = removeErrorMessage($(this), true);
            }
        })
    })

    // checks immediately after user clicks out of password input field if it 
    // is valid i.e. password is at least 8 characters
    $(".userInfoForm :input[name=password]").blur(function () {
        const password = $(this);
        const confirmPassword = $(".userInfoForm :input[name=confirmPassword]");

        if (password.val().length < 8) {
            displayErrorMessage(password, "Password must be at least 8 characters!", null);
            // doesn't allow you to type in the confirm password input field
            // until the password is a valid length
            confirmPassword.attr("readonly", true);
        }
        else {
            removeErrorMessage(password, null);
            // valid length, can now enter confirm password
            confirmPassword.attr("readonly", false);
        }
    });

    // checks immediately after user clicks out of password input field or 
    // confirm password input field if both passwords match
    $(".userInfoForm :input[name=password], .userInfoForm :input[name=confirmPassword]").blur(function () {
        const password = $(".userInfoForm :input[name=password]");
        const confirmPassword = $(".userInfoForm :input[name=confirmPassword]");

        // do not match, display error and give password input a red border too
        if (password.val() !== confirmPassword.val()) {
            validPassword = displayErrorMessage(confirmPassword, "Passwords do not match!", true);
            confirmPassword.val("");
            password.addClass("invalidInput");
        }
        else {
            password.removeClass("invalidInput");
            validPassword = removeErrorMessage(confirmPassword, true);
        }
    });

    // checks immediately after user clicks out of email input field 
    // if the email is in a valid form
    $(".userInfoForm :input[name=email]").blur(function () {
        const email = $(this);

        // check email is a valid format [A-Za-z0-9_-.]@[A-Za-z0-9_-.].[a-zA-Z]
        var valid = /^[\w\.-]+@[\w\.-]+\.[a-zA-Z]{2,7}$/g;
        if (!valid.test(email.val().trim())) {
            validEmail = displayErrorMessage(email, "Not a valid email!", true);
        }
        else {
            validEmail = removeErrorMessage(email, true);
        }
    });

    // when user submits the form, if all inputs are valid, 
    // makes a POST request to create a new user
    $(".userInfoForm").on("submit", function (event) {
        event.preventDefault();

        if (validName && validUsername && validPassword && validEmail) {
            // create a new user object
            const user = {
                firstName: $(".userInfoForm :input[name=firstName]").val().trim(),
                lastName: $(".userInfoForm :input[name=lastName]").val().trim(),
                username: $(".userInfoForm :input[name=username]").val().trim(),
                password: $(".userInfoForm :input[name=password]").val(),
                email: $(".userInfoForm :input[name=email]").val().trim()
            }

            // make a POST request to create the user
            $.ajax({
                method: "POST",
                data: user,
                url: "/api/users"
            }).then(() => {
                // if user was created successfully, redirects them
                // to the logged in profile page already
                location.href = "/profile"
            }).catch(err => {
                console.log(err);
            })
        }
    });

    // logs user in if entered username and password match
    $("#loginForm").on("submit", function (event) {
        event.preventDefault();

        const username = $("#loginForm :input[name=username]").val().trim();
        const password = $("#loginForm :input[name=password]").val()

        if (username === "" || password === "") {
            $("#loginError").text("Must enter a username and password!");
        }
        else {
            console.log(password)
            const user = {
                username: username,
                password: password
            }

            // make post request with login information
            $.ajax({
                method: "POST",
                data: user,
                url: "/login"
            }).then(data => {
                // relocates to profile page if successful
                if (data === "OK") {
                    location.href = "/profile"
                }
                else {
                    // if log in does not exist, display error message
                    $("#loginError").text("Username or password is wrong!");
                    $("#loginForm :input[name=password]").val("");
                }
            }).catch(err => {
                console.log(err);
            })
        }
    })
})