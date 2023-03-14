const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');


async function getTagsByImagePath(url) {
    const model = await tf.loadLayersModel('https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v2_100_224/classification/4');
    const image = fs.readFileSync(url);

    const tensor = tf.node.decodeImage(image).resizeBilinear([224, 224]).toFloat().div(tf.scalar(255)).expandDims();

    const predictions = await model.predict(tensor).array();
    const topK = tf.topk(predictions, 10);
    const values = await topK.values.array();
    const indices = await topK.indices.array();

    return { values, indices };
}

module.exports = {
    getTagsByImagePath
}
