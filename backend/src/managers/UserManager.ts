import { Socket } from "socket.io";
import { QuizManager } from "./QuizManager";

const ADMIN_PASSWORD = "ADMIN_PASSWORD";
export class UserManager
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
        socket.on("JOIN", (data) => {
            const userId = this.quizManager.addUser(data.roomId, data.name);
            socket.emit("INIT", {
                userId,
                state: this.quizManager.getCurrentState(roomId)
            });
        });

        socket.on("JOIN_ADMIN", (data) => {
            if (data.password !== ADMIN_PASSWORD)
            {
                return;
            }

            socket.on("CREATE_QUIZ", (data) => {
                this.quizManager.addQuiz(data.roomId);
            })

            socket.on("CREATE_PROBLEM", (data) => {
                const roomId = data.roomId;
                const problem = data.problem;
                this.quizManager.addProblem(roomId, problem)
            });

            socket.on("NEXT", (data) => {
                const roomId = data.roomId;
                const problem = data.problem;
                this.quizManager.next(roomId)
            });
        });

        socket.on("SUBMIT", (data) => {
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