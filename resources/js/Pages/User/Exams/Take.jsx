import React, {useState, useEffect, useCallback} from "react";
import {router, usePage} from "@inertiajs/react";
import BknLayout from "@/Layouts/BknLayout";
import {Button} from "@/Components/Catalyst/button";
import {calculateTimeLeft, convertToISO, formatTime} from "@/utils/utils.js";
import Timer from "@/Pages/User/Exams/partials/Timer";
import Overview from "@/Pages/User/Exams/partials/Overview";
import {Dialog, DialogActions, DialogBody, DialogTitle} from "@/Components/Catalyst/dialog";
import BackButton from "@/Components/BackButton";
import MobileOverview from "@/Pages/User/Exams/partials/MobileOverview.jsx";

export default function UserExamTake({
                                         all_question_ids,
                                         meta,
                                         current_question,
                                         current_question_index,
                                         current_page_number,
                                         total_question,
                                         next_question_id,
                                         exam_session_id,
                                         question_answers,
                                         answered_question_ids,
                                         start_at,
                                         end_at,
                                     }) {
    const user = usePage().props.auth.user;

    const [currentPage, setCurrentPage] = useState(meta.current_page);
    const [isSaveButtonCanClick, setIsSaveButtonCanClick] = useState(false);
    const [answers, setAnswers] = useState({});

    const [canClickButton, setCanClickButton] = useState(true);

    const [isFinishDialogOpen, setIsFinishDialogOpen] = useState(false);

    const startTime = new Date(convertToISO(start_at)).getTime();
    const endTime = new Date(convertToISO(end_at)).getTime();

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(endTime));
    const [timer, setTimer] = useState("00:00:00");

    const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(false);

    const handleAnswerChange = useCallback((optionId) => {
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [current_question.id]: optionId,
        }));
    }, [current_question.id]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            const remainingTime = calculateTimeLeft(endTime);

            if (remainingTime <= 0) {
                clearInterval(intervalId);

                setTimer('00:00:00');
                handleFinishExam();
            } else {
                setTimeLeft(remainingTime);
                setTimer(formatTime(remainingTime));
            }
        }, 1000);

        return () => clearInterval(intervalId);
    }, [endTime]);

    useEffect(() => {
        const processedAnswers = question_answers.reduce((acc, item) => {
            acc[item.question_id] = item.answer_option_id;
            return acc;
        }, {});
        setAnswers(processedAnswers);
    }, [question_answers]);

    useEffect(() => {
        setIsSaveButtonCanClick(answers[current_question.id] !== undefined);
    }, [answers, current_question.id]);

    const handlePageChange = (page) => {
        if (page > 0 && page <= meta.total_pages) {
            setCurrentPage(page);
            router.get(route("user.exams.take", {
                page: page,
                exam_session: exam_session_id,
            }));
        }
    };

    const skipQuestion = () => {
        const perPage = meta.per_page;
        const nextQuestionIndex = current_question_index + 1;
        const nextPage = Math.floor(nextQuestionIndex / perPage) + 1;
        const nextQuestionId = all_question_ids[nextQuestionIndex] || next_question_id;

        router.get(route("user.exams.take", {
            exam_session: exam_session_id,
            page: nextPage,
            question_id: nextQuestionId.id === undefined ? next_question_id : nextQuestionId.id,
        }));
    }

    const handleQuestionClick = (questionId) => {
        router.get(route("user.exams.take", {
            exam_session: exam_session_id,
            page: currentPage,
            question_id: questionId,
        }));
    };

    const saveAndNextQuestion = () => {
        const selectedOptionId = answers[current_question.id];

        setCanClickButton(false)

        const perPage = meta.per_page;
        const nextQuestionIndex = current_question_index + 1;
        const nextPage = Math.floor(nextQuestionIndex / perPage) + 1;

        router.post(route("user.exams.save-answer", exam_session_id), {
            question_id: current_question.id,
            answer_id: selectedOptionId,
            question_type_id: current_question.question_type_id,
        }, {
            onSuccess: () => {
                if (current_question_index < total_question - 1) {
                    router.get(route("user.exams.take", {
                        exam_session: exam_session_id,
                        page: nextPage,
                        question_id: next_question_id,
                    }));
                }
            },
            onFinish: () => {
                setCanClickButton(true);
            }
        });
    }

    const getButtonClass = (id) => {
        return answered_question_ids.includes(id) ? 'bg-green-500' : (current_question.id === id ? 'bg-blue-500' : 'bg-red-500');
    }

    const handleFinishExam = () => {
        setIsSubmitButtonDisabled(true);

        router.post(route('user.exams.finish', exam_session_id), {
            total_question: total_question,
        });
    }

    return (
        <>
            <BknLayout title={'SIMULASI CAT'} className={'relative flex flex-col'}>
                <BackButton link={route('user.welcome')}
                />
                <div
                    className="bg-white px-5 py-4 border border-gray-300 w-full mt-5 rounded-tl rounded-tr md:rounded-none">
                    <div className="flex">
                        <div className="w-1/6 font-light">Nama</div>
                        <div className="w-5/6 font-light">: {user.name}</div>
                    </div>
                    <div className="flex">
                        <div className="w-1/6 font-light">NIK</div>
                        <div className="w-5/6 font-light">: {user.nik}</div>
                    </div>
                    <div className="mt-2">
                        <strong>{current_question.question_type.name}</strong>
                    </div>
                </div>

                <Timer timer={timer} classes={'block sm:hidden text-white rounded-bl rounded-br text-center'}/>

                <div className="bg-white px-5 py-4 border border-gray-300 w-full mt-5">
                    {current_question && (
                        <>
                            <div className="mb-3">
                                <strong>Soal No. {current_question_index + 1}</strong>
                            </div>
                            <div className="mb-3">{current_question.question}</div>

                            {current_question.options?.map((option, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name={`question-${current_question.id}`}
                                        id={`option-${index}`}
                                        value={option.id}
                                        checked={answers[current_question.id] === option.id}
                                        onChange={() => handleAnswerChange(option.id)}
                                    />
                                    <label htmlFor={`option-${index}`}>
                                        {option.option}. {option.value}
                                    </label>
                                </div>
                            ))}
                        </>
                    )}
                </div>

                <div className="mt-3 flex gap-1">
                    <button
                        className={`w-full md:w-auto px-3 py-2 text-white ${isSaveButtonCanClick ? 'bg-blue-600' : 'bg-blue-500'}`}
                        onClick={saveAndNextQuestion}
                        disabled={!isSaveButtonCanClick || !canClickButton}
                    >
                        {current_question_index < total_question - 1 ? 'Simpan dan lanjutkan' : 'Simpan'}
                    </button>

                    {current_question_index < total_question - 1 && (
                        <button
                            className={`px-3 py-2 bg-blue-600 text-white ${canClickButton ? '' : 'opacity-50 cursor-not-allowed'} w-full md:w-auto`}
                            onClick={skipQuestion}
                            disabled={!canClickButton}
                        >
                            Lewati soal ini
                        </button>
                    )}
                </div>

                <div className="text-center mt-10 flex items-center justify-between max-w-2xl mx-auto">
                    <img
                        src={'/assets/bkn/images/left.png'}
                        onClick={() => handlePageChange(currentPage - 1)}
                        alt={'left'}
                        className={`w-8 h-8 cursor-pointer ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        style={{pointerEvents: currentPage === 1 ? 'none' : 'auto'}}
                    />

                    <div
                        className="grid gap-1 justify-items-center grid-cols-5 grid-rows-4 md:grid-cols-10 md:grid-rows-2">
                        {all_question_ids.map((question_id, index) => {
                            const itemNumber = (currentPage - 1) * meta.per_page + index + 1;

                            return (
                                <button
                                    key={index}
                                    className={`px-3 py-1 w-12 h-8 ${getButtonClass(question_id.id)} text-white`}
                                    onClick={() => handleQuestionClick(question_id.id)}
                                >
                                    {itemNumber}
                                </button>
                            );
                        })}
                    </div>

                    <img
                        src={'/assets/bkn/images/right.png'}
                        onClick={() => handlePageChange(currentPage + 1)}
                        alt={'right'}
                        className={`w-8 h-8 cursor-pointer ${currentPage === meta.total_pages ? 'opacity-50 cursor-not-allowed' : ''}`}
                        style={{pointerEvents: currentPage === meta.total_pages ? 'none' : 'auto'}}
                    />
                </div>

                <div className="mt-10 block md:hidden">
                    <MobileOverview
                        timeLeft={timeLeft}
                        totalQuestion={total_question}
                        totalAnsweredQuestion={answered_question_ids.length}
                        unansweredQuestions={total_question - answered_question_ids.length}
                        setIsFinishDialogOpen={setIsFinishDialogOpen}/>
                </div>

            </BknLayout>

            <Timer timer={timer}
                   classes={'hidden md:block absolute bottom-5 right-5 p-5 text-white shadow-md rounded'}/>

            <Overview
                timeLeft={timeLeft}
                totalQuestion={total_question}
                totalAnsweredQuestion={answered_question_ids.length}
                unansweredQuestions={total_question - answered_question_ids.length}
                setIsFinishDialogOpen={setIsFinishDialogOpen}
                classes={'hidden md:absolute md:top-5 md:right-5 md:bg-white md:bg-opacity-90 md:border-2 md:p-1 md:block'}
                isSubmitButtonDisabled={isSubmitButtonDisabled}
            />

            <Dialog open={isFinishDialogOpen} onClose={() => setIsFinishDialogOpen(false)}>
                <DialogTitle>Selesaikan Ujian?</DialogTitle>
                <DialogBody>
                    <p>
                        Apakah Anda ingin mengakhiri simulasi ujian ini?
                    </p>

                    <p>
                        Jika "Ya" maka Anda sudah dinyatakan selesai mengikuti simulasi ujian, dan Anda tidak bisa
                        memperbaiki lembar kerja Anda. Jika "Tidak" maka anda akan kembali ke lembar kerja dan silahkan
                        untuk melanjutkan menjawab atau memperbaiki jawaban anda.
                    </p>
                </DialogBody>
                <DialogActions>
                    <Button
                        className="cursor-pointer rounded-none"
                        onClick={handleFinishExam}
                        disabled={isSubmitButtonDisabled}
                    >
                        YA
                    </Button>
                    <Button
                        color={'blue'}
                        className="cursor-pointer rounded-none"
                        onClick={() => setIsFinishDialogOpen(false)}
                    >
                        TIDAK
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
