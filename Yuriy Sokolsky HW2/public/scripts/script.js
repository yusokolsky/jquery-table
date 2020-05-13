//state
const state = {
  sortStatus: "none",
  itemsList: [], //for storage
  searchResults: [], //for displaying
  searchNameField: "", //finding field
};

let arrowP = $("#sortDirectionPrice"); //arrow for price
let arrowN = $("#sortDirectionName"); //arrow for name
let itemPriceinput = $("#itemPrice");
function secStarts() {
  //SetTimeout setInterval example for education
  let i = 0;
  let timerId = setInterval(
    () => $("#timerForExample").html(`time passed:${i++}`),
    1000
  );
}
setTimeout(secStarts, 5000);

function ajaxReq(url, data, callback) {
  $.ajax({
    url,
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(data),
    dataType: "json",
  }).then(callback);
}

$(document).ready(() => {
  //load item list on page ready
  ajaxReq("/getitems", {}, (data) => {
    state.searchResults = data;
    state.itemsList = data;
    renderTable();
  });
});

//render

function renderTable() {
  //table render function
  if (state.searchNameField != "") {
    state.searchResults = state.itemsList.filter(({ itemName }) =>
      itemName.toLowerCase().includes(state.searchNameField.toLowerCase())
    ); //searching
  } else {
    state.searchResults = state.itemsList;
  }
  if (arrowP.html() != "") {
    state.searchResults = sort(arrowP, arrowN, "price", true);
  }
  if (arrowN.html() != "") {
    state.searchResults = sort(arrowN, arrowP, "itemName", true);
  }
  let tmpl = $("#grid-template").html().trim();
  tmpl = _.template(tmpl);
  $("#grid-holder").html(
    tmpl({
      list: state.searchResults,
    })
  );
  $('a[name="openDetail"], input[name="openEdit"]').on(
    "click",
    onOpenDetailButtonClick
  );
  $('input[name="buttonDelete"]').on("click", onDeleteButtonClick);
}

//delete

function deleteItem(id) {
  //deleting item
  ajaxReq(
    "/deleteitem",
    {
      id,
    },
    (result) => {
      if (result) {
        state.searchResults = result;
        state.itemsList = result;
        renderTable(); //render table after deleting item
        closeModals();
        return true;
      } else {
        return false;
      }
    }
  );
}

function onDeleteButtonClick() {
  let itemId = $(this).closest("tr").attr("id"); //get opened items id
  showModalAlert();
  let tmplalert = $("#alert-template").html().trim(); //rendering delete modal window
  $("#alert-holder").html(
    _.template(tmplalert)({
      itemId,
      itemName: state.searchResults.find(
        ({ id }) => parseInt(id) === parseInt(itemId)
      ).itemName,
    })
  );
}

//open detail modal
function drawCountryList() {
  let tmpl = $("#delivery-country-template").html().trim();
  tmpl = _.template(tmpl);
  $("#selCountry").html(
    tmpl({
      countries: countries,
    })
  );
  $("#selCountry").on("change", onSelectionChange);
}

function onOpenDetailButtonClick() {
  //on Open item
  let itemId = $(this).closest("tr").attr("id"); //get opened items id
  let item = state.searchResults.find(
    ({ id }) => parseInt(id) === parseInt(itemId)
  ); //finding item
  fillForm(item);
  fillCountriesSelect(item);
}
function fillForm(item) {
  $("#SaveChangesButton").attr("disabled", false);
  $("#checkboxGroup").addClass("d-none");
  $('form[name="item"] :input').each(function () {
    $(this).removeClass("text-danger border-danger"); //remove warnings from fields
  });
  $('form[name="item"] small').each(function () {
    //remove warnings label from fields
    $(this).addClass("d-none");
  });
  showModalBackgorund(); //display modal windows
  $("#itemName").val(item.itemName); //filling fields with parameters of selected item
  $("#supplierEmail").val(item.email);
  $("#itemCount").val(item.count);
  itemPriceinput.val(item.price);
  $("#itemid").val(item.id);
  itemPriceinput.trigger("focusout");
}
function fillCountriesSelect(item) {
  $("#selCountry option:selected").removeAttr("selected");
  drawCountryList();
  $("#selCountry").val(item.delivery.country);
  $("#selCountry option")
    .filter(function () {
      return this.text === item.delivery.country;
    })
    .attr("selected", true);
  onSelectionChange();
  item.delivery.cities.map((val, index) => {
    $.each($("input[type='checkbox']"), function () {
      if ($(this).attr("name") == val) {
        $(this).prop("checked", true);
      }
    });
  });
  if ($(".checkcities:checked").length == $(".checkcities").length) {
    $("#checkAll").prop("checked", true);
  }
}

//modals

$("#openAddNew").on("click", () => {
  //on open item modal
  showModalBackgorund();
  $("#selCountry option:selected").removeAttr("selected");
  $("#checkboxGroup").addClass("d-none");
  $('form[name="item"]').trigger("reset");
  drawCountryList();
});

$(".closeModalDialog,#Cancel,#CancelDelete").on("click", closeModals);

function closeModals() {
  $("#modalBackround").hide();
  $(".modalDialogAlert").hide();
  $(".modalDialogEdit").hide();
}
$(".modalDialogEdit .modalDialogAlert").click((e) => {
  e.stopPropagation();
});

//sorting

function compareValues(key, order = "asc") {
  //sorting object by key(field
  return function innerSort(a, b) {
    const varA = typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
    const varB = typeof b[key] === "string" ? b[key].toUpperCase() : b[key];
    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return order === "desc" ? comparison * -1 : comparison;
  };
}

function sort(arrowCurrent, arrowOther, key, refresh) {
  //hide arrow for name
  arrowOther.html("");
  if (!refresh) arrowChange(arrowCurrent); //change arrow for price
  return state.searchResults.sort(compareValues(key, state.sortStatus)); //return sorted
}

$("#headerName").click(function () {
  arrowP.html("");
  arrowChange(arrowN);
  renderTable();
});

$("#headerPrice").click(function () {
  arrowN.html("");
  arrowChange(arrowP);
  renderTable();
});

function arrowChange(arrow) {
  //changing arrow direction
  if (state.sortStatus === "none") {
    state.sortStatus = "asc";
    arrow.html("&#9650;");
  } else if (state.sortStatus === "asc") {
    state.sortStatus = "desc";
    arrow.html("&#9660;");
  } else if (state.sortStatus === "desc") {
    state.sortStatus = "asc";
    arrow.html("&#9650;");
  }
}

// $('#modalBackround').on("click",function () {                //closing a modal window by clicking outside
//     $('#modalBackround').hide();
//     $('.modalDialogAlert').hide();
//     $('.modalDialogEdit').hide();
// })

//send to server

$.fn.serializeFormJSON = function () {
  //serialize Form to JSON
  const o = {
    cities: [],
  };
  const a = this.serializeArray();
  $.each(a, function () {
    if (Number.isInteger(parseInt(this.name))) {
      o.cities.push(this.name);
    } else if (o[this.name]) {
      if (!o[this.name].push) {
        o[this.name] = [o[this.name]];
      }
      o[this.name].push(this.value || "");
    } else {
      o[this.name] = this.value || "";
    }
  });
  console.log(o);
  return o;
};

$('form[name="item"]').submit(function () {
  //form sending

  let i = 0;
  $($('form[name="item"] :input:text').get().reverse()).each(function () {
    //if field empty focus on it and add alert
    if ($(this).attr("id") != "itemid")
      if (
        $(this).val() == "" ||
        ($(this)[0] == $("#supplierEmail")[0] &&
          !checkValidEmail($(this).val())) ||
        ($(this)[0] == $("#itemName")[0] && checkName($(this).val())) ||
        ($(this)[0] == itemPriceinput[0] && parseFloat($(this).val()) <= 0)
      ) {
        setdanger($(this));
      } else {
        i++;
      }
  });

  if (i >= 4) {
    let item = $(this).serializeFormJSON();
    ajaxReq("/senditem", item, (result) => {
      //sending the form
      if (result) {
        $("#SaveChangesButton").attr("disabled", true);
        state.searchResults = result;
        state.itemsList = result;
        renderTable(); //render table

        $(":input", 'form[name="item"]') //clearing form
          .not(":button, :submit, :reset, :hidden")
          .val("")
          .prop("checked", false)
          .prop("selected", false);
        closeModals();
      }
    });
  }
  return false;
});

$("#searchButton").on("click", () => {
  //search button
  state.searchNameField = $("#serachitem").val();
  renderTable();
});

$("#serachitem").keypress(({ keyCode }) => {
  //on Enter press
  if (keyCode == 13) {
    state.searchNameField = $("#serachitem").val();
    renderTable();
  }
});

$("#serachitem").keyup(function () {
  //if search field are empty render the default view
  if ($(this).val() == "") {
    renderTable();
  }
});

function showModalBackgorund() {
  $("#modalBackround").show();
  $(".modalDialogEdit").show();
}

function showModalAlert() {
  $("#modalBackround").show();
  $(".modalDialogAlert").show();
}
