(function () {
  'use strict';

  describe('Tests of the popup.js file', function () {
    describe('Tests of the findIdOfOppositeCheckbox function', function () {
      it('should return input param if input param not starting with add-* or delete-*', function () {
        const INPUT = 'bla';
        assert.equal(INPUT, findIdOfOppositeCheckbox(INPUT));
      });
      it('should return add-xxx if input param is delete-xxx', function () {
        assert.equal('add-xxx', findIdOfOppositeCheckbox('delete-xxx'));
      });
      it('should return delete-xxx if input param is add-xxx', function () {
        assert.equal('delete-xxx', findIdOfOppositeCheckbox('add-xxx'));
      });
      it('should return initial param if input param contains - but not starting with add or delete', function () {
        const INPUT = 'bla-bla';
        assert.equal(INPUT, findIdOfOppositeCheckbox(INPUT));
      });

      it('should return delete-xxx-yyy if input param is add-xxx-yyy', function () {
        assert.equal('delete-xxx-yyy', findIdOfOppositeCheckbox('add-xxx-yyy'));
      });
    });

    describe('Tests of the checkUncheckOppositeCheckbox function', function () {
      var addCheckbox;
      var removeCheckbox;
      var getElementById;

      beforeEach(function () {
        addCheckbox = {
          id: 'add-xxx',
          checked: false
        };

        removeCheckbox = {
          id: 'delete-xxx',
          checked: false
        };

        getElementById = sinon.stub(document, 'getElementById');
        getElementById.withArgs(addCheckbox.id).returns(addCheckbox);
        getElementById.withArgs(removeCheckbox.id).returns(removeCheckbox);


      });

      afterEach(function () {
        addCheckbox.checked = false;
        removeCheckbox.checked = false;
        getElementById.restore();
      });
      it('if checkbox add-xxx and delete-xxx UNchecked then ' +
        'when add-xxx became checked then delete-xxx should stay UNchecked', function () {
        addCheckbox.checked = false;
        removeCheckbox.checked = false;

        //simulate a click
        addCheckbox.checked = true;

        checkUncheckOppositeCheckbox(addCheckbox);
        assert.equal(false, removeCheckbox.checked);
        assert.equal(true, addCheckbox.checked);
      });

      it('if checkbox add-xxx and delete-xxx checked then ' +
        'when add-xxx became Unchecked then delete-xxx should stay checked', function () {
        addCheckbox.checked = true;
        removeCheckbox.checked = true;

        //simulate a click
        addCheckbox.checked = false;

        checkUncheckOppositeCheckbox(addCheckbox);
        assert.equal(true, removeCheckbox.checked);
        assert.equal(false, addCheckbox.checked);

      });

      it('if checkbox add-xxx is checked and delete-xxx is UNchecked ' +
        'when delete-xxx is checked then add-xxx became UNchecked', function () {
        addCheckbox.checked = true;
        removeCheckbox.checked = false;

        //simulate a click
        removeCheckbox.checked = true;
        checkUncheckOppositeCheckbox(removeCheckbox);
        assert.equal(true, removeCheckbox.checked);
        assert.equal(false, addCheckbox.checked);

      });
    });

    describe('Tests of the functions for the main form', function () {
      var checkBox;
      var hiddenInputField;
      var textInputField;
      var textInputFieldLinkedToRadio;
      var radioField;
      var selectField;
      var listOfFormFields;
      describe('Tests for createHttpHeaderFromFormById function', function () {

        var getElementById;
        var querySelectorAll;

        beforeEach(function () {
          checkBox = {
            id: 'add-xxx',
            checked: false
          };

          hiddenInputField = {
            id: 'add-xxx-hidden',
            type: 'hidden',
            value: 'Header Name'
          };

          textInputField = {
            id: 'add-xxx-text',
            type: 'text',
            value: 'textValue',
            name: 'textName'
          };

          textInputFieldLinkedToRadio = {
            id: 'add-xxx-linkedToRadio',
            type: 'text',
            name: 'linkedToRadio',
            value: 'textValueLinkedToRadio'
          };

          radioField = {
            id: 'add-xxx-radio',
            type: 'radio',
            name: 'radioName',
            value: 'radioValue',
            checked: true
          };

          selectField = {
            id: 'add-xxx-select',
            tagName: 'SELECT',
            value: 'Yes',
            name: 'selectName'
          };

          listOfFormFields = [
            /*0*/checkBox,
            /*1*/hiddenInputField,
            /*2*/textInputField,
            /*3*/radioField,
            /*4*/selectField,
            /*5*/textInputFieldLinkedToRadio,
          ];

          getElementById = sinon.stub(document, 'getElementById');
          getElementById.withArgs(sinon.match.any).returns(checkBox);
          querySelectorAll = sinon.stub(document, 'querySelectorAll');
          querySelectorAll.withArgs(sinon.match.any).returns(listOfFormFields);

        });


        it('if the checkbox is not checked then' +
          'it should return undefined', function () {
          assert.equal(undefined, createHttpHeaderFromFormById('add-xxx'));
        });

        it('if the checkbox is checked then only the hidden field is present' +
          ' then it should return only the hidden field', function () {
          checkBox.checked = true;

          //delete from the list all the elements beside the
          //first two; checkbox and hidden field.
          listOfFormFields.splice(2, 4);

          assert.equal(hiddenInputField.value, createHttpHeaderFromFormById('add-xxx'))
        });

        it('if the checkbox is checked, the hidden field is present ' +
          'and the text field is present' +
          ' then it should return the hidden ' +
          'field + text field name + text field value',
          function () {
            checkBox.checked = true;

            //delete from the list all the elements beside the
            //first 3; checkbox, hidden field and text box.
            listOfFormFields.splice(3, 4);

            assert.equal
            (hiddenInputField.value
              + ':'
              + textInputField.name
              + '='
              + textInputField.value
              , createHttpHeaderFromFormById('add-xxx'))
          });

        it('if the checkbox is checked, the hidden field is present ' +
          'and the radio button is present' +
          ' then it should return the hidden ' +
          'field + radio button field value',
          function () {
            checkBox.checked = true;

            //have in the list only the checkbox, the hidden field
            //and the radio
            listOfFormFields.splice(2, 1);
            listOfFormFields.splice(3, 3);

            assert.equal
            (hiddenInputField.value
              + ':'
              + radioField.value
              , createHttpHeaderFromFormById('add-xxx'))
          });

        it('if the checkbox is checked, the hidden field is present ' +
          'and the select button is present' +
          ' then it should return the hidden ' +
          'field + select button field name', function () {

          checkBox.checked = true;

          //have in the list only the checkbox, the hidden field
          //and the select
          listOfFormFields.splice(2, 2);
          listOfFormFields.splice(3, 1);

          assert.equal
          (hiddenInputField.value
            + ':'
            + selectField.name
            , createHttpHeaderFromFormById('add-xxx'))
        });

        it('if the checkbox is checked, the hidden field is present ' +
          'the radio button is present and the text input linked to radio button is present ' +
          'then it should return the hidden ' +
          'field + radion field value + "text input linked to radio" value', function () {

          checkBox.checked = true;

          //have in the list only the checkbox, the hidden field
          //and the radio and the textInputFieldLinkedToRadio
          listOfFormFields.splice(2, 1);
          listOfFormFields.splice(3, 1);

          assert.equal
          (hiddenInputField.value
            + ':'
            + radioField.value + ' '
            + textInputFieldLinkedToRadio.value
            , createHttpHeaderFromFormById('add-xxx'))

        });

        afterEach(function () {
          checkBox.checked = false;
          getElementById.restore();
          querySelectorAll.restore();
        });
      });
      describe('Tests for setUpMainFormFromHttpHeader', function () {

        var getElementById;
        var getElementsByName;

        beforeEach(function () {
          checkBox = {
            id: 'add-xxx',
            checked: false
          };

          hiddenInputField = {
            id: 'add-xxx-hidden',
            type: 'hidden',
            value: 'Header Name'
          };

          textInputField = {
            id: 'add-xxx-text',
            type: 'text',
            value: 'textValue',
            name: 'textName'
          };

          textInputFieldLinkedToRadio = {
            id: 'add-xxx-linkedToRadio',
            type: 'text',
            name: 'linkedToRadio',
            value: 'textValueLinkedToRadio'
          };

          radioField = {
            id: 'add-xxx-radio',
            type: 'radio',
            name: 'radioName',
            value: 'radioValue',
            checked: true
          };

          selectField = {
            id: 'add-xxx-select',
            tagName: 'SELECT',
            value: 'No',
            name: 'selectName'
          };

          listOfFormFields = [
            /*0*/checkBox,
            /*1*/hiddenInputField,
            /*2*/textInputField,
            /*3*/radioField,
            /*4*/selectField,
            /*5*/textInputFieldLinkedToRadio,
          ];
          getElementById = sinon.stub(document, 'getElementById');
          getElementsByName = sinon.stub(document, 'getElementsByName');
          getElementsByName.withArgs(sinon.match.any).returns([radioField]);
        });

        afterEach(function () {
          checkBox.checked = false;
          getElementById.restore();
          getElementsByName.restore();
        });

        /*
        Strict-Transport-Security: max-age=<expire-time>
        Strict-Transport-Security: max-age=<expire-time>; includeSubDomains
        Strict-Transport-Security: max-age=<expire-time>; preload
         */
        it('if the input is "Strict-Transport-Security: max-age=1234"' +
          ' then the checkbox with id "add-Strict-Transport-Security"' +
          ' should be checked and text box with the id' +
          ' "add-Strict-Transport-Security-max-age" should be 1234',
          function () {

            getElementById.withArgs("add-Strict-Transport-Security").returns(checkBox);
            checkBox.checked = false;

            getElementById.withArgs("add-Strict-Transport-Security-max-age").returns(textInputField);
            getElementById.withArgs("add-Strict-Transport-Security-includeSubDomains").returns(selectField);


            setUpMainFormFromStringForAdd('Strict-Transport-Security: max-age=1234');
            assert.equal(true, checkBox.checked);
            assert.equal('1234', textInputField.value);
            assert.equal('No', selectField.value);
          });
        it('if the input is "Strict-Transport-Security: max-age=1234; includeSubDomains"' +
          ' then the checkbox with id "add-Strict-Transport-Security"' +
          ' should be checked and text box with the id' +
          ' "add-Strict-Transport-Security-max-age" should be 1234' +
          ' and select field with the id add-Strict-Transport-Security-includeSubDomains' +
          ' should be Yes',
          function () {

            getElementById.withArgs("add-Strict-Transport-Security").returns(checkBox);
            checkBox.checked = false;

            getElementById.withArgs("add-Strict-Transport-Security-max-age").returns(textInputField);
            getElementById.withArgs("add-Strict-Transport-Security-includeSubDomains").returns(selectField);

            setUpMainFormFromStringForAdd('Strict-Transport-Security: max-age=1234; includeSubDomains');
            assert.equal(true, checkBox.checked);
            assert.equal('1234', textInputField.value);
            assert.equal('Yes', selectField.value);
          });


        /*
          X-Frame-Options: DENY
          X-Frame-Options: SAMEORIGIN
          X-Frame-Options: ALLOW-FROM https://example.com/
         */
        it('if the input is "X-Frame-Options: DENY" then' +
          ' the checkbox with the id "add-X-Frame-Options"' +
          ' is checked and the radio button having value "DENY" is checked',
          function () {
            checkBox.checked = false;
            getElementById.withArgs("add-X-Frame-Options").returns(checkBox);
            getElementById.withArgs("add-X-Frame-Options-DENY").returns(undefined);

            radioField.value = 'DENY';

            setUpMainFormFromStringForAdd('X-Frame-Options:DENY');
            assert.equal(true, checkBox.checked);
            assert.equal(true, radioField.checked);

          });
        it('if the input is "X-Frame-Options: ALLOW-FROM https://example.com/" then' +
          ' the checkbox with the id "add-X-Frame-Options"' +
          ' is checked and the radio button having value "ALLOW-FROM" is checked' +
          ' and the checkbox lined to the radio contains "https://example.com/" ',
          function () {
            checkBox.checked = false;
            getElementById.withArgs("add-X-Frame-Options").returns(checkBox);
            getElementById.withArgs("add-X-Frame-Options-ALLOW-FROM").returns(undefined);
            getElementById.withArgs("add-X-Frame-Options-ALLOW-FROM-linkedToRadio").returns(textInputField);
            radioField.value = 'ALLOW-FROM';

            setUpMainFormFromStringForAdd('X-Frame-Options: ALLOW-FROM https://example.com/');
            assert.equal(true, checkBox.checked);
            assert.equal(true, radioField.checked);
            assert.equal('https://example.com/', textInputField.value);

          });


      });
    });
  });
  describe('Tests of the background.js', function () {
    var headers;

    //recreate the headers, cause it will be modified by the function calls
    beforeEach(function () {
      headers = [
        {name: "expires", value: "Wed, 07 Feb 2018 21:11:15 GMT"},
        {name: "abc-123", value: "Wed, 07 Feb 2018 21:11:15 GMT"},
        {name: "xxx-yyy", value: "Wed, 07 Feb 2018 21:11:15 GMT"},
        {name: "ab-2345678-4", value: "Wed, 07 Feb 2018 21:11:15 GMT"}
      ];
    });
    describe('Tests of the removeMatchingHeaders function', function () {
      it('if the input does not contains the header to remove' +
        ' then the output should be the same as the input', function () {

        var initialLenght = headers.length;
        removeMatchingHeaders(headers, 'xxxxxxx-123');
        var finalLength = headers.length;

        assert.equal(initialLenght, finalLength);
      });

      it('if the input contains the header "aaa-123"' +
        'and the header to remove is "aaa-123" ' +
        'then the output should not contain the header "aaa-123"', function () {

        var initialLenght = headers.length;
        removeMatchingHeaders(headers, 'abc-123');
        var finalLength = headers.length;

        assert.equal(initialLenght - 1, finalLength);
      });

      it('if the input contains the header "aaa-123"' +
        'and the header to remove is "AAA-123" (all upper cases)' +
        'then the output should not contain the header "aaa-123"', function () {

        var initialLenght = headers.length;
        removeMatchingHeaders(headers, 'ABC-123');
        var finalLength = headers.length;

        assert.equal(initialLenght - 1, finalLength);
      });
    });
    describe('Tests of the headerPresent function', function () {
      it('if the input does not contains the header to check ' +
        ' then the result of the headerPresent should be false', function () {

        assert.equal(false, headerPresent(headers, 'xxxxxxx'));
      });

      it('if the input contains the header "aaa-123"' +
        'and the header to look for is "aaa-123" ' +
        'then the result of the headerPresent should be true', function () {

        assert.equal(true, headerPresent(headers, 'abc-123'));
      });

      it('if the input contains the header "aaa-123"' +
        'and the header to look for is "AAA-123" (all upper cases)' +
        'then the result of the headerPresent should be true', function () {

        assert.equal(true, headerPresent(headers, 'ABC-123'));
      });
    });
    describe('Tests of the responseListener function', function () {


      var localStorageGetItem;
      var details;

      beforeEach(function () {
        localStorageGetItem = sinon.stub(window.localStorage, 'getItem');

        details = {
          responseHeaders: [
            {name: 'X-Content-Type-Options', value: 'nosniff'},
            {name: 'x-xss-protection', value: '1; mode=block'},
            {name: 'x-frame-options', value: 'SAMEORIGIN'}
          ],

        }
      });

      afterEach(function () {
        localStorageGetItem.restore();
      });

      it('if the localstorage contains no headers to replace ' +
        ' then the return value of responseListener function should ' +
        ' contain unchanged response headers', function () {
        localStorageGetItem.withArgs(sinon.match.any).returns(undefined);

        var initialHeadersLength = details.responseHeaders.length;
        responseListener(details);
        var afterHeadersLength = details.responseHeaders.length;
        assert.equal(initialHeadersLength, afterHeadersLength);
      });

      it('if the localstorage contains header to REMOVE ' +
        ' and the response headers do not contain the header to REMOVE' +
        ' then the return value of responseListener function should ' +
        ' contain unchanged response headers', function () {

        localStorageGetItem.withArgs('delete-blabla').returns('blabla');

        var initialHeadersLength = details.responseHeaders.length;
        responseListener(details);
        var afterHeadersLength = details.responseHeaders.length;
        assert.equal(initialHeadersLength, afterHeadersLength);
      });

      it('if the localstorage contains header to REMOVE ' +
        ' and the response headers contain the header to REMOVE' +
        ' then the return value of responseListener function should ' +
        ' not contain the header to remove in ' +
        ' the response headers', function () {

        localStorageGetItem.withArgs('delete-X-XSS-Protection').returns('X-XSS-Protection');
        var initialHeadersLength = details.responseHeaders.length;

        responseListener(details);
        var afterHeadersLength = details.responseHeaders.length;

        assert.equal(initialHeadersLength, afterHeadersLength + 1);

      });

      it('if the localstorage contains header to ADD ' +
        ' and the response headers contain the header to ADD' +
        ' then the return value of responseListener function should ' +
        ' contain unchanged response headers', function () {

        localStorageGetItem.withArgs('add-X-XSS-Protection').returns('X-XSS-Protection');
        var initialHeadersLength = details.responseHeaders.length;

        responseListener(details);
        var afterHeadersLength = details.responseHeaders.length;

        assert.equal(initialHeadersLength, afterHeadersLength);
      });

      it('if the localstorage contains header to ADD ' +
        ' and the response headers DO NOT contain the header to ADD' +
        ' then the return value of responseListener function should ' +
        ' contain in response headers the new header', function () {

        localStorageGetItem.withArgs('add-Expect-CT').returns('Expect-CT');
        var initialHeadersLength = details.responseHeaders.length;

        responseListener(details);
        var afterHeadersLength = details.responseHeaders.length;

        assert.equal(initialHeadersLength + 1, afterHeadersLength);
        assert.equal('Expect-CT', details.responseHeaders[3].name);
      });
    });
  });
})();
