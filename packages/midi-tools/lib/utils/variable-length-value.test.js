"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var variable_length_value_1 = require("./variable-length-value");
var testCases = [
    {
        value: 0x00,
        bytes: [0x00],
    },
    {
        value: 0x40,
        bytes: [0x40],
    },
    {
        value: 0x7F,
        bytes: [0x7F],
    },
    {
        value: 0x80,
        bytes: [0x81, 0x00],
    },
    {
        value: 0x2000,
        bytes: [0xC0, 0x00],
    },
    {
        value: 0x3FFF,
        bytes: [0xFF, 0x7F],
    },
    {
        value: 0x4000,
        bytes: [0x81, 0x80, 0x00],
    },
    {
        value: 0x100000,
        bytes: [0xC0, 0x80, 0x00],
    },
    {
        value: 0x1FFFFF,
        bytes: [0xFF, 0xFF, 0x7F],
    },
    {
        value: 0x200000,
        bytes: [0x81, 0x80, 0x80, 0x00],
    },
    {
        value: 0x8000000,
        bytes: [0xC0, 0x80, 0x80, 0x00],
    },
    {
        value: 0xFFFFFFF,
        bytes: [0xFF, 0xFF, 0xFF, 0x7F],
    },
];
describe("variable length value", function () {
    describe('toVariableLengthValue', function () {
        testCases.forEach(function (testCase) { return it("should generate the correct typed array for value 0x" + testCase.value.toString(16), function () {
            var actual = variable_length_value_1.toVariableLengthValue(testCase.value);
            expect(actual).toEqual(new Uint8Array(testCase.bytes));
        }); });
    });
    describe('fromVariableLengthValue', function () {
        testCases.forEach(function (testCase, index) { return it("should generate the correct value for array " + testCase.bytes, function () {
            var actual = variable_length_value_1.fromVariableLengthValue(new Uint8Array(testCase.bytes).buffer);
            expect(actual).toEqual([testCase.bytes.length, testCase.value]);
        }); });
    });
});
