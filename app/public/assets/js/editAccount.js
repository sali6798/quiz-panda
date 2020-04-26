$(document).ready(function () {
    let validPassword = true;
    let validEmail = true;

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

    // checks immediately after user clicks out of password input field if it 
    // is valid i.e. password is at least 8 characters
    $(".userInfoForm :input[name=password]").blur(function () {
        const password = $(this);
        const confirmPassword = $(".userInfoForm :input[name=confirmPassword]");

        // if user has entered something check length
        if (password.val().length > 0 && password.val().length < 8) {
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
        // only if user has entered something 
        var valid = /^[\w\.-]+@[\w\.-]+\.[a-zA-Z]{2,7}$/g;
        if (email.val().trim().length > 0 && !valid.test(email.val().trim())) {
            validEmail = displayErrorMessage(email, "Not a valid email!", true);
        }
        else {
            validEmail = removeErrorMessage(email, true);
        }
    });

    // when user submits the form, if all inputs are valid, 
    // makes a POST request to create a new user
    $(".userInfoForm").on("submit", async function (event) {
        event.preventDefault();

        if (validPassword && validEmail) {
            const username = $(".userInfoForm :input[name=username]").val().trim();

            const userObj = await $.ajax({
                method: "GET",
                url: "/api/users/" + username
            });

            const firstName = $(".userInfoForm :input[name=firstName]").val().trim();
            const lastName = $(".userInfoForm :input[name=lastName]").val().trim();
            const password = $(".userInfoForm :input[name=password]").val();
            const email = $(".userInfoForm :input[name=email]").val().trim();

            // create a user object if the input is empty, set the value to
            // the current value from the db
            const user = {
                firstName:!firstName ? userObj.firstName : firstName,
                lastName: !lastName ? userObj.lastName : lastName,
                username: username,
                password: !password ? [userObj.password] : [password, "encrypt"],
                email: !email ? userObj.email : email
            }
            

            // make a PUT request to update the user
            $.ajax({
                method: "PUT",
                data: user,
                url: "/api/users/" + username
            }).then(updatedUser => {
                // if user was updated successfully, 
                // refreshes the page to show new info
                location.reload();
            }).catch(err => {
                console.log(err);
            })
        }
    });


    function init() {
        // navbar link change for logged in
        $('a[href="/signup"]').children().text("Profile");
        $('a[href="/signup"]').attr("href", "/profile")

        $('a[href="/login"]').children().text("Log Out");
        $('a[href="/login"]').attr("href", "/logout")

        $('a[href="/"]').attr("href", "/profile")
    }

    init();
});
