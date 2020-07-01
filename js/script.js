// 00002df241840d94211828fc4ba8540c api_key

// Creare un layout base con una searchbar (una input e un button) in cui possiamo scrivere completamente o parzialmente il nome di un film. Possiamo, cliccando il  bottone, cercare sull’API tutti i film che contengono ciò che ha scritto l’utente.
// Vogliamo dopo la risposta dell’API visualizzare a schermo i seguenti valori per ogni film trovato:
// Titolo
// Titolo Originale
// Lingua
// Voto

$(document).ready(function() {

  $('button').click(function() {
    var nomeFilmRicercato = $('#titoloricercato').val(); // recupero il titolo scritto dall utente
    chiamaFilm(nomeFilmRicercato);
  })


  function chiamaFilm(nomeFilm) {
    $.ajax({ // faccio chiamata Ajax per recuperare i titoli ricercati dall utente
      url: 'https://api.themoviedb.org/3/search/movie',
      method: 'GET',
      data: {
        api_key: '00002df241840d94211828fc4ba8540c',
        query: nomeFilm,
        language: 'it-IT',
        page: 1,
      },
      success: function(data) {
        var listaFilm = data.results;
        console.log(listaFilm);
        stampaFilm(listaFilm);
      },
      error: function() {
        alert('errore server');
      }
    })
  }

  function stampaFilm(listaFilm) {
    var source = $('#entry-template').html(); // questo e il path al nostro template html
    var template = Handlebars.compile(source); // passiamo a Handlebars il percorso del template html

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
