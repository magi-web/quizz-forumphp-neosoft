let sliders = document.querySelectorAll('.slider');
sliders.forEach(function (elem) {
    resetSlider(elem);
    renderSliderValue(elem);
    elem.oninput = function () {
        renderSliderValue(this)
    };
});

function resetSlider(elem) {
    if (elem.hasAttribute('data-default')) {
        elem.value = elem.getAttribute('data-default');
    }
}

function renderSliderValue(elem) {
    let valueLabel = elem.value;
    let maxValueParam = null;
    if (elem.hasAttribute('data-maxValueLabel') && parseInt(elem.value) === parseInt(elem.getAttribute('max'))) {
        valueLabel = elem.getAttribute('data-maxValueLabel');
        maxValueParam = valueLabel;
    }
    let nextSibling = elem.nextElementSibling;
    nextSibling.innerHTML = valueLabel;
    if (valueLabel === maxValueParam) {
        nextSibling.classList.add('max-value-reached');
    } else {
        nextSibling.classList.remove('max-value-reached');
    }
}

function objectifyForm(formArray) {//serialize data function
    var returnArray = {};
    for (var i = 0; i < formArray.length; i++) {
        var value = formArray[i][1];
        if (formArray[i][0] in returnArray) {
            value = returnArray[formArray[i][0]] + ',' + value;
        }
        returnArray[formArray[i][0]] = value;
    }
    return returnArray;
}

function storeSelection(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    let object = objectifyForm(Array.from(
        new FormData(document.forms[0])
    ));
    let now = new Date();
    let key = now.toISOString();
    let value = JSON.stringify(object);
    localStorage.setItem(key, value);
    return false;
}

function exportLocalStorage() {
    let content = '';
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        let value = localStorage.getItem(key);
        content += key + ':' + value + '\r\n';
    }

    return content;
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function saveLocalStorageToFile() {
    let content = exportLocalStorage();
    let now = new Date();
    let file = 'quizz-' + now.toUTCString() + '.txt';
    download(file, content);
}

function getEmailField() {
    return document.getElementById('email');
}

function isEmailValid() {
    let email = getEmailField();

    // On reset le customValidity.
    email.setCustomValidity('');

    let valid = email.checkValidity();
    if (valid && isNonUniqueEmail()) {
        valid = false;
        email.setCustomValidity('Cet email est déjà présent. Veuillez entrer une adresse différente.');
    }
    return email.value.trim() === '' || valid;
}

function isNonUniqueEmail() {
    let email = getEmailField().value;

    let emails = localStorage.getItem('emails');
    let isNonUnique = false;
    if (emails !== null) {
        emails = emails.split('|');
        isNonUnique = emails.indexOf(email) !== -1;
    }
    return isNonUnique;
}

function storeEmail() {
    let email = getEmailField();

    if (email.value.trim() !== '') {
        let emails = localStorage.getItem('emails');
        if (emails === null) {
            emails = '';
        } else {
            emails += '|';
        }
        emails += email.value;

        localStorage.setItem('emails', emails);
    }
}


function onRenewParty(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }

    let renew = false;
    if (isEmailValid()) {
        storeEmail();
        renew = confirm('C\'est terminé ! Revenir au début ?');
        if (renew) {
            document.forms[0].reset();
            navigateTo('div#q0');
            historyEvents = [];
        }
    } else {
        let email = getEmailField();
        alert(email.validationMessage);
        email.focus();
    }
    return renew;
}

document.forms[0].reset();

document.forms[0].onsubmit = function (e) {
    e.preventDefault();
    e.stopPropagation();
};