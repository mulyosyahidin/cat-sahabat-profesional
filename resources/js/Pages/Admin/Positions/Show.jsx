import {Head, useForm} from "@inertiajs/react";
import ApplicationLayout from "@/Layouts/ApplicationLayout";
import BackButton from "@/Components/BackButton";
import {Heading} from "@/Components/Catalyst/heading";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/Components/Catalyst/table";
import {Button} from "@/Components/Catalyst/button";
import {useState} from "react";
import {Dialog, DialogActions, DialogBody, DialogTitle} from "@/Components/Catalyst/dialog";
import {EyeIcon, PencilSquareIcon, TrashIcon} from "@heroicons/react/24/outline/index.js";
import {WEIGHTING_TYPES} from "@/utils/utils.js";

export default function AdminPositionShow({position, success}) {
    const {delete: destroy, processing} = useForm();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const [isDeleteQuestionTypeDialogOpen, setIsDeleteQuestionTypeDialogOpen] = useState(false);
    const [selectedQuestionType, setSelectedQuestionType] = useState(null);

    const handleDeletePosition = () => {
        destroy(route('admin.positions.destroy', position.id));
    };

    const handleDeleteQuestionType = () => {
        if (selectedQuestionType) {
            destroy(route('admin.question-types.destroy', selectedQuestionType.id), {
                onSuccess: () => {
                    setIsDeleteQuestionTypeDialogOpen(false);
                },
            });
        }
    };

    const handleDeleteQuestionTypeDialogOpen = (position) => {
        setSelectedQuestionType(position);
        setIsDeleteQuestionTypeDialogOpen(true);
    };

    return (
        <>
            <Head title={position.name}/>
            <ApplicationLayout>
                <div>
                    <BackButton link={route('admin.formations.show', position.formation_id)}/>
                </div>

                <Heading className={'mt-8'}>Data Jabatan</Heading>
                {success && (
                    <div className="mb-4 mt-2 text-sm font-medium text-green-600">
                        {success}
                    </div>
                )}

                <Table className="mt-8 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
                    <TableBody>
                        <TableRow key={1}>
                            <TableCell>Jabatan</TableCell>
                            <TableCell>
                                <strong>{position.name}</strong>
                            </TableCell>
                        </TableRow>

                        <TableRow key={2}>
                            <TableCell>Formasi</TableCell>
                            <TableCell>
                                <strong>{position.formation.name}</strong>
                            </TableCell>
                        </TableRow>

                        <TableRow key={3}>
                            <TableCell>Maksimum Durasi Ujian</TableCell>
                            <TableCell>
                                <strong>{position.maximum_test_duration_in_minutes} menit</strong>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                <div className="flex justify-end gap-1 mt-5">
                    <Button
                        href={route('admin.positions.edit', position.id)}
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
                    <Heading level={3}>Jenis Soal</Heading>

                    <Button className="cursor-pointer"
                            href={route('admin.question-types.create', {position_id: position.id})}>
                        Tambah
                    </Button>
                </div>

                <Table className="mt-8 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
                    <TableHead>
                        <TableRow>
                            <TableHeader>#</TableHeader>
                            <TableHeader>Nama</TableHeader>
                            <TableHeader className={'text-center'}>Urutan Ditampilkan</TableHeader>
                            <TableHeader>Jenis Pembobotan</TableHeader>
                            <TableHeader></TableHeader>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {position.question_types.length === 0 && (
                            <TableRow>
                                <TableCell colSpan="6" className="text-center">Tidak ada data untuk
                                    ditampilkan</TableCell>
                            </TableRow>
                        )}

                        {position.question_types
                            .sort((a, b) => a.display_order - b.display_order)
                            .map((item, index) => {

                                return (
                                    <TableRow key={item.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell className="text-zinc-500">{item.name}</TableCell>
                                        <TableCell
                                            className="text-zinc-500 text-center">{item.display_order}</TableCell>
                                        <TableCell className="text-zinc-500">{WEIGHTING_TYPES[item.weighting_type]}</TableCell>
                                        <TableCell className="flex justify-end gap-1">
                                            <Button
                                                outline={true}
                                                href={route('admin.question-types.show', item.id)}
                                                size="small"
                                                className="cursor-pointer"
                                            >
                                                <EyeIcon/>
                                            </Button>
                                            <Button
                                                outline={true}
                                                href={route('admin.question-types.edit', item.id)}
                                                size="small"
                                                className="cursor-pointer"
                                            >
                                                <PencilSquareIcon/>
                                            </Button>
                                            <Button
                                                outline={true}
                                                size="small"
                                                className="cursor-pointer text-red-500"
                                                onClick={() => handleDeleteQuestionTypeDialogOpen(item)}
                                            >
                                                <TrashIcon/>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </ApplicationLayout>

            <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
                <DialogTitle>Hapus Jabatan</DialogTitle>
                <DialogBody>
                    <p>
                        Apakah Anda yakin ingin menghapus jabatan ini? Menghapus jabatan ini akan menghapus data
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
                        onClick={handleDeletePosition}
                        disabled={processing}
                    >
                        {processing ? 'Menghapus...' : 'Hapus'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isDeleteQuestionTypeDialogOpen} onClose={() => setIsDeleteQuestionTypeDialogOpen(false)}>
                <DialogTitle>Hapus Jenis Soal</DialogTitle>
                <DialogBody>
                    <p>
                        Apakah Anda yakin ingin menghapus jenis soal ini? Menghapus jenis soal ini akan menghapus data
                        terkait.
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
