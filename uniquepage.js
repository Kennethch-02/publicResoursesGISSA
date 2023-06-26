window.addEventListener('load', function () {
    var openRequest = indexedDB.open('myDatabase', 1);

    openRequest.onupgradeneeded = function (e) {
        var db = e.target.result;
        if (!db.objectStoreNames.contains('store')) {
            db.createObjectStore('store');
        }
    };

    openRequest.onsuccess = function (e) {
        var db = e.target.result;
        var tx = db.transaction('store', 'readwrite');
        var store = tx.objectStore('store');

        var getRequest = store.get('web_browser');
        getRequest.onsuccess = function (e) {
            if (e.target.result == null) {
                // No window already open
                var item = {
                    name: 'web_browser',
                    value: 'true',
                    created: new Date().getTime()
                };
                store.put(item, item.name);
                window.addEventListener('unload', function () {
                    var removeRequest = store.delete('web_browser');
                    removeRequest.onsuccess = function (e) {
                        console.log('Browser marker removed');
                    };
                    removeRequest.onerror = function (e) {
                        console.log('Error', e.target.error.name);
                    };
                });
            } else {
                var errorPageUrl = '';

                // Check if you're on localhost
                if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                    errorPageUrl = '/ErrorPage.aspx'; // Path on localhost
                } else {
                    // Get the first subfolder of the domain
                    var pathComponents = window.location.pathname.split('/');
                    var firstSubfolder = pathComponents[1];
                    if (firstSubfolder.contains('.aspx')) firstSubfolder = pathComponents[0];
                    errorPageUrl = '/' + firstSubfolder + '/ErrorPage.aspx'; // Path on other domain
                }

                $.ajax({
                    type: 'POST',
                    url: (errorPageUrl + '/doubleSession'),
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    async: true,
                    success: function (response) {
                        console.log(response);
                    },
                    error: function (xhr, status, error) {
                        console.log(xhr, status, error);
                    }
                });

                window.location.href = errorPageUrl; // Redirect to error page
            }
        };

        getRequest.onerror = function (e) {
            console.log('Error', e.target.error.name);
        };

        tx.oncomplete = function () {
            db.close();
        };
    };

    openRequest.onerror = function (e) {
        console.log('Error', e.target.error.name);
    };
});
