import $ from 'jquery';
import {parseCode} from './code-analyzer';
import Viz from 'viz.js';
import {Module, render} from 'viz.js/full.render.js';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let code = $('#codePlaceholder').val();
        let args = $('#argPlaceholder').val();
        let parsedCode = parseCode(code, JSON.parse(args));
        let viz = new Viz({ Module, render });
        viz.renderSVGElement(parsedCode).then(function(element) {
            $('#parsedCode').html(element);
        });

    });
});

/*function jsonToTable(model , sel) {
    $(sel).html('');
    let cols = create_col_header(model , sel);
    for(let i=0;i<model.length;i++){
        let row$ = $('<tr/>');
        for (let j = 0; j < cols.length; j++) {
            let cell = model[i][cols[j]];
            if (cell == null) cell = '';
            row$.append($('<td/>').html(cell));
        }
        $(sel).append(row$);
    }
}


function create_col_header(models , sel){
    let headerTr$ = $('<tr/>');
    let col = [];
    for(let i =0 ; i< models.length ; i++){
        let row = models[i];
        for(let key in row){
            if($.inArray(key , col) === -1){
                col.push(key);
                headerTr$.append($('<th/>').html(key));
            }
        }
    }
    $(sel).append(headerTr$);
    return col;
}*/