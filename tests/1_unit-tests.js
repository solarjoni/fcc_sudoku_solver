const chai = require('chai');
const { pipeline } = require('jsdom/lib/jsdom/living/helpers/http-request');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

const testStrings = require('../controllers/puzzle-strings').puzzlesAndSolutions

suite('UnitTests', () => {
    
    test('1. valid puzzle string of 81 characters', (done) => {
        // Logic handles a valid puzzle string of 81 characters
        const puzzle = testStrings[0][0]
        assert.lengthOf(puzzle, 81)
        assert.isNotFalse(solver.validate(puzzle)[0])
        // done()
    })
    
    test('2. puzzle string with invalid characters (not 1-9 or .)', (done) => {
        // Logic handles a puzzle string with invalid characters (not 1-9 or .)
        const puzzle = testStrings[0][0].replace('.', '#')
        assert.isFalse(solver.validate(puzzle)[0])
        assert.deepEqual(solver.validate(puzzle)[1], {
            error: "Invalid characters in puzzle"
        })
        // done()
    })
    test('3. puzzle string that is not 81 characters in length', (done) => {
        // Logic handles a puzzle string that is not 81 characters in length
        const puzzle = testStrings[0][0].replace('.', '')
        assert.lengthOf(puzzle, 80)
        assert.isFalse(solver.validate(puzzle)[0])
        assert.deepEqual(solver.validate(puzzle)[1], {
            error: "Expected puzzle to be 81 characters long"
        })
        // done()
    })
    
    test('4. valid row placement', (done) => {
        // Logic handles a valid row placement
        const puzzle = solver.validate((testStrings[4][0])[1]),
            row = "B",
            col = 2,
            value = 3
        assert.equal(solver.checkRowPlacement(puzzle, row, col, value))
        // done()
    })
    
    test('5. invalid row placement', (done) => {
        // Logic handles an invalid row placement
        const puzzle = solver.validate((testStrings[4][0])[1]),
            row = "C",
            col = 2,
            value = 1
        assert.equal(solver.checkRowPlacement(puzzle, row, col, value), "row")
        // done()
    })
    
    test('6. valid column placement', (done) => {
        // Logic handles a valid column placement
        const puzzle = solver.validate((testStrings[4][0])[1]),
            row = "C",
            col = 4,
            value = 3
        assert.equal(solver.checkColPlacement(puzzle, row, col, value))
        // done()
    })
    
    test('7. invalid column placement', (done) => {
        // Logic handles an invalid column placement
        const puzzle = solver.validate((testStrings[4][0])[1]),
            row = "D",
            col = 6,
            value = 4
        assert.equal(solver.checkColPlacement(puzzle, row, col, value), "column")
        // done()
    })
    
    test('8. valid region (3x3 grid) placement', (done) => {
        // Logic handles a valid region (3x3 grid) placement
        const puzzle = solver.validate((testStrings[4][0])[1]),
            row = "E",
            col = 5,
            value = 8
        assert.equal(solver.checkRegionPlacement(puzzle, row, col, value))
        // done()
    })
    
    test('9. invalid region (3x3 grid) placement', (done) => {
        // Logic handles an invalid region (3x3 grid) placement
        const puzzle = solver.validate((testStrings[4][0])[1]),
            row = "E",
            col = 5,
            value = 5
        assert.equal(solver.checkRegionPlacement(puzzle, row, col, value), "region")
        // done()
    })

    test('10. valid puzzle strings pass the solver', (done) => {
        // Valid puzzle strings pass the solver
        const incompletePuzzle = testStrings[0][0],
            completedPuzzle = testStrings[0][1],
            validatedPuzzle = solver.validate(incompletePuzzle)[1]
        assert.equal(solver.solve(validatedPuzzle), completedPuzzle)
        // done()
    })
  
    test('11. invalid puzzle strings fail the solver', (done) => {
        // Invalid puzzle strings fail the solver
        const invalidPuzzle = testStrings[0][0].replace('.', '6'),
            validatedPuzzle = solver.validate(invalidPuzzle)[1]
        assert.isFalse(solver.solve(validatedPuzzle))
        // done()
    })

    test('12. solver returns the expected solution for an incomplete puzzle', (done) => {
        // Solver returns the expected solution for an incomplete puzzle
        const incompletePuzzle = testStrings[1][0],
            completedPuzzle = testStrings[1][1],
            validatedPuzzle = solver.validate(incompletePuzzle)[1]
        assert.equal(solver.solve(validatedPuzzle), completedPuzzle)
        // done()
    })

});
