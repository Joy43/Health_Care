
import { Server } from "http";
import app from "./app";

const port =5000;

async function main() {
    const server:Server = app.listen(port, () => {
        console.log("server is running now port",`http://localhost:${port}`)
    })
    
};


main();