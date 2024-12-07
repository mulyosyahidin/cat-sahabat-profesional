import ApplicationLayout from "@/Layouts/ApplicationLayout.jsx";
import {Head, useForm} from "@inertiajs/react";
import BackButton from "@/Components/BackButton.jsx";
import {Heading} from "@/Components/Catalyst/heading.jsx";
import {Table, TableBody, TableCell, TableRow} from "@/Components/Catalyst/table.jsx";
import {Button} from "@/Components/Catalyst/button.jsx";
import {useState} from "react";
import {Dialog, DialogActions, DialogBody, DialogTitle} from "@/Components/Catalyst/dialog.jsx";

export default function AdminFormationPositionQuestionTypeEdit({formation, position, questionType, success}) {
    const {delete: destroy, processing} = useForm();
    const [isDeleteQuestionTypeDialogOpen, setIsDeleteQuestionTypeDialogOpen] = useState(false);

    const handleDeleteQuestionType = () => {
        destroy(route('admin.formation.position.question-types.destroy', [formation.id, position.id, questionType.id]));
    };

    return (
        <>
            <Head title={`${questionType.name} - Jenis Soal`} />
            <ApplicationLayout>
                <div className="max-lg:hidden">
                    <BackButton link={route('admin.formation.positions.show', [formation.id, position.id])}/>
                </div>

                <Heading className={'mt-8'}>Data Jenis Soal</Heading>
                {success && (
                    <div className="mb-4 mt-2 text-sm font-medium text-green-600">
                        {success}
                    </div>
                )}

                <Table className="mt-8 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
                    <TableBody>
                        <TableRow key={1}>
                            <TableCell>Jenis Soal</TableCell>
                            <TableCell>
                                <strong>{questionType.name}</strong>
                            </TableCell>
                        </TableRow>

                        <TableRow key={2}>
                            <TableCell>Jabatan</TableCell>
                            <TableCell>
                                <strong>{position.name}</strong>
                            </TableCell>
                        </TableRow>

                        <TableRow key={3}>
                            <TableCell>Formasi</TableCell>
                            <TableCell>
                                <strong>{formation.name}</strong>
                            </TableCell>
                        </TableRow>

                        <TableRow key={4}>
                            <TableCell>Jumlah Soal</TableCell>
                            <TableCell>
                                <strong>0</strong>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                <div className="flex justify-end gap-1 mt-5">
                    <Button
                        href={route('admin.formation.position.question-types.edit', [formation.id, position.id, questionType.id])}
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
                        onClick={() => setIsDeleteQuestionTypeDialogOpen(true)}
                    >
                        Hapus
                    </Button>
                </div>

            </ApplicationLayout>

            <Dialog open={isDeleteQuestionTypeDialogOpen} onClose={() => setIsDeleteQuestionTypeDialogOpen(false)}>
                <DialogTitle>Hapus Jenis Soal</DialogTitle>
                <DialogBody>
                    <p>
                        Apakah Anda yakin ingin menghapus jenis soal ini? Menghapus jenis soal ini akan menghapus data terkait.
                    </p>
                </DialogBody>
                <DialogActions>
                    <Button
                        plain
                        className="cursor-pointer"
                        onClick={() => setIsDeleteQuestionTypeDialogOpen(false)}
                    >
                        Batal
                    </Button>
                    <Button
                        color="rose"
                        className="cursor-pointer text-red-500"
                        onClick={handleDeleteQuestionType}
                        disabled={processing}
                    >
                        {processing ? 'Menghapus...' : 'Hapus'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
