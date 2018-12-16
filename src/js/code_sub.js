import * as esprima from 'esprima';
export {subtition, substituteExpression , get_function_code , get_globals , get_expression};

const subtition = (input) => {
    let parsecode = esprima.parseScript(input, { loc: true });
    let enviroment = {};
    let lines = input.split('\n');
    let function_code = get_function_code(parsecode);
    let subtitued_code = sub_parsed_code(parsecode.body[function_code], enviroment, lines);
    return final_code(subtitued_code);

};
var args = [];
function final_code(sub_code){
    let ans = '';
    sub_code.forEach(function(element) {
        let split_element = element.trim().split(/\s+/);
        if (split_element.length !== 1 || split_element[0] !== ''){
            ans = ans + element + '\n';}});
    return ans;
}

function get_function_code(parsecode){
    let counter =0 ;
    let ans = counter;
    parsecode.body.forEach(function(element){
        if(element.type === 'FunctionDeclaration'){
            ans = counter;
        }
        counter ++;
    });
    return ans;
}
function sub_parsed_code(parsed_code , enviroment , lines){
    if(parsed_code.type === 'ReturnStatement'|| parsed_code.type === 'FunctionDeclaration'|| parsed_code.type ==='BlockStatement'|| parsed_code.type ==='VariableDeclaration'){
        return sub_parsed_code_main(parsed_code , enviroment , lines);
    }
    else{
        return sub_parsed_code_sec(parsed_code , enviroment , lines);
    }
}

function sub_parsed_code_main(parsed_code , enviroment , lines) {
    switch(parsed_code.type){
    case 'FunctionDeclaration':  parsed_code.params.forEach(function(element) {args.push(element.name);});return block_handle(parsed_code.body, enviroment, lines);
    case 'BlockStatement' : return block_handle(parsed_code , enviroment , lines);
    case 'VariableDeclaration' : return variable_declartion_handle(parsed_code , enviroment , lines);
    case 'ReturnStatement' : return return_handle(parsed_code , enviroment , lines);
    }
}

function sub_parsed_code_sec(parsed_code , enviroment , lines){
    switch (parsed_code.type) {
    case 'IfStatement' : return handle_if(parsed_code , enviroment , lines);
    case 'ExpressionStatement' : return handle_expr(parsed_code,enviroment , lines);
    case 'WhileStatement' : return handle_while(parsed_code , enviroment , lines);
    }
}

function block_handle(parsed_code , enviroment , lines){
    parsed_code.body.forEach(function(element){
        lines = sub_parsed_code(element, enviroment, lines);
    });
    return lines;
}
function variable_declartion_handle(parsed_Code, enviroment, lines)
{
    parsed_Code.declarations.forEach(function(element){
        if(element.init !== null) {
            if(get_expression(element.init).includes('[')){
                enviroment[element.id.name] = create_Array_from_string(substituteExpression(enviroment,get_expression(element.init)));
            }
            else
                enviroment[element.id.name] = substituteExpression(enviroment,get_expression(element.init));
        }
        else{enviroment[element.id.name] = null;}
    });
    let line = lines[parsed_Code.loc.start.line - 1];
    lines[parsed_Code.loc.start.line - 1] = line.substring(0,parsed_Code.loc.start.column) + line.substring(parsed_Code.loc.end.column);
    return lines;
}

function get_expression(exp){
    let res = '';
    if(exp.type === 'Literal' || exp.type === 'Identifier' || exp.type === 'ArrayExpression'){
        res = res + get_expressin_basic(exp);
    }
    else{
        res = res + get_complex_expprsion(exp);
    }
    return res;
}
function get_expressin_basic(right){
    let res = '';
    switch(right.type) {
    case 'Literal': res = res + right.value; break;
    case 'Identifier' : res = res + right.name; break;
    case 'ArrayExpression' : res = res + '[' + get_array_values(right)+ '] ' ;break;
    }
    return res;
}
function get_array_values(expr){
    let res = '';
    expr.elements.forEach(function (element) {
        res = res + ' ' + element.value ;
    });
    return res;
}
function get_complex_expprsion1(right){
    let res = '';
    switch(right.type){
    case 'UnaryExpression' : res = res + handle_Unary_Expression(right); break;
    case 'UpdateExpression' : right.operator === '--' ?res = res + get_expression(right.argument) + '=' + get_expression(right.argument) + ' - 1' :res = res + get_expression(right.argument) + '=' + get_expression(right.argument) + ' + 1'; break;
    }
    return res;
}
function get_complex_expprsion2(right){
    let res = '';
    switch(right.type) {
    case 'BinaryExpression' :
        (right.operator === '+' || right.operator === '-') ? res = res + ' ( ' + get_expression(right.left) + ' ' + right.operator + ' ' + get_expression(right.right) + ' ) ' : res = res + get_expression(right.left) + ' ' + right.operator + ' ' + get_expression(right.right);
        break;
    case 'MemberExpression' :
        res = res + get_member_expression(right);
        break;
    }
    return res;
}

function get_complex_expprsion(right){
    let res = '';
    if (right.type === 'BinaryExpression' ||right.type === 'MemberExpression'){
        res = res + get_complex_expprsion2(right);
    }
    else{
        res = res + get_complex_expprsion1(right);
    }
    return res;
}

function get_member_expression(exp){
    let res ='';
    if (exp.computed === true){
        res = res + exp.object.name +'[' + get_expression(exp.property) + '] ' ;
    }
    else{
        res = res + exp.object.name + '.' + exp.property.name;
    }
    return res;
}
function handle_Unary_Expression(exp){
    let res ='';
    //if(exp.prefix == true){
    res = res + exp.operator + get_expression(exp.argument);
    /*}
    else{
        res = res + get_expprsion(exp.argument) + exp.operator ;
    }*/
    return res;
}
function handle_array_property(enviroment , element ,array_func) {
    let ans = '';
    if (array_func[0] in enviroment){
        let arr =  enviroment[array_func[0]];
        if(!args.includes(arr)){
            ans += ' ' + arr.length;
        }
        else{
            ans += ' ' +arr + '.length';
        }
    }
    else{ans += ' ' + element;}
    return ans;
}
function handle_array_acessor(enviroment , element) {
    let ans = '';
    let start = element.indexOf('[');
    let end = element.indexOf(']');
    let val = substituteExpression(enviroment , element.substring(start+1 , end));
    if (element.substring(0,start) in enviroment){
        let array_var = element.substring(0,start);
        args.includes(enviroment[array_var]) ? ans += ' ' + enviroment[array_var] +'['+val+']' : ans += ' ' + enviroment[array_var][val] ;}
    else{ans += ' ' + element;}
    return ans;
}
function substituteExpression(enviroment , exp){
    let chars = exp.split(/[\s,]+/); let ans = '';
    chars.forEach(function (element){
        let array_func = element.split('.');
        if(array_func.length >1){
            ans += handle_array_property(enviroment , element ,array_func);}
        else{
            if (element.includes('[') && element.length >1){
                ans += handle_array_acessor(enviroment , element);
            }
            else {if (element in enviroment) {ans += ' ' + enviroment[element];} else {ans += ' ' + element;}}
        }});return ans.substring(1);}

function create_Array_from_string(array){
    let ans  = [];
    let array_elements = array.split('');
    array_elements.forEach(function(element){
        if(element != '[' && element != ']' && element != ' ' && element != '')
            ans.push(element);
    });
    return ans;
}
function return_handle(parsecode, environment, lines)
{
    let expr = substituteExpression(environment, get_expression(parsecode.argument));
    let line = parsecode.argument.loc.start.line;
    let currLine = lines[line - 1];
    lines[line - 1] = currLine.substring(0, parsecode.argument.loc.start.column) + expr + currLine.substring(parsecode.argument.loc.end.column);
    return lines;
}

function handle_expr(parse_Code, environment, lines)
{
    switch (parse_Code.expression.type) {
    case 'UpdateExpression': return handle_update (parse_Code.expression, environment, lines);
    case 'AssignmentExpression': return handle_assignment(parse_Code.expression, environment, lines);
    }
}
function handle_update(parsecode, environment, lines){
    let expr = get_expression(parsecode);
    let chars = expr.split('=');
    let left = chars[0];
    let right = chars [1];
    let value = substituteExpression(environment, right);
    if(environment.hasOwnProperty(left)) {
        environment[left] = value;}
    if (args.includes(left) === false) {
        lines[parsecode.loc.start.line - 1] = '';}
    else {
        let line = parsecode.right.loc.start.line;
        let currLine = lines[line - 1];
        lines[line - 1] = currLine.substring(0, parsecode.right.loc.start.column) + value + currLine.substring(parsecode.right.loc.end.column);
    }
    return lines;
}
function handle_assignment(parsecode, environment, lines)
{
    let left = get_expression(parsecode.left);
    let right = get_expression(parsecode.right);
    let value = substituteExpression(environment, right);
    if(environment.hasOwnProperty(left)) {
        environment[left] = value;}
    if (args.includes(left) === false) {
        lines[parsecode.loc.start.line - 1] = '';}
    else {
        let line = parsecode.right.loc.start.line;
        let currLine = lines[line - 1];
        lines[line - 1] = currLine.substring(0, parsecode.right.loc.start.column) + value + currLine.substring(parsecode.right.loc.end.column);
    }
    return lines;
}

function handle_if(parsecode, environment, lines) {
    let val = substituteExpression(environment , get_expression(parsecode.test));
    let line = parsecode.test.loc.start.line;
    let currLine = lines[line - 1];
    lines[line - 1] = currLine.substring(0, parsecode.test.loc.start.column) + val + currLine.substring(parsecode.test.loc.end.column);
    lines = sub_parsed_code(parsecode.consequent, copy_env(environment), lines);
    if(parsecode.alternate != null)
        lines = sub_parsed_code(parsecode.alternate, copy_env(environment), lines);
    return lines;
}

function handle_while(parsecode, environment, lines) {
    let val = substituteExpression(environment ,get_expression(parsecode.test));
    let line = parsecode.test.loc.start.line;
    let currLine = lines[line - 1];
    lines[line - 1] = currLine.substring(0, parsecode.test.loc.start.column) + val + currLine.substring(parsecode.test.loc.end.column);
    return sub_parsed_code(parsecode.body, copy_env(environment), lines);
}


function copy_env(env) {
    let new_env = JSON.parse(JSON.stringify(env));
    return new_env;
}


function get_globals(parsecode){
    let globals = {};
    parsecode.body.forEach(function(element){
        if(element.type === 'VariableDeclaration'){
            element.declarations.forEach(function (v){
                globals[v.id.name] = get_expression(v.init);
            });
        }
    });
    return globals;
}
