'use strict';

const ADD_PREFIX = 'add';
const DELETE_PREFIX = 'delete';
const TABLE_PANEL_PREFIX = '-tablePanelDiv';
const ACTIVATE_PANNEL = 'activatePanel';
const PIXEL = 'px';
const HEADER_SEPARATOR = ':';
const EQUAL_SEPARATOR = '=';
const SPACE_SEPARATOR = ' ';
const CHECKBOX_IDS = [
  'add-Strict-Transport-Security',
  'add-Public-Key-Pins',
  'add-X-Frame-Options',
  'add-X-XSS-Protection',
  'add-X-Content-Type-Options',
  'add-Content-Security-Policy',
  'add-Referrer-Policy',
  'add-Expect-CT',
  'delete-Strict-Transport-Security',
  'delete-Public-Key-Pins',
  'delete-X-Frame-Options',
  'delete-X-XSS-Protection',
  'delete-X-Content-Type-Options',
  'delete-Content-Security-Policy',
  'delete-Referrer-Policy',
  'delete-Expect-CT'
];

//code used for collapsing and uncollapsing the accordeon sections
function collapseAndUncollapseAccordionSection() {
  this.classList.toggle('active');
  var panel = this.nextElementSibling;
  if (panel.style.maxHeight) {
    panel.style.maxHeight = null;
  } else {
    panel.style.maxHeight = panel.scrollHeight + PIXEL;
  }
}

var acc = document.getElementsByClassName('accordion');
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener('click', collapseAndUncollapseAccordionSection);
}
//=============================================================================
//handle the clicks on the checkboxes


/*
 Function that will collapse and uncollapse the div with the id add-xxx-tablePanelDiv.
 It also resize the div with the id activatePanel which contains all the
 content of the 'Activate HTTP Response Headers' tab.
 */
function collapseAndUncolapseHeaderOptions(checkbox) {

  if (checkbox.id.startsWith(ADD_PREFIX)) {
    var tablePanel = document.getElementById(checkbox.id + TABLE_PANEL_PREFIX);
    var activatePanel = document.getElementById(ACTIVATE_PANNEL);

    if (checkbox.checked === false) {
      tablePanel.style.maxHeight = null;
    } else {
      tablePanel.style.maxHeight = tablePanel.scrollHeight + PIXEL;

      activatePanel.style.maxHeight =
        parseInt(activatePanel.style.maxHeight) +
        parseInt(tablePanel.style.maxHeight) + PIXEL;
    }
  }
}

/*
Given an id (as string) of type add-xxx,
find the opposite id of type delete-xxx.

Returns the input parameter if  the input parameter
does not fit the patter add-xxx or delete-xxx.
 */
function findIdOfOppositeCheckbox(initialId) {
  var arr = initialId.split('-');

  if (arr.length >= 2 && arr[0] === ADD_PREFIX) {
    return initialId.replace(ADD_PREFIX, DELETE_PREFIX);
  }

  if (arr.length >= 2 && arr[0] === DELETE_PREFIX) {
    return initialId.replace(DELETE_PREFIX, ADD_PREFIX);
  }

  return initialId;
}

var checkboxClickListener = function (ev) {
  var checkbox = ev.target;

  checkUncheckOppositeCheckbox(checkbox);
  collapseAndUncolapseHeaderOptions(checkbox);
};

/*
  Function that receive as parameter a header as a string
  and modifies main form with the values specified in the parameter.
  (for  the 'remove' part of the form)
 */
function setUpMainFormFromStringForDelete(headerAsString) {

  var splitedHeader = headerAsString.split(HEADER_SEPARATOR);
  var headerName = splitedHeader.shift().trim();

  var checkBox = document.getElementById('delete-' + headerName);
  checkBox.checked = true;

}

/*
  Function that receive as parameter a header as a string
  and modifies main form with the values specified in the parameter.
  (for  the 'add' part of the form)
 */
function setUpMainFormFromStringForAdd(headerAsString) {

  //split only on first occurrence
  var splitedHeader = headerAsString.split(HEADER_SEPARATOR);
  var headerName = splitedHeader.shift().trim();
  var headerOptions = splitedHeader.join(HEADER_SEPARATOR).trim().split(';');

  var checkBox = document.getElementById('add-' + headerName);
  checkBox.checked = true;

  for (var i = 0, headerOption; (headerOption = headerOptions[i]); i++) {

    //split only on first occurrence
    var splitedHeaderOption = headerOption.split(EQUAL_SEPARATOR);
    var headerOptionName = splitedHeaderOption.shift().trim();
    var headerOptionValue = splitedHeaderOption.join(EQUAL_SEPARATOR).trim();

    var textBoxOrSelect =
      document.getElementById(
        'add-' + headerName + '-' + headerOptionName);


    if (textBoxOrSelect != undefined) {
      //it must be something like max-age=1234
      //and it's a a text box
      if (headerOption.indexOf(EQUAL_SEPARATOR) != -1) {
        textBoxOrSelect.value = headerOptionValue;
      } else {
        //then it is a select; it cannot be a radio
        //because the radio id finish with the radioX keyword
        textBoxOrSelect.value = 'Yes';
      }
    } else {

      //it must be a radio then
      //it must check that the headerOption contains more
      //than the header option; like in the case
      //ALLOW-FROM https://example.com/
      //which contains header option + some other information

      var splitedHeaderName = headerOption.split(SPACE_SEPARATOR);
      var headerOptionValue = undefined;

      if (splitedHeaderName.length == 2) {
        headerOption = splitedHeaderName[0];
        headerOptionValue = splitedHeaderName[1];
      }

      var radios = document.getElementsByName('add-' + headerName + '-radio');

      for (var j = 0, radio; (radio = radios[j]); j++) {
        if (radio.value === headerOption) {
          radio.checked = true;

          if (headerOptionValue != undefined) {
            var textBoxLinkedToRadio =
              document.getElementById(
                'add-'
                + headerName
                + '-'
                + headerOption
                + '-'
                + 'linkedToRadio');
            textBoxLinkedToRadio.value = headerOptionValue;
          }
        }
      }
    }
  }
}

/*
  Function that receives as parameter the id of the checkbox representing
  a Http header from the main form and translate the elements
  of the form having the same id into a string representation.
 */
function createHttpHeaderFromFormById(idOfCheckBox) {

  var headerCheckBox = document.getElementById(idOfCheckBox);


  if (!headerCheckBox.checked) {
    return undefined;
  }

  var formElements = document.querySelectorAll('*[id^="' + idOfCheckBox + '"]');
  var elementsMap = new Map();
  for (var i = 0, formElement; (formElement = formElements[i]); i++) {

    if (formElement.type == 'hidden') {
      elementsMap.set('headerName', formElement.value);
    }

    if (formElement.type == 'text') {
      if (formElement.name == 'linkedToRadio') {
        elementsMap.set('linkedToRadio', formElement.value);
      } else {
        elementsMap.set(formElement.name, formElement.value);
      }
    }

    if (formElement.type == 'text'
      && formElement.name == 'linkedToRadio') {

    }

    if (formElement.tagName == 'SELECT'
      && formElement.value == 'Yes') {
      elementsMap.set(formElement.name, undefined);
    }

    if (formElement.type == 'radio'
      && formElement.checked) {
      elementsMap.set(formElement.value, undefined);
    }
  }

  var returnValue = elementsMap.get('headerName');
  elementsMap.delete('headerName');

  if (elementsMap.size != 0) {
    returnValue = returnValue + ':';
  }

  for (let key of elementsMap.keys()) {
    var value = elementsMap.get(key);

    if (key == 'linkedToRadio') {
      returnValue = returnValue + ' ' + value;
    } else {
      var returnValueLastChar = returnValue.charAt(returnValue.length - 1);

      if (!(returnValueLastChar == ';')
        && !(returnValueLastChar == ':')) {
        returnValue = returnValue + ';';
      }

      if (value === undefined) {
        returnValue = returnValue + key;
      } else {
        returnValue = returnValue + key + '=' + value;
      }
    }

  }
  return returnValue;
}

/*
  if itemToAdd is undefined then remove the item from localstorage
  otherwise just add it.
 */
function setRemoveItemToLocalstorage(key, itemToAdd) {
  if (itemToAdd === undefined) {
    localStorage.removeItem(key);
  } else {
    localStorage.setItem(key, itemToAdd);
  }
}

function cleanLocalstorage() {

  for (var j = 0; j < CHECKBOX_IDS.length; j++) {
    localStorage.removeItem(CHECKBOX_IDS[j]);
  }
}

/*
Process the submit of the main form; basically, for tha checked
checkedboxes, it serialize the content and store it on localstorage;
 */
function processSubmitMainForm(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }

  for (var j = 0; j < CHECKBOX_IDS.length; j++) {
    setRemoveItemToLocalstorage(
      CHECKBOX_IDS[j],
      createHttpHeaderFromFormById(CHECKBOX_IDS[j]));
  }

  // You must return false to prevent the default form behavior
  return false;
}


/*
  For the specified checkbox, found the opposite checkbox and reverse the
  checked status; it means if the specified checkbox is checked, it will
  uncheck the opposite checkebox and vice-versa.
 */
function checkUncheckOppositeCheckbox(checkbox) {

  if (checkbox.checked) {
    var oppositeCheckBox =
      document.getElementById(
        findIdOfOppositeCheckbox(checkbox.id));

    if (oppositeCheckBox.checked) {
      oppositeCheckBox.checked = false;
    }
  }

}

function restoreMainFormFromLocalstorage(checkboxes) {
  for (var j = 0; j < checkboxes.length; j++) {
    if (localStorage.getItem(checkboxes[j]) != undefined) {
      if (checkboxes[j].startsWith('add-')) {
        setUpMainFormFromStringForAdd(localStorage.getItem(checkboxes[j]));
      } else if (checkboxes[j].startsWith('delete-')) {
        setUpMainFormFromStringForDelete(localStorage.getItem(checkboxes[j]));
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', function () {
  //attach listeners for checkboxes
  var checkboxes = document.querySelectorAll('input[type="checkbox"]');
  for (var i = 0, checkbox; (checkbox = checkboxes[i]); i++) {
    checkbox.addEventListener('click', checkboxClickListener);
  }

  restoreMainFormFromLocalstorage(CHECKBOX_IDS);

  var clearLocalstorageButton = document.getElementById('clearLocalstorage');
  if (clearLocalstorageButton != undefined) {
    clearLocalstorageButton.addEventListener('click', cleanLocalstorage);
  }

  //attach listener for the mainForm submit
  var mainForm = document.getElementById('mainForm');

  if (mainForm != undefined) {
    if (mainForm.attachEvent) {
      mainForm.attachEvent('submit', processSubmitMainForm);
    } else {
      mainForm.addEventListener('submit', processSubmitMainForm);
    }
  }
});
