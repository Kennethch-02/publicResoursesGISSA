window.addEventListener('load', function () {
    if (localStorage.getItem('web_browser') == null) {
        // Hay una ventana ya abierta
        console.log("Ventana nueva");
        localStorage.setItem('web_browser', 'true');
        window.addEventListener('unload', function () {
            console.log("cerrando ventana");
            localStorage.removeItem('web_browser');
        });
    } else {
        var errorPageUrl = '';

        // Verificar si estás en localhost
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            errorPageUrl = '/ErrorPage.aspx'; // Ruta en localhost
        } else {
            // Obtener la primera subcarpeta del dominio
            var pathComponents = window.location.pathname.split('/');
            var firstSubfolder = pathComponents[1];
            if (firstSubfolder.contains('.aspx')) firstSubfolder = pathComponents[0];
            errorPageUrl = '/' + firstSubfolder + '/ErrorPage.aspx'; // Ruta en otro dominio
        }
        console.log(errorPageUrl);
        // Algooo
        console.log(errorPageUrl);
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

        window.location.href = errorPageUrl; // Redirecciona a la página de error
    }
});
