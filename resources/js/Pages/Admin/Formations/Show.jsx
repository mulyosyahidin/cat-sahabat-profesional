import {Head, useForm} from "@inertiajs/react";
import ApplicationLayout from "@/Layouts/ApplicationLayout";
import BackButton from "@/Components/BackButton";
import {Heading} from "@/Components/Catalyst/heading";
import {Button} from "@/Components/Catalyst/button";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/Components/Catalyst/table";
import {Dialog, DialogTitle, DialogBody, DialogActions} from "@/Components/Catalyst/dialog";
import {useEffect, useState} from "react";
import {EyeIcon, PencilSquareIcon, TrashIcon} from "@heroicons/react/24/outline/index.js";

export default function AdminPositionShow({formation, success}) {
    const {delete: destroy, processing} = useForm();
    const [isDeleteFormationDialogOpen, setIsDeleteFormationDialogOpen] = useState(false);
    const [isDeletePositionDialogOpen, setIsDeletePositionDialogOpen] = useState(false);
    const [selectedPosition, setSelectedPosition] = useState(null);

    const handleDeleteFormation = () => {
        destroy(route('admin.formations.destroy', formation.id), {
            onSuccess: () => {
                setIsDeleteFormationDialogOpen(false);
            },
        });
    };

    const handleDeletePosition = () => {
        if (selectedPosition) {
            destroy(route('admin.formation.positions.destroy', [formation.id, selectedPosition.id]), {
                onSuccess: () => {
                    setIsDeletePositionDialogOpen(false);
                },
            });
        }
    };

    const handleDeletePositionDialogOpen = (position) => {
        setSelectedPosition(position);
        setIsDeletePositionDialogOpen(true);
    };

    return (
        <>
            <Head title={formation.name}/>
            <ApplicationLayout>
                <div className="max-lg:hidden">
                    <BackButton link={route('admin.formations.index')}/>
                </div>

                <Heading className={'mt-8'}>Data Formasi</Heading>
                {success && (
                    <div className="mb-4 mt-2 text-sm font-medium text-green-600">
                        {success}
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
                                <strong>{formation.positions_count}</strong>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                <div className="flex justify-end gap-1 mt-5">
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

                    <Button className="cursor-pointer" href={route('admin.formation.positions.create', formation.id)}>
                        Tambah
                    </Button>
                </div>

                <Table className="mt-8 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
                    <TableHead>
                        <TableRow>
                            <TableHeader>#</TableHeader>
                            <TableHeader>Nama</TableHeader>
                            <TableHeader>Durasi Ujian Maksimal</TableHeader>
                            <TableHeader></TableHeader>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {formation.positions.length === 0 && (
                            <TableRow>
                                <TableCell colSpan="4" className="text-center">Tidak ada data untuk ditampilkan</TableCell>
                            </TableRow>
                        )}

                        {formation.positions.map((position, index) => {
                            return (
                                <TableRow key={position.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell className="text-zinc-500">{position.name}</TableCell>
                                    <TableCell className="text-zinc-500">{position.maximum_test_duration_in_minutes} menit</TableCell>
                                    <TableCell className="flex justify-end gap-1">
                                        <Button
                                            outline={true}
                                            href={route('admin.formation.positions.show', [formation.id, position.id])}
                                            size="small"
                                            className="cursor-pointer"
                                        >
                                            <EyeIcon />
                                        </Button>
                                        <Button
                                            outline={true}
                                            href={route('admin.formation.positions.edit', [formation.id, position.id])}
                                            size="small"
                                            className="cursor-pointer"
                                        >
                                            <PencilSquareIcon />
                                        </Button>
                                        <Button
                                            outline={true}
                                            size="small"
                                            className="cursor-pointer text-red-500"
                                            onClick={() => handleDeletePositionDialogOpen(position)}
                                        >
                                            <TrashIcon />
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
                        Apakah Anda yakin ingin menghapus formasi ini? Menghapus formasi ini akan menghapus data terkait.
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
                        Apakah Anda yakin ingin menghapus jabatan ini? Menghapus jabatan ini akan menghapus data terkait.
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
        </>
    );
}
