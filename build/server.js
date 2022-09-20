import express from 'express';
const app = express();
app.get('/', (req, res) => {
    res.json({ message: 'Deu bom!' });
});
app.listen(3000, () => {
    console.log(' app listening on port 3000!');
});
