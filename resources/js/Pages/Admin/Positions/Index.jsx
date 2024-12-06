import {Head, router, useForm} from "@inertiajs/react";
import ApplicationLayout from "@/Layouts/ApplicationLayout";
import {Heading} from "@/Components/Catalyst/heading";
import {Button} from "@/Components/Catalyst/button";
import {useEffect, useState, useMemo, useCallback} from "react";
import {Dialog, DialogActions, DialogBody, DialogTitle} from "@/Components/Catalyst/dialog";
import {Field, Label} from "@/Components/Catalyst/fieldset";
import {Input} from "@/Components/Catalyst/input";
import InputError from "@/Components/InputError";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/Components/Catalyst/table";
import {
    Pagination,
    PaginationList,
    PaginationNext,
    PaginationPage,
    PaginationPrevious
} from "@/Components/Catalyst/pagination";
import {HomeIcon} from "@heroicons/react/20/solid";

export default function AdminPositionsIndex({positions, meta, success}) {
    const [currentPage, setCurrentPage] = useState(meta.current_page);
    const [isAddPositionDialogOpen, setIsAddPositionDialogOpen] = useState(false);
    const [isEditPositionDialogOpen, setIsEditPositionDialogOpen] = useState(false);
    const [isAddPositionSubmitted, setIsAddPositionSubmitted] = useState(false);
    const [isEditPositionSubmitted, setIsEditPositionSubmitted] = useState(false);
    const [editPositionId, setEditPositionId] = useState(null);
    const [isDeletePositionDialogOpen, setIsDeletePositionDialogOpen] = useState(false);
    const [deletePositionId, setDeletePositionId] = useState(null);

    const {data, setData, post, patch, processing, errors, reset} = useForm({
        name: '',
    });

    const handlePageChange = useCallback((page) => {
        setCurrentPage(page);
        router.get(route('admin.positions.index', {page}), {
            preserveScroll: true,
        });
    }, []);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const closeAddPositionDialog = () => {
        setIsAddPositionDialogOpen(false);
        setIsAddPositionSubmitted(false);
        reset();
    };

    const closeEditPositionDialog = () => {
        setIsEditPositionDialogOpen(false);
        setIsEditPositionSubmitted(false);
        reset();
    };

    const addPosition = (e) => {
        e.preventDefault();
        setIsAddPositionSubmitted(true);

        post(route('admin.positions.store'), {
            preserveScroll: true,
            onSuccess: () => {
                closeAddPositionDialog();
            },
            onError: () => {
                setIsAddPositionSubmitted(false);
            },
        });
    };

    const openEditPositionDialog = (position) => {
        setEditPositionId(position.id);
        setData({name: position.name});
        setIsEditPositionDialogOpen(true);
    };

    const editPosition = (e) => {
        e.preventDefault();
        setIsEditPositionSubmitted(true);

        patch(route('admin.positions.update', editPositionId), {
            preserveScroll: true,
            onSuccess: () => {
                closeEditPositionDialog();
            },
            onError: () => {
                setIsEditPositionSubmitted(false);
            },
        });
    };

    const handleOpenDeleteDialog = (id) => {
        setDeletePositionId(id);
        setIsDeletePositionDialogOpen(true);
    };

    const handleDelete = () => {
        router.delete(route('admin.positions.destroy', deletePositionId), {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeletePositionDialogOpen(false);
            },
        });
    };

    const paginationPages = useMemo(() => {
        return [...Array(meta.total_pages).keys()].map(page => ({
            page,
            isCurrent: meta.current_page === page + 1
        }));
    }, [meta]);

    return (
        <>
            <Head title="Kelola Jabatan"/>
            <ApplicationLayout>
                <div className="flex items-center justify-between">
                    <div>
                        <Heading>Kelola Jabatan</Heading>
                    </div>
                    <Button className="cursor-pointer" onClick={() => setIsAddPositionDialogOpen(true)}>
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
                            <TableHeader>Jabatan</TableHeader>
                            <TableHeader></TableHeader>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {positions.map((position, index) => {
                            const itemsPerPage = meta.per_page;
                            const startIndex = (meta.current_page - 1) * itemsPerPage;

                            return (
                                <TableRow key={position.id}>
                                    <TableCell>{startIndex + index + 1}</TableCell>
                                    <TableCell className="text-zinc-500">{position.name}</TableCell>
                                    <TableCell className="flex justify-end gap-1">
                                        <Button
                                            size="small"
                                            className="cursor-pointer"
                                            onClick={() => openEditPositionDialog(position)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            size="small"
                                            className="cursor-pointer text-red-500"
                                            onClick={() => handleOpenDeleteDialog(position.id)}
                                        >
                                            Hapus
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

            {/* Dialog Tambah */}
            <Dialog open={isAddPositionDialogOpen} onClose={setIsAddPositionDialogOpen}>
                <DialogTitle>Tambah Data Jabatan</DialogTitle>
                <DialogBody>
                    <Field>
                        <Label>Nama</Label>
                        <Input name="name" onChange={handleChange} value={data.name}/>
                        <InputError message={errors.name} className="mt-2"/>
                    </Field>
                </DialogBody>
                <DialogActions>
                    {!isAddPositionSubmitted && (
                        <Button plain className="cursor-pointer" onClick={closeAddPositionDialog}>
                            Batal
                        </Button>
                    )}
                    <Button className="cursor-pointer" onClick={addPosition}>
                        {isAddPositionSubmitted ? 'Menambah...' : 'Tambah'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog Edit */}
            <Dialog open={isEditPositionDialogOpen} onClose={setIsEditPositionDialogOpen}>
                <DialogTitle>Edit Data Jabatan</DialogTitle>
                <DialogBody>
                    <Field>
                        <Label>Nama</Label>
                        <Input name="name" onChange={handleChange} value={data.name}/>
                        <InputError message={errors.name} className="mt-2"/>
                    </Field>
                </DialogBody>
                <DialogActions>
                    {!isEditPositionSubmitted && (
                        <Button plain className="cursor-pointer" onClick={closeEditPositionDialog}>
                            Batal
                        </Button>
                    )}
                    <Button className="cursor-pointer" onClick={editPosition}>
                        {isEditPositionSubmitted ? 'Menyimpan...' : 'Simpan'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog Konfirmasi Hapus */}
            <Dialog open={isDeletePositionDialogOpen} onClose={() => setIsDeletePositionDialogOpen(false)}>
                <DialogTitle>Hapus Jabatan</DialogTitle>
                <DialogBody>
                    <p>Apakah Anda yakin ingin menghapus jabatan ini?</p>
                </DialogBody>
                <DialogActions>
                    <Button plain className="cursor-pointer" onClick={() => setIsDeletePositionDialogOpen(false)}>
                        Batal
                    </Button>
                    <Button
                        className="cursor-pointer text-red-500"
                        onClick={handleDelete}
                    >
                        Hapus
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
