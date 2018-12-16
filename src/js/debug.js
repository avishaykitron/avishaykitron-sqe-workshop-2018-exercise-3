

/*const subtition = (input , code) => {
    let parsecode = input;
    let lines = code.split('\n');
    let enviroment = {};
    let function_code = get_function_code(parsecode);
    let subtitued_code = sub_parsed_code(function_code, enviroment, lines);
    return final_code(subtitued_code);
};
var args = [];

function final_code(sub_code){
    let ans = '';
    sub_code.forEach(function(element) {
        if (element !== ''){
            ans = ans + element + '\n';}});
    return ans;
}

function get_function_code(parsecode){
    let ans = {};
    parsecode.body.forEach(function(element){
        if(element.type === 'FunctionDeclaration'){
            ans = element;
        }
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
        element.init !== null ? enviroment[element.id.name] = substituteExpression(enviroment,get_expression(element.init)) : enviroment[element.id.name] = null;
    });
    let line = lines[parsed_Code.loc.start.line - 1];
    line[parsed_Code.loc.start.line - 1] = line.substring(0,parsed_Code.loc.start.column) + line.substring(parsed_Code.loc.end.column);
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
    case 'ArrayExpression' : res = res + '[' + get_array_values(right)+ ']' ;break;
    }
    return res;
}
function get_array_values(expr){
    let res = '';
    expr.elements.forEach(function (element) {
        res = res + ' ' + element.value;
    });
    return res;
}
function get_complex_expprsion(right){
    let res = '';
    switch(right.type){
    case 'BinaryExpression' : res = res + get_expression(right.left) + ' ' + right.operator+ ' ' + get_expression(right.right); break;
    case 'MemberExpression' : res = res + get_member_expression(right) ; break;
    case 'UnaryExpression' : res = res + handle_Unary_Expression(right); break;
    case 'UpdateExpression' : res = res + get_expression(right.argument) + right.operator; break;
    }
    return res;
}

function get_member_expression(exp){
    let res ='';
    if (exp.computed === true){
        res = res + exp.object.name +' [ ' + get_expression(exp.property) + ' ] ' ;
    }
    else{
        res = res + exp.object.name + ' . ' +get_expression(exp.property.name);
    }
    return res;
}
function handle_Unary_Expression(exp){
    let res ='';
    //if(exp.prefix == true){
    res = res + exp.operator + get_expression(exp.argument);
    *//*}
    else{
        res = res + get_expprsion(exp.argument) + exp.operator ;
    }*//*
    return res;
}
function substituteExpression(enviroment , exp){
    let chars = exp.split(' ');
    let ans = '';
    chars.forEach(function (element){
        if (element in enviroment){ans += ' ' + enviroment[element];}
        else{ans += ' ' + element;}});
    return ans.substring(1);
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
    case 'UpdateExpression': return lines;
    case 'AssignmentExpression': return handle_assignment(parse_Code.expression, environment, lines);
    }
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

var input = {
    'type': 'Program',
    'body': [
        {
            'type': 'FunctionDeclaration',
            'id': {
                'type': 'Identifier',
                'name': 'binarySearch',
                'loc': {
                    'start': {
                        'line': 1,
                        'column': 9
                    },
                    'end': {
                        'line': 1,
                        'column': 21
                    }
                }
            },
            'params': [
                {
                    'type': 'Identifier',
                    'name': 'X',
                    'loc': {
                        'start': {
                            'line': 1,
                            'column': 22
                        },
                        'end': {
                            'line': 1,
                            'column': 23
                        }
                    }
                },
                {
                    'type': 'Identifier',
                    'name': 'V',
                    'loc': {
                        'start': {
                            'line': 1,
                            'column': 25
                        },
                        'end': {
                            'line': 1,
                            'column': 26
                        }
                    }
                },
                {
                    'type': 'Identifier',
                    'name': 'n',
                    'loc': {
                        'start': {
                            'line': 1,
                            'column': 28
                        },
                        'end': {
                            'line': 1,
                            'column': 29
                        }
                    }
                }
            ],
            'body': {
                'type': 'BlockStatement',
                'body': [
                    {
                        'type': 'VariableDeclaration',
                        'declarations': [
                            {
                                'type': 'VariableDeclarator',
                                'id': {
                                    'type': 'Identifier',
                                    'name': 'low',
                                    'loc': {
                                        'start': {
                                            'line': 2,
                                            'column': 8
                                        },
                                        'end': {
                                            'line': 2,
                                            'column': 11
                                        }
                                    }
                                },
                                'init': null,
                                'loc': {
                                    'start': {
                                        'line': 2,
                                        'column': 8
                                    },
                                    'end': {
                                        'line': 2,
                                        'column': 11
                                    }
                                }
                            },
                            {
                                'type': 'VariableDeclarator',
                                'id': {
                                    'type': 'Identifier',
                                    'name': 'high',
                                    'loc': {
                                        'start': {
                                            'line': 2,
                                            'column': 13
                                        },
                                        'end': {
                                            'line': 2,
                                            'column': 17
                                        }
                                    }
                                },
                                'init': null,
                                'loc': {
                                    'start': {
                                        'line': 2,
                                        'column': 13
                                    },
                                    'end': {
                                        'line': 2,
                                        'column': 17
                                    }
                                }
                            },
                            {
                                'type': 'VariableDeclarator',
                                'id': {
                                    'type': 'Identifier',
                                    'name': 'mid',
                                    'loc': {
                                        'start': {
                                            'line': 2,
                                            'column': 19
                                        },
                                        'end': {
                                            'line': 2,
                                            'column': 22
                                        }
                                    }
                                },
                                'init': null,
                                'loc': {
                                    'start': {
                                        'line': 2,
                                        'column': 19
                                    },
                                    'end': {
                                        'line': 2,
                                        'column': 22
                                    }
                                }
                            }
                        ],
                        'kind': 'let',
                        'loc': {
                            'start': {
                                'line': 2,
                                'column': 4
                            },
                            'end': {
                                'line': 2,
                                'column': 23
                            }
                        }
                    },
                    {
                        'type': 'ExpressionStatement',
                        'expression': {
                            'type': 'AssignmentExpression',
                            'operator': '=',
                            'left': {
                                'type': 'Identifier',
                                'name': 'low',
                                'loc': {
                                    'start': {
                                        'line': 3,
                                        'column': 4
                                    },
                                    'end': {
                                        'line': 3,
                                        'column': 7
                                    }
                                }
                            },
                            'right': {
                                'type': 'Literal',
                                'value': 0,
                                'raw': '0',
                                'loc': {
                                    'start': {
                                        'line': 3,
                                        'column': 10
                                    },
                                    'end': {
                                        'line': 3,
                                        'column': 11
                                    }
                                }
                            },
                            'loc': {
                                'start': {
                                    'line': 3,
                                    'column': 4
                                },
                                'end': {
                                    'line': 3,
                                    'column': 11
                                }
                            }
                        },
                        'loc': {
                            'start': {
                                'line': 3,
                                'column': 4
                            },
                            'end': {
                                'line': 3,
                                'column': 12
                            }
                        }
                    },
                    {
                        'type': 'ExpressionStatement',
                        'expression': {
                            'type': 'AssignmentExpression',
                            'operator': '=',
                            'left': {
                                'type': 'Identifier',
                                'name': 'high',
                                'loc': {
                                    'start': {
                                        'line': 4,
                                        'column': 4
                                    },
                                    'end': {
                                        'line': 4,
                                        'column': 8
                                    }
                                }
                            },
                            'right': {
                                'type': 'BinaryExpression',
                                'operator': '-',
                                'left': {
                                    'type': 'Identifier',
                                    'name': 'n',
                                    'loc': {
                                        'start': {
                                            'line': 4,
                                            'column': 11
                                        },
                                        'end': {
                                            'line': 4,
                                            'column': 12
                                        }
                                    }
                                },
                                'right': {
                                    'type': 'Literal',
                                    'value': 1,
                                    'raw': '1',
                                    'loc': {
                                        'start': {
                                            'line': 4,
                                            'column': 15
                                        },
                                        'end': {
                                            'line': 4,
                                            'column': 16
                                        }
                                    }
                                },
                                'loc': {
                                    'start': {
                                        'line': 4,
                                        'column': 11
                                    },
                                    'end': {
                                        'line': 4,
                                        'column': 16
                                    }
                                }
                            },
                            'loc': {
                                'start': {
                                    'line': 4,
                                    'column': 4
                                },
                                'end': {
                                    'line': 4,
                                    'column': 16
                                }
                            }
                        },
                        'loc': {
                            'start': {
                                'line': 4,
                                'column': 4
                            },
                            'end': {
                                'line': 4,
                                'column': 17
                            }
                        }
                    },
                    {
                        'type': 'WhileStatement',
                        'test': {
                            'type': 'BinaryExpression',
                            'operator': '<=',
                            'left': {
                                'type': 'Identifier',
                                'name': 'low',
                                'loc': {
                                    'start': {
                                        'line': 5,
                                        'column': 11
                                    },
                                    'end': {
                                        'line': 5,
                                        'column': 14
                                    }
                                }
                            },
                            'right': {
                                'type': 'Identifier',
                                'name': 'high',
                                'loc': {
                                    'start': {
                                        'line': 5,
                                        'column': 18
                                    },
                                    'end': {
                                        'line': 5,
                                        'column': 22
                                    }
                                }
                            },
                            'loc': {
                                'start': {
                                    'line': 5,
                                    'column': 11
                                },
                                'end': {
                                    'line': 5,
                                    'column': 22
                                }
                            }
                        },
                        'body': {
                            'type': 'BlockStatement',
                            'body': [
                                {
                                    'type': 'ExpressionStatement',
                                    'expression': {
                                        'type': 'AssignmentExpression',
                                        'operator': '=',
                                        'left': {
                                            'type': 'Identifier',
                                            'name': 'mid',
                                            'loc': {
                                                'start': {
                                                    'line': 6,
                                                    'column': 8
                                                },
                                                'end': {
                                                    'line': 6,
                                                    'column': 11
                                                }
                                            }
                                        },
                                        'right': {
                                            'type': 'BinaryExpression',
                                            'operator': '/',
                                            'left': {
                                                'type': 'BinaryExpression',
                                                'operator': '+',
                                                'left': {
                                                    'type': 'Identifier',
                                                    'name': 'low',
                                                    'loc': {
                                                        'start': {
                                                            'line': 6,
                                                            'column': 15
                                                        },
                                                        'end': {
                                                            'line': 6,
                                                            'column': 18
                                                        }
                                                    }
                                                },
                                                'right': {
                                                    'type': 'Identifier',
                                                    'name': 'high',
                                                    'loc': {
                                                        'start': {
                                                            'line': 6,
                                                            'column': 21
                                                        },
                                                        'end': {
                                                            'line': 6,
                                                            'column': 25
                                                        }
                                                    }
                                                },
                                                'loc': {
                                                    'start': {
                                                        'line': 6,
                                                        'column': 15
                                                    },
                                                    'end': {
                                                        'line': 6,
                                                        'column': 25
                                                    }
                                                }
                                            },
                                            'right': {
                                                'type': 'Literal',
                                                'value': 2,
                                                'raw': '2',
                                                'loc': {
                                                    'start': {
                                                        'line': 6,
                                                        'column': 27
                                                    },
                                                    'end': {
                                                        'line': 6,
                                                        'column': 28
                                                    }
                                                }
                                            },
                                            'loc': {
                                                'start': {
                                                    'line': 6,
                                                    'column': 14
                                                },
                                                'end': {
                                                    'line': 6,
                                                    'column': 28
                                                }
                                            }
                                        },
                                        'loc': {
                                            'start': {
                                                'line': 6,
                                                'column': 8
                                            },
                                            'end': {
                                                'line': 6,
                                                'column': 28
                                            }
                                        }
                                    },
                                    'loc': {
                                        'start': {
                                            'line': 6,
                                            'column': 8
                                        },
                                        'end': {
                                            'line': 6,
                                            'column': 29
                                        }
                                    }
                                },
                                {
                                    'type': 'IfStatement',
                                    'test': {
                                        'type': 'BinaryExpression',
                                        'operator': '<',
                                        'left': {
                                            'type': 'Identifier',
                                            'name': 'X',
                                            'loc': {
                                                'start': {
                                                    'line': 7,
                                                    'column': 12
                                                },
                                                'end': {
                                                    'line': 7,
                                                    'column': 13
                                                }
                                            }
                                        },
                                        'right': {
                                            'type': 'MemberExpression',
                                            'computed': true,
                                            'object': {
                                                'type': 'Identifier',
                                                'name': 'V',
                                                'loc': {
                                                    'start': {
                                                        'line': 7,
                                                        'column': 16
                                                    },
                                                    'end': {
                                                        'line': 7,
                                                        'column': 17
                                                    }
                                                }
                                            },
                                            'property': {
                                                'type': 'Identifier',
                                                'name': 'mid',
                                                'loc': {
                                                    'start': {
                                                        'line': 7,
                                                        'column': 18
                                                    },
                                                    'end': {
                                                        'line': 7,
                                                        'column': 21
                                                    }
                                                }
                                            },
                                            'loc': {
                                                'start': {
                                                    'line': 7,
                                                    'column': 16
                                                },
                                                'end': {
                                                    'line': 7,
                                                    'column': 22
                                                }
                                            }
                                        },
                                        'loc': {
                                            'start': {
                                                'line': 7,
                                                'column': 12
                                            },
                                            'end': {
                                                'line': 7,
                                                'column': 22
                                            }
                                        }
                                    },
                                    'consequent': {
                                        'type': 'ExpressionStatement',
                                        'expression': {
                                            'type': 'AssignmentExpression',
                                            'operator': '=',
                                            'left': {
                                                'type': 'Identifier',
                                                'name': 'high',
                                                'loc': {
                                                    'start': {
                                                        'line': 8,
                                                        'column': 12
                                                    },
                                                    'end': {
                                                        'line': 8,
                                                        'column': 16
                                                    }
                                                }
                                            },
                                            'right': {
                                                'type': 'BinaryExpression',
                                                'operator': '-',
                                                'left': {
                                                    'type': 'Identifier',
                                                    'name': 'mid',
                                                    'loc': {
                                                        'start': {
                                                            'line': 8,
                                                            'column': 19
                                                        },
                                                        'end': {
                                                            'line': 8,
                                                            'column': 22
                                                        }
                                                    }
                                                },
                                                'right': {
                                                    'type': 'Literal',
                                                    'value': 1,
                                                    'raw': '1',
                                                    'loc': {
                                                        'start': {
                                                            'line': 8,
                                                            'column': 25
                                                        },
                                                        'end': {
                                                            'line': 8,
                                                            'column': 26
                                                        }
                                                    }
                                                },
                                                'loc': {
                                                    'start': {
                                                        'line': 8,
                                                        'column': 19
                                                    },
                                                    'end': {
                                                        'line': 8,
                                                        'column': 26
                                                    }
                                                }
                                            },
                                            'loc': {
                                                'start': {
                                                    'line': 8,
                                                    'column': 12
                                                },
                                                'end': {
                                                    'line': 8,
                                                    'column': 26
                                                }
                                            }
                                        },
                                        'loc': {
                                            'start': {
                                                'line': 8,
                                                'column': 12
                                            },
                                            'end': {
                                                'line': 8,
                                                'column': 27
                                            }
                                        }
                                    },
                                    'alternate': {
                                        'type': 'IfStatement',
                                        'test': {
                                            'type': 'BinaryExpression',
                                            'operator': '>',
                                            'left': {
                                                'type': 'Identifier',
                                                'name': 'X',
                                                'loc': {
                                                    'start': {
                                                        'line': 9,
                                                        'column': 17
                                                    },
                                                    'end': {
                                                        'line': 9,
                                                        'column': 18
                                                    }
                                                }
                                            },
                                            'right': {
                                                'type': 'MemberExpression',
                                                'computed': true,
                                                'object': {
                                                    'type': 'Identifier',
                                                    'name': 'V',
                                                    'loc': {
                                                        'start': {
                                                            'line': 9,
                                                            'column': 21
                                                        },
                                                        'end': {
                                                            'line': 9,
                                                            'column': 22
                                                        }
                                                    }
                                                },
                                                'property': {
                                                    'type': 'Identifier',
                                                    'name': 'mid',
                                                    'loc': {
                                                        'start': {
                                                            'line': 9,
                                                            'column': 23
                                                        },
                                                        'end': {
                                                            'line': 9,
                                                            'column': 26
                                                        }
                                                    }
                                                },
                                                'loc': {
                                                    'start': {
                                                        'line': 9,
                                                        'column': 21
                                                    },
                                                    'end': {
                                                        'line': 9,
                                                        'column': 27
                                                    }
                                                }
                                            },
                                            'loc': {
                                                'start': {
                                                    'line': 9,
                                                    'column': 17
                                                },
                                                'end': {
                                                    'line': 9,
                                                    'column': 27
                                                }
                                            }
                                        },
                                        'consequent': {
                                            'type': 'ExpressionStatement',
                                            'expression': {
                                                'type': 'AssignmentExpression',
                                                'operator': '=',
                                                'left': {
                                                    'type': 'Identifier',
                                                    'name': 'low',
                                                    'loc': {
                                                        'start': {
                                                            'line': 10,
                                                            'column': 12
                                                        },
                                                        'end': {
                                                            'line': 10,
                                                            'column': 15
                                                        }
                                                    }
                                                },
                                                'right': {
                                                    'type': 'BinaryExpression',
                                                    'operator': '+',
                                                    'left': {
                                                        'type': 'Identifier',
                                                        'name': 'mid',
                                                        'loc': {
                                                            'start': {
                                                                'line': 10,
                                                                'column': 18
                                                            },
                                                            'end': {
                                                                'line': 10,
                                                                'column': 21
                                                            }
                                                        }
                                                    },
                                                    'right': {
                                                        'type': 'Literal',
                                                        'value': 1,
                                                        'raw': '1',
                                                        'loc': {
                                                            'start': {
                                                                'line': 10,
                                                                'column': 24
                                                            },
                                                            'end': {
                                                                'line': 10,
                                                                'column': 25
                                                            }
                                                        }
                                                    },
                                                    'loc': {
                                                        'start': {
                                                            'line': 10,
                                                            'column': 18
                                                        },
                                                        'end': {
                                                            'line': 10,
                                                            'column': 25
                                                        }
                                                    }
                                                },
                                                'loc': {
                                                    'start': {
                                                        'line': 10,
                                                        'column': 12
                                                    },
                                                    'end': {
                                                        'line': 10,
                                                        'column': 25
                                                    }
                                                }
                                            },
                                            'loc': {
                                                'start': {
                                                    'line': 10,
                                                    'column': 12
                                                },
                                                'end': {
                                                    'line': 10,
                                                    'column': 26
                                                }
                                            }
                                        },
                                        'alternate': {
                                            'type': 'ReturnStatement',
                                            'argument': {
                                                'type': 'Identifier',
                                                'name': 'mid',
                                                'loc': {
                                                    'start': {
                                                        'line': 12,
                                                        'column': 19
                                                    },
                                                    'end': {
                                                        'line': 12,
                                                        'column': 22
                                                    }
                                                }
                                            },
                                            'loc': {
                                                'start': {
                                                    'line': 12,
                                                    'column': 12
                                                },
                                                'end': {
                                                    'line': 12,
                                                    'column': 23
                                                }
                                            }
                                        },
                                        'loc': {
                                            'start': {
                                                'line': 9,
                                                'column': 13
                                            },
                                            'end': {
                                                'line': 12,
                                                'column': 23
                                            }
                                        }
                                    },
                                    'loc': {
                                        'start': {
                                            'line': 7,
                                            'column': 8
                                        },
                                        'end': {
                                            'line': 12,
                                            'column': 23
                                        }
                                    }
                                }
                            ],
                            'loc': {
                                'start': {
                                    'line': 5,
                                    'column': 24
                                },
                                'end': {
                                    'line': 13,
                                    'column': 5
                                }
                            }
                        },
                        'loc': {
                            'start': {
                                'line': 5,
                                'column': 4
                            },
                            'end': {
                                'line': 13,
                                'column': 5
                            }
                        }
                    },
                    {
                        'type': 'ReturnStatement',
                        'argument': {
                            'type': 'UnaryExpression',
                            'operator': '-',
                            'argument': {
                                'type': 'Literal',
                                'value': 1,
                                'raw': '1',
                                'loc': {
                                    'start': {
                                        'line': 14,
                                        'column': 12
                                    },
                                    'end': {
                                        'line': 14,
                                        'column': 13
                                    }
                                }
                            },
                            'prefix': true,
                            'loc': {
                                'start': {
                                    'line': 14,
                                    'column': 11
                                },
                                'end': {
                                    'line': 14,
                                    'column': 13
                                }
                            }
                        },
                        'loc': {
                            'start': {
                                'line': 14,
                                'column': 4
                            },
                            'end': {
                                'line': 14,
                                'column': 14
                            }
                        }
                    }
                ],
                'loc': {
                    'start': {
                        'line': 1,
                        'column': 30
                    },
                    'end': {
                        'line': 15,
                        'column': 1
                    }
                }
            },
            'generator': false,
            'expression': false,
            'async': false,
            'loc': {
                'start': {
                    'line': 1,
                    'column': 0
                },
                'end': {
                    'line': 15,
                    'column': 1
                }
            }
        }
    ],
    'sourceType': 'script',
    'loc': {
        'start': {
            'line': 1,
            'column': 0
        },
        'end': {
            'line': 15,
            'column': 1
        }
    }
}
var input2 =  {
    'type': 'Program',
    'body': [
        {
            'type': 'VariableDeclaration',
            'declarations': [
                {
                    'type': 'VariableDeclarator',
                    'id': {
                        'type': 'Identifier',
                        'name': 'a',
                        'loc': {
                            'start': {
                                'line': 1,
                                'column': 4
                            },
                            'end': {
                                'line': 1,
                                'column': 5
                            }
                        }
                    },
                    'init': {
                        'type': 'UnaryExpression',
                        'operator': '-',
                        'argument': {
                            'type': 'Literal',
                            'value': 3,
                            'raw': '3',
                            'loc': {
                                'start': {
                                    'line': 1,
                                    'column': 9
                                },
                                'end': {
                                    'line': 1,
                                    'column': 10
                                }
                            }
                        },
                        'prefix': true,
                        'loc': {
                            'start': {
                                'line': 1,
                                'column': 8
                            },
                            'end': {
                                'line': 1,
                                'column': 10
                            }
                        }
                    },
                    'loc': {
                        'start': {
                            'line': 1,
                            'column': 4
                        },
                        'end': {
                            'line': 1,
                            'column': 10
                        }
                    }
                }
            ],
            'kind': 'let',
            'loc': {
                'start': {
                    'line': 1,
                    'column': 0
                },
                'end': {
                    'line': 1,
                    'column': 10
                }
            }
        }
    ],
    'sourceType': 'script',
    'loc': {
        'start': {
            'line': 1,
            'column': 0
        },
        'end': {
            'line': 1,
            'column': 10
        }
    }
};

var inputt = {
    'type': 'Program',
    'body': [
        {
            'type': 'VariableDeclaration',
            'declarations': [
                {
                    'type': 'VariableDeclarator',
                    'id': {
                        'type': 'Identifier',
                        'name': 'a',
                        'loc': {
                            'start': {
                                'line': 1,
                                'column': 4
                            },
                            'end': {
                                'line': 1,
                                'column': 5
                            }
                        }
                    },
                    'init': {
                        'type': 'Literal',
                        'value': 0,
                        'raw': '0',
                        'loc': {
                            'start': {
                                'line': 1,
                                'column': 8
                            },
                            'end': {
                                'line': 1,
                                'column': 9
                            }
                        }
                    },
                    'loc': {
                        'start': {
                            'line': 1,
                            'column': 4
                        },
                        'end': {
                            'line': 1,
                            'column': 9
                        }
                    }
                }
            ],
            'kind': 'let',
            'loc': {
                'start': {
                    'line': 1,
                    'column': 0
                },
                'end': {
                    'line': 1,
                    'column': 10
                }
            }
        },
        {
            'type': 'IfStatement',
            'test': {
                'type': 'BinaryExpression',
                'operator': '<',
                'left': {
                    'type': 'Identifier',
                    'name': 'a',
                    'loc': {
                        'start': {
                            'line': 2,
                            'column': 3
                        },
                        'end': {
                            'line': 2,
                            'column': 4
                        }
                    }
                },
                'right': {
                    'type': 'Literal',
                    'value': 9,
                    'raw': '9',
                    'loc': {
                        'start': {
                            'line': 2,
                            'column': 7
                        },
                        'end': {
                            'line': 2,
                            'column': 8
                        }
                    }
                },
                'loc': {
                    'start': {
                        'line': 2,
                        'column': 3
                    },
                    'end': {
                        'line': 2,
                        'column': 8
                    }
                }
            },
            'consequent': {
                'type': 'BlockStatement',
                'body': [
                    {
                        'type': 'ExpressionStatement',
                        'expression': {
                            'type': 'UpdateExpression',
                            'operator': '++',
                            'argument': {
                                'type': 'Identifier',
                                'name': 'a',
                                'loc': {
                                    'start': {
                                        'line': 3,
                                        'column': 4
                                    },
                                    'end': {
                                        'line': 3,
                                        'column': 5
                                    }
                                }
                            },
                            'prefix': false,
                            'loc': {
                                'start': {
                                    'line': 3,
                                    'column': 4
                                },
                                'end': {
                                    'line': 3,
                                    'column': 7
                                }
                            }
                        },
                        'loc': {
                            'start': {
                                'line': 3,
                                'column': 4
                            },
                            'end': {
                                'line': 3,
                                'column': 8
                            }
                        }
                    }
                ],
                'loc': {
                    'start': {
                        'line': 2,
                        'column': 9
                    },
                    'end': {
                        'line': 4,
                        'column': 1
                    }
                }
            },
            'alternate': {
                'type': 'BlockStatement',
                'body': [
                    {
                        'type': 'ExpressionStatement',
                        'expression': {
                            'type': 'UpdateExpression',
                            'operator': '--',
                            'argument': {
                                'type': 'Identifier',
                                'name': 'a',
                                'loc': {
                                    'start': {
                                        'line': 6,
                                        'column': 4
                                    },
                                    'end': {
                                        'line': 6,
                                        'column': 5
                                    }
                                }
                            },
                            'prefix': false,
                            'loc': {
                                'start': {
                                    'line': 6,
                                    'column': 4
                                },
                                'end': {
                                    'line': 6,
                                    'column': 7
                                }
                            }
                        },
                        'loc': {
                            'start': {
                                'line': 6,
                                'column': 4
                            },
                            'end': {
                                'line': 6,
                                'column': 8
                            }
                        }
                    }
                ],
                'loc': {
                    'start': {
                        'line': 5,
                        'column': 4
                    },
                    'end': {
                        'line': 7,
                        'column': 1
                    }
                }
            },
            'loc': {
                'start': {
                    'line': 2,
                    'column': 0
                },
                'end': {
                    'line': 7,
                    'column': 1
                }
            }
        }
    ],
    'sourceType': 'script',
    'loc': {
        'start': {
            'line': 1,
            'column': 0
        },
        'end': {
            'line': 7,
            'column': 1
        }
    }
};

let code = 'function binarySearch(X, V, n){\n' +
    '    let low, high, mid;\n' +
    '    low = 0;\n' +
    '    high = n - 1;\n' +
    '    while (low <= high) {\n' +
    '        mid = (low + high)/2;\n' +
    '        if (X < V[mid])\n' +
    '            high = mid - 1;\n' +
    '        else if (X > V[mid])\n' +
    '            low = mid + 1;\n' +
    '        else\n' +
    '            return mid;\n' +
    '    }\n' +
    '    return -1;\n' +
    '}';

var result = (evalc(input , code));
var x =3;
*/
/*var temp = "                 ";
console.log(temp.trim().split(/\s+/));*/
