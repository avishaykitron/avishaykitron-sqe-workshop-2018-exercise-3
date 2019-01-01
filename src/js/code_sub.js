import * as escodegen from 'escodegen';
import * as esgraph from 'esgraph';
import * as esprima from 'esprima';
export {dot_impel, substituteExpression ,  get_expression};

const dot_impel = (input, args) => {
    let parsecode = esprima.parseScript(input, { range: true });
    let enviroment = getParams(parsecode.body[0].params , args);
    let nodes = esgraph(parsecode.body[0].body)[2];
    nodes = nodes.slice(1, nodes.length - 1);
    if(nodes.length ===0) return '';
    nodes[0].prev = [];
    nodes.forEach(function (element) {
        if(element.astNode.type === 'ReturnStatement'){
            element.next = [];
            delete element.normal;}
    });
    nodes.forEach(function (element) {
        element.label = escodegen.generate(element.astNode);
    });
    mergeNodes(nodes);
    evalNodes(nodes[0] , enviroment);
    create_merge_nodes(nodes);
    return getGraph(nodes);
};
function getParams(params , args){
    let ans = {};
    let dict = params.map((key) => {return {'key': key.name, 'value': args[key.name]};});
    dict.forEach((element) => {ans[element.key]=element.value;});
    return ans;
}
function mergeNodes(nodes){
    for (let i = 0 ; i < nodes.length ; i++){
        let n = nodes[i];
        while (n.normal && n.normal.normal && n.normal.prev.length ===1 ) {
            n.next = n.normal.next;
            n.label = n.label + '\n' + n.normal.label;
            nodes.splice(nodes.indexOf(n.normal),1);
            n.normal = n.normal.normal;}}
}
function evalNodes(node , enviroment){
    node.green = true;
    if(node.false && node.true){
        let parsecode = esprima.parseScript(node.label, { range: true });
        let test = evalr(parsecode.body[0] , enviroment);
        if(test){
            evalNodes(node.true ,enviroment);
        }
        else{
            evalNodes(node.false , enviroment);
        }
    }
    else if(node.normal){
        let parsecode = esprima.parseScript(node.label, { range: true });
        evalr(parsecode , enviroment);
        evalNodes(node.normal, enviroment);
    }
}
function create_merge_nodes(nodes){
    nodes.forEach(function (node) {
        if(node.prev.length > 1){
            let m_node =  esgraph('')[0];
            m_node.label = '';
            m_node.astNode = undefined;
            m_node.next = node;
            m_node.green = true;
            m_node.prev = node.prev;
            m_node.type = 'normal';
            m_node.parent =node.parent;
            m_node.normal = node;
            node.parent = m_node;
            node.prev.forEach(function (prev) {
                nodes.forEach(function (element) {
                    if(element.label.includes(prev.label)){
                        element.next = m_node;
                        element.normal = m_node;}});});
            node.prev = m_node;
            nodes.push(m_node);}});}

function getGraph(nodes){
    let ans = ['digraph cfg { forcelabels=true '];
    for (let [i, node] of nodes.entries()) {
        let label = node.label;
        ans.push(`n${i} [label="${label}", xlabel = ${i + 1}, `);
        let s = 'rectangle';
        if(node.label === '')
            s = 'circle';
        else if (node.true || node.false) {
            s = 'diamond';}
        ans.push(` shape=${s},`);
        ans.push(color_green(node));}
    getEdges(ans , nodes);
    return ans.join('');

}
function color_green(node){
    if (node.green === true) {return ' style = filled, fillcolor = green]\n';}
    return ']\n';
}
function getEdges(ans , nodes){
    for (let [index, node] of nodes.entries()) {
        for (let type of ['normal', 'true', 'false']) {
            let next_node = node[type];
            if (!next_node)
                continue;
            ans.push(`n${index} -> n${nodes.indexOf(next_node)} [`);
            if (['true', 'false'].includes(type))
                ans.push(`label="${type.charAt(0).toUpperCase()}"`);
            ans.push(']\n');}}
    ans.push(' }');
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
    let arr =  enviroment[array_func[0]];
    ans += ' ' + arr.length;
    return ans;
}
function handle_array_acessor(enviroment , element) {
    let ans = '';
    let start = element.indexOf('[');
    let end = element.indexOf(']');
    let val = substituteExpression(enviroment , element.substring(start+1 , end));
    let array_var = element.substring(0,start);
    ans += ' ' + enviroment[array_var][val] ;
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

function evalr_other(parsed_code , enviroment , lines){
    switch(parsed_code.type){
    case 'ExpressionStatement' : return handle_exp(parsed_code.expression , enviroment , lines);
    case 'Program' : return block_handle(parsed_code , enviroment , lines);
    }
}

function evalr(parsed_code , enviroment , lines) {
    if(parsed_code.type === 'VariableDeclaration'){
        return handle_variable_dec(parsed_code,enviroment);
    }
    else{
        return evalr_other(parsed_code,enviroment,lines);
    }
}
function handle_exp(parsed_code, enviroment){
    if(parsed_code.type === 'AssignmentExpression')
        return handle_assignment(parsed_code , enviroment);
    else if (parsed_code.type === 'UpdateExpression')
        return handle_update(parsed_code ,enviroment);
    else
        return handle_binary(parsed_code , enviroment);

}
function handle_update(parsed_code ,enviroment){
    let left = get_expression(parsed_code.argument);
    if(parsed_code.operator === '++')
        enviroment[left] = enviroment[left] + ' + 1';
    else
        enviroment[left] = enviroment[left] + ' - 1';
    return true;

}
function handle_binary(parsed_code , enviroment){
    let left = substituteExpression(enviroment ,get_expression(parsed_code.left) );
    let right = substituteExpression(enviroment ,get_expression(parsed_code.right));
    return eval(left + parsed_code.operator + right);

}
function handle_assignment(parsed_code, enviroment) {
    let left = get_expression(parsed_code.left);
    let right = get_expression(parsed_code.right);
    let value = substituteExpression(enviroment, right);
    enviroment[left] = value;
    return true;
}
function handle_variable_dec(parsed_code, enviroment){
    parsed_code.declarations.forEach(function (element) {
        if(element.init != null){
            let right = get_expression(element.init);
            if(right.includes('[') && right.indexOf('[')===0){
                enviroment[element.id.name] = create_Array_from_string(substituteExpression(enviroment, right));
            }
            else {
                let value = substituteExpression(enviroment, right);
                enviroment[element.id.name] = value;
            }
        }
    });
    return true;
}
function create_Array_from_string(array){
    let ans  = [];
    let array_elements = array.split('');
    array_elements.forEach(function(element){
        if(element != '[' && element != ']' && element != ' ' && element != '')
            ans.push(element);
    });
    return ans;
}
/*function handle_if(parsed_code, enviroment) {
    let cond = eval(substituteExpression(enviroment, get_expression(parsed_code.test)));
    if (cond) {
        return evalr(parsed_code.consequent, enviroment);
    }
    else{
        if(parsed_code.alternate !== null)
            return evalr(parsed_code.alternate, enviroment);
    }
}*/

function block_handle(parsed_code, enviroment){
    parsed_code.body.forEach(function(element){
        evalr(element, enviroment);
    });
    return true;
}


/*function while_handle(parsed_code, enviroment){
    return evalr(parsed_code.body, enviroment);
}*/