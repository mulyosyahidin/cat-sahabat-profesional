import {Head, router} from "@inertiajs/react";
import ApplicationLayout from "@/Layouts/ApplicationLayout.jsx";
import {useCallback, useMemo, useState} from "react";
import {Heading} from "@/Components/Catalyst/heading.jsx";
import {Button} from "@/Components/Catalyst/button.jsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/Components/Catalyst/table.jsx";
import {EyeIcon, PencilSquareIcon, TrashIcon} from "@heroicons/react/24/outline/index.js";
import {
    Pagination,
    PaginationList,
    PaginationNext,
    PaginationPage,
    PaginationPrevious
} from "@/Components/Catalyst/pagination.jsx";
import {Dialog, DialogActions, DialogBody, DialogTitle} from "@/Components/Catalyst/dialog.jsx";

export default function AdminExamIndex({exams, meta, success}) {
    const [currentPage, setCurrentPage] = useState(meta.current_page);

    const handlePageChange = useCallback((page) => {
        setCurrentPage(page);

        router.get(route('admin.exams.index', {page}), {
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
        router.delete(route('admin.exams.destroy', deleteId), {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleteDialogOpen(false);
            },
        });
    }

    return (
        <>
            <Head title={'Kelola Ujian'}/>
            <ApplicationLayout>
                <div className="flex items-center justify-between">
                    <div>
                        <Heading>Kelola Ujian</Heading>
                    </div>
                    <Button href={route('admin.exams.create')} className="cursor-pointer">
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
                            <TableHeader>Formasi</TableHeader>
                            <TableHeader>Token</TableHeader>
                            <TableHeader className={'text-center'}>Jumlah Peserta</TableHeader>
                            <TableHeader></TableHeader>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {exams.length === 0 && (
                            <TableRow>
                                <TableCell colSpan="5" className="text-center">Tidak ada data untuk ditampilkan</TableCell>
                            </TableRow>
                        )}

                        {exams.map((exam, index) => {
                            const itemsPerPage = meta.per_page;
                            const startIndex = (meta.current_page - 1) * itemsPerPage;

                            return (
                                <TableRow key={exam.id}>
                                    <TableCell>{startIndex + index + 1}</TableCell>
                                    <TableCell className="text-zinc-500">{exam.name}</TableCell>
                                    <TableCell className="text-zinc-500">{exam.formation.name}</TableCell>
                                    <TableCell className="text-zinc-500">{exam.token}</TableCell>
                                    <TableCell className="text-zinc-500 text-center">{0}</TableCell>
                                    <TableCell className="flex justify-end gap-1">
                                        <Button
                                            outline={true}
                                            href={route('admin.exams.show', exam.id)}
                                            size="small"
                                            className="cursor-pointer"
                                        >
                                            <EyeIcon />
                                        </Button>
                                        <Button
                                            outline={true}
                                            href={route('admin.exams.edit', exam.id)}
                                            size="small"
                                            className="cursor-pointer"
                                        >
                                            <PencilSquareIcon />
                                        </Button>
                                        <Button
                                            outline={true}
                                            size="small"
                                            className="cursor-pointer text-red-500"
                                            onClick={() => handleOpenDeleteDialog(exam.id)}
                                        >
                                            <TrashIcon />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>

                {meta.total_items > meta.per_page && (
                    <Pagination className="mt-6">
                        <PaginationPrevious
                            href={meta.current_page > 1 ? `?page=${meta.current_page - 1}` : null}
                            onClick={() => handlePageChange(meta.current_page - 1)}
                        />
                        <PaginationList>
                            {paginationPages.map(({page, isCurrent}) => (
                                <PaginationPage
                                    key={page}
                                    href={`?page=${page + 1}`}
                                    current={isCurrent}
                                    onClick={() => handlePageChange(page + 1)}
                                >
                                    {page + 1}
                                </PaginationPage>
                            ))}
                        </PaginationList>
                        <PaginationNext
                            href={meta.current_page < meta.total_pages ? `?page=${meta.current_page + 1}` : null}
                            onClick={() => handlePageChange(meta.current_page + 1)}
                        />
                    </Pagination>
                )}
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
