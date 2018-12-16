import * as sub from './code_sub.js';
import * as evalc from './eval_code.js';

const parseCode = (input, arg) => {
    let substitutedCode = sub.subtition(input);
    return evalc.eval_code(substitutedCode, arg);
};
export {parseCode};

