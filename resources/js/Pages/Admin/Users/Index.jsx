import ApplicationLayout from "@/Layouts/ApplicationLayout";
import {Head, Link, router} from "@inertiajs/react";
import {useCallback, useMemo, useState} from "react";
import {Heading} from "@/Components/Catalyst/heading";
import {Button} from "@/Components/Catalyst/button";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/Components/Catalyst/table";
import {Dialog, DialogActions, DialogBody, DialogTitle} from "@/Components/Catalyst/dialog";
import {
    Pagination,
    PaginationList,
    PaginationNext,
    PaginationPage,
    PaginationPrevious
} from "@/Components/Catalyst/pagination";
import {Input} from "@/Components/Catalyst/input.jsx";
import {MagnifyingGlassIcon, PencilSquareIcon} from "@heroicons/react/24/outline/index.js";

export default function AdminUsersIndex({users, meta, success, search_query}) {
    const [currentPage, setCurrentPage] = useState(meta.current_page);
    const [search, setSearch] = useState(search_query);
    const [filteredUsers, setFilteredUsers] = useState(users);

    const [isEditPasswordDialogOpen, setIsEditPasswordDialogOpen] = useState(false);
    const [editPasswordId, setEditPasswordId] = useState(null);

    const handlePageChange = useCallback((page) => {
        setCurrentPage(page);

        router.get(route('admin.users.index', {page}));
    }, []);

    const paginationPages = useMemo(() => {
        return [...Array(meta.total_pages).keys()].map(page => ({
            page,
            isCurrent: meta.current_page === page + 1
        }));
    }, [meta]);

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const handleOpenDeleteDialog = (id) => {
        setDeleteId(id);
        setIsDeleteDialogOpen(true);
    };

    const performSearch = () => {
        router.get(route('admin.users.index', {search}), {
            preserveScroll: true,
            onSuccess: (response) => {
                setFilteredUsers(response.props.users);
            }
        });
    };

    const handleOpenEditPasswordDialog = (id) => {
        setEditPasswordId(id);
        setIsEditPasswordDialogOpen(true);
    }

    return (
        <>
            <Head title={'Kelola User'} />
            <ApplicationLayout>
                <div className="flex items-center justify-between">
                    <div>
                        <Heading>Kelola User</Heading>
                    </div>
                </div>

                <div className='mt-5 flex gap-2'>
                    <Input
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={'Cari User'}
                        value={search}
                    />
                    <Button onClick={performSearch} className={'cursor-pointer'}>
                        <MagnifyingGlassIcon className={'w-5 h-5'} />
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
                            <TableHeader>NIK</TableHeader>
                            <TableHeader>Email</TableHeader>
                            <TableHeader></TableHeader>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredUsers.length === 0 && (
                            <TableRow>
                                <TableCell colSpan="4" className="text-center">Tidak ada data untuk ditampilkan</TableCell>
                            </TableRow>
                        )}

                        {filteredUsers.map((user, index) => {
                            const itemsPerPage = meta.per_page;
                            const startIndex = (meta.current_page - 1) * itemsPerPage;

                            return (
                                <TableRow key={user.id}>
                                    <TableCell>{startIndex + index + 1}</TableCell>
                                    <TableCell className="text-zinc-500">{user.name}</TableCell>
                                    <TableCell className="text-zinc-500">{user.nik}</TableCell>
                                    <TableCell className="text-zinc-500">{user.email}</TableCell>
                                    <TableCell className="flex justify-end gap-1">
                                        {/*<Button*/}
                                        {/*    outline={true}*/}
                                        {/*    size="small"*/}
                                        {/*    className="cursor-pointer"*/}
                                        {/*    onClick={() => handleOpenEditPasswordDialog(user.id)}*/}
                                        {/*>*/}
                                        {/*    <PencilSquareIcon />*/}
                                        {/*</Button>*/}
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

            {/*<Dialog open={isEditPasswordDialogOpen} onClose={() => setIsEditPasswordDialogOpen(false)}>*/}
            {/*    <DialogTitle>Edit Password</DialogTitle>*/}
            {/*    <DialogBody>*/}
            {/*        <p>Apakah Anda yakin ingin menghapus formasi ini? Menghapus formasi juga akan menghapus data lain*/}
            {/*            yang terkait.</p>*/}
            {/*    </DialogBody>*/}
            {/*    <DialogActions>*/}
            {/*        <Button plain className="cursor-pointer" onClick={() => setIsEditPasswordDialogOpen(false)}>*/}
            {/*            Batal*/}
            {/*        </Button>*/}
            {/*        <Button*/}
            {/*            color={'rose'}*/}
            {/*            className="cursor-pointer text-red-500"*/}
            {/*            // onClick={handleDelete}*/}
            {/*        >*/}
            {/*            Hapus*/}
            {/*        </Button>*/}
            {/*    </DialogActions>*/}
            {/*</Dialog>*/}
        </>
    );
}
