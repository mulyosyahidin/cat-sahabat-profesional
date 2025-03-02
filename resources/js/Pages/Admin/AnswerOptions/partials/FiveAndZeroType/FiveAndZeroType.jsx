import {CheckIcon, InformationCircleIcon, PencilSquareIcon, TrashIcon} from "@heroicons/react/24/outline/index.js";
import {Subheading} from "@/Components/Catalyst/heading";
import {Button} from "@/Components/Catalyst/button";
import {Dialog, DialogActions, DialogBody, DialogTitle} from "@/Components/Catalyst/dialog";
import {useEffect, useState} from "react";
import {useForm} from "@inertiajs/react";
import FiveAndZeroTypeAddBulk from "@/Pages/Admin/AnswerOptions/partials/FiveAndZeroType/FiveAndZeroTypeAddBulk";
import FiveAndZeroTypeAddSingle
    from "@/Pages/Admin/AnswerOptions/partials/FiveAndZeroType/FiveAndZeroTypeAddSingle";

export default function FiveAndZeroType({formation, position, question, questionType, newOptionId, newOptions}) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const [options, setOptions] = useState(question.options);
    const [isCorrectOptionPresent, setIsCorrectOptionPresent] = useState(true);

    const [selectedOptionToMark, setSelectedOptionToMark] = useState(null);
    const [isMarkAsCorrectDialogOpen, setIsMarkAsCorrectDialogOpen] = useState(false);

    const {patch, delete: destroy} = useForm();

    useEffect(() => {
        const hasCorrectOption = options.some(option => option.is_correct === 1 || option.is_correct === true);

        setIsCorrectOptionPresent(hasCorrectOption);
    }, [options]);

    const handleOpenDeleteDialog = (option) => {
        setItemToDelete(option);
        setIsDeleteDialogOpen(true);
    };

    const handleDelete = () => {
        destroy(route('admin.answer-options.destroy', [question.id, itemToDelete.id]), {
            preserveScroll: true,
            onSuccess: () => {
                setOptions((prevOptions) => prevOptions.filter(option => option !== itemToDelete));
                setIsDeleteDialogOpen(false);
            },
            onError: () => {

            },
        });
    }

    const handleOpenMarkAsCorrectDialog = (option) => {
        setSelectedOptionToMark(option);
        setIsMarkAsCorrectDialogOpen(true);
    };

    const handleMarkAsCorrectOption = () => {
        patch(route('admin.questions.answer-options.mark-as-correct', [question.id, selectedOptionToMark.id]), {
            preserveScroll: true,
            onSuccess: () => {
                setOptions((prevOptions) => {
                    return prevOptions.map(option => {
                        return {...option, is_correct: option.id === selectedOptionToMark.id};
                    });
                });

                setIsMarkAsCorrectDialogOpen(false);
            },
        });
    };

    return (
        <>
            <div className="mt-5 flex items-start p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <InformationCircleIcon className={'size-5 text-blue-700'}/>
                <div className="ml-3 text-sm text-blue-700">
                    Soal ini menggunakan pembobotan 5 dan 0. Hanya jawaban benar yang mendapatkan nilai 5.
                </div>
            </div>

            <div className="flex justify-between mt-8">
                <Subheading level={4}>Pilihan Jawaban</Subheading>
                <div className={'flex gap-1'}>
                    {/*<FiveAndZeroTypeAddBulk question={question} setOptions={setOptions} newOptions={newOptions}/>*/}
                    <FiveAndZeroTypeAddSingle question={question} setOptions={setOptions}/>
                </div>
            </div>

            {options.length == 0 && (
                <div className="mt-5 flex items-start p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <InformationCircleIcon className={'size-5 text-yellow-700'}/>
                    <div className="ml-3 text-sm text-yellow-700">
                        Belum ada pilihan jawaban. Silahkan tambahkan pilihan jawaban.
                    </div>
                </div>
            )}

            {!isCorrectOptionPresent && options.length > 0 && (
                <div className="mt-5 flex items-start p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <InformationCircleIcon className={'size-5 text-yellow-700'}/>
                    <div className="ml-3 text-sm text-yellow-700">
                        Belum ada pilihan jawaban yang ditandai sebagai benar. Silahkan pilih salah satu
                        pilihan sebagai benar, atau membuat pilihan baru.
                    </div>
                </div>
            )}

            {options.length > 0 && (
                <>
                    <div className="flex flex-col gap-2 mt-5">
                        {options
                            .sort((a, b) => {
                                if (a.option < b.option) return -1;
                                if (a.option > b.option) return 1;

                                return 0;
                            })
                            .map((option, index) => (
                                <>
                                    {
                                        option.type === 'image' && (
                                            <div
                                                className="rounded-lg shadow-md bg-white p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                                                <div className="flex justify-between" key={index}>
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className={`flex items-center justify-center w-8 h-8 text-lg font-bold text-gray-800 ${option.is_correct ? 'bg-green-500 border-green-600 text-white' : 'bg-gray-200 border-gray-300 text-gray-800'}`}
                                                        >
                                                            {option.option}
                                                        </div>
                                                        <a className={'text-blue-600'} target="_blank"
                                                           href={`/storage/${option.value}`}>lihat gambar</a>
                                                    </div>

                                                    <div className={'flex gap-1'}>
                                                        <Button
                                                            outline
                                                            size="small"
                                                            className={`${option.is_correct ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                                            disabled={option.is_correct}
                                                            onClick={() => handleOpenMarkAsCorrectDialog(option)}
                                                        >
                                                            <CheckIcon/>
                                                        </Button>
                                                        <Button
                                                            outline={true}
                                                            href={route('admin.answer-options.edit', [question.id, option.id])}
                                                            size="small"
                                                            className="cursor-pointer"
                                                        >
                                                            <PencilSquareIcon/>
                                                        </Button>
                                                        <Button
                                                            outline={true}
                                                            size="small"
                                                            className="cursor-pointer text-red-500"
                                                            onClick={() => handleOpenDeleteDialog(option)}
                                                        >
                                                            <TrashIcon/>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }

                                    {
                                        option.type === 'text' && (
                                            <div
                                                className="rounded-lg shadow-md bg-white p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                                                <div className="flex justify-between mb-3" key={index}>
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className={`flex items-center justify-center w-8 h-8 text-lg font-bold text-gray-800 ${option.is_correct ? 'bg-green-500 border-green-600 text-white' : 'bg-gray-200 border-gray-300 text-gray-800'}`}
                                                        >
                                                            {option.option}
                                                        </div>
                                                    </div>

                                                    <div className={'flex gap-1'}>
                                                        <Button
                                                            outline
                                                            size="small"
                                                            className={`${option.is_correct ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                                            disabled={option.is_correct}
                                                            onClick={() => handleOpenMarkAsCorrectDialog(option)}
                                                        >
                                                            <CheckIcon/>
                                                        </Button>
                                                        <Button
                                                            outline={true}
                                                            href={route('admin.answer-options.edit', [question.id, option.id])}
                                                            size="small"
                                                            className="cursor-pointer"
                                                        >
                                                            <PencilSquareIcon/>
                                                        </Button>
                                                        <Button
                                                            outline={true}
                                                            size="small"
                                                            className="cursor-pointer text-red-500"
                                                            onClick={() => handleOpenDeleteDialog(option)}
                                                        >
                                                            <TrashIcon/>
                                                        </Button>
                                                    </div>
                                                </div>
                                                <div dangerouslySetInnerHTML={{__html: option.value}}/>
                                            </div>
                                        )
                                    }
                                </>
                            ))}
                    </div>
                </>
            )}

            <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)} size={'sm'}>
                <DialogTitle>Hapus Pilihan Jawaban</DialogTitle>
                <DialogBody>
                    <div className="text-sm text-gray-700">
                        Apakah Anda yakin ingin menghapus pilihan jawaban ini?
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
                    <Button
                        className="cursor-pointer text-red-500"
                        onClick={handleDelete}
                    >
                        Hapus
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isMarkAsCorrectDialogOpen} onClose={() => setIsMarkAsCorrectDialogOpen(false)} size={'sm'}>
                <DialogTitle>Menandai Pilihan Jawaban Sebagai Benar</DialogTitle>
                <DialogBody>
                    <div className="text-sm text-gray-700">
                        Apakah Anda ingin menandai pilihan jawaban ini sebagai benar?
                    </div>
                </DialogBody>
                <DialogActions>
                    <Button
                        plain
                        className="cursor-pointer"
                        onClick={() => setIsMarkAsCorrectDialogOpen(false)}
                    >
                        Batal
                    </Button>
                    <Button
                        className="cursor-pointer text-blue-500"
                        onClick={handleMarkAsCorrectOption}
                    >
                        Tandai Sebagai Benar
                    </Button>
                </DialogActions>
            </Dialog>

        </>
    )
}
