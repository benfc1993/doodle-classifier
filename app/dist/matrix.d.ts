export default class Matrix {
    columns: number;
    rows: number;
    data: number[][];
    constructor(rows: number, columns: number, seed?: number);
    static fromArray(input_array: any): Matrix;
    static toFlatArray(m: Matrix): number[];
    randomise(): void;
    scale(mod: number): void;
    add(mod: number | Matrix): void;
    subtract(mod: number | Matrix): void;
    static subtract(a: Matrix, b: Matrix): Matrix;
    static multiply(a: Matrix, b: Matrix): Matrix;
    multiply(mod: Matrix): void;
    static map(m: Matrix, func: (cell: number) => number): Matrix;
    map(func: (cell: number) => number): void;
    static transpose(m: Matrix): Matrix;
    transpose(): Matrix;
    copy(): Matrix;
    print: () => void;
    static deserialise(data: {
        rows: number;
        columns: number;
        data: number[][];
    }): Matrix;
}
