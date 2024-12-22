import {useState, useEffect} from "react";
import ApplicationLayout from "@/Layouts/ApplicationLayout";
import {Head, Link, router, useForm} from "@inertiajs/react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/Components/Catalyst/table";
import {
    Pagination,
    PaginationList,
    PaginationNext,
    PaginationPage,
    PaginationPrevious
} from "@/Components/Catalyst/pagination";
import BackButton from "@/Components/BackButton";
import {timeLeft, timeLeftInMinute} from "@/utils/utils.js";
import {Heading} from "@/Components/Catalyst/heading.jsx";
import {Button} from "@/Components/Catalyst/button.jsx";
import {ArrowPathIcon, EyeIcon, MagnifyingGlassIcon, TrashIcon} from "@heroicons/react/24/outline/index.js";
import {Input} from "@/Components/Catalyst/input.jsx";
import {Dialog, DialogActions, DialogBody, DialogTitle} from "@/Components/Catalyst/dialog.jsx";

export default function AdminParticipantIndex({exam, participants, meta, success, count, search_query}) {
    const [search, setSearch] = useState(search_query);

    const {delete: destroy} = useForm();

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedParticipantId, setSelectedParticipantId] = useState(null);

    const [remainingTimes, setRemainingTimes] = useState(() =>
        participants.map((participant) =>
            timeLeftInMinute(participant.session.started_at, participant.session.maximum_duration)
        )
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setRemainingTimes(
                participants.map((participant) =>
                    timeLeftInMinute(participant.session.started_at, participant.session.maximum_duration)
                )
            );
        }, 60000);

        return () => clearInterval(interval);
    }, [participants]);

    const handlePageChange = (page) => {
        console.log(page);
        router.get(route("admin.exams.participants.index", {exam: exam.id, page}), {
            preserveScroll: true,
        });
    }

    const performSearch = () => {
        router.get(route('admin.exams.participants.index', {exam: exam.id, search}));
    }

    const refreshPage = () => {
        router.get(route('admin.exams.participants.index', {exam: exam.id}));
    }

    const handleDeleteParticipant = (id) => {
        setSelectedParticipantId(id);
        setIsDeleteDialogOpen(true);
    }

    const handleDelete = () => {
        destroy(route('admin.exams.participants.destroy', [exam.id, selectedParticipantId]), {
            onSuccess: () => {
                setIsDeleteDialogOpen(false);
            }
        });
    }

    return (
        <>
            <Head title={"Kelola Formasi"}/>
            <ApplicationLayout>
                <BackButton link={route("admin.exams.show", exam.id)}/>

                <div className="flex justify-between">
                    <Heading className={"mt-8"}>Peserta Ujian</Heading>

                    <div className="flex items-center gap-2">
                        <span
                            className="inline-flex items-center gap-x-1.5 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                            <small>{count['active']}</small>/{count['total']} ({count['finished']} selesai)
                        </span>

                        <Link
                            onClick={refreshPage}
                            className="cursor-pointer ml-5">
                            <ArrowPathIcon className="w-5 h-5"/>
                        </Link>
                    </div>
                </div>

                {success && (
                    <div className="mt-2 text-sm font-medium text-green-600">
                        {success}
                    </div>
                )}

                <div className='mt-5 flex gap-2'>
                    <Input
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={'Cari Nama atau NIK'}
                        value={search}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                performSearch();
                            }
                        }}
                    />
                    <Button onClick={performSearch} className={'cursor-pointer'}>
                        <MagnifyingGlassIcon className={'w-5 h-5'}/>
                    </Button>
                </div>

                <Table className="mt-8 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
                    <TableHead>
                        <TableRow>
                            <TableHeader>#</TableHeader>
                            <TableHeader>Nama</TableHeader>
                            <TableHeader>NIK</TableHeader>
                            {/*<TableHeader>Jabatan Dilamar</TableHeader>*/}
                            <TableHeader className={"text-center"}>Total Skor</TableHeader>
                            <TableHeader className={"text-center"}>Sisa Waktu</TableHeader>
                            <TableHeader className={"text-center"}>Progress</TableHeader>
                            <TableHeader></TableHeader>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {participants.length === 0 && (
                            <TableRow>
                                <TableCell colSpan="8" className="text-center">
                                    Tidak ada data untuk ditampilkan
                                </TableCell>
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
                                    {/*<TableCell className="text-zinc-500">{participant.position.name}</TableCell>*/}
                                    <TableCell className="text-zinc-500 text-center">
                                        {participant.session.status === "finished" ? (
                                            <span className="text-green-500">{participant.session.total_score}</span>
                                        ) : (
                                            <span
                                                className="inline-flex items-center gap-x-1.5 rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                                                <svg
                                                    className="h-1.5 w-1.5 fill-red-500"
                                                    viewBox="0 0 6 6"
                                                    aria-hidden="true"
                                                >
                                                    <circle cx="3" cy="3" r="3"/>
                                                </svg>
                                                Belum Selesai
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-zinc-500 text-center">
                                        {participant.session.status === "finished"
                                            ? '-'
                                            : remainingTimes[index]}
                                    </TableCell>
                                    <TableCell className="text-zinc-500 text-center">
                                        {
                                            participant.session.status === "finished" && 'Selesai'
                                        }
                                        {
                                            participant.session.status === "active" && participant.session.total_questions > 0 && (
                                                <span
                                                    className="inline-flex items-center gap-x-1.5 rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700">
                                               {participant.session.current_answered_questions}/{participant.session.total_questions} Soal
                                            </span>
                                            )
                                        }

                                        {
                                            participant.session.status === "active" && participant.session.total_questions == 0 && (
                                                <span
                                                    className="inline-flex items-center gap-x-1.5 rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700">
                                               Tidak ada data
                                            </span>
                                            )
                                        }
                                    </TableCell>
                                    <TableCell className="flex justify-end gap-1">
                                        <Button
                                            outline={true}
                                            href={route(
                                                "admin.exams.participants.show",
                                                [exam.id, participant.id]
                                            )}
                                            size="small"
                                            className="cursor-pointer"
                                        >
                                            <EyeIcon/>
                                        </Button>

                                        <Button
                                            outline={true}
                                            onClick={() => handleDeleteParticipant(participant.id)}
                                            size="small"
                                            className="cursor-pointer"
                                        >
                                            <TrashIcon/>
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
                            href={
                                meta.current_page > 1
                                    ? `?page=${meta.current_page - 1}${search ? `&search=${search}` : ""}`
                                    : null
                            }
                            onClick={() => handlePageChange(meta.current_page - 1)}
                        />
                        <PaginationList>
                            {[...Array(meta.total_pages).keys()].map((page) => (
                                <PaginationPage
                                    key={page}
                                    href={`?page=${page + 1}${search ? `&search=${search}` : ""}`}
                                    current={meta.current_page === page + 1}
                                    onClick={() => handlePageChange(page + 1)}
                                >
                                    {page + 1}
                                </PaginationPage>
                            ))}
                        </PaginationList>
                        <PaginationNext
                            href={
                                meta.current_page < meta.total_pages
                                    ? `?page=${meta.current_page + 1}${search ? `&search=${search}` : ""}`
                                    : null
                            }
                            onClick={() => handlePageChange(meta.current_page + 1)}
                        />
                    </Pagination>
                )}
            </ApplicationLayout>

            <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
                <DialogTitle>Hapus Peserta?</DialogTitle>
                <DialogBody>
                    <p>Apakah Anda yakin ingin menghapus peserta ini? Menghapus peserta juga akan menghapus data lain
                        yang terkait. Namun, peserta masih dapat mengikuti ujian dengan menggunakan kode token yang sama.</p>
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
    );
}
