import assert from 'assert';
import { parseCode} from '../src/js/code-analyzer';

describe('Sub empty function' , () => {
    it('is sub an empty function correctly', () => {
        assert.equal(
            parseCode('function foo(){\n' +
                '}\n' , {}),
            'function foo(){<br>\n}<br>\n');});
    it('with param', () => {
        assert.equal(
            parseCode(
                'function foo(x){\n' +
                '    let a = 2;\n' +
                '    if(x>0){\n' + '        return 5;\n' + '    }\n' + '    else{\n' + '        return a;\n' + '    }\n' + '    return 1;\n' + '}', {'x':2}),
            'function foo(x){<br>\n<mark class="green">    if(x > 0){</mark><br>\n        return 5;<br>\n    }<br>\n    else{<br>\n        return 2;<br>\n    }<br>\n    return 1;<br>\n}<br>\n'
        );
    });
});

describe('if stat' , () => {
    it('without parmeter', () => {
        assert.equal(
            parseCode(
                'function foo(){\n' +
                '    let a = 2;\n' +
                '    if(a>0){\n' +
                '        return 5;\n' +
                '    }\n' +
                '    else{\n' +
                '        return a;\n' +
                '    }\n' +
                '    return 1;\n' +
                '}', {}),
            'function foo(){<br>\n<mark class="green">    if(2 > 0){</mark><br>\n        return 5;<br>\n    }<br>\n    else{<br>\n        return 2;<br>\n    }<br>\n    return 1;<br>\n}<br>\n'
        );
    });


});
it('with global before', () => {
    assert.equal(
        parseCode(
            'let g = 3;\n'+
            'function foo(x){\n' +
            '    let a = 2;\n' +
            '    if(g>0){\n' +
            '        return 5;\n' +
            '    }\n' +
            '    else{\n' +
            '        return a;\n' +
            '    }\n' +
            '    return 1;\n' +
            '}', {'x':2}),
        'let g = 3;<br>\nfunction foo(x){<br>\n<mark class="green">    if(g > 0){</mark><br>\n        return 5;<br>\n    }<br>\n    else{<br>\n        return 2;<br>\n    }<br>\n    return 1;<br>\n}<br>\n'

    );
});

describe('Sub if without else with global after the function' , () => {
    it('is sub work correctly', () => {
        assert.equal(
            parseCode(
                'function foo(x){\n' +
                '    let a = 2;\n' +
                '    if(g>0){\n' +
                '        return 5;\n' +
                '    }\n' +
                '    return 1;\n' +
                '}'+'let g = 3;\n', {'x':2}),
            'function foo(x){<br>\n<mark class="green">    if(g > 0){</mark><br>\n        return 5;<br>\n    }<br>\n    return 1;<br>\n}let g = 3;<br>\n'
        );
    });
});

describe('Sub while' , () => {
    it('is sub work correctly', () => {
        assert.equal(
            parseCode(
                'function foo(x){\n' +
                '    let a = 2;\n' +
                '    while(a>0){\n' +
                '        a = a-1;\n' +
                '    }\n' +
                '    return 1;\n' +
                '}'+'let g = 3;\n', {'x':2}),
            'function foo(x){<br>\n    while(2 > 0){<br>\n    }<br>\n    return 1;<br>\n}let g = 3;<br>\n'
        );
    });
});

describe('Sub while with update expression' , () => {
    it('is sub work correctly', () => {
        assert.equal(
            parseCode(
                'function foo(x){\n' +
                '    let a = x.length;\n' +
                '    if(a>0){\n' +
                '        a --;\n' +
                '    }\n' +
                '    return 1;\n' +
                '}'+'let g = 3;\n', {'x':[1]}),
            'function foo(x){<br>\n<mark class="green">    if(x.length > 0){</mark><br>\n    }<br>\n    return 1;<br>\n}let g = 3;<br>\n'
        );
    });
});

describe('Sub while with update expression' , () => {
    it('is sub work correctly', () => {
        assert.equal(
            parseCode(
                'function foo(x){\n' +
                '    let a = x;\n' +
                '    if(a.length>0){\n' +
                '        return a[0];\n' +
                '    }\n' +
                '    return a;\n' +
                '}'+'let g = 3;\n', {'x':[1 ,2 ,3]}),
            'function foo(x){<br>\n<mark class="green">    if(x.length > 0){</mark><br>\n        return x[0] ;<br>\n    }<br>\n    return x;<br>\n}let g = 3;<br>\n'
        );
    });
});
describe('local array and local null' , () => {
    it('is sub work correctly', () => {
        assert.equal(
            parseCode(
                'function foo(x){\n' +
                '    let a = [1,2,3];\n' +
                '    let b;\n' +
                '    if(a.length>10){\n' +
                '        return -x[0];\n' +
                '    }\n' +
                '    return a;\n' +
                '}'+'let g = 3;\n', {'x':[1 ,2 ,3]}),
            'function foo(x){<br>\n<mark class="red">    if(3 > 10){</mark><br>\n        return -x[0] ;<br>\n    }<br>\n    return 1,2,3;<br>\n}let g = 3;<br>\n'
        );
    });
});
describe('paramter assginment' , () => {
    it('is sub work correctly', () => {
        assert.equal(
            parseCode(
                'function foo(x){\n' +
                '    x = 4;\n' +
                '    x ++;\n' +
                '    return x;\n' +
                '}', {'x':3}),
            'function foo(x){<br>\n    x = 4;<br>\n    x = x + 1;<br>\n    return x;<br>\n}<br>\n' );
    });
});
describe('Sub else' , () => {
    it('is sub work correctly', () => {
        assert.equal(
            parseCode(
                'function foo(x){\n' +
                '    let a = x;\n' +
                '    if(a.length>10){\n' +
                '        return a[0];\n' +
                '    }\n' +
                '    else{\n' +
                '        return 0;}}\n' , {'x':[1 ,2 ,3]}),
            'function foo(x){<br>\n<mark class="red">    if(x.length > 10){</mark><br>\n        return x[0] ;<br>\n    }<br>\n    else{<br>\n        return 0;}}<br>\n'
        );
    });
});

describe('Sub arrays ass' , () => {
    it('is sub work correctly', () => {
        assert.equal(
            parseCode(
                'function soo(){\n' +
                '    let a = [1 ,2];\n' +
                '    let b = a;\n' +
                '    return b[0];\n' +
                '}' , {}),
            'function soo(){<br>\n    return 1 ;<br>\n}<br>\n'
        );
    });
});

