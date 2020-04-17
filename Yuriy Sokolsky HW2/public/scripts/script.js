$('#openAddNew').on("click", function() {
    $('#modalBackround').show();
    $('.modalDialogEdit').show();
})
$('.closeModalDialog').on("click", function() {
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
    Countries = [$("#city1"), $("#city2"), $("#city3")]
    switch ($("#selCountry option:selected").text()) {
        case "Russia":
            Countries[0].siblings('label').html('Saratov');
            Countries[1].siblings('label').html('Moscow');
            Countries[2].siblings('label').html('St. Petersburg');
            break;
        case "Belorus":
            Countries[0].siblings('label').html('Minsk');
            Countries[1].siblings('label').html('Grodno');
            Countries[2].siblings('label').html('Vitebsk');
            break;
        case "USA":
            Countries[0].siblings('label').html('Washington');
            Countries[1].siblings('label').html('New York');
            Countries[2].siblings('label').html('Seatle');
            break;
        default:
        // code block
    }
});

$("#SaveChangesButton").click(function() {

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
