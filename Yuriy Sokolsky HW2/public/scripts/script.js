
function secStarts() {                                      //SetTimeout setInterval example for education
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
let itemsList = [];                                          //for storage
let Searchresults = [];                                         //for displaying
$(document).ready(function() {                                  //load item list on page ready
    ajaxReq("/getitems", {}, function(data) {
        itemsList = data;
        Searchresults = data;
        renderTable(Searchresults);
    })
});
$.fn.serializeFormJSON = function() {                           //serialize Form to JSON
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

function openDetail() {                                           //on Open item
    $('form[name="item"] :input').each(function() {
        $(this).removeClass("text-danger border-danger");         //remove warnings from fields
    })
    $('form[name="item"] small').each(function() {                 //remove warnings label from fields
        $(this).addClass("d-none");
    })
    let itemId = $(this).closest('tr').attr('id');                  //get opened items id
    let item = Searchresults.find(x => parseInt(x.id) === parseInt(itemId));//finding item
    $('#modalBackround').show();                         //display modal windows
    $('.modalDialogEdit').show();
    $("#itemName").val(item.itemName);                   //filling fields with parameters of selected item
    $("#supplierEmail").val(item.email);
    $("#itemCount").val(item.count);
    $("#itemPrice").val(item.price);
    $("#itemPrice").change();
    $("#itemid").val(item.id);
    $("#selCountry option:selected").removeAttr("selected")
    $("#selCountry").val(item.delivery.country);
    $("#selCountry option").filter(function() {
        return this.text === item.delivery.country;
    }).attr('selected', true);
    $("#selCountry").change();
    Countries = [$("#city1"), $("#city2"), $("#city3")]
    Countries[0].prop("checked", item.delivery.cities[0] ? true : false);
    Countries[1].prop("checked", item.delivery.cities[1] ? true : false);
    Countries[2].prop("checked", item.delivery.cities[2] ? true : false);
}

function buttonDelete() {
    let itemId = $(this).closest('tr').attr('id');                   //get opened items id
    $('#modalBackround').show();                                    //display modal windows
    $('.modalDialogAlert').show();
    let tmplalert = document.getElementById('alert-template').innerHTML.trim();     //rendering delete modal window
    document.getElementById('alert-holder').innerHTML = _.template(tmplalert)({
        itemId: itemId,
        itemName: Searchresults.find(x => parseInt(x.id) === parseInt(itemId)).itemName
    });
}

function renderTable(items) {                                           //table render function
    var tmpl = document.getElementById('grid-template').innerHTML.trim();
    tmpl = _.template(tmpl);
    document.getElementById('grid-holder').innerHTML = tmpl({
        list: items
    });
    for (const openDetailA of document.querySelectorAll('a[name="openDetail"]')) {      //set events for buttons which rendered
        openDetailA.addEventListener('click', openDetail)
    }
    for (const editDetailIn of document.querySelectorAll('input[name="openEdit"]')) {
        editDetailIn.addEventListener('click', openDetail)
    }
    for (const deleteitemIn of document.querySelectorAll('input[name="buttonDelete"]')) {
        deleteitemIn.addEventListener('click', buttonDelete)
    }
}

function deleteitem(id) {                               //deleting item
    ajaxReq("/deleteitem", {
        id: id
    }, function(result) {
        if (result) {
            renderTable(result);                        //render table after deleting item
            itemsList = result;
            Searchresults = result;
            closemodals();
            searchByName();                             //search again after render to display if item was delete after search
            return true
        } else {
            return false;
        }
    });
}

function checkValidEmail(mail) {                        //check email for valid
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail);
}
$('#openAddNew').on("click", function() {               //on open item modal
    $('#modalBackround').show();
    $('.modalDialogEdit').show();
    $('#selCountry option:selected').removeAttr('selected');
    $("#checkboxGroup").addClass("d-none");
    $('form[name="item"]').trigger("reset");
})
$('.closeModalDialog,#Cancel,#CancelDelete').on("click", closemodals);

function closemodals() {
    $('#modalBackround').hide();
    $('.modalDialogAlert').hide();
    $('.modalDialogEdit').hide();
}

function searchByName() {
    let targetName = $('#serachitem').val();
    Searchresults = itemsList.filter(x => (x.itemName.toLowerCase().includes(targetName.toLowerCase())));   //searching
    renderTable(Searchresults);
}

function compareValues(key, order = 'asc') {                //sorting object by key(field
    return function innerSort(a, b) {
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

function sortByPrice() {                                            //sorting by price
    let arrowP = $("#sortDirectionPrice");                              //arrow for price
    let arrowN = $("#sortDirectionName")                                //arrow for name
    arrowN.attr("data-sortStatus", "none");
    arrowN.removeClass("badge badge-dark");                             //hide arrow for name
    arrowN.html('');
    arrowChange(arrowP);                                                //change arrow for price
    if (arrowP.attr("data-sortStatus") === "largeToSmall")              //sort type is stored in arrow attribute
        Searchresults.sort(compareValues('price', 'desc'));
    else
    if (arrowP.attr("data-sortStatus") === "SmallToLarge")
        Searchresults.sort(compareValues('price', 'asc'));
    renderTable(Searchresults)                                          //rerender after sorting
}
$("#headerName").click(sortByName);
$("#headerPrice").click(sortByPrice);

function sortByName() {                                             //sorting by name
    let arrowP = $("#sortDirectionPrice");                          //arrow for price
    let arrowN = $("#sortDirectionName");                           //arrow for name
    arrowP.attr("data-sortStatus", "none");
    arrowP.removeClass("badge badge-dark");                         //hide arrow for price
    arrowP.html('');
    arrowChange(arrowN);                                            //change arrow for price
    if (arrowN.attr("data-sortStatus") === "largeToSmall")          //sort type is stored in arrow attribute
        Searchresults.sort(compareValues('itemName', 'asc'));
    else
    if (arrowN.attr("data-sortStatus") === "SmallToLarge")
        Searchresults.sort(compareValues('itemName', 'desc'));
    renderTable(Searchresults)
}

function arrowChange(arrow) {                                          //changing arrow direction
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
// $('#modalBackround').on("click",function () {                //closing a modal window by clicking outside
//     $('#modalBackround').hide();
//     $('.modalDialogAlert').hide();
//     $('.modalDialogEdit').hide();
// })
$("#checkAll").click(function() {                                //check all in form
    $(".check").prop('checked', $(this).prop('checked'));
});
$("#selCountry").change(function() {                            //display cities depending on the selected country
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
$('form[name="item"]').submit(function() {                                  //form sending
    let promise = new Promise((resolve, reject) => {
        let i = 0;
        $($('form[name="item"] :input:text').get().reverse()).each(function() { //if field empty focus on it and add alert
            if ($(this).val() == "") {
                $(this).focus();
                $(this).addClass("text-danger border-danger");
            } else {
                i++;
            }
        });
        if (i >= 4) {
            resolve("result");                              //if all fields are good
        } else reject("error");
    });
    promise
        .then(
            result => {
                let item = $(this).serializeFormJSON();
                ajaxReq("/senditem", item, function(result) {   //sending the form
                    if (result) {
                        renderTable(result);                            //render table
                        itemsList = result;
                        Searchresults=result;
                        searchByName();
                        $(':input', 'form[name="item"]')                 //clearing form
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
$("#supplierEmail").change(function() {                             //email checker
    if (checkValidEmail($(this).val())) {
        $("#itemEmailAlert").addClass("d-none");
        $("#supplierEmail").removeClass("text-danger border-danger");
    } else {
        $("#itemEmailAlert").removeClass("d-none");
        $("#supplierEmail").addClass("text-danger border-danger");
    }
});
$("#itemName").change(function() {                                     //name checker
    if ((/^\s+$/.test(($(this).val()))) || $(this).val().length < 5 || $(this).val() > 15) {
        $("#nameMaxLenAlert").removeClass("d-none");
        $("#itemName").addClass("text-danger border-danger");
    } else {
        $("#nameMaxLenAlert").addClass("d-none");
        $("#itemName").removeClass("text-danger border-danger");
    }
});
$('#itemCount').on('input', function() {                            //count checker
    this.value = this.value.replace(/[^0-9]/g, '');
    $("#itemPriceAlert").addClass("itemCountAlert");
    $("#itemCount").removeClass("text-danger border-danger");
});
$('#itemPrice').on('input', function() {                        //price checker
    this.value = this.value.replace(/[^\d\.]/g, '');
    if ($(this).val().match(/^-?\d+(?:\.\d+)?$/)) {
        $("#itemPriceAlert").addClass("d-none");
        $("#itemPrice").removeClass("text-danger border-danger");
    } else {
        $("#itemPriceAlert").removeClass("d-none");
        $("#itemPrice").addClass("text-danger border-danger");
    }
});
$('#searchButton').on("click", function() {                 //search button
    searchByName();
})
$('#serachitem').keypress(function(event) {                 //on Enter press
    if (event.keyCode == 13) {
        searchByName();
    }
});
$('#serachitem').keyup(function() {                         //if search field are empty render the default view
    if ($(this).val() == "") {
        renderTable(itemsList);
        Searchresults = itemsList;
    }
});
$("#itemPrice").change(function() {                     //display price field like a dollar currency
    $(this).val('$' + parseFloat($(this).val(), 10).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString());
});