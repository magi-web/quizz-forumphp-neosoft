function ready(fn) {
    if (document.readyState != 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

function triggerEvent(el, eventName, data) {
    if (window.CustomEvent) {
        var event = new CustomEvent(eventName, {detail: data});
    } else {
        var event = document.createEvent('CustomEvent');
        event.initCustomEvent(eventName, true, true, data);
    }

    el.dispatchEvent(event);
}

ready(function () {
    // Bind click sur les boutons de navigation et de départ
    let precedent = document.getElementById('precedent');
    precedent.onclick = onPrecedent;

    let buttons = document.querySelectorAll('#suivant,#q0-intro');
    Array.prototype.forEach.call(buttons, function (el, i) {
        el.onclick = onSuivant;
    });
});

function onPrecedent() {
    historyEvents.pop();
    var eventType = historyEvents.pop();
    if (typeof eventType !== 'undefined') {
        /*
        let currentActive = document.querySelector('.active');

        // Quand on navigue vers le précédent, on reinitialise le choix de l'étape qu'on quitte
        let checkedInput = currentActive.querySelector('input[type=radio][checked]');
        if (checkedInput) {
            checkedInput.removeAttribute('checked');
        }

        let textInput = currentActive.querySelector('input[type=text][value]');
        if (textInput) {
            textInput.value = '';
        }
        */

        triggerEvent(document, eventType);
    } else {
        navigateTo('#q0', '');
    }
}

function onSuivant() {
    let currentActive = document.querySelector('.questions .active');
    if (currentActive) {
        let checkedValue = currentActive.querySelector('input:checked');
        if (checkedValue)
            triggerEvent(document, checkedValue.value);
    }
}


var historyEvents = [];
var Noeud = function (transitions) {
    for (var transition in transitions) {
        if (transition.indexOf('/') === -1) {
            document.addEventListener(transition, transitions[transition]);
        } else {
            let listeTransitions = transition.split('/');
            let lastTransition = listeTransitions[(listeTransitions.length - 1)];

            document.addEventListener(lastTransition, function (listeTransitions) {
                let allMatches = true;

                listeTransitions.forEach(function (eventName, i) {
                    if (historyEvents.indexOf(eventName) === -1) {
                        allMatches = false;
                    }
                });

                if (allMatches) {
                    var transition = listeTransitions.join('/');
                    transitions[transition]();
                }
            }.bind(this, listeTransitions));
        }
    }
};

function navigateTo(selection, selectionImg, event) {
    if (typeof event !== 'undefined' && event.type !== 'click') {
        if (historyEvents.indexOf(event.type) === -1) {
            historyEvents.push(event.type);
        }
    }

    var imgSelect = selectionImg;
    if (selectionImg == null || selectionImg === "") {
        imgSelect = selection + "-img";
    }

    let questions = document.querySelectorAll('.question,.img-question');
    if (questions.length) {
        questions.forEach(function (item) {
            item.classList.remove('active');
        });
    }
    let selectionElement = document.querySelector(selection);
    if (selectionElement) {
        selectionElement.classList.add('active');
    }
    let selectionImgElement = document.querySelector(imgSelect);
    if (selectionImgElement) {
        selectionImgElement.classList.add('active');
    }

    let selectionId = null;
    if (selectionElement) {
        selectionId = selectionElement.id;
        // Permet d'afficher ou de cacher le bouton SUIVANT dans les cas suivants :
        //- DÃ©but du simulateur
        //- Message succÃ¨s (fin simulateur)
        //- Message Ã©chec (fin simulateur)
        if (selectionId === 'q0' || selectionId.slice(0, 1) === 'm' || selectionId.slice(0, 1) === 's') {
            // selectionId += ' right-block';
            // $("#suivant").hide();
        } else {
            // $("#suivant").show();
        }
    }

    let questionsContainer = document.querySelector('.questions');
    if (questionsContainer) {
        questionsContainer.removeAttribute('class');
        questionsContainer.classList.add('questions', 'justify-center', 'm-auto', selectionId);
    }
}

// Q0
new Noeud({
    '0-0': function (event) {
        document.getElementById('vache-answer').classList.add('dn');
        document.getElementById('1-1').removeAttribute('checked');
        navigateTo('div#q1', '', event);
    }
});

// Q1
new Noeud({
    'vache-1': function (event) {
        document.getElementById('vache-answer').classList.remove('dn');
        document.getElementById('1-1').setAttribute('checked', 'checked');
    },
    '1-1': function (event) {
        resetVillaAnswer();
        navigateTo('div#q2', '', event);
    }
});

// Q2
new Noeud({
    'villa-330000': function (event) {
        showVillaAnswer();
    },
    'villa-530000': function (event) {
        showVillaAnswer();
    },
    'villa-730000': function (event) {
        showVillaAnswer();
    },
    'villa-1300000': function (event) {
        showVillaAnswer();
    },
    'villa-checked': function (event) {
        navigateTo('div#qProfil', '', event);
    }
});

// QProfil
new Noeud({
    'dev': function (event) {
        navigateTo('div#qtech', '', event);
    },
    'projet': function (event) {
        navigateTo('div#qproj', '', event);
    },
    'recruteur': function (event) {
        navigateTo('div#qSujetEntreprise', '', event);
    },
    'cto': function (event) {
        navigateTo('div#qSujetEntreprise', '', event);
    },
    'ceo': function (event) {
        navigateTo('div#qSujetEntreprise', '', event);
    }
});

// Q3
new Noeud({
    'tech-1': function (event) {
        navigateTo('div#qproj', '', event);
    }
});

new Noeud({
    'proj-1': function (event) {
        navigateTo('div#qSujetEntreprise', '', event);
    }
});

new Noeud({
    'sujet-1': function (event) {
        navigateTo('div#fini', '', event);
    }
});

function resetVillaAnswer() {
    document.getElementById('villa-answer').classList.add('dn');
    document.getElementById('villa-checked').removeAttribute('checked');
}
function showVillaAnswer() {
    document.getElementById('villa-answer').classList.remove('dn');
    document.getElementById('villa-checked').setAttribute('checked', 'checked');
}