import ApplicationLayout from "@/Layouts/ApplicationLayout";
import {Head, Link, router} from "@inertiajs/react";
import {useCallback, useMemo, useState} from "react";
import {Heading} from "@/Components/Catalyst/heading";
import {Button} from "@/Components/Catalyst/button";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/Components/Catalyst/table";
import {Dialog, DialogActions, DialogBody, DialogTitle} from "@/Components/Catalyst/dialog";
import {EyeIcon, TrashIcon, PencilSquareIcon} from "@heroicons/react/24/outline";

export default function AdminFormationIndex({formations, meta, success}) {
    const [currentPage, setCurrentPage] = useState(meta.current_page);

    const handlePageChange = useCallback((page) => {
        setCurrentPage(page);

        router.get(route('admin.formations.index', {page}), {
            preserveScroll: true,
        });
    }, []);

    const paginationPages = useMemo(() => {
        return [...Array(meta.total_pages).keys()].map(page => ({
            page,
            isCurrent: meta.current_page === page + 1
        }));
    }, [meta])

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const handleOpenDeleteDialog = (id) => {
        setDeleteId(id);
        setIsDeleteDialogOpen(true);
    }

    const handleDelete = () => {
        router.delete(route('admin.formations.destroy', deleteId), {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleteDialogOpen(false);
            },
        });
    }

    return (
        <>
            <Head title={'Kelola Formasi'} />
            <ApplicationLayout>
                <div className="flex items-center justify-between">
                    <div>
                        <Heading>Kelola Formasi</Heading>
                    </div>
                    <Button href={route('admin.formations.create')} className="cursor-pointer">
                        Tambah
                    </Button>
                </div>

                {success && (
                    <div className="mt-2 text-sm font-medium text-green-600">
                        {success}
                    </div>
                )}

                <Table className="mt-8 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
                    <TableHead>
                        <TableRow>
                            <TableHeader>#</TableHeader>
                            <TableHeader>Nama</TableHeader>
                            <TableHeader></TableHeader>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {formations.length === 0 && (
                            <TableRow>
                                <TableCell colSpan="3" className="text-center">Tidak ada data untuk ditampilkan</TableCell>
                            </TableRow>
                        )}

                        {formations.map((formation, index) => {
                            const itemsPerPage = meta.per_page;
                            const startIndex = (meta.current_page - 1) * itemsPerPage;

                            return (
                                <TableRow key={formation.id}>
                                    <TableCell>{startIndex + index + 1}</TableCell>
                                    <TableCell className="text-zinc-500">{formation.name}</TableCell>
                                    <TableCell className="flex justify-end gap-1">
                                        <Button
                                            outline={true}
                                            href={route('admin.formations.show', formation.id)}
                                            size="small"
                                            className="cursor-pointer"
                                        >
                                            <EyeIcon />
                                        </Button>
                                        <Button
                                            outline={true}
                                            href={route('admin.formations.edit', formation.id)}
                                            size="small"
                                            className="cursor-pointer"
                                        >
                                           <PencilSquareIcon />
                                        </Button>
                                        <Button
                                            outline={true}
                                            size="small"
                                            className="cursor-pointer text-red-500"
                                            onClick={() => handleOpenDeleteDialog(formation.id)}
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

            <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
                <DialogTitle>Hapus Formasi</DialogTitle>
                <DialogBody>
                    <p>Apakah Anda yakin ingin menghapus formasi ini? Menghapus formasi juga akan menghapus data lain
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
