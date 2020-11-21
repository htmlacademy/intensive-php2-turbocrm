$('table.mail-list__table tbody').on('click', 'tr', function (event) {
    var msgId = $(event.currentTarget).data('id');

    window.location = '/inbox/email?msgid=' + msgId;
});
