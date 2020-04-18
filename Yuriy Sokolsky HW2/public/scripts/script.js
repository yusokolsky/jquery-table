function ajaxReq(url, data, callback){
    $.ajax({
        url: url,
        type: 'POST',
        contentType:'application/json',
        data: JSON.stringify(data),
        dataType:'json'
    }).done(callback);
}

$.fn.serializeFormJSON = function () {

    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

$('#openAddNew').on("click", function() {
    $('#modalBackround').show();
    $('.modalDialogEdit').show();
})
$('.closeModalDialog,#Cancel').on("click", function() {
    $('#modalBackround').hide();
    $('.modalDialogAlert').hide();
    $('.modalDialogEdit').hide();
})
$(".modalDialogEdit").click(function(e) {
    e.stopPropagation();
});
$(".modalDialogAlert").click(function(e) {
    e.stopPropagation();
});

// $('#modalBackround').on("click",function () {
//     $('#modalBackround').hide();
//     $('.modalDialogAlert').hide();
//     $('.modalDialogEdit').hide();
// })

$("#checkAll").click(function() {
    $(".check").prop('checked', $(this).prop('checked'));
});

$("#selCountry").change(function() {
    $("#checkboxGroup").removeClass("d-none");
    Countries = [$("#city1"), $("#city2"), $("#city3")]
    switch ($("#selCountry option:selected").text()) {
        case "Russia":
            Countries[0].siblings('label').html('Saratov');
            Countries[0].attr('value', 'Saratov');
            Countries[1].siblings('label').html('Moscow');
            Countries[1].attr('value', 'Moscow');
            Countries[2].siblings('label').html('St. Petersburg');
            Countries[2].attr('value', 'St. Petersburg');
            break;
        case "Belorus":
            Countries[0].siblings('label').html('Minsk');
            Countries[0].attr('value', 'Minsk');
            Countries[1].siblings('label').html('Grodno');
            Countries[1].attr('value', 'Grodno');
            Countries[2].siblings('label').html('Vitebsk');
            Countries[2].attr('value', 'Vitebsk');
            break;
        case "USA":
            Countries[0].siblings('label').html('Washington');
            Countries[0].attr('value', 'Washington');
            Countries[1].siblings('label').html('New York');
            Countries[1].attr('value', 'New York');
            Countries[2].siblings('label').html('Seatle');
            Countries[2].attr('value', 'Seatle');
            break;
        default: $("#checkboxGroup").addClass("d-none");

    }
});


$('form[name="Product"]').submit(function(){

    let Product= $(this).serializeFormJSON();
    console.log(Product);
    ajaxReq("/sendProduct/",Product , function(result) {

    });
    return false;
});

$("#productName").change(function() {

    if ((/^\s+$/.test(($(this).val()))) || $(this).val().length < 5 || $(this).val() > 15) {
        $("#nameMaxLenAlert").removeClass("d-none");
        $("#productName").addClass("text-danger border-danger");
    } else {
        $("#nameMaxLenAlert").addClass("d-none");
        $("#productName").removeClass("text-danger border-danger");
    }
});

$('#productCount').on('input', function() {
    this.value = this.value.replace(/[^0-9]/g, '');
});
$('#productPrice').on('input', function() {
    this.value = this.value.replace(/[^\d\.]/g, '');
    if ($(this).val().match(/^-?\d+(?:\.\d+)?$/)) {
        $("#productPriceAlert").addClass("d-none");
        $("#productPrice").removeClass("text-danger border-danger");
    } else {
        $("#productPriceAlert").removeClass("d-none");
        $("#productPrice").addClass("text-danger border-danger");

    }
});

$("#productPrice").change(function() {
    $(this).val('$' + parseFloat($(this).val(), 10).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString());
});
