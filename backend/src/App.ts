import express from 'express';

const app = express();
const PORT = 8000;

app.get('/', (req, res) => res.send('Hello World'));

app.listen(PORT, () => {
  /* eslint-disable no-console */
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
