function displayNoneAndremoveDanger(div1,div2){
    div1.addClass("d-none");
    div2.removeClass("text-danger border-danger");
}

function removedisplayNoneAndaddDanger(div1,div2){
    div1.removeClass("d-none");
    div2.addClass("text-danger border-danger");
}

function checkValidEmail(mail) {                        //check email for valid
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail);
}

$("#supplierEmail").change(function() {                             //email checker
    if (checkValidEmail($(this).val())) {
        displayNoneAndremoveDanger($("#itemEmailAlert"),$("#supplierEmail"));
    } else {
        removedisplayNoneAndaddDanger( $("#itemEmailAlert"), $("#supplierEmail"));
    }
});

function setdanger(div){
    div.focus();
    div.addClass("text-danger border-danger");
}

$("#checkAll").click(function() {                                //check all in form
    $(".check").prop('checked', $(this).prop('checked'));
});

$("#selCountry").change(() => {                            //display cities depending on the selected country
    $("#checkboxGroup").removeClass("d-none");
    Countries = [$("#city1"), $("#city2"), $("#city3")]
    $(".check").prop('checked',false);
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

function checkName(namefiled){

    if ((/^\s+$/.test(namefiled)) || namefiled.replace(/\s/g, '').length < 5 || namefiled.replace(/\s/g, '').length > 15) {
        removedisplayNoneAndaddDanger($("#nameMaxLenAlert"), $("#itemName"));
        return true;
    } else {
        displayNoneAndremoveDanger( $("#nameMaxLenAlert"), $("#itemName"));
    }
}

$("#itemName").change(function() {                                     //name checker
    checkName($(this).val());
});

$('#itemCount').on('input', function() {                            //count checker
    this.value = this.value.replace(/[^0-9]/g, '');
    $("#itemPriceAlert").addClass("itemCountAlert");
    $("#itemCount").removeClass("text-danger border-danger");
});

itemPriceinput.on('input', function() {                        //price checker
    this.value = this.value.replace(/[^\d\.]/g, '');
    if ($(this).val().match(/^-?\d+(?:\.\d+)?$/) && parseFloat($(this).val())>0) {
        displayNoneAndremoveDanger( $("#itemPriceAlert"), $("#itemPrice"));
    } else {
        removedisplayNoneAndaddDanger($("#itemPriceAlert"), $("#itemPrice"));
    }
});

itemPriceinput.focusout(function() {                     //display price field like a dollar currency
    if ($(this).val()!=""  && parseFloat($(this).val())>0)
        $(this).val(`$${parseFloat($(this).val(), 10).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString()}`);
});

itemPriceinput.focusin(function() {
    function resolveAfterinputremovedol() {                         //setting caret exactly to the position that the user clicked
        return new Promise(resolve => {                     //caret was jumping to end of input so
            setTimeout(() => {                              //this is the demonstration of async/await and promises and settimeout too
                resolve();
            }, 0);
        });
    }
    async function setCaret() {
        itemPriceinput.val(itemPriceinput.val().replace(/[^\d\.]/g, ''));               //removing dollar sign
        const a = resolveAfterinputremovedol();
        return await a;
    }
    setCaret().then(v => {
        $(this)[0].setSelectionRange($(this)[0].selectionStart-1,$(this)[0].selectionStart-1);      //setting caret position to -1 (because dollar sign was removed)
    });

});

