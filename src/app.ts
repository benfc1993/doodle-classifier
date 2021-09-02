import { NeuralNetwork } from '../libs/nn/neural-network'

const containerElement = document.getElementById('p5-container')
const trainButton = document.getElementById('train-btn')
const testButton = document.getElementById('test-btn')
const guessButton = document.getElementById('guess-btn')
const clearButton = document.getElementById('clear-btn')

const saveButton = document.getElementById('save-btn')
const loadButton = document.getElementById('load-btn')

const sketch = (p) => {
    const len = 784

    let cats_data
    let cars_data
    let carrots_data

    let cats: { training: number[][]; testing: number[][] } = { training: [], testing: [] }
    let cars: { training: number[][]; testing: number[][] } = { training: [], testing: [] }
    let carrots: { training: number[][]; testing: number[][] } = { training: [], testing: [] }

    const CAT = 0
    const CAR = 1
    const CARROT = 2

    const classification = ['Cat', 'Car', 'Carrot']

    let nn: NeuralNetwork
    let training = []
    let testing = []

    function prepData(obj, bytes, label) {
        obj.training = []
        obj.testing = []

        let images = 100000
        for (let i = 0; i < images; i++) {
            let offset = i * len
            let threshold = Math.floor(images * 0.8)
            if (i < threshold) {
                obj.training[i] = bytes.bytes.subarray(offset, offset + len)
                obj.training[i].label = label
            } else {
                obj.testing[i - threshold] = bytes.bytes.subarray(offset, offset + len)
                obj.testing[i - threshold].label = label
            }
        }
    }

    p.preload = () => {
        cats_data = p.loadBytes('./data/cats.bin')
        cars_data = p.loadBytes('./data/cars.bin')
        carrots_data = p.loadBytes('./data/carrots.bin')
    }

    const train = () => {
        p.shuffle(training, true)

        let percent = 0
        let iterations = training.length

        for (let i = 0; i < iterations; i++) {
            if ((i / iterations) * 100 > percent + 1) {
                console.clear()
                console.log(`${Math.floor((i / iterations) * 100)}%`)
                percent = (i / iterations) * 100
            }
            let inputs = []
            let data = training[i]
            for (let j = 0; j < data.length; j++) {
                inputs[j] = data[j] / 255.0
            }
            let targets = [0, 0, 0]
            let label = training[i].label
            targets[label] = 1
            nn.train(inputs, targets)
        }
        console.clear()
        console.log('Training completed')
    }

    const test = () => {
        let correct = 0
        let iterations = testing.length

        console.log('testing...')
        for (let i = 0; i < iterations; i++) {
            let data = testing[i]
            let inputs = data.map((x) => x / 255.0)
            let label = testing[i].label
            let guess = nn.predict(inputs)

            let m = p.max(guess)
            let classification = guess.indexOf(m)

            if (classification === label) {
                correct++
            }
        }
        let percent = correct / iterations
        console.clear()
        console.log(percent)
    }

    const guess = () => {
        let inputs = []
        let img = p.get()

        img.resize(28, 28)
        img.loadPixels()
        for (let i = 0; i < len; i++) {
            let alpha = img.pixels[i * 4]
            inputs[i] = (255 - alpha) / 255.0
        }

        let guess = nn.predict(inputs)
        let m = p.max(guess)
        console.log(classification[guess.indexOf(m)])
    }

    const clear = () => {
        p.clear()
        p.createCanvas(280, 280)
        p.background(255)
    }

    const save = () => {
        let json = nn
        p.saveJSON(nn, 'brain')
    }

    const load = () => {
        let data = p.loadJSON('./data/brain.json')
        setTimeout(() => (nn = NeuralNetwork.deserialise(data)), 250)

        console.log('Loaded and ready!')
    }

    p.setup = () => {
        trainButton.addEventListener('click', train)
        testButton.addEventListener('click', test)
        guessButton.addEventListener('click', guess)
        clearButton.addEventListener('click', clear)
        saveButton.addEventListener('click', save)
        loadButton.addEventListener('click', load)

        prepData(cats, cats_data, CAT)
        prepData(cars, cars_data, CAR)
        prepData(carrots, carrots_data, CARROT)

        // nn = new NeuralNetwork(784, [786], 3)
        // nn = new NeuralNetwork(2, [2, 3], 3)

        training = training.concat(cats.training)
        training = training.concat(cars.training)
        training = training.concat(carrots.training)

        testing = testing.concat(cats.testing)
        testing = testing.concat(cars.testing)
        testing = testing.concat(carrots.testing)
        p.createCanvas(280, 280)
        p.background(255)
    }

    p.draw = () => {
        p.strokeWeight(8)
        p.stroke(0)
        if (p.mouseIsPressed) {
            p.line(p.pmouseX, p.pmouseY, p.mouseX, p.mouseY)
        }
    }
}

new p5(sketch, containerElement)
