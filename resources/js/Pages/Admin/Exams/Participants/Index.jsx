import ApplicationLayout from "@/Layouts/ApplicationLayout";
import {Head, Link, router} from "@inertiajs/react";
import {useCallback, useMemo, useState} from "react";
import {Heading} from "@/Components/Catalyst/heading";
import {Button} from "@/Components/Catalyst/button";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/Components/Catalyst/table";
import {Dialog, DialogActions, DialogBody, DialogTitle} from "@/Components/Catalyst/dialog";
import {EyeIcon, TrashIcon, PencilSquareIcon} from "@heroicons/react/24/outline";
import {
    Pagination,
    PaginationList,
    PaginationNext,
    PaginationPage,
    PaginationPrevious
} from "@/Components/Catalyst/pagination";
import BackButton from "@/Components/BackButton";

export default function AdminParticipantIndex({exam, participants, meta, success}) {
    const [currentPage, setCurrentPage] = useState(meta.current_page);

    const handlePageChange = useCallback((page) => {
        setCurrentPage(page);

        router.get(route('admin.participants.index', {page}), {
            preserveScroll: true,
        });
    }, []);

    const paginationPages = useMemo(() => {
        return [...Array(meta.total_pages).keys()].map(page => ({
            page,
            isCurrent: meta.current_page === page + 1
        }));
    }, [meta])

    return (
        <>
            <Head title={'Kelola Formasi'} />
            <ApplicationLayout>
                <BackButton link={route('admin.exams.show', exam.id)}/>

                <Heading className={'mt-8'}>Peserta Ujian</Heading>

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
                            <TableHeader>Jabatan Dilamar</TableHeader>
                            <TableHeader className={'text-center'}>Total Skor</TableHeader>
                            <TableHeader></TableHeader>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {participants.length === 0 && (
                            <TableRow>
                                <TableCell colSpan="6" className="text-center">Tidak ada data untuk ditampilkan</TableCell>
                            </TableRow>
                        )}

                        {participants.map((participant, index) => {
                            const itemsPerPage = meta.per_page;
                            const startIndex = (meta.current_page - 1) * itemsPerPage;

                            return (
                                <TableRow key={participant.id}>
                                    <TableCell>{startIndex + index + 1}</TableCell>
                                    <TableCell className="text-zinc-500">{participant.user.name}</TableCell>
                                    <TableCell className="text-zinc-500">{participant.user.nik}</TableCell>
                                    <TableCell className="text-zinc-500">{participant.position.name}</TableCell>
                                    <TableCell className="text-zinc-500 text-center">{participant.session.total_score}</TableCell>
                                    <TableCell className="flex justify-end gap-1">
                                        <Button
                                            outline={true}
                                            href={route('admin.exams.participants.show', [exam.id, participant.id])}
                                            size="small"
                                            className="cursor-pointer"
                                        >
                                            <EyeIcon />
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
        </>
    )
}
