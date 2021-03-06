//serverListener module
var socket = io();
$(document).ready(() => {
    /**
     * Quando viene ricevuto il messaggio 'refresh' ricarica la pagina dal server
     */
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
      } else {
        alert('Error on finish: ' + data);
      }
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

    socket.on('finish', (data) => window.location.reload());

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
    $("#addRow").click(event => addRowManagement(event));

    /**
     * Ad ogni modifica dello stato delle checkbox della tabella dei riconoscimenti,
     * ne effettua la richiesta di modifica al router
     */
    $(".labelCheckbox").change( event => manageCheckboxState(event));

    /**
     * Ad ogni richiesta di aggiunta di input, ne effettua la richiesta
     * di modifica al router
     */
    $(".editInput").change(event => manageContentChange(event));

    /**
     * Ad ogni richiesta di reset del contenuto, ne effettua la richiesta
     * al router
     */
    $("#tableReset").click(event => resetTable(event));

    /**
     * Ad ogni richiesta di ritornare alla pagina di fileExplorer, ne invia
     * la richiesta al router
     */
    $("#backLink").click(event => returnToFileExplorer(event));

    /**
     * Ad ogni richiesta di confermare il video di sintesi, ne invia
     * la richiesta al router
     */
    $("#confirm").click(event => {
        $.ajax({
            type: "POST",
            url:"confirmEditing"
        }).error((error) => {
            alert(error);
        })
    });
    $("#videoSelector").change(event => manageVideoModeChange(event));
});

/**
 * Invia al router la richiesta di andare alla pagina "toFileExplorer"
 */
function returnToFileExplorer(event) {
    $.ajax({
        type: "POST",
        url: "toFileExplorer"
    }).error((error) => {
        alert(error);
    });
}

/**
 * Invia al router la richiesta di reimpostare la tabella
 */
function resetTable(event) {
    $.ajax({
        type: "POST",
        url: "resetTable"
    }).error((error) => {
        alert(error);
    });
}

/**
 * Gestisce il cambio di stato di una checkbox di una riga
 * avvisando il router del relativo cambio
 */
function manageCheckboxState (event) {
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
}

/**
 * Gestisce il cambiamento di una riga, inviando al router
 * le relative informazioni
 */
function manageContentChange(event) {
    const row = $(event.target).parent().parent();
    const index = row.index();
    const start = row.find('input[name="startText"]').val();
    const duration = row.find('input[name="endText"]').val();
    const label = row.find('select[name="labelSelect"]').val();
    const data = {
        row: index,
        start: start,
        duration: duration,
        label: label
    }
    $.ajax({
        type: "POST",
        url: "changeRow",
        data: data
    }).error((error) => {
        alert(error);
    });
}

/**
 * Richiede al router di ottenere la pagina "toFileExplorer"
 */
function goIndex() {
  $.ajax({
      url: "toFileExplorer"
  })
}

/**
 * Aggiorna il video visualizzato in "toEdit" in base alle informazioni ricevute
 * dal router
 */
function updateStreaming() {
    $.ajax({
        type: "POST",
        url: "getVideoFrame"
    }).done( (video) => {
        $('#videoDiv').replaceWith(video);
        $("#videoSelector").change(event => manageVideoModeChange(event));
    }).error((error) => {
        alert(error);
    });
}

/**
 * Aggiorna la lista dei file visualizzati in "toFileExplorer"
 */
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

/**
 * Aggiorna la tabella dei frames in "toEdit"
 */
function updateTable() {
  $.ajax({
      type: "POST",
      url: "getTable"
  }).done(function(data){
      // sostituisci la table con quella nuova(data)
      $('#labelTable').replaceWith(data);
      $(".labelCheckbox").change( event => manageCheckboxState(event));
      $(".editInput").change((event) => manageContentChange(event));
      $("#addRow").click( (event) => addRowManagement(event));
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
  $('#loadingProgressBar').css('width', data + '%');
  $('#loadingProgressBar').attr('aria-valuenow', data);
}

/**
 * Avvisa il router dell'inserimento di una nuova riga nella
 * tabella
 */
function addRowManagement(event) {
    const dataToSend = {
        start: $("#newStart").val(),
        duration: $("#newEnd").val(),
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
}

/**
 * Avvisa il router del cambiamento del tipo di video da visualizzare
 */
function manageVideoModeChange(event) {
    const option = $(event.target).children("option:selected");
    const data = {
        toOriginal: option.val() == "original"
    };
    if(option.val() == "original"){
        $.ajax({
            type: "POST",
            url: "setOriginalVideoMode"
        }).done(() => {
            updateStreaming();
        }).fail((error) => alert(error));
    }
    else{
        $.ajax({
            type: "POST",
            url: "setPreviewVideoMode"
        }).done(() => {
            updateStreaming();
        }).fail((error) => alert(error));
    }
}
