import { Matrix } from './matrix';
export declare class NeuralNetwork {
    inputs: number;
    hiddenLayerArray: number[];
    hiddenLayerCount: number;
    outputs: number;
    learningRate: number;
    generatedHidden: Matrix;
    generatedOutputs: Matrix;
    weights_ih: Matrix;
    weights_ho: Matrix;
    bias_h: Matrix;
    bias_o: Matrix;
    hiddenLayers: Matrix[];
    weights: Matrix[];
    biases: Matrix[];
    constructor(inputs: number, hiddenLayers: number[], outputs: number);
    train(input_array: number[], targets: number[]): void;
    predict(input_array: number[]): number[];
    serialise: () => string;
    static deserialise(data: any): NeuralNetwork;
}
