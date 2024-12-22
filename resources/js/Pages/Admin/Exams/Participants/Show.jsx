import {Head, useForm} from "@inertiajs/react";
import ApplicationLayout from "@/Layouts/ApplicationLayout";
import BackButton from "@/Components/BackButton";
import {Heading} from "@/Components/Catalyst/heading";
import {Button} from "@/Components/Catalyst/button";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/Components/Catalyst/table";
import {Dialog, DialogTitle, DialogBody, DialogActions} from "@/Components/Catalyst/dialog";
import {useEffect, useState} from "react";
import {EyeIcon, PencilSquareIcon, TrashIcon} from "@heroicons/react/24/outline/index.js";
import NextButton from "@/Components/NextButton";
import {formatDateTime, timeLeft} from "@/utils/utils.js";

export default function AdminParticipantShow({
                                                 exam,
                                                 examParticipant,
                                                 participantProfile,
                                                 typeScores,
                                                 questionAnswers,
                                                 success
                                             }) {
    const [remainingTime, setRemainingTime] = useState(
        timeLeft(examParticipant.session.started_at, examParticipant.session.maximum_duration)
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setRemainingTime(
                timeLeft(examParticipant.session.started_at, examParticipant.session.maximum_duration)
            )
        }, 1000);

        return () => clearInterval(interval);
    }, [examParticipant.session.started_at, examParticipant.session.maximum_duration]);

    return (
        <>
            <Head title={'Data Peserta Ujian'}/>
            <ApplicationLayout>
                <div>
                    <BackButton link={route('admin.exams.participants.index', exam.id)}/>
                </div>

                <Heading className={'mt-8'}>Data Peserta Ujian</Heading>
                {success && (
                    <div className="mb-4 mt-2 text-sm font-medium text-green-600">
                        {success}
                    </div>
                )}

                {
                    examParticipant.session.status == 'active' && (
                        <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4 mt-5">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor"
                                         aria-hidden="true">
                                        <path fill-rule="evenodd"
                                              d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                                              clip-rule="evenodd"/>
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-yellow-700">
                                        Peserta sedang mengerjakan ujian. Data akan tersedia setelah peserta menyelesaikan ujian.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )
                }

                {
                    examParticipant.session.status == 'finished' && (

                        <div className="rounded-md bg-green-50 p-4 mt-5">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor"
                                         aria-hidden="true">
                                        <path fill-rule="evenodd"
                                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                              clip-rule="evenodd"/>
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-green-800">
                                        Peserta telah menyelesaikan ujian
                                    </p>
                                </div>
                            </div>
                        </div>

                    )
                }

                <Table className="mt-8 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
                    <TableBody>
                        <TableRow key={1}>
                            <TableCell>Nama</TableCell>
                            <TableCell>
                                <strong>{examParticipant.user.name}</strong>
                            </TableCell>
                        </TableRow>

                        <TableRow key={2}>
                            <TableCell>NIK</TableCell>
                            <TableCell>
                                <strong>{examParticipant.user.nik}</strong>
                            </TableCell>
                        </TableRow>

                        {
                            participantProfile && (
                                <>
                                    <TableRow key={3}>
                                        <TableCell>No. HP</TableCell>
                                        <TableCell>
                                            <strong>{participantProfile.phone_number}</strong>
                                        </TableCell>
                                    </TableRow>

                                    <TableRow key={4}>
                                        <TableCell>Alamat</TableCell>
                                        <TableCell>
                                            <strong>{participantProfile.address}</strong>
                                        </TableCell>
                                    </TableRow>
                                </>
                            )
                        }

                        <TableRow key={5}>
                            <TableCell>Jabatan Dilamar</TableCell>
                            <TableCell>
                                <strong>{examParticipant.position.name}</strong>
                            </TableCell>
                        </TableRow>

                        {
                            examParticipant.session.status == 'finished' && (
                                <>
                                    <TableRow key={6}>
                                        <TableCell>Total Skor</TableCell>
                                        <TableCell>
                                            <strong>{examParticipant.session.total_score}</strong>
                                        </TableCell>
                                    </TableRow>

                                    <TableRow key={7}>
                                        <TableCell>Soal Tidak Dijawab</TableCell>
                                        <TableCell>
                                            <strong>{examParticipant.session.unanswered_questions_count}</strong>
                                        </TableCell>
                                    </TableRow>

                                    <TableRow key={8}>
                                        <TableCell>Soal Dijawab</TableCell>
                                        <TableCell>
                                            <strong>
                                                {examParticipant.session.answered_questions_count}
                                                {' '}
                                                ({examParticipant.session.answered_question_percent}%)
                                            </strong>
                                        </TableCell>
                                    </TableRow>

                                    <TableRow key={9}>
                                        <TableCell>Soal Dijawab Salah</TableCell>
                                        <TableCell>
                                            <strong>{examParticipant.session.wrong_answer_count}</strong>
                                        </TableCell>
                                    </TableRow>

                                    <TableRow key={10}>
                                        <TableCell>Soal Dijawab Benar</TableCell>
                                        <TableCell>
                                            <strong>{examParticipant.session.correct_answer_count} ({examParticipant.session.correct_answer_percent}%)</strong>
                                        </TableCell>
                                    </TableRow>

                                    <TableRow key={11}>
                                        <TableCell>Waktu Pengerjaan</TableCell>
                                        <TableCell>
                                            <strong>{examParticipant.session.total_processing_time} menit</strong>
                                        </TableCell>
                                    </TableRow>
                                </>
                            )
                        }

                        <TableRow key={12}>
                            <TableCell>Waktu Mulai</TableCell>
                            <TableCell>
                                <strong>{formatDateTime(examParticipant.session.started_at)}</strong>
                            </TableCell>
                        </TableRow>

                        {examParticipant.session.status == 'finished' && (
                            <>
                                <TableRow key={15}>
                                    <TableCell>Waktu Selesai</TableCell>
                                    <TableCell>
                                        <strong>{formatDateTime(examParticipant.session.finished_at)}</strong>
                                    </TableCell>
                                </TableRow>

                                <TableRow key={15}>
                                    <TableCell>Diselesaikan Oleh</TableCell>
                                    <TableCell>
                                        <strong>{examParticipant.session.finished_by}</strong>
                                    </TableCell>
                                </TableRow>
                            </>
                        )}

                        {examParticipant.session.status == 'active' && (
                            <>
                                <TableRow key={13}>
                                    <TableCell>Batas Waktu Pengerjaan</TableCell>
                                    <TableCell>
                                        <strong>{examParticipant.session.maximum_duration} menit</strong>
                                    </TableCell>
                                </TableRow>

                                <TableRow key={15}>
                                    <TableCell>Batas Waktu Sampai</TableCell>
                                    <TableCell>
                                        <strong>{formatDateTime(examParticipant.session.maximum_duration_end_at)}</strong>
                                    </TableCell>
                                </TableRow>

                                <TableRow key={14}>
                                    <TableCell>Sisa Waktu</TableCell>
                                    <TableCell>
                                        <strong>{remainingTime}</strong>
                                    </TableCell>
                                </TableRow>

                                <TableRow key={16}>
                                    <TableCell>Progress Pengerjaan</TableCell>
                                    <TableCell>
                                        {
                                            examParticipant.session.total_questions > 0 && (
                                                <strong>{examParticipant.session.current_answered_questions} / {examParticipant.session.total_questions} Soal</strong>
                                            )
                                        }

                                        {
                                            examParticipant.session.total_questions == 0 && (
                                                <strong>Tidak ada data</strong>
                                            )
                                        }
                                    </TableCell>
                                </TableRow>
                            </>
                        )}
                    </TableBody>
                </Table>

                <div className="mt-20">
                    <div className="flex justify-between">
                        <Heading level={3}>Skor Per Jenis Pertanyaan</Heading>

                        {
                            examParticipant.session.status == 'finished' && (
                                <NextButton
                                    link={route('admin.exams.participants.question-answers', [exam.id, examParticipant.id])}
                                    text={'Jawaban Soal'}/>
                            )}
                    </div>

                    <Table className="mt-8 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
                        <TableHead>
                            <TableRow>
                                <TableHeader>#</TableHeader>
                                <TableHeader>Jenis Pertanyaan</TableHeader>
                                <TableHeader className={'text-center'}>Skor</TableHeader>
                                <TableHeader className={'text-center'}>Soal Dikerjakan</TableHeader>
                                <TableHeader className={'text-center'}>Total Jawaban Salah</TableHeader>
                                <TableHeader className={'text-center'}>Total Jawaban Benar</TableHeader>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                typeScores.length == 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center">Tidak ada data untuk
                                            ditampilkan</TableCell>
                                    </TableRow>
                                )
                            }
                            {typeScores.map((item, index) => {
                                return (
                                    <TableRow key={item.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell className="text-zinc-500">{item.question_type.name}</TableCell>
                                        <TableCell className="text-zinc-500 text-center">{item.score}</TableCell>
                                        <TableCell
                                            className="text-zinc-500 text-center">{item.wrong_answer_count + item.correct_answer_count}</TableCell>
                                        <TableCell
                                            className="text-zinc-500 text-center">{item.wrong_answer_count}</TableCell>
                                        <TableCell
                                            className="text-zinc-500 text-center">{item.correct_answer_count}</TableCell>

                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </ApplicationLayout>
        </>
    );
}
