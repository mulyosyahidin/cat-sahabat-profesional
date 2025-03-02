import {Head, useForm} from "@inertiajs/react";
import ApplicationLayout from "@/Layouts/ApplicationLayout";
import BackButton from "@/Components/BackButton";
import {Heading} from "@/Components/Catalyst/heading";
import {Button} from "@/Components/Catalyst/button";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/Components/Catalyst/table";
import {Dialog, DialogTitle, DialogBody, DialogActions} from "@/Components/Catalyst/dialog";
import {useEffect, useState} from "react";
import {EyeIcon, PencilSquareIcon, TrashIcon} from "@heroicons/react/24/outline/index.js";
import {Input} from "@/Components/Catalyst/input";
import InputError from "@/Components/InputError";
import {formatDate, formatDateTime} from "@/utils/utils.js";

export default function AdminUsersShow({user, success}) {
    const {delete: destroy, processing} = useForm();

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const handleDeleteFormation = () => {
        destroy(route('admin.users.destroy', user.id), {
            onSuccess: () => {
                setIsDeleteDialogOpen(false);
            },
        });
    };

    return (
        <>
            <Head title={user.name}/>
            <ApplicationLayout>
                <div>
                    <BackButton link={route('admin.users.index')}/>
                </div>

                <Heading className={'mt-8'}>Data User</Heading>
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
                                <strong>{user.name}</strong>
                            </TableCell>
                        </TableRow>

                        <TableRow key={2}>
                            <TableCell>Email</TableCell>
                            <TableCell>
                                <strong>{user.email}</strong>
                            </TableCell>
                        </TableRow>

                        <TableRow key={3}>
                            <TableCell>NIK</TableCell>
                            <TableCell>
                                <strong>{user.nik}</strong>
                            </TableCell>
                        </TableRow>

                        <TableRow key={3}>
                            <TableCell>Terdaftar Pada</TableCell>
                            <TableCell>
                                <strong>{formatDateTime(user.created_at)}</strong>
                            </TableCell>
                        </TableRow>

                        <TableRow key={3}>
                            <TableCell>Total Ujian Diikuti</TableCell>
                            <TableCell>
                                <strong>{user.exam_participants_count} Ujian</strong>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                <div className="flex justify-end gap-1 mt-5">
                    <Button
                        href={route('admin.users.edit', user.id)}
                        size="small"
                        outline
                        className={'cursor-pointer'}
                    >
                        Edit
                    </Button>
                    <Button
                        color="rose"
                        size="small"
                        outline
                        className={'cursor-pointer'}
                        onClick={() => setIsDeleteDialogOpen(true)}
                    >
                        Hapus
                    </Button>
                </div>

                <div className="flex justify-between mt-20">
                    <Heading level={3}>Ujian Diikuti</Heading>
                </div>

                <Table className="mt-8 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
                    <TableHead>
                        <TableRow>
                            <TableHeader>#</TableHeader>
                            <TableHeader>Ujian</TableHeader>
                            <TableHeader>Jabatan</TableHeader>
                            <TableHeader>Tanggal</TableHeader>
                            <TableHeader className={'text-center'}>Total Skor</TableHeader>
                            <TableHeader></TableHeader>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {user.exam_participants.length === 0 && (
                            <TableRow>
                                <TableCell colSpan="6" className="text-center">Tidak ada data untuk
                                    ditampilkan</TableCell>
                            </TableRow>
                        )}

                        {user.exam_participants.map((exam_participant, index) => {
                            // const questionCount = position.question_types.reduce((total, questionType) =>
                            //     total + questionType.questions.length, 0);

                            return (
                                <TableRow key={exam_participant.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell className="text-zinc-500">
                                        {exam_participant.exam.name}
                                        <br/>
                                        <small>Token: {exam_participant.exam.token}</small>
                                    </TableCell>
                                    <TableCell className="text-zinc-500">{exam_participant.position.name}</TableCell>
                                    <TableCell className="text-zinc-500">{formatDate(exam_participant.session.created_at)}</TableCell>
                                    <TableCell className="text-zinc-500 text-center">{exam_participant.session.total_score}</TableCell>
                                    <TableCell className="flex justify-end gap-1">
                                        <Button
                                            outline={true}
                                            href={route('admin.exams.participants.show', [exam_participant.exam.id, exam_participant.id])}
                                            size="small"
                                            className="cursor-pointer"
                                        >
                                            <EyeIcon/>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>

            </ApplicationLayout>

            <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
                <DialogTitle>Hapus User</DialogTitle>
                <DialogBody>
                    <p>
                        Apakah Anda yakin ingin menghapus user ini? Menghapus user ini akan menghapus data
                        terkait.
                    </p>
                </DialogBody>
                <DialogActions>
                    <Button
                        plain
                        className="cursor-pointer"
                        onClick={() => setIsDeleteDialogOpen(false)}
                    >
                        Batal
                    </Button>
                    <Button
                        color="rose"
                        className="cursor-pointer text-red-500"
                        onClick={handleDeleteFormation}
                        disabled={processing}
                    >
                        {processing ? 'Menghapus...' : 'Hapus'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
