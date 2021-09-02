export default class Matrix {
    columns: number
    rows: number
    data: number[][]

    constructor(rows: number, columns: number, seed: number = 0) {
        this.rows = rows
        this.columns = columns
        this.data = new Array(this.rows).fill(0).map(() => new Array(this.columns).fill(seed))
    }

    static fromArray(input_array: any): Matrix {
        const rows = input_array.length
        const cols = input_array[0].length || 1
        const matrix = new Matrix(rows, cols)

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                matrix.data[r][c] = cols === 1 ? input_array[r] : input_array[r][c]
            }
        }

        return matrix
    }

    static toFlatArray(m: Matrix): number[] {
        let arr = []
        for (let r = 0; r < m.rows; r++) {
            for (let c = 0; c < m.columns; c++) {
                arr.push(m.data[r][c])
            }
        }
        return arr
    }

    randomise() {
        this.data = this.data.map((column) => column.map(() => Math.random() * 2 - 1))
    }

    scale(mod: number) {
        this.data = this.data.map((column) => column.map((cell) => (cell *= mod)))
    }

    add(mod: number | Matrix) {
        this.data = this.data.map((column, ridx) =>
            column.map(
                (cell, cidx) => (cell += mod instanceof Matrix ? mod.data[ridx][cidx] : mod),
            ),
        )
    }

    subtract(mod: number | Matrix) {
        this.data = this.data.map((column, ridx) =>
            column.map(
                (cell, cidx) => (cell -= typeof mod === 'number' ? mod : mod.data[ridx][cidx]),
            ),
        )
    }

    static subtract(a: Matrix, b: Matrix) {
        if (a.rows !== b.rows && a.columns !== b.rows) {
            console.error('columns must match columns')
            return undefined
        }
        const result = new Matrix(a.rows, a.columns)
        for (let r = 0; r < result.rows; r++) {
            for (let c = 0; c < result.columns; c++) {
                result.data[r][c] = a.data[r][c] - b.data[r][c]
            }
        }
        return result
    }

    static multiply(a: Matrix, b: Matrix): Matrix {
        if (a.columns !== b.rows) {
            console.error('columns must match columns')
            return undefined
        }

        const result = new Matrix(a.rows, b.columns)

        for (let r = 0; r < result.rows; r++) {
            for (let c = 0; c < result.columns; c++) {
                let sum = 0
                for (let k = 0; k < a.columns; k++) {
                    sum += a.data[r][k] * b.data[k][c]
                }
                result.data[r][c] = sum
            }
        }
        return result
    }

    multiply(mod: Matrix) {
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.columns; c++) {
                this.data[r][c] *= mod.data[r][c]
            }
        }
    }

    static map(m: Matrix, func: (cell: number) => number): Matrix {
        const result = new Matrix(m.rows, m.columns)
        result.data = m.data.map((column) => column.map((cell) => func(cell)))
        return result
    }

    map(func: (cell: number) => number) {
        this.data = this.data.map((column) => column.map((cell) => func(cell)))
    }

    static transpose(m: Matrix) {
        const result = new Matrix(m.columns, m.rows)
        for (let r = 0; r < m.rows; r++) {
            for (let c = 0; c < m.columns; c++) {
                result.data[c][r] = m.data[r][c]
            }
        }
        return result
    }

    transpose() {
        const result = new Matrix(this.columns, this.rows)
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.columns; c++) {
                result.data[c][r] = this.data[r][c]
            }
        }
        return result
    }

    copy(): Matrix {
        const newM = new Matrix(this.rows, this.columns)

        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.columns; c++) {
                newM.data[r][c] = this.data[r][c]
            }
        }

        return newM
    }

    //istanbul ignore next
    print = () => console.table(this.data)

    static deserialise(data: { rows: number; columns: number; data: number[][] }) {
        let m = new Matrix(data.rows, data.columns)
        m.data = data.data
        return m
    }
}
