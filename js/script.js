// 00002df241840d94211828fc4ba8540c api_key

// Creare un layout base con una searchbar (una input e un button) in cui possiamo scrivere completamente o parzialmente il nome di un film. Possiamo, cliccando il  bottone, cercare sull’API tutti i film che contengono ciò che ha scritto l’utente.
// Vogliamo dopo la risposta dell’API visualizzare a schermo i seguenti valori per ogni film trovato:
// Titolo
// Titolo Originale
// Lingua
// Voto

$(document).ready(function() {

  // Eseguo la ricerca API quando premo il tasto Invio
  $('input').keypress(function(event) {
    if (event.which === 13 ) { // dove 13 è il codice numerico attribuito al tasto Invio
      variabiliDaRichiamare();
    }
  })


  // funzione che fa chiamata Ajax e restituisce un oggetto che viene poi compilato dalla funzione stampaFilm
  function chiamaFilm(nomeFilm, numeroPagina, url) {
    $.ajax({
      url: url,
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
        stampaFilm(listaFilm, oggettoApi, paginaAttuale, url);
      },
      error: function() {
        alert('errore server');
      }
    })
  }

  // funzione che stampa i risultati ottenuti dalla chiamata Ajax
  function stampaFilm(listaFilm, oggettoApi, paginaAttuale, url) {
    var source = $('#entry-template').html(); // questo e il path al nostro template html
    var template = Handlebars.compile(source); // passiamo a Handlebars il percorso del template html


    // ciclo sul array di oggetti restituito dall API
    if (url == 'https://api.themoviedb.org/3/search/movie') {
      for (var i = 0; i < listaFilm.length; i++) {
        var nomeFilm = listaFilm[i].title;
        var nomeOriginaleFilm = listaFilm[i].original_title;
        var linguaFilm = listaFilm[i].original_language;
        var votoFilm = listaFilm[i].vote_average;
        var locandina = listaFilm[i].poster_path;
        var overview = listaFilm[i].overview;


        var context = { titolo: nomeFilm, titolooriginale: nomeOriginaleFilm, linguafilm: chiamaNazione(linguaFilm), votofilm: chiamaVoto(votoFilm), locandina: stampaLocandina(locandina), schedafilm: troncaOverview(overview, 20, '...') };

        var html = template(context);
        $('.risultati').append(html);
      }
    }
    else if (url == 'https://api.themoviedb.org/3/search/tv') {
      for (var i = 0; i < listaFilm.length; i++) {
        var nomeFilm = listaFilm[i].name;
        var nomeOriginaleFilm = listaFilm[i].original_name;
        var linguaFilm = listaFilm[i].original_language;
        var votoFilm = listaFilm[i].vote_average;
        var locandina = listaFilm[i].poster_path;
        var overview = listaFilm[i].overview;


        var context = { titolo: nomeFilm, titolooriginale: nomeOriginaleFilm, linguafilm: chiamaNazione(linguaFilm), votofilm: chiamaVoto(votoFilm), locandina: stampaLocandina(locandina), schedafilm: troncaOverview(overview, 20, '...') };

        var html = template(context);
        $('.risultati').append(html);
      }
    }

  }

  // da questa funzione posso modificare le variabili url API, input e che parametri passare alla funzione chiamaFilm
  function variabiliDaRichiamare() {
    $('.risultati').html(''); // mi resetta l html dei risultati
    var nomeRicercato = $('#titoloricercato').val(); // recupero il titolo scritto dall utente
    var urlAPIFilm = 'https://api.themoviedb.org/3/search/movie';
    var urlAPITv = 'https://api.themoviedb.org/3/search/tv';
    chiamaFilm(nomeRicercato, 1, urlAPIFilm);
    chiamaFilm(nomeRicercato, 1, urlAPITv);
  }

  // funzione che verifica la lingua dello show e ne mostra la bandiera correlata
  function chiamaNazione(linguaFilm) {
    switch (linguaFilm) {
      case 'en':
        var flag = 'img/usa.png';
        break;
      case 'fr':
        flag = 'img/france.png';
        break;
      case 'it':
        flag = 'img/italy.png';
        break;
      case 'ja':
        flag = 'img/japan.png';
        break;
      case 'es':
        flag = 'img/spain.png';
        break;
      default:
        flag = 'img/icon.png'
    }
    return flag;
  }

  // funzione che prende il voto del film/show dall API e lo trasforma in un punteggio da 1 a 5 espresso in stelle
  function chiamaVoto(votoFilm) {
    var voto5Stelle = Math.ceil(votoFilm/2);
    var stellaPiena = '';
    for (var i = 0; i < voto5Stelle; i++) {
      stellaPiena += '<i class="fas fa-star"></i>';
    }
    var stellaVuota = '';
    for (var i = 5; i > voto5Stelle; i--) {
      stellaVuota += '<i class="far fa-star"></i>';
    }
    var totaleStelle = stellaPiena + stellaVuota;
    return totaleStelle;
  }

  function stampaLocandina(locandina) {
    if (locandina == null) {
      var urlCompletoLocandina = 'img/noimage.png';
      return urlCompletoLocandina;
    }
    var urlInizialeLocandina = 'https://image.tmdb.org/t/p/w342';
    var urlCompletoLocandina = urlInizialeLocandina + locandina;
    return urlCompletoLocandina;
  }

  // funzione che tronca la overview se essa supera piu di 20 parole
  function troncaOverview(overview, limit, after) {
    var content = overview;
    if (content.length == 0) {
      var content = 'Per questo film non è disponibile la trama';
      return content;
    }
    content = content.split(' ').slice(0, limit);
    content = content.join(' ') + (after ? after : '');
    return content;
  }

})
