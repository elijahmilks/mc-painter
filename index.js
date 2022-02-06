const fs = require('fs');
const express = require('express');
const app = express();

const file = fs.readFileSync('./model.json');
const data = JSON.parse(file);
const points = {};
data.voxels.forEach(v => {
    v.id = `${v.x},${v.y},${v.z}`;
    points[v.id] = v;
});
const matrix = [];
for (let x = 0; x <= Number(data.dimension[0].width); x++) {
    if (!matrix[x]) matrix[x] = [];
    for (let y = 0; y <= Number(data.dimension[0].height); y++) {
        if (!matrix[x][y]) matrix[x][y] = '';
        for (let z = 0; z <= Number(data.dimension[0].depth); z++) {
            if (points[`${x},${y},${z}`]) matrix[x][y] += 'x';
            else matrix[x][y] += 'o';
        }
    }
}

app.get('/dimensions', (req, res) => {
    res.send(`${data.dimension.width},${data.dimension.height},${data.dimension.depth}`);
});

app.get('/', (req, res) => {
    if (!req.query.x || !req.query.y) {
        res.status(500).send();
        return;
    }

    const x = Number(req.query.x);
    const y = Number(req.query.y);

    if (x >= 0 && x < matrix.length && y >= 0 && y < matrix[x].length) {
        res.send(matrix[x][y]);
    } else {
        res.send('');
    }
});

app.listen(3000, () => {
    console.log('running');
});