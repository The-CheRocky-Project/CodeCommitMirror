//serverListener module
var socket = io();
$(document).ready(() => {
    socket.on('refresh',() => {
        window.location.reload();
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

