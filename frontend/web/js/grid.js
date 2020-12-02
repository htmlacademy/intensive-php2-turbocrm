$(function () {
    var urlParams = new URLSearchParams(window.location.search);

    if (urlParams.get('modal')) {
        var body = document.querySelector('body');
        var modal = document.querySelector('.modal');

        modal.classList.add('show');
        body.classList.add('modal-open');
    }
})
