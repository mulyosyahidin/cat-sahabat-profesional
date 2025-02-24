import ApplicationLayout from "@/Layouts/ApplicationLayout";
import {Head, router, useForm} from "@inertiajs/react";
import BackButton from "@/Components/BackButton";
import {Heading} from "@/Components/Catalyst/heading";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/Components/Catalyst/table";
import {useCallback, useMemo, useState} from "react";
import {
    EyeIcon,
    InformationCircleIcon,
    ListBulletIcon, MagnifyingGlassIcon,
    PencilSquareIcon,
    TrashIcon
} from "@heroicons/react/24/outline/index.js";
import {Dialog, DialogActions, DialogBody, DialogTitle} from "@/Components/Catalyst/dialog";
import {Button} from "@/Components/Catalyst/button";
import {limitPlainText} from "@/utils/utils";
import {
    Pagination,
    PaginationList,
    PaginationNext,
    PaginationPage,
    PaginationPrevious
} from "@/Components/Catalyst/pagination";
import QuestionTypeOverviewDialog from "@/Pages/Admin/QuestionTypes/QuestionTypeOverviewDialog";
import {Input} from "@/Components/Catalyst/input.jsx";

export default function AdminFormationPositionQuestionTypeQuestionIndex({questionType, questions, meta, success, search_query}) {
    const [currentPage, setCurrentPage] = useState(meta.current_page);
    const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false);
    const [search, setSearch] = useState(search_query);

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const {delete: destroy} = useForm();

    const handlePageChange = useCallback((page) => {
        setCurrentPage(page);

        router.get(route('admin.questions.index', {
            question_type_id: questionType.id,
            page: page,
        }), {
            preserveScroll: true,
        });
    }, [questionType.id]);

    const paginationPages = useMemo(() => {
        return [...Array(meta.total_pages).keys()].map(page => ({
            page,
            isCurrent: meta.current_page === page + 1
        }));
    }, [meta]);

    const handleOpenDeleteDialog = (option) => {
        setItemToDelete(option);
        setIsDeleteDialogOpen(true);
    }

    const handleDeleteOption = () => {
        destroy(route('admin.questions.destroy', itemToDelete.id), {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleteDialogOpen(false);
            },
            onError: () => {

            },
        });
    }

    const performSearch = () => {
        router.get(route('admin.questions.index', {
            question_type_id: questionType.id,
            search,
        }));
    };

    return (
        <>
            <Head title={'Kelola Soal'}/>
            <ApplicationLayout>
                <div className="flex justify-between">
                    <BackButton link={route('admin.question-types.show', questionType.id)}/>

                    <InformationCircleIcon className={'size-4 cursor-pointer'}
                                           onClick={() => setIsInfoDialogOpen(true)}/>
                </div>

                <div className="flex justify-between mt-8">
                    <Heading>Kelola Soal</Heading>

                    <Button href={route('admin.questions.create', {question_type_id: questionType.id})}
                            className="cursor-pointer">
                        Tambah
                    </Button>
                </div>
                {success && (
                    <div className="mb-4 mt-2 text-sm font-medium text-green-600">
                        {success}
                    </div>
                )}

                <div className='mt-5 flex gap-2'>
                    <Input
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={'Cari Soal'}
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
                            <TableHeader>Pertanyaan</TableHeader>
                            <TableHeader className={'text-center'}>Jumlah Pilihan Jawaban</TableHeader>
                            <TableHeader></TableHeader>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            questions.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center">Tidak ada data untuk
                                        ditampilkan</TableCell>
                                </TableRow>
                            )
                        }
                        {questions.map((question, index) => {
                            const itemsPerPage = meta.per_page;
                            const startIndex = (meta.current_page - 1) * itemsPerPage;

                            return (
                                <TableRow key={question.id}>
                                    <TableCell>{startIndex + index + 1}</TableCell>
                                    <TableCell
                                        className="text-zinc-500">
                                        {
                                            question.type === 'text' && limitPlainText(question.question, 50)
                                        }

                                        {
                                            question.type === 'image' && '[Gambar]'
                                        }
                                    </TableCell>
                                    <TableCell
                                        className="text-zinc-500 text-center">{question.options.length}</TableCell>
                                    <TableCell className="flex justify-end gap-1">
                                        <Button
                                            outline
                                            size="small"
                                            className="cursor-pointer"
                                            href={route('admin.answer-options.index', question.id)}
                                        >
                                            <ListBulletIcon/>
                                        </Button>
                                        <Button
                                            outline
                                            size="small"
                                            className="cursor-pointer"
                                            href={route('admin.questions.show', question.id)}
                                        >
                                            <EyeIcon/>
                                        </Button>
                                        <Button
                                            outline
                                            size="small"
                                            className="cursor-pointer"
                                            href={route('admin.questions.edit', question.id)}
                                        >
                                            <PencilSquareIcon/>
                                        </Button>
                                        <Button
                                            outline
                                            size="small"
                                            className="cursor-pointer text-red-500"
                                            onClick={() => handleOpenDeleteDialog(question)}
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
                            href={meta.current_page > 1 ? `?question_type_id=${questionType.id}&page=${meta.current_page - 1}` : null}
                            onClick={() => handlePageChange(meta.current_page - 1)}
                        />
                        <PaginationList>
                            {paginationPages.map(({page, isCurrent}) => (
                                <PaginationPage
                                    key={page}
                                    href={`?question_type_id=${questionType.id}&page=${page + 1}`}
                                    current={isCurrent}
                                    onClick={() => handlePageChange(page + 1)}
                                >
                                    {page + 1}
                                </PaginationPage>
                            ))}
                        </PaginationList>
                        <PaginationNext
                            href={meta.current_page < meta.total_pages ? `?question_type_id=${questionType.id}&page=${meta.current_page + 1}` : null}
                            onClick={() => handlePageChange(meta.current_page + 1)}
                        />
                    </Pagination>
                )}
            </ApplicationLayout>

            <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)} size={'sm'}>
                <DialogTitle>Hapus Soal</DialogTitle>
                <DialogBody>
                    <div className="text-sm text-gray-700">
                        Apakah Anda yakin ingin menghapus soal ini? Menghapus soal juga akan menghapus semua pilihan
                        jawaban yang terkait.
                    </div>
                </DialogBody>
                <DialogActions>
                    <Button
                        plain
                        className="cursor-pointer"
                        onClick={() => setIsDeleteDialogOpen(false)}
                    >
                        Batal
                    </Button>
                    <Button color={'red'}
                            className="cursor-pointer"
                            onClick={handleDeleteOption}
                    >
                        Hapus
                    </Button>
                </DialogActions>
            </Dialog>

            <QuestionTypeOverviewDialog isInfoDialogOpen={isInfoDialogOpen} setIsInfoDialogOpen={setIsInfoDialogOpen}
                                        questionType={questionType}/>
        </>
    );
}
