const name = $('#name');
const email = $('#mail');
const jobRoles = $('#title');
const design = $('#design');
const colorsDiv = $('#colors-js-puns');
const colors = $('#color').children();
const activities = $('.activities input');
const paymentType = $('#payment');
const paypal = $('#paypal');
const bitcoin = $('#bitcoin');
const regExEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
let total = 0;

const addMessage = (id, message) => {
    $(`#${id}`).css("background-color", "rgb(250, 69, 69)");
    errorMessage = `
            <p id='${id}-error' class='error-message'>${message}</p>
        `;
    $(`#${id}`).prev().before(errorMessage)
}

const removeMessage = (id) => {
    $(`#${id}`).css("background-color", "");
    $(`#${id}-error`).remove();
}

$(document).ready( () => {
    name.focus();
    $('#other-title').hide();
    colorsDiv.hide();
    paymentType.val('credit-card');
    paypal.hide();
    bitcoin.hide();
});

// If the "other" job role is select then the other-title
// input field will be visible. Otherwise it will be hidden.
jobRoles.change( () => {
    (jobRoles.val() === 'other') ? $('#other-title').show() : $('#other-title').hide();
});

// Will change the color options depending on which design
// was chosen.
design.change(() => {
    switch (design.val()) {
        case 'js puns':
            colorsDiv.show();
            colors.show();
            $('#color').val($(colors[0]).val());
            for (let i = 3; i < 6; i++) {
                $(colors[i]).hide()
            }
            break;
        case 'heart js':
            colorsDiv.show();
            colors.show();
            $('#color').val($(colors[3]).val());
            for (let i = 0; i < 3; i++) {
                $(colors[i]).hide()
            }
            break;
        default:
            colorsDiv.hide();
            colors.show();
            $('#color').val($(colors[0]).val());
            break;
    }
});

$('.activities').change((e) => {
    let selection = e.target;

    // Will update the total everytime a box is selected.
    const updateTotal = (operator) => {
        let price = Number($(e.target).parent().text().slice(-3));
        selection.checked ? total += price : total -= price;
    }

    // Accepts the index of the conflicting activity for the selected
    // checkbox, and will enable or disable the checkbox for the
    // conflicting time based off of whether the selected checkbox
    // is checked or not
    const conflict = (conflict) => {
        if (selection.checked) {
            $(activities[conflict]).attr('disabled', true);
            $(activities[conflict]).parent().css('color', 'grey');
        }
        else {
            $(activities[conflict]).attr('disabled', false);
            $(activities[conflict]).parent().css('color','black');
        }
    }

    // Will call conflict() if the selected checkbox has a 
    // conflicting activity, by passing in the index of the
    // conflicting activity.
    switch (selection.name) {
        case "js-frameworks":
            conflict(3);
            break;
        case "js-libs":
            conflict(4)
            break;
        case "express":
            conflict(1)
            break;
        case "node":
            conflict(2)
            break;
        default:
            break;
    }

    // Will remove the old total div from the dom.
    $('#total').remove()

    updateTotal();

    // Will render a new total div, if the total is greater than 0.
    if (total > 0) {
        $('.activities').append(`
            <div id='total'>Total: $${total}</div>
        `);
    }
})

paymentType.change(() => {
    $('#credit-card').hide();
    paypal.hide();
    bitcoin.hide();
    
    $(`#${paymentType.val()}`).show();
})

email.keyup(()=> {
    if (email.val().search(regExEmail) === -1 && email.val() !== '') {
        removeMessage('mail');
        email.css("border-color", "rgb(240, 240, 37)");
        errorMessage = `
            <p id='mail-error' class='email-message'>
                Email must be in "name@example.com" format.
            </p>
        `;
        email.prev().before(errorMessage);
    }
    else {
        removeMessage('mail');
        email.css("border-color", "");
    }
})

$('form').submit((e) => {
    e.preventDefault();
    let isValid = true;

    if (name.val() === '') {
        isValid = false;
        message = "Please enter a valid name."
        removeMessage('name');
        addMessage('name',message);
    }
    else {
        removeMessage('name')
    }

    if (email.val().search(regExEmail) === -1) {
        isValid = false;
        message = "Please enter a valid email address";
        removeMessage('mail');
        addMessage('mail',message);
    }
    else {
        removeMessage('mail');
    }

    if ( total === 0) {
        isValid = false;
        errorMessage = `
            <p id='activity-error' class='error-message'>Please select an activity.</p>
        `;
        $('#activity-error').remove();
        $('.activities').prepend(errorMessage)
    }
    else {
        $('#activity-error').remove();
    }
    
    if (paymentType.val() === 'credit-card') {
        if ($('#cc-num').val().length === 0) {
            isValid = false;
            $('#cc-num').css("background-color", "rgb(250, 69, 69)");
            errorMessage = `
                <p id='cc-num-error' class='error-message'>Please enter a credit card number.</p>
            `;
            removeMessage('cc-num');
            $('#credit-card').before(errorMessage)
        }
        else if ($('#cc-num').val().length < 13 || $('#cc-num').val().length > 16 || isNaN($('#cc-num').val())) {
            isValid = false;
            $('#cc-num').css("background-color", "rgb(250, 69, 69)");
            errorMessage = `
                <p id='cc-num-error' class='error-message'>Credit card number must be between 13 and 16 digits.</p>
            `;
            removeMessage('cc-num');
            $('#credit-card').before(errorMessage)
        }
        else {
            removeMessage('cc-num');
        }

        if ($('#zip').val().length !== 5 || isNaN($('#zip').val())) {
            isValid = false;
            $('#zip').css("background-color", "rgb(250, 69, 69)");
            errorMessage = `
                <p id='zip-error' class='error-message'>Please enter a zip code.</p>
            `;
            removeMessage('zip');
            $('#credit-card').before(errorMessage)
        }
        else {
            removeMessage('zip');
        }

        if ($('#cvv').val().length === 0) {
            isValid = false;
            $('#cvv').css("background-color", "rgb(250, 69, 69)");
            errorMessage = `
                <p id='cvv-error' class='error-message'>Please enter a cvv.</p>
            `;
            removeMessage('cvv');
            $('#credit-card').before(errorMessage)
        }
        else if ($('#cvv').val().length !== 3 || isNaN($('#cvv').val())) {
            isValid = false;
            $('#cvv').css("background-color", "rgb(250, 69, 69)");
            errorMessage = `
                <p id='cvv-error' class='error-message'>Cvv must be 3 digits.</p>
            `;
            removeMessage('cvv');
            $('#credit-card').before(errorMessage)
        }
        else {
            removeMessage('cvv');
        }
    }
    
    if (isValid) {
        location.reload();
    }
})