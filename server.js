const app = require("./src/app");

const _PORT = process.env.APP_PORT;

const server = app.listen(_PORT, () => {
    console.log(`Server ShopBee is running with ${_PORT}`);
});
// process.on("SIGINT", () => {
//     server.close(() => console.log(`Server ShopBee is stopped`));
// });
