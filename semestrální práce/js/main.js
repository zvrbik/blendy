/****************************** globalni promenne  ********************************/
//existuji po celou dobu behu programu

//promenna, ktera odpovida tlacitku "generovat" v html
var buttonSubmit = document.querySelector('#submitButton');

//promenna, ve ktere jsou data ulozena jako textovy retezec primo z input pole v html
var inputWords = document.querySelector('#floatingTextarea2');

//promenna typu pole, do ktere se ukladaji jednotliva vstupni slova
var wordsArray = new Array();

//promenna typu pole, v niz jsou jiz ulozena osvedcena slova
var provenWordsArray = ["you", "guarantee", "instant", "fast", "easy", "free", "now", "new"];

//promenna typu pole, do ktere se ukladaji generovana slova spolu s vysvetlenim slozeniny
var generatedResults = new Array();

//promenna typu pole, do ktere se ukladaji pouze generovana slova
var generatedNames = new Array();


/****************************** pomocne funkce  ********************************/

// deklarace funkce generate()
// volá funkci kombinuj a vklada do ni vsechny mozne kombinace vstupnich slov 
function generate() {

    // inicializace promennych - nastaveni poli na prazdna pole 
    // (pro pripad, ze uzivatel bude generovat vickrat po sobe bez znovunacteni stranky)
    generatedResults = [];
    generatedNames = [];

    wordsArray.forEach(function (word1) {
        wordsArray.forEach(function (word2) {
            kombinuj(word1, word2);
        });
    });

    provenWordsArray.forEach(function (word1) {
        wordsArray.forEach(function (word2) {
            kombinuj(word1, word2)
        });
    });
}

// deklarace funkce kombinuj()
// jako vstupni parametry jsou vzdy dve slova (kombinace slov z funkce generate())
function kombinuj(word1, word2) {
    for (var delka = 2; delka <= 3; delka++) {
        var sub1 = word1.substring(word1.length - delka, word1.length);
        var sub2 = word2.substring(0, delka);

        if (sub1 == sub2) {
            var sub2b = word2.substring(delka);
            var word = word1 + sub2b;
            var result = word + " = " + word1 + " + " + word2;

            // pokud se podari vytvorit kombinaci, tak ji vklada do pole
            // generatedResults v podobe: vysledek = slovo1 + slovo2
            // generatedNames v podobe: vysledek 
            generatedResults.push(result);
            generatedNames.push(word);
            //console.log(word, "+ result:", result);

            //volani funkce - dotaz na pocet vyskytu daneho slova
            gooleQuery(word);
        }
    }

    if (word2 != word1 && word1[1] == word2[0]) {
        var word = word1[0] + word2;
        var result = word + " = " + word1 + " + " + word2;

        // pokud se popdari vytvorit kombinaci, tak ji vklada do pole 
        // generatedResults v podobe: vysledek = slovo1 + slovo2
        // generatedNames v podobe: vysledek 
        generatedResults.push(result);
        generatedNames.push(word);

        //volani funkce - dotaz na pocet vyskytu daneho slova
        gooleQuery(word);
    }
    else if(word2 != word1 && word2[1] == word1[0])
    {
        var word = word2[0] + word1;
        var result = word + " = " + word2 + " + " + word1;

        // pokud se podari vytvorit kombinaci, tak ji vklada do pole 
        // generatedResults v podobe: vysledek = slovo1 + slovo2
        // generatedNames v podobe: vysledek 
        generatedResults.push(result);
        generatedNames.push(word);

        //volani funkce - dotaz na pocet vyskytu daneho slova
        gooleQuery(word);
    }
}

// deklarace asynchronni funkce, ktera zjistuje pocet vyskytu na google
// parametr word je slovo, na ktere se dotazujeme
function gooleQuery(word) {

    // pouzite API https://developers.google.com/custom-search/v1/reference/rest/v1/cse/list

    var key = "AIzaSyCf3BRI-SUBUxlQJtacOUkdeIMZmOJ7ZWs";

    // v promenne url je adresa na Google API
    var url = 'https://www.googleapis.com/customsearch/v1?key=' + key + '&cx=c529aec4f0a164204&q=' + word + '&alt=json&fields=queries(request(totalResults))';

    console.log(url);
    // asynchronni dotaz na pocet vyskytu
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            console.log(myJson);

            // promenna s poctem vyskytu
            //var totalResults = myJson.queries.request[0]
            var totalResults = myJson.queries.request[0].totalResults;
            //console.log(totalResults);

            //nalezne index slova v poli generatedNames
            var index = generatedNames.indexOf(word);

            // v poli generatedResults se doplni ke stavajici hodnote pocet vyskytu (totalResults)
            // pole generatedNames a generatedResults maji polozky usporadany ve stejnem poradi
            // diky tomu muzeme vyuzit stejny index pro obe pole
            // tento zapis (parseInt(totalResults).toLocaleString()) slouzi k tomu, aby bylo cislo ve formátu s mezerami po tisících
            generatedResults[index] = generatedResults[index] + " | počet výskytů: " + parseInt(totalResults).toLocaleString();

            // vysledek vypiseme uzivateli pomoci funkce printToHtml
            printToHtml(generatedResults[index], "generatedWords");
        })
        .catch(function (error) {
            console.log(error);
        })
        ;
}

//deklarace funkce, ktera vytvori <li> element v html (uvnitr <ol> s zadanym id) pro kazdou polozku pole 
function printToHtml(contentToPrint, elementID) {

    // najde rodicovsky element v html
    var list = document.getElementById(elementID);

    //uvnitr vytvori novy <li> element
    var inputNode = document.createElement("LI");

    // vepise do nej obsah promenne contentToPrint
    var textnodeInput = document.createTextNode(contentToPrint);
    inputNode.appendChild(textnodeInput);
    list.append(inputNode);
}

/****************************** hlavni funkce  ********************************/

//funkce buttonSubmit se vykona po kliknuti na tlacitko "generovat" v html
buttonSubmit.onclick = function () {


    // do wordsArray (pole) ukladas jednotliva slova z textoveho retezce, oddelovacem slov (split) je mezera
    var input = inputWords.value;
    wordsArray = input.split(" ");
    console.log(wordsArray);

    // nema cenu nic generovat pokud nejsou zadana alespon dve slova
    if (wordsArray.length >= 1) {
        generate();
    }
}