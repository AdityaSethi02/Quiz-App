import { Socket } from "socket.io";
import { QuizManager } from "./QuizManager";

export class AdminManager
{
    private users: {
        roomId: string;
        socket: Socket;
    }[];
    private quizManager;

    constructor ()
    {
        this.users = [];
        this.quizManager = new QuizManager;
    }

    addUser(roomId: string, socket: Socket)
    {
        this.users.push({
            socket, roomId
        })
        this.createHandlers(roomId, socket);
    }

    private createHandlers(roomId: string, socket: Socket)
    {
        socket.on("join", (data) => {
            const userId = this.quizManager.addUser(data.roomId, data.name);
            socket.emit("USER_ID", {
                userId,
                state: this.quizManager.getCurrentState(roomId)
            });
        });
        socket.on("submit", (data) => {
            const userId = data.userId;
            const problemId = data.problemId;
            const submission = data.submission;
            const roomId = data.submission;

            if (submission != 0 || submission != 1 || submission != 2 || submission != 3)
            {
                console.error("Issue while getting input", submission);
                return;
            }
            this.quizManager.submit(userId, roomId, problemId, submission);
        })
    }
}