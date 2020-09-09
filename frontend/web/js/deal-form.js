var $form = $('#deal-form');

$form.on('change', 'select, input, textarea', function() {
    var data = $form.serialize();

    $.ajax({
        url: $form.attr('action'),
        type: 'POST',
        data: data
    });

    return false;
});
