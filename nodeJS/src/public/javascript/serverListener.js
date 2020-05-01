//serverListener module
var socket = io();
$(document).ready(() => {
    socket.on('refresh',() => {
        window.location.reload();
    });

// aggiornare tabella degli hilights
    socket.on('changedRow', (msg) => {
      $.ajax({
          url: "./getTable"
      }).done(function(data){
          // replace table con quella nuova(data)
          $('table').replaceWith(data);
      })
    });

    socket.on('newEndPoint', (data) => {
      $.ajax({
          url: "./toEdit"
      })
    });

// aggiornare loadingProgressBar
    socket.on('progress', (data) => {
      if (!($('#loadingProgressBar').lenght)) {
        $.ajax({
            url: "./toLoading"
        })
      } else {
        updateLoadingProgressBar(data)
      }
    });

// aggiornare a fine elaborazione, il parametro data si aspetta una stringa 'done' se tutto ok
    socket.on('finish', (data) => {
// faccio chiamata a api per settare la active page = .toFileExplorer
      if (data === 'done') {
        $.ajax({
            url: "./toFileExplorer"
        })
      } else {
        alert('Error on finish: ' + data);
      }

// // se il ruter prima del messaggio campbia la active page va bene questa versione
//       if (data === 'done') {
//         window.location.reload();
//       }

    });

// aggiornare la lista di video della view fileExplorer contente i video su s3
    socket.on('changeFile', (foo) => {
      $.ajax({
          url: "./getFileList"
      }).done(function(data){
          // replace titleList con quella nuova(data)
          $('tileList').replaceWith(data);
      })
    });


    $("#carica").click(() => {
        alert("Caricamento da interfaccia non ancora disponibile, utilizzare AWS CLI");
    });
    $("#start").click(function(){
        $.ajax({
            url: "./toLoading"
        }).done(function(data){
            window.location.reload();
        })
    });
    $("#progress-style").click(function(){
        $.ajax({
            url: "./toEdit"
        }).done(function(data){
            window.location.reload();
        })
    });
    $("#backLink").click(function(){
        $.ajax({
            url: "./toFileExplorer"
        }).done(function(data){
            window.location.reload();
        })
    });
    $('#confirm').click(() => {
        alert("Non è ancora possibile eseguire il montaggio");
    });
    $('#inputGroupSelect01').change(() => {
        alert("Non è ancora possibile cambiare la modalità video");
    });
    $('#tableReset').click(() => {
        alert("Non è ancora possibile ripristinare i valori della tabella agli originali");
    });
    $('#addRow').click(() => {
        alert("Non è ancora possibile aggiungere righe alla tabella dei riconoscimenti");
    });
});

// modifica la width della loading progressbar
function updateLoadingProgressBar(data) {
// // con handlebars
//   var template = Handlebars.compile('progressBar.hbs');
//   var pagina = template({progression: data});
//   pagina.print();

// con jquery
  $(#loadingProgressBar).css('width', data+'%');
  $(#loadingProgressBar).attr('aria-valuenow', data);

  // forse si vuole modificare la 'notifyProgressionUpdate' in router.js e includere il messaggio di refresh
  if (data >= 100) {
    $.ajax {
      url: './toEdit'
    }
  }
}
