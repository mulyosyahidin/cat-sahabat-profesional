import {InformationCircleIcon, PencilSquareIcon, TrashIcon} from "@heroicons/react/24/outline/index.js";
import {Subheading} from "@/Components/Catalyst/heading";
import FiveToOneAddSingle
    from "@/Pages/Admin/Formations/Positions/QuestionTypes/Questions/AnswerOptions/partials/FiveToOneType/FiveToOneAddSingle";
import {useEffect, useState} from "react";
import {Button} from "@/Components/Catalyst/button";
import {useForm} from "@inertiajs/react";
import {Dialog, DialogActions, DialogBody, DialogTitle} from "@/Components/Catalyst/dialog";
import FiveToOneAddBulk
    from "@/Pages/Admin/Formations/Positions/QuestionTypes/Questions/AnswerOptions/partials/FiveToOneType/FiveToOneAddBulk";

export default function FiveToOneType({formation, position, question, questionType, newOptionId, newOptions}) {
    const [options, setOptions] = useState(question.options);
    const [isCorrectOptionPresent, setIsCorrectOptionPresent] = useState(true);

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

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
        destroy(route('admin.formation.position.question-type.question.answer-options.destroy', [formation.id, position.id, questionType.id, question.id, itemToDelete.id]), {
            preserveScroll: true,
            onSuccess: () => {
                setOptions((prevOptions) => prevOptions.filter(option => option !== itemToDelete));
                setIsDeleteDialogOpen(false);
            },
            onError: () => {

            },
        });
    }

    return (
        <>
            <div className="mt-5 flex items-start p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <InformationCircleIcon className={'size-5 text-blue-700'}/>
                <div className="ml-3 text-sm text-blue-700">
                    Soal ini menggunakan pembobotan 5 hingga 1. Setiap pilihan jawaban memiliki nilai tersendiri, mulai
                    dari 5 hingga 1. Pilihan benar memiliki nilai 5, sedangkan pilihan yang salah memiliki nilai 4, 3, 2
                    dan 1.
                </div>
            </div>

            <div className="flex justify-between mt-8">
                <Subheading level={4}>Pilihan Jawaban</Subheading>

                {
                    options.length < 5 && (
                        <>
                            <div className={'flex gap-1'}>
                                {options.length === 0 && (
                                    <FiveToOneAddBulk formation={formation} position={position} questionType={questionType}
                                                      question={question} options={options} setOptions={setOptions}/>
                                )}
                                {options.length > 0 && (
                                    <FiveToOneAddSingle formation={formation} position={position} questionType={questionType}
                                                        question={question} setOptions={setOptions}/>
                                )}
                            </div>
                        </>
                    )
                }
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
                        Belum ada pilihan jawaban yang ditandai sebagai benar. Buatlah pilihan jawaban dengan nilai 5.
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
                                <div className="flex justify-between" key={index}>
                                    <div className="flex items-center gap-3">
                                        <div className="flex gap-1">
                                            <div
                                                className={`flex items-center justify-center w-8 h-8 text-lg font-bold text-gray-800
                                                ${option.is_correct ? 'bg-green-500 border-green-600 text-white' : 'bg-gray-200 border-gray-300 text-gray-800'}`}
                                            >
                                                {option.option}
                                            </div>
                                            <div
                                                className={`flex items-center justify-center w-8 h-8 text-lg font-bold text-gray-800
                                                ${option.is_correct ? 'bg-green-500 border-green-600 text-white' : 'bg-gray-200 border-gray-300 text-gray-800'}`}
                                            >
                                                {option.weight}
                                            </div>
                                        </div>
                                        <span className="text-sm text-gray-700">{option.value}</span>
                                    </div>

                                    <div className={'flex gap-1'}>
                                        <Button
                                            outline={true}
                                            href={route('admin.formation.position.question-type.question.answer-options.edit', [formation.id, position.id, questionType.id, question.id, option.id])}
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
        </>
    )
}
