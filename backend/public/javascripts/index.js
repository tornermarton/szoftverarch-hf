function viewDocument() {
    let document_id = document.getElementById('mainFormViewIdInput').value;

    if (document_id !== '' && document_id !== undefined) {
        window.location.href = '/documents/' + document_id + '/view/';
    }
}

function editDocument() {
    let document_id = document.getElementById('mainFormEditIdInput').value;

    if (document_id !== '' && document_id !== undefined) {
        window.location.href = '/documents/' + document_id + '/edit/';
    }
}

function openRawDocument(document_id) {
    window.location.href = '/documents/' + document_id + '/view/raw/';
}

function deleteDocument(document_id) {
    if (confirm('Are you sure you want to delete this document?')) {
        $.ajax({
            type: "GET",
            url: "/documents/" + document_id + "/delete/",
            dataType: "json",
            success: function (result) {
                if (result.success) {
                    window.location.reload(true);
                }
                else {
                    alert("Failed to delete!");
                }
            }
        });
    }
}

function copyToClipboard(text) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val(text).select();

    try {
        document.execCommand( 'copy' );
    } catch (err) {
        console.log('Oops, unable to copy',err);
    }

    $temp.remove();
}