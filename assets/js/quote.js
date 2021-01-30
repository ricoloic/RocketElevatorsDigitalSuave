
/***********************************************************************
* Project           : RocketElevatorsDigitalPresence-Genesis
*
* Program name      : custom.js
*
* Author            : LOÏC RICO
*
* Date created      : 2020/09/02
*
* Purpose           : Sending of form for estimate
*
* Revision History  :
*
* Date          Author         Ref
* 2020/09/16    LOÏC RICO      undefined/lets say 1
*
***********************************************************************/

$(function () {

    const txtNumElevator = "The number of elevator required is : ";

    const $apartments = $('#apartments'), $floors = $('#floors'), $basements = $('#basements'), $cages = $('#cages'), $occupants = $('#occupants');

    const inputEvery = $('#basements, #occupants, #floors, #apartments, #cages, #opt1, #opt2, #opt3');

    let apartments, floors, basements, cages, occupants, type, prodLine;

    function prodLineCheck () {
        if ($("#opt1").prop("checked")) {
            prodLine = 1;
        } else if ($("#opt2").prop("checked")) {
            prodLine = 2;
        } else if ($("#opt3").prop("checked")) {
            prodLine = 3;
        }
    }

    function resetInput () {
        $('input').val(0);
        $("#total-elev").text(txtNumElevator + '0');
    }

    function infoUpdate () {
        apartments = parseInt($apartments.val(), 10);
        floors = parseInt($floors.val(), 10);
        basements = parseInt($basements.val(), 10);
        cages = parseInt($cages.val(), 10);
        occupants = parseInt($occupants.val(), 10);
    }

    function checkNaN () {
        if (isNaN(apartments) || isNaN(floors) || isNaN(basements) || isNaN(cages) || isNaN(occupants)) {
            return false;
        } else {
            return true;
        }
    }

    function divResidential () {
        $('#apartments-div, #basements-div, #floors-div').removeClass('not-show');
        $('#businesses-div, #parking-div, #cages-div, #occupants-div, #hours-div').addClass('not-show');
    }

    function divCommercial () {
        $('#basements-div, #businesses-div, #parking-div, #cages-div, #floors-div').removeClass('not-show');
        $('#apartments-div, #occupants-div, #hours-div').addClass('not-show');
    }

    function divCorporate () {
        $('#businesses-div, #basements-div, #parking-div, #occupants-div, #floors-div').removeClass('not-show');
        $('#apartments-div, #cages-div, #hours-div').addClass('not-show');
    }

    function divHybrid () {
        $('#businesses-div, #basements-div, #parking-div, #occupants-div, #floors-div, #hours-div').removeClass('not-show');
        $('#apartments-div, #cages-div').addClass('not-show');
    }

    function checkSelect() {
        type = parseInt($("#building-type option:selected").val()); // 0 = none, 1 = residential, 2 = commercial, 3 = corporate, 4 = hybrid
        
        if (type == 0) {
            $('#hr-select, #total-elev, #hr-total-elev').addClass('not-show');
        } else {
            $('#hr-select, #total-elev, #hr-total-elev').removeClass('not-show');
        }

        if (type == 1) {
            divResidential();
        } else if (type == 2) {
            divCommercial();
        } else if (type == 3) {
            divCorporate();
        } else if (type == 4) {
            divHybrid();
        }
    }

    function apiPost () {
        infoUpdate();

        $.post(
            "https://heroku-serverless.herokuapp.com/calculation",

            {
                nbCages: cages,
                nbOcc: occupants,
                nbBase: basements,
                nbApart: apartments,
                nbFloor: floors,
                project: type,
                prodLine: prodLine
            },

            function(data) {
                $("#total-elev").text(txtNumElevator + data.elev);
                $("#cost-elevator").val("$" + data.costElev);
                $("#cost-fee").val("$" + data.costFee);
                $("#cost-total").val("$" + data.costTotal);
            }
        );

    }

    $('#building-type').change( () => {

        resetInput();

        checkSelect()
    })

    inputEvery.on('keyup change', () => {
        infoUpdate();
        if (checkNaN()) {
            prodLineCheck();
            apiPost();
        } else {
            return;
        }
    })
});