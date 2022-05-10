const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
    suite('POST request to /api/solve', () => {

        test('1. puzzle with valid puzzle string: POST request to /api/solve', (done) => {
            // Solve a puzzle with valid puzzle string: POST request to /api/solve
            chai
                .request(server)
                .post('/api/solve')
                .send({ puzzle: testStrings[1][0] })
                .end((err, res) => {
                    if (err) done(err)
                    assert.equal(res.status, 200)
                    assert.equal(res.body.solution, testStrings[1][1])
                    done()
                })
    
        })
        
        test('2. puzzle with missing puzzle string: POST request to /api/solve', (done) => {
            // Solve a puzzle with missing puzzle string: POST request to /api/solve
            chai
                .request(server)
                .post('/api/solve')
                .send({})
                .end((err, res) => {
                    if (err) done(err)
                    assert.equal(res.status, 200)
                    assert.equal(res.body.error, "Required field missing")
                    done()
                })
        })
        
        test('3. puzzle with invalid characters: POST request to /api/solve', (done) => {
            // Solve a puzzle with invalid characters: POST request to /api/solve
            const invalidPuzzle = testStrings[2][0].replace('.', '#')
            chai
            .request(server)
            .post('/api/solve')
            .send({ puzzle: invalidPuzzle })
            .end((err, res) => {
                if (err) done(err)
                assert.equal(res.status, 200)
                assert.equal(res.body.error, "Invalid characters in puzzle")
                done()
            })
        })
        
        test('4. puzzle with incorrect length: POST request to /api/solve', (done) => {
            // Solve a puzzle with incorrect length: POST request to /api/solve
            const incorrectPuzzle = testStrings[3][0].replace('.', '')
            chai
                .request(server)
                .post('/api/solve')
                .send({ puzzle: incorrectPuzzle })
                .end((err, res) => {
                    if (err) done(err)
                    assert.equal(res.status, 200)
                    assert.equal(res.body.error, "Expected puzzle to be 81 characters long")
                    done()
                })
        })
        
        test('5. puzzle that cannot be solved: POST request to /api/solve', (done) => {
            // Solve a puzzle that cannot be solved: POST request to /api/solve
            const puzzle = testStrings[1][0].replace('.', '3')
            chai
            .request(server)
            .post('/api/solve')
            .send({ puzzle: puzzle })
            .end((err, res) => {
                if (err) done(err)
                assert.equal(res.status, 200)
                assert.equal(res.body.error, "Puzzle cannot be solved")
                done()
            })
        })
    })
    suite('POST request to /api/check', () => {
        test('6. puzzle placement with all fields: POST request to /api/check', (done) => {
            // Check a puzzle placement with all fields: POST request to /api/check
            chai
            .request(server)
            .post('/api/check')
            .send({ 
                puzzle: testStrings[4][0],
                coordinate: "A3",
                value: "7"
             })
            .end((err, res) => {
                if (err) done(err)
                assert.equal(res.status, 200)
                done()
            })
        })
        
        test('7. puzzle placement with single placement conflict: POST request to /api/check', (done) => {
            // Check a puzzle placement with single placement conflict: POST request to /api/check
            chai
            .request(server)
            .post('/api/check')
            .send({ 
                puzzle: testStrings[4][0],
                coordinate: "A1",
                value: "1"
             })
            .end((err, res) => {
                if (err) done(err)
                assert.equal(res.status, 200)
                assert.isFalse(res.body.valid)
                assert.isArray(res.body.conflict)
                assert.lengthOf(res.body.conflict, 1)
                assert.equal(res.body.conflict[0], "region")
                done()
            })
        })
        
        test('8. puzzle placement with multiple placement conflicts: POST request to /api/check', (done) => {
            // Check a puzzle placement with multiple placement conflicts: POST request to /api/check
            chai
            .request(server)
            .post('/api/check')
            .send({ 
                puzzle: testStrings[4][0],
                coordinate: "A1",
                value: "4"
             })
            .end((err, res) => {
                if (err) done(err)
                assert.equal(res.status, 200)
                assert.isFalse(res.body.valid)
                assert.isArray(res.body.conflict)
                assert.lengthOf(res.body.conflict, 2)
                assert.equal(res.body.conflict[0], "row")
                assert.equal(res.body.conflict[1], "column")
                done()
            })
        })
        
        test('9. puzzle placement with all placement conflicts: POST request to /api/check', (done) => {
            // Check a puzzle placement with all placement conflicts: POST request to /api/check
            chai
            .request(server)
            .post('/api/check')
            .send({ 
                puzzle: testStrings[4][0],
                coordinate: "G7",
                value: "5"
             })
            .end((err, res) => {
                if (err) done(err)
                assert.equal(res.status, 200)
                assert.isFalse(res.body.valid)
                assert.isArray(res.body.conflict)
                assert.lengthOf(res.body.conflict, 3)
                assert.equal(res.body.conflict[0], "row")
                assert.equal(res.body.conflict[1], "column")
                assert.equal(res.body.conflict[2], "region")
                done()
            })
        })
        
        test('10. puzzle placement with missing required fields: POST request to /api/check', (done) => {
            // Check a puzzle placement with missing required fields: POST request to /api/check
            chai
                .request(server)
                .post('/api/check')
                .send({
                    value: "6"
                })
                .end((err, res) => {
                    if (err) done(err)
                    assert.equal(res.status, 200)
                    assert.equal(res.body.error, "Required field(s) missing")
                    done()
                })
        })
        
        test('11. puzzle placement with invalid characters: POST request to /api/check', (done) => {
            // Check a puzzle placement with invalid characters: POST request to /api/check
            chai
                .request(server)
                .post('/api/check')
                .send({
                    puzzle: testStrings[4][0].replace('.', '$'),
                    coordinate: "A3",
                    value: "7"
                })
                .end((err, res) => {
                    if (err) done(err)
                    assert.equal(res.status, 200)
                    assert.equal(res.body.error, "Invalid characters in puzzle")
                    done()
                })
        })
        
        test('12. puzzle placement with incorrect length: POST request to /api/check', (done) => {
            // Check a puzzle placement with incorrect length: POST request to /api/check
            chai
                .request(server)
                .post('/api/check')
                .send({
                    puzzle: testStrings[4][0].replace('.', ''),
                    coordinate: "A3",
                    value: "7"
                })
                .end((err, res) => {
                    if (err) done(err)
                    assert.equal(res.status, 200)
                    assert.lengthOf(puzzle, 80)
                    assert.equal(
                        res.body.error,
                        "Expected puzzle to be 81 characters long")
                    done()
                })
        })
    
        test('13. puzzle placement with invalid placement coordinate: POST request to /api/check', (done) => {
            // Check a puzzle placement with invalid placement coordinate: POST request to /api/check
            chai
                .request(server)
                .post('/api/check')
                .send({
                    puzzle: testStrings[4][0],
                    coordinate: "Z3",
                    value: "7"
                })
                .end((err, res) => {
                    if (err) done(err)
                    assert.equal(res.status, 200)
                    assert.equal(
                        res.body.error,
                        "Invalid coordinate")
                    done()
                })
        })
    
        test('14. puzzle placement with invalid placement value: POST request to /api/check', (done) => {
            // Check a puzzle placement with invalid placement value: POST request to /api/check
            chai
                .request(server)
                .post('/api/check')
                .send({
                    puzzle: testStrings[4][0],
                    coordinate: "A3",
                    value: "96"
                })
                .end((err, res) => {
                    if (err) done(err)
                    assert.equal(res.status, 200)
                    assert.equal(
                        res.body.error,
                        "Invalid value")
                    done()
                })
        })
    })    
});

