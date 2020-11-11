function editDocument() {
    let document_id = document.getElementById('mainFormIdInput').value;

    if (document_id !== '' && document_id !== undefined) {
        window.location.href = '/' + document_id + '/edit/';
    }
}