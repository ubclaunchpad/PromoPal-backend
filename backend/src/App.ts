import server from './server';
const PORT = 8000;

const starter = new server().start(PORT)
    .then(port => console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`))
    .catch(error => {
        console.log(error)
    });

export default starter;