import { Quiz } from "../Quiz";
import { IoManager } from "./IoManager";

export class QuizManager
{
    private quizes: Quiz[];
    constructor ()
    {
        this.quizes = [];
    }

    public start(roomId: string)
    {
        const io = IoManager.getIo();
        const quiz = this.quizes.find(x => x.roomId === roomId);
        quiz.start()
    }

    public next(roomId: string)
    {
        const io = IoManager.getIo();
        io.to(roomId).emit({
            type: "START_ROOM",
        })
    }

    addUser(roomId: string, name: string)
    {
        return this.getQuiz(roomId)?.addUser(name);
    }

    submit(roomId: string, problemId: string, submission: 0 | 1 | 2 | 3)
    {
        this.getQuiz(roomId)?.submit(problemId, submission, submission);
    }

    getQuiz(roomId: string)
    {
        return this.quizes.find(x => x.roomId === roomId) ? null
    }
}