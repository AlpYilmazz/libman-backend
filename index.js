const app = require('./src/app');

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host, (err) => {
    if (err) {
        throw err;
    }

    const listeningOn = `| Listening on ${host}:${port} |`;
    const dashes = ' ' + '-'.repeat(listeningOn.length-2) + ' ';
    console.log(dashes);
    console.log(listeningOn);
    console.log(dashes);
});