const config = {
    apiKey: "AIzaSyDSvErE1DHq8KnFgN5NRz4zfhMk-3j9Uas",
    authDomain: "arxiview.firebaseapp.com",
    databaseURL: "https://arxiview.firebaseio.com",
    projectId: "arxiview",
    storageBucket: "arxiview.appspot.com",
    messagingSenderId: "211862024559",
    appId: "1:211862024559:web:55341cfc78df318577389a"
};

firebase.initializeApp(config);

function callGoogleSignIn(){
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then((session) => {
        session.user.getIdToken().then( idToken => {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/login', false);

            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    const json = JSON.parse(xhr.responseText);
                    if (json.success === true){
                        window.location.reload(true);
                    }
                }
            };
            xhr.send(JSON.stringify({token: idToken}));
        })}
    ).catch((error) => alert(error))
}

function logout(){
    firebase.auth().signOut().then(function() {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/logout', false);
        xhr.send();

        window.location.reload(true);
        // Sign-out successful.
    }).catch(function(error) {
        // An error happened.
        alert(error.message);
    });

}