function editDocument() {
    let document_id = document.getElementById('mainFormIdInput').value;

    if (document_id !== '' && document_id !== undefined) {
        window.location.href = '/' + document_id + '/edit/';
    }
}

function copyToClipboard(element) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(element).parent().parent().children("input")[0].value).select();

    try {
        document.execCommand( 'copy' );
    } catch (err) {
        console.log('Oops, unable to copy',err);
    }

    $temp.remove();
}