import * as sub from './code_sub.js';
import * as esprima from 'esprima';

const eval_code = (input, args) => {
    let parsecode = esprima.parseScript(input, { loc: true });
    let lines = input.split('\n');
    let globals = sub.get_globals(parsecode);
    let enviroment = globals;
    let function_code_element = sub.get_function_code(parsecode);
    let function_code = parsecode.body[function_code_element];

    function_code.params.forEach(function(element){
        enviroment[element.name] = args[element.name];
    });
    args = [];
    let subcode = evalr(function_code.body, enviroment, lines);
    return html_code(subcode);
};

function html_code(subcode) {
    let ans = '';
    subcode.forEach(function(element) {
        if (element !== '' && element !=='\n'){
            ans += element + '<br>\n';}});
    return ans;
}
function evalr_if_while(parsed_code , enviroment , lines){
    switch(parsed_code.type) {
    case 'IfStatement' :
        return handle_if(parsed_code, enviroment, lines);
    case 'WhileStatement':
        return while_handle(parsed_code, enviroment, lines);
    }
}
function evalr_other(parsed_code , enviroment , lines){
    switch(parsed_code.type){
    case 'ExpressionStatement' : return handle_assignment(parsed_code.expression , enviroment , lines);
    case 'BlockStatement' : return block_handle(parsed_code , enviroment , lines);
    case 'ReturnStatement' : return lines;
    }
}

function evalr(parsed_code , enviroment , lines) {
    if(parsed_code.type === 'IfStatement' || parsed_code.type === 'WhileStatement'){
        return evalr_if_while(parsed_code,enviroment,lines);
    }
    else{
        return evalr_other(parsed_code,enviroment,lines);
    }
}
function handle_assignment(parsed_code, enviroment, lines) {
    let left = sub.get_expression(parsed_code.left);
    let right = sub.get_expression(parsed_code.right);
    let value = sub.substituteExpression(enviroment, right);
    enviroment[left] = value;
    return lines;
}

function handle_if(parsed_code, enviroment, lines) {
    let cond = eval(sub.substituteExpression(enviroment, sub.get_expression(parsed_code.test)));
    let line = parsed_code.test.loc.start.line;
    mark(cond, line, lines);
    if (cond) {
        return evalr(parsed_code.consequent, enviroment, lines);
    }
    else{
        if(parsed_code.alternate !== null)
            return evalr(parsed_code.alternate, enviroment, lines);
        else
            return lines;
    }
}

function block_handle(parsed_code, enviroment, lines){
    parsed_code.body.forEach(function(element){
        lines = evalr(element, enviroment, lines);
    });
    return lines;
}


function while_handle(parsed_code, enviroment, lines){
    return evalr(parsed_code.body, enviroment, lines);
}

function mark(cond, line, lines){
    let objClass = 'red';
    if (cond)
        objClass = 'green';
    lines[line - 1] = '<mark class="' + objClass +'">' + lines[line - 1] + '</mark>';
}
export {eval_code};