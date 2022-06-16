const parser = require("@babel/parser");

function sql(input) {
    const parsed = parser.parse(input.toString());
    const body = parsed.program.body;

    if (body.length !== 1) {
        throw new Error("Supply a single arrow function");
    }
    const arrow = body[0].expression;

    if (arrow.type !== "ArrowFunctionExpression") {
        throw new Error("Argument must be an arrow function");
    }

    if (arrow.params.length !== 1 || arrow.params[0].type !== "Identifier") {
        throw new Error("Arrow function must take a single identifier argument");
    }

    const table = arrow.params[0].name;
    const arrowBody = arrow.body;
    return compileArrow(table, arrowBody);
}

function compileArrow(table, body) {
    return `SELECT * FROM ${table} WHERE ${compileExpression(body)};`;
}

function compileExpression(expr) {
    switch(expr.type) {
        case "BinaryExpression": return compileBinaryExpression(expr);
        case "MemberExpression": return compileMemberExpression(expr);
        case "LogicalExpression": return compileLogicalExpression(expr);
        case "NumericLiteral": return expr.value;
        case "StringLiteral": return `'${expr.value}'`;
        default: throw new Error(`Unknown expression type ${expr.type}`);
    }
}

function compileLogicalExpression(expr) {
    const left = expr.left;
    const right = expr.right;
    const op = expr.operator;

    return `${compileExpression(left)} ${compileOperator(op)} ${compileExpression(right)}`;
}

function compileOperator(op) {
    switch(op) {
        case "!=":
        case "!==":
            return "<>";
        case "==":
        case "===":
            return "=";
        case "&&": return "and";
        case "||": return "or";
        case "<":
        case ">":
            return op;
        default:
            throw new Error(`Unsupported operator ${op}`);
    }
}

function compileMemberExpression(expr) {
    return expr.property.name;
}


function compileBinaryExpression(expr) {
    const left = expr.left;
    const right = expr.right;
    const op = expr.operator;

    return `${compileExpression(left)} ${compileOperator(op)} ${compileExpression(right)}`
}

//const input = table => table.col > 1;
//const input = table => table.col == "asdf" && table.col2 > 2;
/*
const input = customers => customers.country == "Mexico" && customers.customerId > 5;
console.log(sql(input));
*/

exports.sql = sql;