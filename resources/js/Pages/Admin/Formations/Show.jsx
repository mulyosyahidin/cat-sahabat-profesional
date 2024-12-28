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

export default function AdminPositionShow({formation, success, error, errorMessages, total_questions}) {
    const {data, setData, post, delete: destroy, processing, errors, reset} = useForm({
        file: null,
        clear_data: false,
    });

    const [isDeleteFormationDialogOpen, setIsDeleteFormationDialogOpen] = useState(false);
    const [isDeletePositionDialogOpen, setIsDeletePositionDialogOpen] = useState(false);
    const [selectedPosition, setSelectedPosition] = useState(null);

    const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

    const handleDeleteFormation = () => {
        destroy(route('admin.formations.destroy', formation.id), {
            onSuccess: () => {
                setIsDeleteFormationDialogOpen(false);
            },
        });
    };

    const handleDeletePosition = () => {
        if (selectedPosition) {
            destroy(route('admin.positions.destroy', selectedPosition.id), {
                onSuccess: () => {
                    setIsDeletePositionDialogOpen(false);
                },
            });
        }
    };

    const handleImportFile = () => {
        post(route('admin.formations.question-import', formation.id), {
            preserveScroll: true,
            onSuccess: () => {
                setIsImportDialogOpen(false);
            },
        });
    }

    const handleDeletePositionDialogOpen = (position) => {
        setSelectedPosition(position);
        setIsDeletePositionDialogOpen(true);
    };

    return (
        <>
            <Head title={formation.name}/>
            <ApplicationLayout>
                <div>
                    <BackButton link={route('admin.formations.index')}/>
                </div>

                <Heading className={'mt-8'}>Data Formasi</Heading>
                {success && (
                    <div className="mb-4 mt-2 text-sm font-medium text-green-600">
                        {success}
                    </div>
                )}

                {errorMessages &&
                    errorMessages.map((message, index) => (
                        <div key={index} className="mb-4 mt-2 text-sm font-medium text-red-600">
                            {message}
                        </div>
                    ))
                }

                {error && (
                    <div className="mb-4 mt-2 text-sm font-medium text-red-600">
                        {error}
                    </div>
                )}

                <Table className="mt-8 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
                    <TableBody>
                        <TableRow key={1}>
                            <TableCell>Formasi</TableCell>
                            <TableCell>
                                <strong>{formation.name}</strong>
                            </TableCell>
                        </TableRow>

                        <TableRow key={2}>
                            <TableCell>Jumlah Jabatan</TableCell>
                            <TableCell>
                                <strong>{formation.positions.length} Jabatan</strong>
                            </TableCell>
                        </TableRow>

                        <TableRow key={3}>
                            <TableCell>Total Soal</TableCell>
                            <TableCell>
                                <strong>{total_questions}</strong>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                <div className="flex justify-end gap-1 mt-5">
                    <Button
                        size="small"
                        outline
                        className={'cursor-pointer'}
                        onClick={() => setIsImportDialogOpen(true)}
                    >
                        Import Soal
                    </Button>
                    <Button
                        href={route('admin.formations.edit', formation.id)}
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
                        onClick={() => setIsDeleteFormationDialogOpen(true)}
                    >
                        Hapus
                    </Button>
                </div>

                <div className="flex justify-between mt-20">
                    <Heading level={3}>Jabatan</Heading>

                    <Button className="cursor-pointer"
                            href={route('admin.positions.create', {formation_id: formation.id})}>
                        Tambah
                    </Button>
                </div>

                <Table className="mt-8 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
                    <TableHead>
                        <TableRow>
                            <TableHeader>#</TableHeader>
                            <TableHeader>Nama</TableHeader>
                            <TableHeader>Durasi Ujian Maksimal</TableHeader>
                            <TableHeader className={'text-center'}>Jumlah Soal</TableHeader>
                            <TableHeader></TableHeader>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {formation.positions.length === 0 && (
                            <TableRow>
                                <TableCell colSpan="5" className="text-center">Tidak ada data untuk
                                    ditampilkan</TableCell>
                            </TableRow>
                        )}

                        {formation.positions.map((position, index) => {
                            const questionCount = position.question_types.reduce((total, questionType) =>
                                total + questionType.questions.length, 0);

                            return (
                                <TableRow key={position.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell className="text-zinc-500">{position.name}</TableCell>
                                    <TableCell className="text-zinc-500">
                                        {position.maximum_test_duration_in_minutes} menit
                                    </TableCell>
                                    <TableCell className="text-zinc-500 text-center">{questionCount}</TableCell>
                                    <TableCell className="flex justify-end gap-1">
                                        <Button
                                            outline={true}
                                            href={route('admin.positions.show', position.id)}
                                            size="small"
                                            className="cursor-pointer"
                                        >
                                            <EyeIcon/>
                                        </Button>
                                        <Button
                                            outline={true}
                                            href={route('admin.positions.edit', position.id)}
                                            size="small"
                                            className="cursor-pointer"
                                        >
                                            <PencilSquareIcon/>
                                        </Button>
                                        <Button
                                            outline={true}
                                            size="small"
                                            className="cursor-pointer text-red-500"
                                            onClick={() => handleDeletePositionDialogOpen(position)}
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

            <Dialog open={isDeleteFormationDialogOpen} onClose={() => setIsDeleteFormationDialogOpen(false)}>
                <DialogTitle>Hapus Formasi</DialogTitle>
                <DialogBody>
                    <p>
                        Apakah Anda yakin ingin menghapus formasi ini? Menghapus formasi ini akan menghapus data
                        terkait.
                    </p>
                </DialogBody>
                <DialogActions>
                    <Button
                        plain
                        className="cursor-pointer"
                        onClick={() => setIsDeleteFormationDialogOpen(false)}
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

            <Dialog open={isDeletePositionDialogOpen} onClose={() => setIsDeletePositionDialogOpen(false)}>
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
                        onClick={() => setIsDeletePositionDialogOpen(false)}
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

            <Dialog open={isImportDialogOpen} onClose={() => setIsImportDialogOpen(false)}>
                <DialogTitle>Import Soal</DialogTitle>
                <DialogBody>
                    <p>
                        Pastikan semua kolom yang dibutuhkan tidak kosong dan ubah nilai menjadi <b>actual value</b>.
                    </p>

                    <section className="mb-5 mt-5">
                        <Input type="file" name="file" onChange={(e) => setData('file', e.target.files[0])}/>

                        {errors.file ? (
                            <InputError message={errors.file} className="mt-2"/>
                        ) : (
                            <small className="text-zinc-500">
                                Download template import soal <a href="/assets/files/template_import_soal.xlsx"
                                                                 className={'text-blue-500'}>disini</a>.
                            </small>
                        )}
                    </section>

                    <section className="mb-3">
                        <input
                            type="checkbox"
                            id="clear_data"
                            name="clear_data"
                            className="h-5 w-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                            onChange={(e) => setData('clear_data', e.target.checked)}
                        />
                        <label htmlFor="clear_data" className="ml-2 text-sm font-medium text-gray-700 cursor-pointer">
                            Hapus data soal sebelumnya
                        </label>
                    </section>

                </DialogBody>
                <DialogActions>
                    {
                        !processing && (
                            <Button
                                plain
                                className="cursor-pointer"
                                onClick={() => setIsImportDialogOpen(false)}
                            >
                                Batal
                            </Button>
                        )
                    }
                    <Button
                        className="cursor-pointer"
                        onClick={handleImportFile}
                        disabled={processing}
                    >
                    {processing ? 'Mengimport...' : 'Import'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
