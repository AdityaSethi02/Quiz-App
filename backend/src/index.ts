import { IoManager } from "./managers/IoManager";
const io = IoManager.getIo();

io.listen(3000);

io.on("connection", (client) => {
    client.on("event", data => {
        const type = data.type;
        // 3 admin events
        // 2 client events
        // UserManager => QuizManager => Quiz => broadcast
    });
    client.on("disconnect", () => {

    });
});
