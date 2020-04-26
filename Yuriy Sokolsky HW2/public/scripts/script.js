//state
let sortStatus="none";
let arrowP = $("#sortDirectionPrice");                              //arrow for price
let arrowN = $("#sortDirectionName")                //arrow for name
let itemsList = [];                                          //for storage
let searchResults = [];                                         //for displaying
let itemPriceinput=$("#itemPrice");

function secStarts() {                                      //SetTimeout setInterval example for education
    let i = 0;
    let timerId = setInterval(() => $("#timerForExample").html(`time passed:${i++}`), 1000)
}
setTimeout(secStarts, 5000);

function ajaxReq(url, data, callback) {
    $.ajax({
        url,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        dataType: 'json'
    }).done(callback);
}

$(document).ready(() => {                                  //load item list on page ready
    ajaxReq("/getitems", {}, data => {
        itemsList = data;
        searchResults = data;
        renderTable(searchResults);
    })
});

//render

function renderTable(items) {                                           //table render function
    let tmpl = $("#grid-template").html().trim();
    tmpl = _.template(tmpl);
    $("#grid-holder").html(tmpl({
        list: items
    }));
    $('a[name="openDetail"], input[name="openEdit"]').on('click', onOpenDetailButtonClick);
    $('input[name="buttonDelete"]').on('click', onDeleteButtonClick);
}

//delete

function deleteitem(id) {                               //deleting item
    ajaxReq("/deleteitem", {
        id
    }, result => {
        if (result) {
            renderTable(result);                        //render table after deleting item
            itemsList = result;
            searchResults = result;
            closemodals();
            searchByName();                             //search again after render to display if item was delete after search
            return true
        } else {
            return false;
        }
    });
}

function onDeleteButtonClick() {
    let itemId = $(this).closest('tr').attr('id');                   //get opened items id
    $('#modalBackround').show();                                    //display modal windows
    $('.modalDialogAlert').show();
    let tmplalert =$('#alert-template').html().trim();     //rendering delete modal window
    $('#alert-holder').html(_.template(tmplalert)({
        itemId,
        itemName: searchResults.find(({id}) => parseInt(id) === parseInt(itemId)).itemName
    }))
}

//open detail modal
function drawCountryList() {
    let tmpl = $("#delivery-country-template").html().trim();
    tmpl = _.template(tmpl);
    $("#selCountry").html(tmpl({
        countries: countries
    }));

    $('#selCountry').on('change', onSelectionChange);

}

function onOpenDetailButtonClick() {                                           //on Open item
    $("#checkboxGroup").addClass("d-none");
    $('form[name="item"] :input').each(function() {
        $(this).removeClass("text-danger border-danger");         //remove warnings from fields
    })
    $('form[name="item"] small').each(function() {                 //remove warnings label from fields
        $(this).addClass("d-none");
    })
    let itemId = $(this).closest('tr').attr('id');                  //get opened items id
    let item = searchResults.find(({id}) => parseInt(id) === parseInt(itemId));//finding item
    $('#modalBackround').show();                         //display modal windows
    $('.modalDialogEdit').show();
    $("#itemName").val(item.itemName);                   //filling fields with parameters of selected item
    $("#supplierEmail").val(item.email);
    $("#itemCount").val(item.count);
    itemPriceinput.val(item.price);
    $("#itemid").val(item.id);
    $("#selCountry option:selected").removeAttr("selected")
    drawCountryList();
    $("#selCountry").val(item.delivery.country);
    $("#selCountry option").filter(function() {
        return this.text === item.delivery.country;
    }).attr('selected', true);
    onSelectionChange();
    item.delivery.cities.map((val, index) => {
        $.each($("input[type='checkbox']"), function(){
           if ($(this).attr('name')==val){
               $(this).prop("checked",true);
           }
        });
    });

    itemPriceinput.trigger( "focusout" );
}

//modals

$('#openAddNew').on("click", () => {               //on open item modal
    $('#modalBackround').show();
    $('.modalDialogEdit').show();
    $('#selCountry option:selected').removeAttr('selected');
    $("#checkboxGroup").addClass("d-none");
    $('form[name="item"]').trigger("reset");
    drawCountryList();
})

$('.closeModalDialog,#Cancel,#CancelDelete').on("click", closemodals);

function closemodals() {
    $('#modalBackround').hide();
    $('.modalDialogAlert').hide();
    $('.modalDialogEdit').hide();
}
$(".modalDialogEdit .modalDialogAlert").click(e => {
    e.stopPropagation();
});

//sorting

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

function sort(arrowCurrent,arrowOther,key,refresh){     //hide arrow for name
    arrowOther.html('');
    if (!refresh)
    arrowChange(arrowCurrent);                                                //change arrow for price
    searchResults.sort(compareValues(key, sortStatus));
    renderTable(searchResults)                                          //rerender after sorting
}

$("#headerName").click(function() {
    sort(arrowN,arrowP,'itemName',false)
});

$("#headerPrice").click(function() {
    sort(arrowP,arrowN,'price',false)
});
function arrowChange(arrow) {                                          //changing arrow direction
    if (sortStatus === "none") {
        sortStatus="asc";
        arrow.html('&#9650;');
    } else {
        if (sortStatus === "asc") {
            sortStatus="desc";
            arrow.html('&#9660;');
        } else {
            if (sortStatus === "desc") {
                sortStatus="asc";
                arrow.html('&#9650;');
            }
        }
    }
}

// $('#modalBackround').on("click",function () {                //closing a modal window by clicking outside
//     $('#modalBackround').hide();
//     $('.modalDialogAlert').hide();
//     $('.modalDialogEdit').hide();
// })

//send to server

$.fn.serializeFormJSON = function() {                           //serialize Form to JSON
    const o = {cities:[]};
    const a = this.serializeArray();
    $.each(a, function() {
        if(Number.isInteger(parseInt(this.name))) {
            o.cities.push(this.name);
        }else
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    console.log(o);
    return o;
};

$('form[name="item"]').submit(function() {                                  //form sending

    let i = 0;
    $($('form[name="item"] :input:text').get().reverse()).each(function() { //if field empty focus on it and add alert
        if ($(this).attr('id')!="itemid")
        if ($(this).val() == ""  || ($(this).val()==$("#supplierEmail").val() && !checkValidEmail($(this).val())) || ($(this).val()==$("#itemName").val() && checkName($(this).val()))  || ($(this).val()==itemPriceinput.val() && parseFloat($(this).val())<=0)) {
            setdanger($(this));
        }else {
            i++;
        }
    });

    if (i >= 4) {
        let item = $(this).serializeFormJSON();
        ajaxReq("/senditem", item, result => {   //sending the form
            if (result) {
                renderTable(result);                            //render table
                itemsList = result;
                searchResults = result;
                searchByName();
                if( arrowP.html()!=""){
                    sort(arrowP,arrowN,'price',true)
                }
                if( arrowN.html()!=""){
                    sort(arrowN,arrowP,'itemName',true)
                }

                $(':input', 'form[name="item"]')                 //clearing form
                    .not(':button, :submit, :reset, :hidden')
                    .val('')
                    .prop('checked', false)
                    .prop('selected', false);
                closemodals();
            }
        });
    }
    return false;
});

//search

function searchByName() {
    let targetName = $('#serachitem').val();
    searchResults = itemsList.filter(({itemName}) => itemName.toLowerCase().includes(targetName.toLowerCase()));   //searching
    renderTable(searchResults);
}

$('#searchButton').on("click", () => {                 //search button
    searchByName();
})

$('#serachitem').keypress(({keyCode}) => {                 //on Enter press
    if (keyCode == 13) {
        searchByName();
    }
});

$('#serachitem').keyup(function() {                         //if search field are empty render the default view
    if ($(this).val() == "") {
        renderTable(itemsList);
        searchResults = itemsList;
    }
});

