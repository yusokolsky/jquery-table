function ajaxReq(url, data, callback){
    $.ajax({
        url: url,
        type: 'POST',
        contentType:'application/json',
        data: JSON.stringify(data),
        dataType:'json'
    }).done(callback);
}
let ProductsList=[];
$( document ).ready(function() {

    ajaxReq("/getProducts", {}, function(data){
        ProductsList=data;
        renderTable(data);

    })

});
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

function openDetail() {
    let productId= $(this).closest('tr').attr('id');
    let Product=ProductsList.find(x => parseInt(x.id) === parseInt(productId));
    $('#modalBackround').show();
    $('.modalDialogEdit').show();
    $("#productName").val(Product.productName);
    $("#supplierEmail").val(Product.email);
    $("#productCount").val(Product.count);
    $("#productPrice").val(Product.price);
    $("#productPrice").change();
    $("#productid").val(Product.id);
    $("#selCountry option").filter(function() {
        return this.text === Product.delivery.country;
    }).attr('selected', true);
    $("#selCountry").change();
    Countries = [$("#city1") , $("#city2"), $("#city3")]
    Countries[0].prop("checked", Product.delivery.cities[0] ? true :false);
    Countries[1].prop("checked", Product.delivery.cities[1] ? true :false);
    Countries[2].prop("checked", Product.delivery.cities[2] ? true :false);
}
function buttonDelete() {
    let productId = $(this).closest('tr').attr('id');
    $('#modalBackround').show();
    $('.modalDialogAlert').show();
    let tmplalert = document.getElementById('alert-template').innerHTML.trim();
    document.getElementById('alert-holder').innerHTML = _.template(tmplalert)({
        productId: productId,
        productName:ProductsList.find(x => parseInt(x.id) === parseInt(productId)).productName
    });

}
function renderTable(Products) {
    var tmpl = document.getElementById('grid-template').innerHTML.trim();
    tmpl = _.template(tmpl);
    document.getElementById('grid-holder').innerHTML = tmpl({
        list: Products
    });
    for (const openDetailA of document.querySelectorAll('a[name="openDetail"]')) {
        openDetailA.addEventListener('click', openDetail)
    }
    for (const editDetailIn of document.querySelectorAll('input[name="openEdit"]')) {
        editDetailIn.addEventListener('click', openDetail)
    }
    for (const deleteProductIn of document.querySelectorAll('input[name="buttonDelete"]')) {
        deleteProductIn.addEventListener('click', buttonDelete)
    }
}
function deleteProduct(id){

    ajaxReq("/deleteProduct",{id:id} , function(result) {
        if (result){
            renderTable(result);
            closemodals();
            return true
        }else{
            return false ;
        }
    });

}

$('#openAddNew').on("click", function() {
    $('#modalBackround').show();
    $('.modalDialogEdit').show();
    $('#selCountry option:selected').removeAttr('selected');
    $("#checkboxGroup").addClass("d-none");
    $('form[name="Product"]').trigger("reset");
})
$('.closeModalDialog,#Cancel,#CancelDelete').on("click", closemodals);

    function closemodals() {
    $('#modalBackround').hide();
    $('.modalDialogAlert').hide();
    $('.modalDialogEdit').hide();
}
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
    ajaxReq("/sendProduct",Product , function(result) {
    if (result){
        return true
    }else{
        return false ;
    }
    });
    //return false;
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


