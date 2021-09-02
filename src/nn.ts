import Matrix from './matrix'

const sigmoid = (x: number) => 1 / (1 + Math.exp(-x))

const dsigmoid = (x) => x * (1 - x)

export default class NeuralNetwork {
    inputs: number
    hiddenLayerArray: number[]
    hiddenLayerCount: number
    outputs: number
    learningRate: number

    generatedHidden: Matrix
    generatedOutputs: Matrix
    weights_ih: Matrix
    weights_ho: Matrix
    bias_h: Matrix
    bias_o: Matrix

    hiddenLayers: Matrix[] = []
    weights: Matrix[] = []
    biases: Matrix[] = []

    // constructor(inputs: number, hiddenLayer: number, outputs: number) {
    //     this.inputs = inputs
    //     this.hiddenLayer = hiddenLayer
    //     this.outputs = outputs
    //     this.learningRate = 0.1

    //     this.weights_ih = new Matrix(hiddenLayer, inputs)
    //     this.weights_ho = new Matrix(outputs, hiddenLayer)
    //     this.weights_ih.randomise()
    //     this.weights_ho.randomise()

    //     this.bias_h = new Matrix(hiddenLayer, 1)
    //     this.bias_o = new Matrix(outputs, 1)
    //     this.bias_h.randomise()
    //     this.bias_o.randomise()
    // }

    constructor(inputs: number, hiddenLayers: number[], outputs: number) {
        this.inputs = inputs
        this.hiddenLayerArray = hiddenLayers
        this.hiddenLayerCount = hiddenLayers.length
        this.outputs = outputs
        this.learningRate = 0.2

        this.weights.push(new Matrix(hiddenLayers[0], inputs))
        this.weights[0].randomise()

        for (let i = 0; i < hiddenLayers.length; i++) {
            if (i + 1 < hiddenLayers.length) {
                this.weights.push(new Matrix(hiddenLayers[i + 1], hiddenLayers[i]))
                this.weights[i + 1].randomise()
            }
            this.biases.push(new Matrix(hiddenLayers[i], 1))
            this.biases[i].randomise()
        }

        this.weights.push(new Matrix(outputs, hiddenLayers[hiddenLayers.length - 1]))
        this.weights[this.weights.length - 1].randomise()
        this.biases.push(new Matrix(outputs, 1))
        this.biases[this.biases.length - 1].randomise()

        this.weights_ho = new Matrix(outputs, hiddenLayers[hiddenLayers.length - 1])
        this.weights_ho.randomise()

        this.bias_o = new Matrix(outputs, 1)
        this.bias_o.randomise()
    }

    // train(input_array: number[], targets: number[]) {
    //     const guess: number[] = this.feedForward(input_array)
    //     const inputsM = Matrix.fromArray(input_array)
    //     const guessM: Matrix = Matrix.fromArray(guess)

    //     const targetsM: Matrix = Matrix.fromArray(targets)

    //     //Output gradients
    //     const output_errors: Matrix = Matrix.subtract(targetsM, guessM)

    //     const output_gradients = Matrix.map(this.generatedOutputs, dsigmoid)
    //     output_gradients.multiply(output_errors)
    //     output_gradients.scale(this.learningRate)

    //     const hidden_t = Matrix.transpose(this.generatedHidden)
    //     const weight_ho_deltas = Matrix.multiply(output_gradients, hidden_t)

    //     this.weights_ho.add(weight_ho_deltas)
    //     this.bias_o.add(output_gradients)

    //     //Hidden gradient
    //     const who_t = Matrix.transpose(this.weights_ho)
    //     const hidden_errors: Matrix = Matrix.multiply(who_t, output_errors)

    //     const hidden_gradients = Matrix.map(this.generatedHidden, dsigmoid)
    //     hidden_gradients.multiply(hidden_errors)
    //     hidden_gradients.scale(this.learningRate)

    //     const inputs_t = Matrix.transpose(inputsM)
    //     const weight_ih_deltas = Matrix.multiply(hidden_gradients, inputs_t)

    //     this.weights_ih.add(weight_ih_deltas)
    //     this.bias_h.add(hidden_gradients)
    // }

    train(input_array: number[], targets: number[]) {
        const guess: number[] = this.predict(input_array)
        const inputsM = Matrix.fromArray(input_array)
        const guessM: Matrix = Matrix.fromArray(guess)

        const targetsM: Matrix = Matrix.fromArray(targets)

        //Output gradients
        const output_errors: Matrix = Matrix.subtract(targetsM, guessM)

        const output_gradients = Matrix.map(this.generatedOutputs, dsigmoid)
        output_gradients.multiply(output_errors)
        output_gradients.scale(this.learningRate)

        const hidden_t = Matrix.transpose(this.hiddenLayers[this.hiddenLayers.length - 1])
        const weight_ho_deltas = Matrix.multiply(output_gradients, hidden_t)

        this.weights[this.weights.length - 1].add(weight_ho_deltas)
        this.biases[this.biases.length - 1].add(output_gradients)

        let hidden_errors_prev: Matrix = output_errors
        let hidden_gradient_prev: Matrix = null

        for (let i = this.hiddenLayers.length - 1; i > -1; i--) {
            let weight_T: Matrix = Matrix.transpose(this.weights[i + 1])
            hidden_errors_prev = Matrix.multiply(weight_T, hidden_errors_prev)

            hidden_gradient_prev = Matrix.map(this.hiddenLayers[i], dsigmoid)
            hidden_gradient_prev.multiply(hidden_errors_prev)
            hidden_gradient_prev.scale(this.learningRate)

            let next_layer_t = Matrix.transpose(i >= 1 ? this.hiddenLayers[i - 1] : inputsM)
            let next_layer_deltas = Matrix.multiply(hidden_gradient_prev, next_layer_t)

            this.weights[i].add(next_layer_deltas)
            this.biases[i].add(hidden_gradient_prev)
        }
    }

    // feedForward(input_array: number[]): number[] {
    //     let inputs = Matrix.fromArray(input_array)

    //     this.generatedHidden = Matrix.multiply(this.weights_ih, inputs)
    //     this.generatedHidden.add(this.bias_h)
    //     this.generatedHidden.map(sigmoid)

    //     this.generatedOutputs = Matrix.multiply(this.weights_ho, this.generatedHidden)
    //     this.generatedOutputs.add(this.bias_o)
    //     this.generatedOutputs.map(sigmoid)

    //     return Matrix.toFlatArray(this.generatedOutputs)
    // }

    predict(input_array: number[]): number[] {
        let inputs = Matrix.fromArray(input_array)

        for (let i = 0; i < this.hiddenLayerCount; i++) {
            this.hiddenLayers[i] = Matrix.multiply(
                this.weights[i],
                i === 0 ? inputs : this.hiddenLayers[i - 1],
            )
            this.hiddenLayers[i].add(this.biases[i])
            this.hiddenLayers[i].map(sigmoid)
        }

        this.generatedOutputs = Matrix.multiply(
            this.weights[this.weights.length - 1],
            this.hiddenLayers[this.hiddenLayerCount - 1],
        )
        this.generatedOutputs.add(this.biases[this.biases.length - 1])
        this.generatedOutputs.map(sigmoid)

        return Matrix.toFlatArray(this.generatedOutputs)
    }

    serialise = () => JSON.stringify(this)

    static deserialise(data): NeuralNetwork {
        let nn = new NeuralNetwork(data.inputs, data.hiddenLayerArray, data.outputs)
        nn.hiddenLayers = data.hiddenLayers.map((layer) => Matrix.deserialise(layer))
        nn.weights = data.weights.map((weight) => Matrix.deserialise(weight))
        nn.biases = data.biases.map((bias) => Matrix.deserialise(bias))
        nn.learningRate = data.learningRate
        return nn
    }
}
