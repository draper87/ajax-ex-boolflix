// 00002df241840d94211828fc4ba8540c api_key

// Creare un layout base con una searchbar (una input e un button) in cui possiamo scrivere completamente o parzialmente il nome di un film. Possiamo, cliccando il  bottone, cercare sull’API tutti i film che contengono ciò che ha scritto l’utente.
// Vogliamo dopo la risposta dell’API visualizzare a schermo i seguenti valori per ogni film trovato:
// Titolo
// Titolo Originale
// Lingua
// Voto

$(document).ready(function() {

  // Eseguo la ricerca API al click del mouse
  $('button').click(function() {
    var nomeFilmRicercato = $('#titoloricercato').val(); // recupero il titolo scritto dall utente
    chiamaFilm(nomeFilmRicercato);
  })

  // Eseguo la ricerca API quando premo il tasto Invio
  $('input').keypress(function(event) {
    if (event.which === 13 ) { // dove 13 è il codice numerico attribuito al tasto Invio
      var nomeFilmRicercato = $('#titoloricercato').val(); // recupero il titolo scritto dall utente
      chiamaFilm(nomeFilmRicercato);
    }
  })

  // se clicco su Avanti mi fa la chiamata Ajax sulla pagina successiva
  $('#pagavanti').click(function() {
    var nomeFilmRicercato = $('#titoloricercato').val(); // recupero il titolo scritto dall utente
    var paginaCorrente = parseInt($('#pagcorrente').text());
    var totalePagine = parseInt($('#numeropag').text());
    if (paginaCorrente >= totalePagine) {
      return;
    }
    chiamaFilm(nomeFilmRicercato, paginaCorrente + 1);
  })

  // se clicco su Indietro mi fa la chiamata Ajax sulla pagina precedente
  $('#pagindietro').click(function() {
    var nomeFilmRicercato = $('#titoloricercato').val(); // recupero il titolo scritto dall utente
    var paginaCorrente = parseInt($('#pagcorrente').text());
    if (paginaCorrente == 1) {
      return;
    }
    chiamaFilm(nomeFilmRicercato, paginaCorrente - 1);
  })


  // funzione che fa chiamata Ajax e restituisce un oggetto che viene poi compilato dalla funzione stampaFilm
  function chiamaFilm(nomeFilm, numeroPagina) {
    $.ajax({
      url: 'https://api.themoviedb.org/3/search/movie',
      method: 'GET',
      data: {
        api_key: '00002df241840d94211828fc4ba8540c',
        query: nomeFilm,
        language: 'it-IT',
        page: numeroPagina,
      },
      success: function(data) {
        var listaFilm = data.results;
        var oggettoApi = data;
        var paginaAttuale = data.page;
        stampaFilm(listaFilm, oggettoApi, paginaAttuale);
      },
      error: function() {
        alert('errore server');
      }
    })
  }

  // funzione che stampa i risultati ottenuti dalla chiamata Ajax
  function stampaFilm(listaFilm, oggettoApi, paginaAttuale) {
    $('.risultati').html('');
    var source = $('#entry-template').html(); // questo e il path al nostro template html
    var template = Handlebars.compile(source); // passiamo a Handlebars il percorso del template html

    var numeroPagine = oggettoApi.total_pages;
    $('#numeropag').text(numeroPagine);
    $('#pagcorrente').text(paginaAttuale);

    // ciclo?
    for (var i = 0; i < listaFilm.length; i++) {
      var nomeFilm = listaFilm[i].title;
      var nomeOriginaleFilm = listaFilm[i].original_title;
      var linguaFilm = listaFilm[i].original_language;
      var votoFilm = listaFilm[i].vote_average;


      var context = { titolo: nomeFilm, titolooriginale: nomeOriginaleFilm, linguafilm: linguaFilm, votofilm: votoFilm };

      var html = template(context);
      $('.risultati').append(html);
    }

  }



})
