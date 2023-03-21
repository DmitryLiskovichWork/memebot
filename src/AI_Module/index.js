const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');
const axios = require('axios');

const modelCache = {
    model: null,
    labels: null
}

async function getModel() {
    if(modelCache.model && modelCache.labels) {
        return modelCache;
    }

    const model = await tf.loadGraphModel('file://'+ __dirname +'/model/model.json');
    const labelsStore = JSON.parse(fs.readFileSync(__dirname + '/model/labels.json'));

    modelCache.model = model;
    modelCache.labels = labelsStore;
    return modelCache;
}

getModel();

async function getTagsByImagePath(url) {
    const { model, labels: labelsStore } = modelCache;
    const imageBuffer = await axios.get(url, {
        responseType: 'arraybuffer'
    });

    const tensor = tf.node.decodeImage(imageBuffer.data).resizeBilinear([224, 224]).toFloat().div(tf.scalar(255)).expandDims();

    const predictions = await model.predict(tensor).array();
    const topK = tf.topk(predictions, 10);
    const values = await topK.values.array();
    const indices = await topK.indices.array();

    const labels = indices[0].map((indice) => labelsStore[indice]);

    return { values, indices, labels };
}

module.exports = {
    getTagsByImagePath
}
