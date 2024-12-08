import {useState} from "react";
import {useForm} from "@inertiajs/react";
import {Button} from "@/Components/Catalyst/button";
import {Dialog, DialogActions, DialogBody, DialogTitle} from "@/Components/Catalyst/dialog";
import {Subheading} from "@/Components/Catalyst/heading";
import {Input} from "@/Components/Catalyst/input";
import InputError from "@/Components/InputError";

export default function FiveToOneAddBulk({formation, position, questionType, question, options, setOptions}) {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    const [optionLeft, setOptionLeft] = useState(5 - options.length);

    const [answerOptions, setAnswersOptions] = useState([
        {option: 'A', value: '', weight: ''},
        {option: 'B', value: '', weight: ''},
        {option: 'C', value: '', weight: ''},
        {option: 'D', value: '', weight: ''},
        {option: 'E', value: '', weight: ''},
    ]);

    const {data, setData, post, processing, errors, reset} = useForm({
        options: [],
    });

    const closeAddDialog = () => {
        setIsAddDialogOpen(false);

        setTimeout(() => {
            setAnswersOptions([{option: '', value: ''}]);
        }, 1000);
    }

    const handleChange = (e, index) => {
        const { name, value } = e.target;

        setAnswersOptions((prevAnswers) => {
            const updatedAnswers = [...prevAnswers];

            if (name === 'option' && value.trim() === '') {
                updatedAnswers.splice(index, 1);
            } else {
                updatedAnswers[index] = {
                    ...updatedAnswers[index],
                    [name]: value,
                };
            }

            setData('options', updatedAnswers);

            return updatedAnswers;
        });
    };

    const submit = (e) => {
        e.preventDefault();

        console.log(data)

        post(route('admin.formation.position.question-type.question.answer-options.store-bulk', [formation.id, position.id, questionType.id, question.id]), {
            onSuccess: (response) => {
                setOptions((prevOptions) => {
                    const updatedOptions = prevOptions.map(option => ({
                        ...option,
                        is_correct: option.is_correct && !data.is_correct ? option.is_correct : false,
                    }));

                    response.props.newOptions.forEach(newOption => {
                        updatedOptions.push({
                            option: newOption.option,
                            value: newOption.value,
                            is_correct: newOption.is_correct,
                            weight: newOption.weight,
                            id: newOption.id,
                        });
                    });

                    return updatedOptions;
                });

                closeAddDialog();
            }
        });
    }

    return (
        <>
            <Button className={'cursor-pointer'} onClick={() => setIsAddDialogOpen(true)}>
                Tambah
            </Button>

            <Dialog open={isAddDialogOpen} onClose={() => null} size={'5xl'}>
                <div className="flex justify-between">
                    <DialogTitle>Tambah Pilihan Jawaban</DialogTitle>
                </div>
                <DialogBody>
                    {errors.options && (
                        <InputError message={errors.options} className="mb-5"/>
                    )}
                    {Array.from({ length: optionLeft }).map((_, index) => (
                        <section key={index} className="grid gap-x-8 gap-y-6 sm:grid-cols-12 mb-5">
                            <div className="sm:col-span-2 space-y-6">
                                <div className="space-y-1">
                                    <Subheading>Pilihan</Subheading>
                                    <Input
                                        aria-label="Pilihan jawaban"
                                        name="option"
                                        value={String.fromCharCode(65 + index)}
                                        onChange={(e) => handleChange(e, index)}
                                        required
                                    />

                                    {errors?.[`options.${index}.option`] && (
                                        <InputError message={errors[`options.${index}.option`]} className="mt-2"/>
                                    )}
                                </div>
                            </div>

                            <div className="sm:col-span-8 space-y-6">
                                <div className="space-y-1">
                                    <Subheading>Jawaban</Subheading>
                                    <Input
                                        aria-label="Jawaban"
                                        name="value"
                                        onChange={(e) => handleChange(e, index)}
                                        required
                                    />

                                    {errors?.[`options.${index}.value`] && (
                                        <InputError message={errors[`options.${index}.value`]} className="mt-2"/>
                                    )}
                                </div>
                            </div>

                            <div className="sm:col-span-2 space-y-6">
                                <div className="space-y-1">
                                    <Subheading>Nilai</Subheading>
                                    <Input
                                        type={'number'}
                                        min={'1'}
                                        max={'5'}
                                        aria-label="Nilai jawaban"
                                        name="weight"
                                        onChange={(e) => handleChange(e, index)}
                                        required
                                    />

                                    {errors?.[`options.${index}.weight`] && (
                                        <InputError message={errors[`options.${index}.weight`]} className="mt-2"/>
                                    )}
                                </div>
                            </div>
                        </section>
                    ))}
                </DialogBody>
                <DialogActions>
                    {!processing && (
                        <Button
                            plain
                            className="cursor-pointer"
                            onClick={closeAddDialog}
                        >
                            Tutup
                        </Button>
                    )}

                    <Button className={'cursor-pointer'} onClick={submit} disabled={processing}>
                        {processing ? 'Menyimpan...' : 'Simpan'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
