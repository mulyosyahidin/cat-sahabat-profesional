import {Head, useForm} from "@inertiajs/react";
import ApplicationLayout from "@/Layouts/ApplicationLayout";
import BackButton from "@/Components/BackButton";
import {Heading} from "@/Components/Catalyst/heading";
import {Table, TableBody, TableCell, TableRow} from "@/Components/Catalyst/table";
import {Button} from "@/Components/Catalyst/button";
import {useState} from "react";
import {Dialog, DialogActions, DialogBody, DialogTitle} from "@/Components/Catalyst/dialog";
import {formatDate} from "@/utils/utils.js";

export default function AdminExamShow({exam, success}) {
    const {delete: destroy, processing} = useForm();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const handleDelete = () => {
        destroy(route('admin.exams.destroy', exam.id), {
            onSuccess: () => {
                setIsDeleteDialogOpen(false);
            },
        });
    };

    const downloadExamResults = (examId) => {
        axios.get(route('admin.exams.download-exam-results', examId))
            .then(response => {
                window.location.href = response.data.download_url;
            })
            .catch(error => {
                console.error("Error saat mengunduh file:", error);
            });
    };

    return (
        <>
            <Head title={'Data Ujian'} />
            <ApplicationLayout>
                <BackButton link={route('admin.exams.index')}/>

                <Heading className={'mt-8'}>Data Ujian</Heading>
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
                                <strong>{exam.name}</strong>
                            </TableCell>
                        </TableRow>

                        <TableRow key={2}>
                            <TableCell>Token</TableCell>
                            <TableCell>
                                <strong>{exam.token}</strong>
                            </TableCell>
                        </TableRow>

                        <TableRow key={3}>
                            <TableCell>Formasi</TableCell>
                            <TableCell>
                                <strong>{exam.formation.name}</strong>
                            </TableCell>
                        </TableRow>

                        <TableRow key={3}>
                            <TableCell>Tanggal</TableCell>
                            <TableCell>
                                <strong>{formatDate(exam.date)}</strong>
                            </TableCell>
                        </TableRow>

                        <TableRow key={3}>
                            <TableCell>Jumlah Peserta</TableCell>
                            <TableCell>
                                <strong>{exam.participants_count} Peserta</strong>
                            </TableCell>
                        </TableRow>

                        <TableRow key={6}>
                            <TableCell>Keterangan</TableCell>
                            <TableCell>
                                <strong>{exam.description}</strong>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                <div className="flex justify-end gap-1 mt-5">
                    <Button
                        onClick={() => downloadExamResults(exam.id)}
                        size="small"
                        outline
                        className={'cursor-pointer'}
                    >
                        Download Nilai
                    </Button>
                    <Button
                        href={route('admin.exams.participants.index', exam.id)}
                        size="small"
                        outline
                        className={'cursor-pointer'}
                    >
                        Peserta Ujian
                    </Button>
                    <Button
                        href={route('admin.exams.edit', exam.id)}
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
            </ApplicationLayout>

            <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
                <DialogTitle>Hapus Ujian</DialogTitle>
                <DialogBody>
                    <p>Apakah Anda yakin ingin menghapus ujian ini? Menghapus ujian juga akan menghapus data lain
                        yang terkait.</p>
                </DialogBody>
                <DialogActions>
                    <Button plain className="cursor-pointer" onClick={() => setIsDeleteDialogOpen(false)}>
                        Batal
                    </Button>
                    <Button
                        color={'rose'}
                        className="cursor-pointer text-red-500"
                        onClick={handleDelete}
                    >
                        Hapus
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
