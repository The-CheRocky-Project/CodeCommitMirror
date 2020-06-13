//serverListener module
var socket = io();
$(document).ready(() => {
    socket.on('refresh',() => {
        window.location.reload();
    });

    /**
     * Vai alla pagina fileExplorer tramite una POST
     * quando viene ricevuto
     * il messaggio 'finish'
     * @param {object} data - stringa 'done' se e' andato tutto bene
     */
    socket.on('finish', (data) => {
      // faccio chiamata a api per settare la active page = .toFileExplorer
      if (data === 'done') {
          // TODO fix
        // goIndex();
      } else {
        alert('Error on finish: ' + data);
      }
    // // se il ruter prima del messaggio cambia la active page va bene questa versione
    //       if (data === 'done') {
    //         window.location.reload();
    //       }
    });

    /**
     * Aggiorna la loadingProgressBar
     * oppure
     * Vai alla pagina edit tramite una POST
     * quando viene ricevuto
     * il messaggio 'progress'
     * @param {object} data - intero 0-100 che indica la percentuale di caricamento
     */
    socket.on('progress', (data) => {
      if (document.getElementById("loadingProgressBar"))
          updateProgressBar(data);
      else
          window.location.reload();
    });

    /**
     * Vai alla pagina edit tramite una POST
     * quando viene ricevuto
     * il messaggio 'newEndPoint'
     * @param {object} data - parametro fittizio che non fa nulla
     */
    socket.on('newEndPoint', (data) => {
      // TODO da sistemare
    });

    /**
     * Aggiorna il frame video tramite chiamata API
     * quando viene ricevuto
     * il messaggio 'newVideo'
     * @param {object} data - parametro fittizio che non fa nulla
     */
    socket.on('newVideo', (data) => {
      updateStreaming();
    });

    /**
     * Aggiorna la tabella degli hilights quando viene ricevuto
     * il messaggio 'changedRow'
     * @param {object} msg - parametro fittizio che non fa nulla
     */
    socket.on('changedRow', (msg) => {
        updateTable();
    });

    /**
     * Aggiorna la lista di video alla pagina fileExplorer
     * tramite una POST
     * quando viene ricevuto
     * il messaggio 'changeFile'
     * @param {object} foo - parametro fittizio che non fa nulla
     */
    socket.on('changeFile', (foo) => {
      updateFileList();
    });

    /**
     * Al click del button preleva la key corrispondente al file che si vuole elaborare e ne
     * richiede l'elaborazione al router
     */
    $(".startBtn").click( (event) => {
        const dataToSend = {
            fileKey: event.target.getAttribute("id")
        };
        $.ajax({
            type: "POST",
            url: "selectFile",
            data: dataToSend
        }).fail(() => {
            alert("Impossibile elaborare il video " + dataToSend.fileKey);
        }).error((error) => {
            alert(error);
        });
    });

    /**
     * Al click sul button di aggiunta label, invia una richiesta al router
     * di inserire una nuovo record nella tabella
     */
    $("#addRow").click( (event) => {
        const dataToSend = {
            start: $("#newStart").val(),
            end: $("#newEnd").val(),
            modelIndex: $("#newLabel").prop('selectedIndex')
        };
        $.ajax({
            type: "POST",
            url: "addLabel",
            data: dataToSend
        }).fail(() => {
            console.log("Impossibile aggiungere una label");
            $("#newStart").val("");
            $("#newEnd").val("");
        });
    });

    /**
     * Ad ogni modifica dellos tato delle checkbox della tabella dei riconoscimenti,
     * ne effettua la richiesta di modifica al router
     */
    $(".labelCheckbox").change( (event) => {
        $.each($(".labelCheckbox"),(i, x) => {
            x.setAttribute('disabled', 'disabled()');
        });
        const data = {
            index: event.target.getAttribute('value')
        }
        const url = event.target.checked?"includeLabel":"excludeLabel";
        $.ajax({
            type: "POST",
            url: url,
            data: data
        }).error((error) => {
            alert(error);
        });
    });

// FORSE UTILE PER TESTARE
//    TODO clean
    // $("#carica").click(() => {
    //     alert("Caricamento da interfaccia non ancora disponibile, utilizzare AWS CLI");
    // });
    // $("#start").click(function(){
    //     $.ajax({
    //         url: "./toLoading"
    //     }).done(function(data){
    //         window.location.reload();
    //     })
    // });
    // $("#progress-style").click(function(){
    //     $.ajax({
    //         url: "./toEdit"
    //     }).done(function(data){
    //         window.location.reload();
    //     })
    // });
    // $("#backLink").click(function(){
    //     $.ajax({
    //         url: "./toFileExplorer"
    //     }).done(function(data){
    //         window.location.reload();
    //     })
    // });
    // $('#confirm').click(() => {
    //     alert("Non è ancora possibile eseguire il montaggio");
    // });
    // $('#inputGroupSelect01').change(() => {
    //     alert("Non è ancora possibile cambiare la modalità video");
    // });
    // $('#tableReset').click(() => {
    //     alert("Non è ancora possibile ripristinare i valori della tabella agli originali");
    // });
    // $('#addRow').click(() => {
    //     alert("Non è ancora possibile aggiungere righe alla tabella dei riconoscimenti");
    // });
});

function goIndex() {
  $.ajax({
      url: "toFileExplorer"
  })
}
// TODO remove: useless function
// function goLoading() {
//   $.ajax({
//       url: "./toLoading"
//   })
// }

function goEdit() {
  $.ajax({
      url: "toEdit"
  })
}

function updateStreaming() {
  $.ajax({
      type: "POST",
      url: "getVideoFrame"
  }).done( (video) => {
    // sostituisci il tag video con quella nuova(data)
    $('#videoLabel').replaceWith(video);
  }).error((error) => {
      alert(error);
  });
}

function updateFileList() {
  $.ajax({
      type: "POST",
      url: "getFileList"
  }).done(function(data){
      // replace titleList con quella nuova(data)
      $('#tileList').replaceWith(data);
  }).error((error) => {
      alert(error);
  });
}

function updateTable() {
  $.ajax({
      type: "POST",
      url: "getTable"
  }).done(function(data){
      // sostituisci la table con quella nuova(data)
      $('#labelTable').replaceWith(data);
      $.each($(".labelCheckbox"),(i, x) => {
          x.removeAttribute('disabled');
      });
  }).error((error) => {
      alert(error);
      $.each($(".labelCheckbox"),(i, x) => {
          x.removeAttribute('disabled');
      });
  });
}

  /**
     * Aggiorna la loadingProgressBar, viene chiamata
     * quando viene ricevuto
     * il messaggio 'finish'
     * @param {object} data - intero 0-100 che indica il progresso
     */
function updateProgressBar(data) {
// // con handlebars ma probabilmente sbagliata
//   var template = Handlebars.compile('progressBar.hbs');
//   var pagina = template({progression: data});
//   pagina.print();

  // con jquery
  $('#loadingProgressBar').css('width', data + '%');
  $('#loadingProgressBar').attr('aria-valuenow', data);
  // forse si vuole modificare la 'notifyProgressionUpdate' in router.js e includere il messaggio di refresh
  //  TODO remove this code: single responibility
  // if (data >= 100) {
  //   $.ajax({
  //     url: './toEdit'
  //   });
  // }
}
