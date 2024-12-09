import {useEffect, useState} from "react";
import {router, usePage} from "@inertiajs/react";
import BknLayout from "@/Layouts/BknLayout.jsx";
import {Button} from "@/Components/Catalyst/button.jsx";

export default function UserExamIndex({
                                          currentQuestionData,
                                          questions,
                                          examSession,
                                          questionAnswers,
                                          start_at,
                                          end_at
                                      }) {
    const user = usePage().props.auth.user;

    const totalQuestion = questions.length;
    const [totalAnsweredQuestion, setTotalAnsweredQuestion] = useState(0);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(null);

    const [answers, setAnswers] = useState(() => {
        const initialAnswers = {};

        Object.keys(questionAnswers).forEach((questionId) => {
            initialAnswers[questionId] = questionAnswers[questionId].answer_id;
        });

        return initialAnswers;
    });

    const [savedAnswers, setSavedAnswers] = useState(() => {
        const initialSavedAnswers = {};

        Object.values(questionAnswers).forEach((answer) => {
            if (answer.created_at || answer.updated_at) {
                initialSavedAnswers[answer.question_id] = true;
            }
        });

        return initialSavedAnswers;
    });

    const convertToISO = (datetime) => {
        return datetime.replace(' ', 'T');
    };

    const startTime = new Date(convertToISO(start_at)).getTime();
    const endTime = new Date(convertToISO(end_at)).getTime();

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
    const [timer, setTimer] = useState("");

    // Menghitung waktu yang tersisa dalam milidetik
    function calculateTimeLeft() {
        const now = new Date().getTime(); // Waktu saat ini
        const remainingTime = endTime - now; // Hitung sisa waktu dari waktu sekarang
        return remainingTime;
    }

    // Fungsi untuk mengubah milidetik menjadi format JAM:MENIT:DETIK
    const formatTime = (milliseconds) => {
        let seconds = Math.floor(milliseconds / 1000);
        let minutes = Math.floor(seconds / 60);
        let hours = Math.floor(minutes / 60);
        seconds = seconds % 60;
        minutes = minutes % 60;

        // Menambahkan leading zero jika jam, menit, atau detik kurang dari 10
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };


    useEffect(() => {
        const answeredCount = Object.values(answers).filter((answer) => answer !== undefined).length;
        setTotalAnsweredQuestion(answeredCount);

        if (currentQuestionData?.question) {
            const currentIndex = questions.findIndex(
                (q) => q.question.id === currentQuestionData?.question.id
            );

            setCurrentQuestionIndex(currentIndex);
            setCurrentQuestion(currentQuestionData.question);
        }

        const intervalId = setInterval(() => {
            const remainingTime = calculateTimeLeft();
            if (remainingTime <= 0) {
                clearInterval(intervalId);
                setTimer('00:00:00');
            } else {
                setTimeLeft(remainingTime);
                setTimer(formatTime(remainingTime));
            }
        }, 1000);

        // Cleanup interval saat komponen unmount
        return () => clearInterval(intervalId);

    }, [currentQuestionData, questions, endTime]);


    const unansweredQuestions = totalQuestion - totalAnsweredQuestion;

    const setCurrentQuestionRequest = (questionId) => {
        router.post(route("user.exams.set-current-question", examSession.id), {
            question_id: questionId,
        });
    };

    const skipQuestion = () => {
        const nextIndex = currentQuestionIndex + 1;

        if (nextIndex < questions.length) {
            setCurrentQuestionIndex(nextIndex);
            setCurrentQuestion(questions[nextIndex].question);

            setCurrentQuestionRequest(questions[nextIndex]["question"].id);
        }
    };

    const handleQuestionClick = (index) => {
        setCurrentQuestionIndex(index);
        setCurrentQuestion(questions[index].question);

        setCurrentQuestionRequest(questions[index]["question"].id);
    };

    const handleAnswerChange = (questionId, selectedAnswer) => {
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [questionId]: selectedAnswer,
        }));
    };

    const saveAnswer = () => {
        const selectedAnswer = answers[currentQuestion.id];

        if (selectedAnswer === undefined) {
            alert("Pilih jawaban terlebih dahulu!");
            return;
        }

        router.post(
            route("user.exams.save-answer", examSession.id),
            {
                question_id: currentQuestion.id,
                answer_id: selectedAnswer,
            },
            {
                onSuccess: () => {
                    setSavedAnswers((prevSavedAnswers) => ({
                        ...prevSavedAnswers,
                        [currentQuestion.id]: true,
                    }));
                },
            }
        );
    };

    return (
        <div className="relative" style={{minHeight: "90vh"}}>
            <BknLayout className={'relative flex flex-col min-h-'}>
                <div className="bg-white px-5 py-4 border border-gray-300 w-full">
                    <div className="flex">
                        <div className="w-1/6 font-light">Nama Peserta</div>
                        <div className="w-5/6 font-light">: {user.name}</div>
                    </div>
                    <div className="flex">
                        <div className="w-1/6 font-light">Email</div>
                        <div className="w-5/6 font-light">: {user.email}</div>
                    </div>
                    <div className="mt-2">
                        <strong>{currentQuestionData?.question_type?.name || ""}</strong>
                    </div>
                </div>

                <div className="bg-white px-5 py-4 border border-gray-300 w-full mt-5">
                    {currentQuestion &&
                        <>
                            <div className="mb-3">
                                <strong>Soal No. {currentQuestionIndex + 1}</strong>
                            </div>

                            <div className="mb-3">{currentQuestion.question}</div>

                            {currentQuestion.options?.map((option, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name={`question-${currentQuestion.id}`}
                                        id={`option-${index}`}
                                        value={option.id}
                                        checked={answers[currentQuestion?.id] === option.id}
                                        onChange={() =>
                                            handleAnswerChange(currentQuestion.id, option.id)
                                        }
                                    />
                                    <label htmlFor={`option-${index}`}>
                                        {option.option}. {option.value}
                                    </label>
                                </div>
                            ))}
                        </>
                    }
                </div>

                <div className="mt-3 flex gap-1">
                    <button
                        className={`px-3 py-2 text-white ${
                            answers[currentQuestion?.id] !== undefined
                                ? "bg-blue-600"
                                : "bg-blue-500 cursor-not-allowed"
                        }`}
                        disabled={answers[currentQuestion?.id] === undefined}
                        onClick={saveAnswer}
                    >
                        Simpan jawaban
                    </button>

                    {currentQuestionIndex < questions.length - 1 && (
                        <button
                            className="px-3 py-2 bg-blue-600 text-white"
                            onClick={skipQuestion}
                        >
                            Lewati soal ini
                        </button>
                    )}
                </div>

                <div className="text-center flex items-center justify-center mt-5">
                    <small>
                        Hijau : Dijawab, Merah : Belum dijawab
                    </small>
                </div>
                <div className="text-center flex items-center justify-center mt-1">
                    <div className="flex gap-2">
                        {questions.map((_, index) => {
                            let buttonClass = "bg-red-600 text-white";

                            if (savedAnswers[questions[index].question.id]) {
                                buttonClass = "bg-green-600 text-white";
                            }

                            if (currentQuestionIndex === index) {
                                buttonClass = "bg-blue-600 text-white";
                            }

                            return (
                                <button
                                    key={index}
                                    className={`px-3 py-1 rounded-full border ${buttonClass}`}
                                    onClick={() => handleQuestionClick(index)}
                                >
                                    {index + 1}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="absolute top-5 right-5 bg-white bg-opacity-90 border-2  p-1">
                    <div className="flex flex-wrap">
                        <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/6 xl:w-1/6 text-center p-2">
                            <span className="font-light" style={{fontSize: "14px"}}>Batas Waktu</span>
                            <br/>
                            <strong id="batas_waktu">10 menit</strong>
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
                            <Button type="button" className="cursor-pointer">
                                Selesai Ujian
                            </Button>
                        </div>
                    </div>
                </div>


            </BknLayout>

            <div className="absolute bottom-5 right-5 p-5 text-white shadow-md rounded"
                 style={{backgroundColor: "rgba(0,0,0,0.8)"}}>
                <span style={{fontSize: "25px"}}>{timer}</span>
            </div>
        </div>

    );
}
