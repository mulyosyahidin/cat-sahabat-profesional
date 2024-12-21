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

export default function AdminParticipantShow({exam, examParticipant, participantProfile, typeScores, questionAnswers, success}) {
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

                        {/*<TableRow key={2}>*/}
                        {/*    <TableCell>Email</TableCell>*/}
                        {/*    <TableCell>*/}
                        {/*        <strong>{examParticipant.user.email}</strong>*/}
                        {/*    </TableCell>*/}
                        {/*</TableRow>*/}

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
                    </TableBody>
                </Table>

                <div className="mt-20">
                    <div className="flex justify-between">
                        <Heading level={3}>Skor Per Jenis Pertanyaan</Heading>

                        <NextButton link={route('admin.exams.participants.question-answers', [exam.id, examParticipant.id])} text={'Jawaban Soal'} />
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
                            {typeScores.map((item, index) => {
                                return (
                                    <TableRow key={item.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell className="text-zinc-500">{item.question_type.name}</TableCell>
                                        <TableCell className="text-zinc-500 text-center">{item.score}</TableCell>
                                        <TableCell className="text-zinc-500 text-center">{item.wrong_answer_count + item.correct_answer_count}</TableCell>
                                        <TableCell className="text-zinc-500 text-center">{item.wrong_answer_count}</TableCell>
                                        <TableCell className="text-zinc-500 text-center">{item.correct_answer_count}</TableCell>

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
