import ApplicationLayout from "@/Layouts/ApplicationLayout";
import {Head, useForm} from "@inertiajs/react";
import BackButton from "@/Components/BackButton";
import {Heading} from "@/Components/Catalyst/heading";
import {Table, TableBody, TableCell, TableRow} from "@/Components/Catalyst/table";
import {Button} from "@/Components/Catalyst/button";
import {useState} from "react";
import {Dialog, DialogActions, DialogBody, DialogTitle} from "@/Components/Catalyst/dialog";

export default function AdminFormationPositionQuestionTypeEdit({formation, position, questionType, success}) {
    const {delete: destroy, processing} = useForm();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const handleDelete = () => {
        destroy(route('admin.formation.position.question-types.destroy', [formation.id, position.id, questionType.id]));
    };

    return (
        <>
            <Head title={`${questionType.name} - Jenis Soal`} />
            <ApplicationLayout>
                <div>
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
                            <TableCell>Jenis Pembobotan</TableCell>
                            <TableCell>
                                <strong>{questionType.weighting_type}</strong>
                            </TableCell>
                        </TableRow>

                        <TableRow key={3}>
                            <TableCell>Jabatan</TableCell>
                            <TableCell>
                                <strong>{position.name}</strong>
                            </TableCell>
                        </TableRow>

                        <TableRow key={4}>
                            <TableCell>Formasi</TableCell>
                            <TableCell>
                                <strong>{formation.name}</strong>
                            </TableCell>
                        </TableRow>

                        <TableRow key={5}>
                            <TableCell>Jumlah Soal</TableCell>
                            <TableCell>
                                <strong>{questionType.questions.length}</strong>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                <div className="flex justify-end gap-1 mt-5">
                    <Button
                        color={'violet'}
                        href={route('admin.formation.position.question-type.questions.index', [formation.id, position.id, questionType.id])}
                        size="small"
                        className={'cursor-pointer'}
                    >
                        Kelola Soal
                    </Button>
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
                        onClick={() => setIsDeleteDialogOpen(true)}
                    >
                        Hapus
                    </Button>
                </div>

            </ApplicationLayout>

            <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
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
                        onClick={() => setIsDeleteDialogOpen(false)}
                    >
                        Batal
                    </Button>
                    <Button
                        color="rose"
                        className="cursor-pointer text-red-500"
                        onClick={handleDelete}
                        disabled={processing}
                    >
                        {processing ? 'Menghapus...' : 'Hapus'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
