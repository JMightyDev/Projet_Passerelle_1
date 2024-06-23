const mots = [
    "bandit",
    "brigand",
    "sherif",
    "mustang",
    "lasso",
    "revolver",
    "saloon",
    "colt",
    "ranch",
    "rodeo",
    "bison",
    "eperon",
    "desperado",
    "farouche",
    "whisky",
    "betail",
    "sixcoups",
    "diligence",
    "colline",
    "apache",
    "sombrero",
    "gibier",
    "embuscade",
    "trappeur",
    "cowgirl",
    "scalp",
    "etable",
    "fusillade",
    "duelliste",
    "farwest",
    "pionnier",
    "troupeau",
    "eclaireur",
    "burlesque",
    "caravanes",
    "banqueroute",
    "diligente",
    "flibustier",
    "banque",
    "buffle"
];

let motSelectionne;
let nbErreurs;
let nbLettres;
let intervalPair;
let intervalImpair;

function motAleatoire(tabMots) {
    return tabMots[Math.floor(Math.random() * tabMots.length)];
}

function init() {
    motSelectionne = motAleatoire(mots);
    nbLettres = motSelectionne.length;
    nbErreurs = 0;
    $('#motATrouver').text('');
    for (i = 0; i < nbLettres; i++) {
        document.querySelector('#motATrouver').textContent += "_";
    }
    $('#nbLettres').text(nbLettres);
    $('.btnLettre').prop("disabled", false);
    $('#indice').show();
    $('#btnReset').hide();
}

//Moyen simple trouvé sur le net pour remplacer un caractère à un endroit précis dans une chaine... Y'a moyen de faire autrement, je sais, mais bon j'avais la flemme du développeur !
function setCharAt(str, index, chr) {
    if (index > str.length - 1) {
        return str;
    }
    return str.substring(0, index) + chr + str.substring(index + 1);
}

// Fonction pour faire clignoter un bouton
function clignoterBouton(button) {
    button.css('background-color', 'gold');
    setTimeout(function() {
        button.css('background-color', '#E0A75E');
    }, 100);
}

function faireClignoter() {
      // Appliquer le clignotement alterné aux boutons pairs et impairs
      intervalPair = setInterval(function() {
        $('.btnLettre').each(function(index) {
            if (index % 2 === 0) { // Boutons pairs
                const button = $(this);
                clignoterBouton(button);
            }
        });
    }, 200); // Intervalle de clignotement pour les boutons pairs
    
    // Appliquer le clignotement alterné aux boutons impairs avec un délai de 500ms
    intervalImpair = setInterval(function() {
        setTimeout(function() {
            $('.btnLettre').each(function(index) {
                if (index % 2 !== 0) { // Boutons impairs
                    const button = $(this);
                    clignoterBouton(button);
                }
            });
        }, 500); // Délai de 500ms pour les boutons impairs
    }, 200); // Intervalle de clignotement pour les boutons impairs
}

function arreterClignotements() {
    clearInterval(intervalPair);
    clearInterval(intervalImpair);
}

function verif(actionManuelle) {
    $('#consignes').hide();
    if ($('#motATrouver').text() === motSelectionne || $('#mdp').val().toLowerCase() === motSelectionne) {
        //C'est gagné !
        $('#titre').show();
        $('#titre').text('Bravo !');
        $('#indice').hide();
        $('#btnReset').show();
        $('#pendu').attr("src", 'images/tresor.webp');
        $('.btnLettre').prop("disabled", true);
        $('#motATrouver').text(motSelectionne);
        $('#btnVerif').prop('disabled', true);
        $('#mdp').prop('disabled', true);
        $('#mdp').css('cursor', 'not-allowed');
        $('#btnVerif').css('cursor', 'not-allowed');
        faireClignoter();
    } else if(!actionManuelle) {
        nbErreurs++;
        $('#pendu').attr("src", 'images/pendu'+nbErreurs+'.png');
        if (nbErreurs > 0) {
            $('#pendu').show();
        }
        if (nbErreurs == 8) {
            perdu();
        }
    }
}

function perdu() {
    $('#titre').show();
    $('#titre').text('Perdu !');
    $('#indice').hide();
    $('#btnReset').show();
    $('.btnLettre').prop('disabled', true);
    $('#btnVerif').prop('disabled', true);
    $('#btnVerif').css('cursor', 'not-allowed');
    $('#mdp').prop('disabled', true);
    $('#mdp').css('cursor', 'not-allowed');
}

function reset() {
    init();
    $('#consignes').hide();
    $('#pendu').hide();
    $('#titre').hide();
    $('#pendu').attr("src", 'images/pendu1.png');
    $('#btnVerif').prop('disabled', false);
    $('#btnVerif').css('cursor', 'pointer');
    $('#mdp').prop('disabled', false);
    $('#mdp').css('cursor', 'initial');
    $('#mdp').val('');
    arreterClignotements();
}

//Amélioration made in chatGPT pour le fun
$('#mdp').on('keydown', function(event) {
    // Allow: backspace, delete, escape, enter, home, end, arrow keys, Ctrl+A, Ctrl+C, Ctrl+X
    if (event.key.length === 1 && !/[a-zA-Z]/.test(event.key)) {
        event.preventDefault();
    } else if ([46, 8, 27, 13, 35, 36, 37, 38, 39, 40].indexOf(event.keyCode) !== -1 ||
               (event.keyCode === 65 && (event.ctrlKey === true || event.metaKey === true)) || // Ctrl+A
               (event.keyCode === 67 && (event.ctrlKey === true || event.metaKey === true)) || // Ctrl+C
               (event.keyCode === 88 && (event.ctrlKey === true || event.metaKey === true))) { // Ctrl+X
        // Allow these keys
        return;
    } else {
        // Ensure it is a letter and stop the keypress
        if (!/[a-zA-Z]/.test(String.fromCharCode(event.keyCode))) {
            event.preventDefault();
        }
    }
});

btnReset
$("#btnReset").on("click", () => reset());
$("#btnVerif").on("click", () => verif(false));

$('.btnLettre').on("click", function() {
    let lettreCliquee = $(this).val().toLowerCase();
    if (motSelectionne.indexOf(lettreCliquee) !== -1) {
        //lettre trouvée
        for (i=0;i<nbLettres;i++) {
            if (motSelectionne[i] === lettreCliquee) {
                $('#motATrouver').text(setCharAt($('#motATrouver').text(), i, lettreCliquee));
            }
        }
        verif(true);
    } else {
        //lettre introuvable
        $(this).prop('disabled', true);
        verif(false);
    }
});

init();