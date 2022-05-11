class SudokuSolver {
  constructor() {
    this.isValid = this.isValid.bind(this)
    this.solve = this.solve.bind(this)
    this.rowToNum = this.rowToNum.bind(this)
  }

  validate(puzzle) {
    // error on invalid puzzle
    const re = /^[\d.]+$/gi
    if (puzzle.length !== 81)
      return [false, { error: "Expected puzzle to be 81 characters long" }]
    if(re.test(puzzle) === false)
      return [false, { error: "Invalid characters in puzzle" }]
    // return puzzle string to array of rows to solve and check placement
    let arr = puzzle.split("")
    let a1 = [],
      a2 = [],
      a3 = [],
      a4 = [],
      a5 = [],
      a6 = [],
      a7 = [],
      a8 = [],
      a9 = [] 
    arr.forEach((item, i) => {
      let num = i + 1
      if (num / 9 <= 1) a1.push(item)
      if (num / 9 > 1 && num /9 <= 2) a2.push(item)
      if (num / 9 > 2 && num /9 <= 3) a3.push(item)
      if (num / 9 > 3 && num /9 <= 4) a4.push(item)
      if (num / 9 > 4 && num /9 <= 5) a5.push(item)
      if (num / 9 > 5 && num /9 <= 6) a6.push(item)
      if (num / 9 > 6 && num /9 <= 7) a7.push(item)
      if (num / 9 > 7 && num /9 <= 8) a8.push(item)
      if (num / 9 > 8 && num /9 <= 9) a9.push(item)
    });
    const result = [a1, a2, a3, a4, a5, a6, a7, a8, a9]
    return [true, result]
  }

  rowToNum(row) {
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I"]
    let num
    // convert row letter to number
    rows.forEach((item, i) => {
      // if (row === item) num = i
      if (row.toUpperCase() === item) num = i
    })
    return num
  }

  checkRowPlacement(puzzle, row, col, value) {
    row = this.rowToNum(row)
    col = col - 1
    let result = true
    // check if value is in row
    puzzle[row].forEach((item) => {
      if (value == item) result = "row"
    })
    // check if value is already in place
    if (puzzle[row][col] == value) result = true
    return result
  }

  checkColPlacement(puzzle, row, col, value) {
    row = this.rowToNum(row)
    col = col - 1
    let result = true
    // check if value is on column
    puzzle.forEach((item) => {
      if (value == item[col]) result = "column"
    })
    // check if value is already in place
    if (puzzle[row][col] == value) result = true
    return result
  }

  checkRegionPlacement(puzzle, row, col, value) {
    row = this.rowToNum(row)
    col = col - 1
    let result = true
    // check if value is in region
    for (let i = 0; i < 9; i++) {
      const m = 3 * Math.floor(row / 3) + Math.floor(i / 3)
      const n = 3 * Math.floor(col / 3) + (i % 3)
      if (value == puzzle[m][n]) result = "region"
    }
    // check if value already in place
    if (puzzle[row][col] == value) result = true
    return result
  }

  isValid(puzzle, row, col, reg) {
    for (let i = 0; i < 9; i++) {
      const m = 3 * Math.floor(row / 3) + Math.floor(i / 3)
      const n = 3 * Math.floor(col / 3) + (i % 3)
      if (puzzle[row][i] == reg || puzzle[i][col] == reg || puzzle[m][n] == reg) {
        return false
      }
    }
    return true
  }

    solve(puzzle) {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (puzzle[row][col] == ".") {
            for (let reg = 1; reg <= 9; reg++) {
              if (this.isValid(puzzle, row, col, reg)) {
                puzzle[row][col] = reg
                // return array to string if exists for result solution
                if (this.solve(puzzle)) {
                  return puzzle.toString().replace(/,/g, "")
                } else {
                  puzzle[row][col] = "."
                }
              }
            }
            return false
          }
        }
      }
      return true
  }
}

module.exports = SudokuSolver;

