import {Button} from "@/Components/Catalyst/button";
import {msToMinute} from "@/utils/utils.js";


export default function Overview({
                                     timeLeft,
                                     totalQuestion,
                                     totalAnsweredQuestion,
                                     unansweredQuestions,
                                     setIsFinishDialogOpen,
                                     classes = ''
                                 }) {
    return (
        <div className={`${classes}`}>
            <div className="flex flex-wrap">
                <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/6 xl:w-1/6 text-center p-2">
                    <span className="font-light" style={{fontSize: "14px"}}>Sisa Waktu</span>
                    <br/>
                    {msToMinute(timeLeft)} menit
                </div>
                <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/6 xl:w-1/6 text-center p-2">
                    <span className="font-light" style={{fontSize: "14px"}}>Jumlah Soal</span>
                    <br/>
                    {totalQuestion}
                </div>
                <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/6 xl:w-1/6 text-center p-2">
                    <span className="text-green-600" style={{fontSize: "14px"}}>Soal Dijawab</span>
                    <br/>
                    {totalAnsweredQuestion}
                </div>
                <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/6 xl:w-1/6 text-center p-2">
                    <span className="text-red-600" style={{fontSize: "14px"}}>Belum Dijawab</span>
                    <br/>
                    {unansweredQuestions}
                </div>
                <div
                    className="w-full sm:w-1/2 md:w-1/4 lg:w-1/3 xl:w-1/3 text-center p-2 flex justify-center items-center">
                    <Button type="button" className="cursor-pointer" onClick={() => setIsFinishDialogOpen(true)}>
                        Selesai Ujian
                    </Button>
                </div>
            </div>
        </div>
    )
}
