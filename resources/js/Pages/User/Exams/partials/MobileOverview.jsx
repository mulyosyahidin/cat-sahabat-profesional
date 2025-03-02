import React from "react";
import {msToMinute} from "@/utils/utils.js";
import {Button} from "@/Components/Catalyst/button.jsx";

export default function MobileOverview({
                                           timeLeft,
                                           totalQuestion,
                                           totalAnsweredQuestion,
                                           unansweredQuestions,
                                           setIsFinishDialogOpen,
                                           classes = ''
                                       }) {
    return (
        <div className={`${classes}`}>
            <div
                className="bg-white px-5 py-4 border border-gray-300 w-full mt-5 rounded-tl rounded-tr md:rounded-none mb-3">
                <div className="flex">
                    <div className="w-1/2 font-light">Sisa Waktu</div>
                    <div className="w-1/2 font-light">: {msToMinute(timeLeft)} menit</div>
                </div>
                <div className="flex">
                    <div className="w-1/2 font-light">Jumlah Soal</div>
                    <div className="w-1/2 font-light">: {totalQuestion}</div>
                </div>
                <div className="flex">
                    <div className="w-1/2 font-light">Soal Dijawab</div>
                    <div className="w-1/2 font-light">: {totalAnsweredQuestion}</div>
                </div>
                <div className="flex">
                    <div className="w-1/2 font-light">Belum Dijawab</div>
                    <div className="w-1/2 font-light">: {unansweredQuestions}</div>
                </div>
            </div>
            <Button type="button" className="cursor-pointer w-full" onClick={() => setIsFinishDialogOpen(true)}>
                Selesai Ujian
            </Button>
        </div>
    )
}
