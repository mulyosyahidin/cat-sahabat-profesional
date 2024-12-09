import {useCallback, useMemo, useState} from "react";
import {Head, router} from "@inertiajs/react";
import ApplicationLayout from "@/Layouts/ApplicationLayout.jsx";
import BackButton from "@/Components/BackButton.jsx";
import {Heading} from "@/Components/Catalyst/heading.jsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/Components/Catalyst/table.jsx";
import {Button} from "@/Components/Catalyst/button.jsx";
import {EyeIcon} from "@heroicons/react/24/outline/index.js";
import {
    Pagination,
    PaginationList,
    PaginationNext,
    PaginationPage,
    PaginationPrevious
} from "@/Components/Catalyst/pagination.jsx";
import {limitPlainText} from "@/utils/utils.js";

export default function AdminParticipantShowQuestionAnswers({exam, examParticipant, questionAnswers, meta}) {
    const [currentPage, setCurrentPage] = useState(meta.current_page);

    const handlePageChange = useCallback((page) => {
        setCurrentPage(page);

        router.get(route('admin.exams.participants.question-answers', [exam.id, examParticipant.id]), {
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
            <Head title={'Jawaban Soal'} />
            <ApplicationLayout>
                <div>
                    <BackButton link={route('admin.exams.participants.show', [exam.id, examParticipant.id])}/>
                </div>

                <Heading className={'mt-8'}>Jawaban Soal</Heading>

                <Table className="mt-8 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
                    <TableHead>
                        <TableRow>
                            <TableHeader>#</TableHeader>
                            <TableHeader>Jenis</TableHeader>
                            <TableHeader>Soal</TableHeader>
                            <TableHeader>Jawaban</TableHeader>
                            <TableHeader>Benar / Salah</TableHeader>
                            <TableHeader className={'text-center'}>Nilai</TableHeader>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {questionAnswers.map((item, index) => {
                            const itemsPerPage = meta.per_page;
                            const startIndex = (meta.current_page - 1) * itemsPerPage;

                            return (
                                <TableRow key={item.id}>
                                    <TableCell>{startIndex + index + 1}</TableCell>
                                    <TableCell className="text-zinc-500">{item.question_type.name}</TableCell>
                                    <TableCell className="text-zinc-500">{limitPlainText(item.question.question, 40)}</TableCell>
                                    <TableCell className="text-zinc-500">{item.answer_option.option}. {item.answer_option.value}</TableCell>
                                    <TableCell className="text-zinc-500">{item.answer_option.is_correct ? 'Benar' : 'Salah'}</TableCell>
                                    <TableCell className="text-zinc-500 text-center">{item.answer_option.weight}</TableCell>
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
