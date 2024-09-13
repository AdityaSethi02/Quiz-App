import { IoManager } from "./managers/IoManager";

export type AllowedSubmissions  = 0 | 1 | 2 | 3;

const problemTimeSec = 20;
interface User
{
    name: string;
    id: string;
    points: number;
}

interface Submission
{
    problemId: string;
    userId: string;
    isCorrect: boolean;
    optionSelected: AllowedSubmissions;
}

interface Problem
{
    id: string;
    title: string,
    description: string,
    image?: string,
    startTime: number;
    answer: AllowedSubmissions,
    options: {
        id: number;
        title: string;
    }
    submissions: Submission[];
}


export class Quiz
{
    public roomId: string;
    private hasStarted: boolean;
    private problems: Problem[];
    private activeProblem: number;
    private users: User[];

    constructor(roomId: string)
    {
        this.roomId = roomId;
        this.hasStarted = false;
        this.problems = [];
        this.activeProblem = 0;
        this.users = [];
    }

    addProblem(problem: Problem)
    {
        this.problems.push(problem);
    }

    start()
    {
        this.hasStarted = true;
        const io = IoManager.getIo();
        io.emit("CHANGE_PROBLEM", {
            problem: this.problems[0]
        });
        this.setActiveProblem(this.problems[0])
        this.problems[0].startTime = new Date().getTime();
    }

    setActiveProblem(problem: Problem)
    {
        problem.startTime = new Date().getTime();
        problem.submissions = [];
        IoManager.getIo().emit("CHANGE_PROBLEM", {
            problem
        })

        // clear this if function moves ahead
        setTimeout(() => {
            this.sendLeaderBoard();
        }, problemTimeSec * 1000)
    }

    sendLeaderBoard()
    {
        const leaderBoard = this.getLeaderBoard().splice(0, 20);
        IoManager.getIo().to(this.roomId).emit("LEADER_BOARD", {
            leaderBoard
        })
    }

    next()
    {
        this.activeProblem++;
        const problem = this.problems[this.activeProblem];
        const io = IoManager.getIo();

        if (problem)
        {
            problem.startTime = new Date().getTime();
            io.emit("CHANGE_PROBLEM", {
                problem
            });
        }
        else
        {
            // send final results hereS
            io.emit("QUIZ_ENDED", {
                problem
            })
        }
    }

    generateRandomString(length: number)
    {
        var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()";
        var charLength = chars.length;
        var result = "";

        for (var i=0; i<length; i++)
        {
            result += chars.charAt(Math.floor(Math.random() * charLength));
        }
        return result;
    }

    addUser(name: string)
    {
        const id = this.generateRandomString(10);
        this.users.push({
            id, name, points: 0
        })
        return id;
    }

    submit(userId: string, roomId: string, problemId: string, submission: 0 | 1 | 2 | 3)
    {
        const problem = this.problems.find(x => x.id === problemId);
        const user = this.users.find(x => x.id === userId);

        if (!problem || !user)
        {
            return;
        }
        const existingSubmission = problem.submissions.find(x => x.userId === userId);
        if (existingSubmission)
        {
            return;
        }
        problem.submissions.push({
            problemId,
            userId,
            isCorrect: problem.answer === submission,
            optionSelected: submission,
        });
        user.points += 1000 - 500 * (new Date().getTime() - problem.startTime) / problemTimeSec;
    }

    getLeaderBoard()
    {
        return this.users.sort((a, b) => a.points < b.points ? 1 : -1);
    }
}