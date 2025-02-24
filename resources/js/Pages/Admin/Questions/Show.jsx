import {useState} from "react";
import {Head, useForm} from "@inertiajs/react";
import ApplicationLayout from "@/Layouts/ApplicationLayout";
import BackButton from "@/Components/BackButton";
import {InformationCircleIcon, PencilSquareIcon, TrashIcon} from "@heroicons/react/24/outline";
import {Dialog, DialogActions, DialogBody, DialogTitle} from "@/Components/Catalyst/dialog";
import {Table, TableBody, TableCell, TableRow} from "@/Components/Catalyst/table";
import {Button} from "@/Components/Catalyst/button";
import {Heading, Subheading} from "@/Components/Catalyst/heading";

export default function AdminQuestionShow({question, success}) {
    const {delete: destroy, processing} = useForm();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const handleDelete = () => {
        destroy(route('admin.questions.destroy', question.id));
    };

    return (
        <>
            <Head title={'Data Soal'}/>

            <ApplicationLayout>
                <BackButton
                    link={route('admin.questions.index', {question_type_id: question.question_type_id})}/>

                <Heading className={'mt-8'}>Data Soal</Heading>
                {success && (
                    <div className="mb-4 mt-2 text-sm font-medium text-green-600">
                        {success}
                    </div>
                )}

                {
                    question.type === 'text' && (
                        <div className="mt-8 shadow p-5 rounded-lg">
                            <Subheading level={4}>Pertanyaan</Subheading>
                            <div className="mt-2">
                                {question.question}
                            </div>
                        </div>
                    )
                }

                {
                    question.type === 'image' && (
                        <>
                            <Subheading level={4} className={'mt-8'}>Pertanyaan</Subheading>
                            <div className="shadow mt-2 rounded-lg">
                                <div className="mt-2">
                                    <img src={'/storage/' + question.question} alt="Pertanyaan"/>
                                </div>
                            </div>
                        </>
                    )
                }

                {question.discussion !== null && (
                    <div className="mt-8 shadow p-5 rounded-lg">
                        <Subheading level={4}>Pembahasan</Subheading>
                        <div className="mt-2">
                            {question.discussion}
                        </div>
                    </div>
                )}

                <Table className="mt-8 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
                    <TableBody>
                        <TableRow key={1}>
                            <TableCell>Jenis Soal</TableCell>
                            <TableCell>
                                <strong>{question.question_type.name}</strong>
                            </TableCell>
                        </TableRow>

                        <TableRow key={2}>
                            <TableCell>Jenis Pembobotan</TableCell>
                            <TableCell>
                                <strong>{question.question_type.weighting_type}</strong>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                <div className="flex justify-end gap-1 mt-5">
                    <Button
                        href={route('admin.answer-options.index', question.id)}
                        size="small"
                        outline
                        className={'cursor-pointer'}
                    >
                        Pilihan Jawaban
                    </Button>
                    <Button
                        href={route('admin.questions.edit', question.id)}
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
                        onClick={() => setIsDeleteDialogOpen(true)}
                    >
                        Hapus
                    </Button>
                </div>

                <Subheading level={4} className={'mt-8'}>Pilihan Jawaban</Subheading>

                {question.options.length === 0 && (
                    <div className="mt-5 flex items-start p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <InformationCircleIcon className={'size-5 text-yellow-700'}/>
                        <div className="ml-3 text-sm text-yellow-700">
                            Belum ada pilihan jawaban.
                        </div>
                    </div>
                )}

                {question.options.length > 0 && (
                    <>
                        <div className="flex flex-col gap-2 mt-5">
                            {question.options
                                .sort((a, b) => {
                                    if (a.option < b.option) return -1;
                                    if (a.option > b.option) return 1;

                                    return 0;
                                })
                                .map((option, index) => (
                                    <div className="flex justify-between" key={index}>
                                        <div className="flex items-center gap-3">
                                            <div className="flex gap-1">
                                                <div
                                                    className={`flex items-center justify-center w-8 h-8 text-lg font-bold text-gray-800
                                                    ${option.is_correct ? 'bg-green-500 border-green-600 text-white' : 'bg-gray-200 border-gray-300 text-gray-800'}`}
                                                >
                                                    {option.option}
                                                </div>
                                                {
                                                    question.question_type.weighting_type == 'FIVE_TO_ONE' && (
                                                        <div
                                                            className={`flex items-center justify-center w-8 h-8 text-lg font-bold text-gray-800
                                                                ${option.is_correct ? 'bg-green-500 border-green-600 text-white' : 'bg-gray-200 border-gray-300 text-gray-800'}`}
                                                        >
                                                            {option.score}
                                                        </div>
                                                    )
                                                }
                                            </div>
                                            {
                                                option.type === 'text' && <span className="text-sm text-gray-700">{option.value}</span>
                                            }

                                            {
                                                option.type === 'image' && <a className={'text-blue-600'} target="_blank" href={`/storage/${option.value}`}>lihat gambar</a>
                                            }
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </>
                )}
            </ApplicationLayout>

            <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
                <DialogTitle>Hapus Soal</DialogTitle>
                <DialogBody>
                    <p>
                        Apakah Anda yakin ingin menghapus soal ini? Menghapus soal juga akan menghapus semua pilihan
                        jawaban yang terkait.
                    </p>
                </DialogBody>
                <DialogActions>
                    <Button
                        plain
                        className="cursor-pointer"
                        onClick={() => setIsDeleteDialogOpen(false)}
                    >
                        Batal
                    </Button>
                    <Button
                        color="rose"
                        className="cursor-pointer text-red-500"
                        onClick={handleDelete}
                        disabled={processing}
                    >
                        {processing ? 'Menghapus...' : 'Hapus'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
