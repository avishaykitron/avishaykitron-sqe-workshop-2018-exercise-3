import assert from 'assert';
import { parseCode} from '../src/js/code-analyzer';

describe('Sub empty function' , () => {
    it('is sub an empty function correctly', () => {
        assert.equal(
            parseCode('function foo(){\n' +
                '}\n' , {}),
            '');});
    it('with param', () => {
        assert.equal(
            parseCode(
                'function foo(x){\n' +
                '    let a = 2;\n' +
                '    if(x>0){\n' + '        return 5;\n' + '    }\n' + '    else{\n' + '        return a;\n' + '    }\n' + '    return 1;\n' + '}', {'x':2}),
            'digraph cfg { forcelabels=true n0 [label="let a = 2;", xlabel = 1,  shape=rectangle, style = filled, fillcolor = green]\nn1 [label="x > 0", xlabel = 2,  shape=diamond, style = filled, fillcolor = green]\nn2 [label="return 5;", xlabel = 3,  shape=rectangle, style = filled, fillcolor = green]\nn3 [label="return a;", xlabel = 4,  shape=rectangle,]\nn0 -> n1 []\nn1 -> n2 [label="T"]\nn1 -> n3 [label="F"]\n }'
        );
    });
});

describe('if stat' , () => {
    it('without parmeter', () => {
        assert.equal(
            parseCode(
                'function foo(){\n' +
                '    let a = [1,2,3];\n' +
                '    if(a[1]>0){\n' +
                '        return a[1]--;\n' +
                '    }\n' +
                '    else{\n' +
                '        return a.length;\n' +
                '    }\n' +
                '    return 1;\n' +
                '}', {}),
            'digraph cfg { forcelabels=true n0 [label="let a = [\n    1,\n    2,\n    3\n];", xlabel = 1,  shape=rectangle, style = filled, fillcolor = green]\nn1 [label="a[1] > 0", xlabel = 2,  shape=diamond, style = filled, fillcolor = green]\nn2 [label="return a[1]--;", xlabel = 3,  shape=rectangle, style = filled, fillcolor = green]\nn3 [label="return a.length;", xlabel = 4,  shape=rectangle,]\nn0 -> n1 []\nn1 -> n2 [label="T"]\nn1 -> n3 [label="F"]\n }'
        );
    });


});
it('with global before', () => {
    assert.equal(
        parseCode(
            'function foo(x){\n' +
            '    let a = 2;\n' +
            '    if(x[1]>0){\n' +
            '        x[1] = 2;\n' +
            '    }\n' +
            '    else{\n' +
            '        a = x.length;\n' +
            '    }\n' +
            '    return 1;\n' +
            '}', {'x':[1,2,3]}),
        'digraph cfg { forcelabels=true n0 [label="let a = 2;", xlabel = 1,  shape=rectangle, style = filled, fillcolor = green]\nn1 [label="x[1] > 0", xlabel = 2,  shape=diamond, style = filled, fillcolor = green]\nn2 [label="x[1] = 2", xlabel = 3,  shape=rectangle, style = filled, fillcolor = green]\nn3 [label="return 1;", xlabel = 4,  shape=rectangle, style = filled, fillcolor = green]\nn4 [label="a = x.length", xlabel = 5,  shape=rectangle,]\nn5 [label="", xlabel = 6,  shape=circle, style = filled, fillcolor = green]\nn0 -> n1 []\nn1 -> n2 [label="T"]\nn1 -> n4 [label="F"]\nn2 -> n5 []\nn4 -> n5 []\nn5 -> n3 []\n }'

    );
});

describe('Sub if without else with global after the function' , () => {
    it('is sub work correctly', () => {
        assert.equal(
            parseCode(
                'function foo(x){\n' +
                '    let a = 2;\n' +
                '    if(a>0){\n' +
                '        a ++;\n' +
                '    }\n' +
                '    else{\n' +
                '        a--;\n' +
                '    }\n' +
                '    return 1;\n' +
                '}', {'x':2}),'digraph cfg { forcelabels=true n0 [label="let a = 2;", xlabel = 1,  shape=rectangle, style = filled, fillcolor = green]\nn1 [label="a > 0", xlabel = 2,  shape=diamond, style = filled, fillcolor = green]\nn2 [label="a++", xlabel = 3,  shape=rectangle, style = filled, fillcolor = green]\nn3 [label="return 1;", xlabel = 4,  shape=rectangle, style = filled, fillcolor = green]\nn4 [label="a--", xlabel = 5,  shape=rectangle,]\nn5 [label="", xlabel = 6,  shape=circle, style = filled, fillcolor = green]\nn0 -> n1 []\nn1 -> n2 [label="T"]\nn1 -> n4 [label="F"]\nn2 -> n5 []\nn4 -> n5 []\nn5 -> n3 []\n }'
        );
    });
});
describe('Sub if without else with global after the function' , () => {
    it('is sub work correctly', () => {
        assert.equal(
            parseCode(
                'function foo(x){\n' +
                '    let a = 2;\n' +
                '    if(a>0){\n' +
                '        a --;\n' +
                '    }\n' +
                '    else{\n' +
                '        a++;\n' +
                '    }\n' +
                '    return 1;\n' +
                '}', {'x':2}),'digraph cfg { forcelabels=true n0 [label="let a = 2;", xlabel = 1,  shape=rectangle, style = filled, fillcolor = green]\nn1 [label="a > 0", xlabel = 2,  shape=diamond, style = filled, fillcolor = green]\nn2 [label="a--", xlabel = 3,  shape=rectangle, style = filled, fillcolor = green]\nn3 [label="return 1;", xlabel = 4,  shape=rectangle, style = filled, fillcolor = green]\nn4 [label="a++", xlabel = 5,  shape=rectangle,]\nn5 [label="", xlabel = 6,  shape=circle, style = filled, fillcolor = green]\nn0 -> n1 []\nn1 -> n2 [label="T"]\nn1 -> n4 [label="F"]\nn2 -> n5 []\nn4 -> n5 []\nn5 -> n3 []\n }'
        );
    });
});

describe('Sub while' , () => {
    it('is sub work correctly', () => {
        assert.equal(
            parseCode(
                'function foo(x, y, z){\n' +
                '   let a = x + 1;\n' +
                '   let b = a + y;\n' +
                '   let c = a--;\n' +
                '   \n' +
                '   while (a < z) {\n' +
                '       c = a + b;\n' + '       z = c * 2;\n' + '       a++;\n' + '   }\n' + '   \n' +
                '   return z;\n' +
                '}\n', {'x':10 , 'y':1 , 'z':2}), 'digraph cfg { forcelabels=true n0 [label="let a = x + 1;\nlet b = a + y;\nlet c = a--;", xlabel = 1,  shape=rectangle, style = filled, fillcolor = green]' +
            '\nn1 [label="a < z", xlabel = 2,  shape=diamond, style = filled, fillcolor = green]\nn2 [label="c = a + b\nz = c * 2\na++", xlabel = 3,  shape=rectangle,]\nn3 [label="' +
            'return z;", xlabel = 4,  shape=rectangle, style = filled, fillcolor = green]\nn4 [label="", xlabel = 5,  shape=circle, style = filled, fillcolor = green]\nn0 -> n4 []\nn1' +
            ' -> n2 [label="T"]\nn1 -> n3 [label="F"]\nn2 -> n4 []\nn4 -> n1 []\n }'
        );
    });
});
describe('Sub while' , () => {
    it('is sub work correctly', () => {
        assert.equal(
            parseCode(
                'function foo(x, y, z){\n' +
                '   let a = x + 1;\n' +
                '   let b ;\n' +
                '   let c = a++;\n' +
                '   \n' +
                '   while (a < z) {\n' +
                '       c = a + 2;\n' + '       z = c * 2;\n' + '       a++;\n' + '   }\n' + '   \n' +
                '   return z;\n' +
                '}\n', {'x':10 , 'y':1 , 'z':2}), 'digraph cfg { forcelabels=true n0 [label="let a = x + 1;\nlet b;\nlet c = a++;", xlabel = 1,  shape=rectangle, style = filled, fillcolor = green]' +
            '\nn1 [label="a < z", xlabel = 2,  shape=diamond, style = filled, fillcolor = green]\nn2 [label="c = a + 2\nz = c * 2\na++", xlabel = 3,  shape=rectangle,]\nn3 [label="' +
            'return z;", xlabel = 4,  shape=rectangle, style = filled, fillcolor = green]\nn4 [label="", xlabel = 5,  shape=circle, style = filled, fillcolor = green]\nn0 -> n4 []\nn1' +
            ' -> n2 [label="T"]\nn1 -> n3 [label="F"]\nn2 -> n4 []\nn4 -> n1 []\n }'
        );
    });
});

describe('Sub while with update expression' , () => {
    it('is sub work correctly', () => {
        assert.equal(
            parseCode(
                'function foo(x, y, z){\n' + '    let a = x + 1;\n' + '    let b = a + y;\n' + '    let c = 0;\n' + '    \n' + '    if (b < z) {\n' + '        c = c + 5;\n' + '    } else if (b < z * 2) {\n' +
                '        c = c + x + -5;\n' +
                '    } else {\n' +
                '        c = c + z + -5;\n' + '    }\n' + '    \n' +
                '    return c;\n' +
                '}\n' ,{}), 'digraph cfg { forcelabels=true n0 [label="let a = x + 1;\nlet b = a + y;\nlet c = 0;", xlabel = 1,  shape=rectangle, style = filled, fillcolor = green]' +
            '\nn1 [label="b < z", xlabel = 2,  shape=diamond, style = filled, fillcolor = green]\nn2 [label="c = c + 5", xlabel = 3,  shape=rectangle,]\nn3 [label="return c;", xla' +
            'bel = 4,  shape=rectangle, style = filled, fillcolor = green]\nn4 [label="b < z * 2", xlabel = 5,  shape=diamond, style = filled, fillcolor = green]\nn5 [label="c = c +' +
            ' x + -5", xlabel = 6,  shape=rectangle,]\nn6 [label="c = c + z + -5", xlabel = 7,  shape=rectangle, style = filled, fillcolor = green]\nn7 [label="", xlabel = 8,  shape=c' +
            'ircle, style = filled, fillcolor = green]\nn0 -> n1 []\nn1 -> n2 [label="T"]\nn1 -> n4 [label="F"]\nn2 -> n7 []\nn4 -> n5 [label="T"]\nn4 -> n6 [label="F"]\nn5 -> n7' +
            ' []\nn6 -> n7 []\nn7 -> n3 []\n }'
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
                '}', {'x':[1 ,2 ,3]}),
            'digraph cfg { forcelabels=true n0 [label="let a = x;", xlabel = 1,  shape=rectangle, style = filled, fillcolor = green]\nn1 [label="a.length > 0", xla' +
                'bel = 2,  shape=diamond, style = filled, fillcolor = green]\nn2 [label="return a[0];", xlabel = 3,  shape=rectangle, style = filled, fillcolor = green]\nn3 [label="retu' +
                'rn a;", xlabel = 4,  shape=rectangle,]\nn0 -> n1 []\nn1 -> n2 [label="T"]\nn1 -> n3 [label="F"]\n }'
        );
    });
});
describe('Sub while with update expression red line' , () => {
    it('is sub work correctly', () => {
        assert.equal(
            parseCode(
                'function foo(x){\n' +
                '    let a = x;\n' +
                '    if(a.length>10){\n' +
                '        return a[0];\n' +
                '    }\n' +
                '    return a;\n' +
                '}', {'x':[1 ,2 ,3]}),
            'digraph cfg { forcelabels=true n0 [label="let a = x;", xlabel = 1,  shape=rectangle, style = filled, fillcolor = green]\nn1 [label="a.length > 10", xl'+
        'abel = 2,  shape=diamond, style = filled, fillcolor = green]\nn2 [label="return a[0];", xlabel = 3,  shape=rectangle,]\nn3 [label="return a;", xlabel = 4,  shape=recta'+
        'ngle, style = filled, fillcolor = green]\nn0 -> n1 []\nn1 -> n2 [label="T"]\nn1 -> n3 [label="F"]\n }'
        );
    });
});

it('with global before', () => {
    assert.equal(
        parseCode(
            'function foo(x){\n' +
            '   let a = x;\n' +
            '   if(a[0] > 1){\n' +
            '       return 1;\n' +
            '   }\n' +
            '   else{\n' +
            '       return 1 + a[1];\n' +
            '   }\n' +
            '}', {'x':[1,2,3]}),
        'digraph cfg { forcelabels=true n0 [label="let a = x;", xlabel = 1,  shape=rectangle, style = filled, fillcolor = green]\nn1 [label="a[0] > 1", xlabel = 2,  shape=diamond, style = filled, fillcolor = green]\nn2 [label="return 1;", xlabel = 3,  shape=rectangle,]\nn3 [label="return 1 + a[1];", xlabel = 4,  shape=rectangle, style = filled, fillcolor = green]\nn0 -> n1 []\nn1 -> n2 [label="T"]\nn1 -> n3 [label="F"]\n }'
    );
});

describe('if stat' , () => {
    it('without parmeter', () => {
        assert.equal(
            parseCode(
                'function foo(){\n' +
                '    let a = [1,2,3];\n' +
                '    if(a[1]>0){\n' +
                '        return a.length;\n' +
                '    }\n' +
                '    else{\n' +
                '        return a.length;\n' +
                '    }\n' +
                '    return 1;\n' +
                '}', {}),
            'digraph cfg { forcelabels=true n0 [label="let a = [\n    1,\n    2,\n    3\n];", xlabel = 1,  shape=rectangle, style = filled, fillcolor = green]\nn1 [label="a[1] > 0", xlabel = 2,  shape=diamond, style = filled, fillcolor = green]\nn2 [label="return a.length;", xlabel = 3,  shape=rectangle, style = filled, fillcolor = green]\nn3 [label="return a.length;", xlabel = 4,  shape=rectangle,]\nn0 -> n1 []\nn1 -> n2 [label="T"]\nn1 -> n3 [label="F"]\n }'
        );
    });


});

describe('Sub while with update expression' , () => {
    it('is sub work correctly', () => {
        assert.equal(
            parseCode(
                'function foo(x){\n' +
                '    let a = x;\n' +
                '    let b = [1];\n' +
                '    if(a.length>0){\n' +
                '        return b[0];\n' +
                '    }\n' +
                '    return b.length + x.length;\n' +
                '}', {'x':[1 ,2 ,3]}),
            'digraph cfg { forcelabels=true n0 [label="let a = x;\nlet b = [1];", xlabel = 1,  shape=rectangle, style = filled, fillcolor = green]\nn1 [label="a.length > 0", xla' +
            'bel = 2,  shape=diamond, style = filled, fillcolor = green]\nn2 [label="return b[0];", xlabel = 3,  shape=rectangle, style = filled, fillcolor = green]\nn3 [label="retu' +
            'rn b.length + x.length;", xlabel = 4,  shape=rectangle,]\nn0 -> n1 []\nn1 -> n2 [label="T"]\nn1 -> n3 [label="F"]\n }'
        );
    });
});