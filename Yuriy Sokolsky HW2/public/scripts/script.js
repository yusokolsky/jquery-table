//SetTimeout setInterval example for education
function secStarts() {
    let i = 0;
    let timerId = setInterval(() => $("#timerForExample").html(`time passed:${i++}`), 1000)
}
setTimeout(secStarts, 5000);

function ajaxReq(url, data, callback) {
    $.ajax({
        url: url,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        dataType: 'json'
    }).done(callback);
}
let ProductsList = [];
let Searchresults = [];
$(document).ready(function() {
    ajaxReq("/getProducts", {}, function(data) {
        ProductsList = data;
        Searchresults = data;
        renderTable(Searchresults);
    })
});
$.fn.serializeFormJSON = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
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
    $('form[name="Product"] :input').each(function() {
        $(this).removeClass("text-danger border-danger");
    })
    $('form[name="Product"] small').each(function() {
        $(this).addClass("d-none");
    })
    let productId = $(this).closest('tr').attr('id');
    let Product = Searchresults.find(x => parseInt(x.id) === parseInt(productId));
    $('#modalBackround').show();
    $('.modalDialogEdit').show();
    $("#productName").val(Product.productName);
    $("#supplierEmail").val(Product.email);
    $("#productCount").val(Product.count);
    $("#productPrice").val(Product.price);
    $("#productPrice").change();
    $("#productid").val(Product.id);
    $("#selCountry option:selected").removeAttr("selected")
    $("#selCountry").val(Product.delivery.country);
    $("#selCountry option").filter(function() {
        return this.text === Product.delivery.country;
    }).attr('selected', true);
    $("#selCountry").change();
    Countries = [$("#city1"), $("#city2"), $("#city3")]
    Countries[0].prop("checked", Product.delivery.cities[0] ? true : false);
    Countries[1].prop("checked", Product.delivery.cities[1] ? true : false);
    Countries[2].prop("checked", Product.delivery.cities[2] ? true : false);
}

function buttonDelete() {
    let productId = $(this).closest('tr').attr('id');
    $('#modalBackround').show();
    $('.modalDialogAlert').show();
    let tmplalert = document.getElementById('alert-template').innerHTML.trim();
    document.getElementById('alert-holder').innerHTML = _.template(tmplalert)({
        productId: productId,
        productName: Searchresults.find(x => parseInt(x.id) === parseInt(productId)).productName
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

function deleteProduct(id) {
    ajaxReq("/deleteProduct", {
        id: id
    }, function(result) {
        if (result) {
            renderTable(result);
            ProductsList = result;
            Searchresults = result;
            closemodals();
            searchByName();
            return true
        } else {
            return false;
        }
    });
}

function checkValidEmail(mail) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail);
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

function searchByName() {
    let targetName = $('#serachProduct').val();
    Searchresults = ProductsList.filter(x => (x.productName.toLowerCase().includes(targetName.toLowerCase())));
    renderTable(Searchresults);
}

function compareValues(key, order = 'asc') {
    return function innerSort(a, b) {
        if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
            // property doesn't exist on either object
            return 0;
        }
        const varA = (typeof a[key] === 'string') ?
            a[key].toUpperCase() : a[key];
        const varB = (typeof b[key] === 'string') ?
            b[key].toUpperCase() : b[key];
        let comparison = 0;
        if (varA > varB) {
            comparison = 1;
        } else if (varA < varB) {
            comparison = -1;
        }
        return (
            (order === 'desc') ? (comparison * -1) : comparison
        );
    };
}

function sortByPrice() {
    let arrowP = $("#sortDirectionPrice");
    let arrowN = $("#sortDirectionName")
    arrowN.attr("data-sortStatus", "none");
    arrowN.removeClass("badge badge-dark");
    arrowN.html('');
    arrowChange(arrowP);
    if (arrowP.attr("data-sortStatus") === "largeToSmall")
        Searchresults.sort(compareValues('price', 'desc'));
    else
    if (arrowP.attr("data-sortStatus") === "SmallToLarge")
        Searchresults.sort(compareValues('price', 'asc'));
    renderTable(Searchresults)
}
$("#headerName").click(sortByName);
$("#headerPrice").click(sortByPrice);

function sortByName() {
    let arrowP = $("#sortDirectionPrice");
    let arrowN = $("#sortDirectionName");
    arrowP.attr("data-sortStatus", "none");
    arrowP.removeClass("badge badge-dark");
    arrowP.html('');
    arrowChange(arrowN);
    if (arrowN.attr("data-sortStatus") === "largeToSmall")
        Searchresults.sort(compareValues('productName', 'asc'));
    else
    if (arrowN.attr("data-sortStatus") === "SmallToLarge")
        Searchresults.sort(compareValues('productName', 'desc'));
    renderTable(Searchresults)
}

function arrowChange(arrow) {
    if (arrow.attr("data-sortStatus") === "none") {
        arrow.attr("data-sortStatus", "largeToSmall");
        arrow.html('&#9660;');
        arrow.addClass("badge badge-dark");
    } else {
        if (arrow.attr("data-sortStatus") === "largeToSmall") {
            arrow.attr("data-sortStatus", "SmallToLarge");
            arrow.html('&#9650;');
        } else {
            if (arrow.attr("data-sortStatus") === "SmallToLarge") {
                arrow.attr("data-sortStatus", "largeToSmall");
                arrow.html('&#9660;');

            }
        }
    }
}
$(".modalDialogEdit .modalDialogAlert").click(function(e) {
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
        default:
            $("#checkboxGroup").addClass("d-none");
    }
});
$('form[name="Product"]').submit(function() {
    let promise = new Promise((resolve, reject) => {
        let i = 0;
        $($('form[name="Product"] :input:text').get().reverse()).each(function() {
            if ($(this).val() == "") {
                $(this).focus();
                $(this).addClass("text-danger border-danger");
            } else {
                i++;
            }
        });
        if (i >= 4) {
            resolve("result");
        } else reject("error");
    });
    promise
        .then(
            result => {
                let Product = $(this).serializeFormJSON();
                ajaxReq("/sendProduct", Product, function(result) {
                    if (result) {
                        renderTable(result);
                        ProductsList = result;
                        Searchresults=result;
                        searchByName();
                        $(':input', 'form[name="Product"]')
                            .not(':button, :submit, :reset, :hidden')
                            .val('')
                            .prop('checked', false)
                            .prop('selected', false);
                        closemodals();
                    } else {
                        return false;
                    }
                })
            },
            error => {
                console.log("promise rejected")
            }
        );
    return false;
});
$("#supplierEmail").change(function() {
    if (checkValidEmail($(this).val())) {
        $("#productEmailAlert").addClass("d-none");
        $("#supplierEmail").removeClass("text-danger border-danger");
    } else {
        $("#productEmailAlert").removeClass("d-none");
        $("#supplierEmail").addClass("text-danger border-danger");
    }
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
    $("#productPriceAlert").addClass("productCountAlert");
    $("#productCount").removeClass("text-danger border-danger");
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
$('#searchButton').on("click", function() {
    searchByName();
})
$('#serachProduct').keypress(function(event) {
    if (event.keyCode == 13) {
        searchByName();
    }
});
$('#serachProduct').keyup(function() {
    if ($(this).val() == "") {
        renderTable(ProductsList);
        Searchresults = ProductsList;
    }
});
$("#productPrice").change(function() {
    $(this).val('$' + parseFloat($(this).val(), 10).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString());
});