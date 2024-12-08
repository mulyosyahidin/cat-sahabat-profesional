import {Button} from "@/Components/Catalyst/button";
import {useState} from "react";
import {Dialog, DialogActions, DialogBody, DialogTitle} from "@/Components/Catalyst/dialog";
import {Subheading} from "@/Components/Catalyst/heading";
import {Input} from "@/Components/Catalyst/input";
import InputError from "@/Components/InputError";
import {useForm} from "@inertiajs/react";
import {XCircleIcon} from "@heroicons/react/24/outline";

export default function FiveAndZeroTypeAddBulk({formation, position, questionType, question, setOptions, newOptions}) {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isAddingOptions, setIsAddingOption] = useState(false);

    const {data, setData, post, processing, errors, reset} = useForm({
        options: [],
    });

    const [options, setOptionsState] = useState([
        {option: '', value: ''}
    ]);

    const closeAddDialog = () => {
        setIsAddDialogOpen(false);

        setTimeout(() => {
            setOptionsState([{option: '', value: ''}]);
        }, 1000);
    }

    const handleChange = (e, index) => {
        const {name, type, value, checked} = e.target;

        setOptionsState((prevOptions) => {
            const updatedOptions = [...prevOptions];
            updatedOptions[index] = {
                ...updatedOptions[index],
                [name]: type === 'checkbox' ? checked : value,
            };

            setData('options', updatedOptions);

            return updatedOptions;
        });
    };

    const addOptionItem = (e) => {
        e.preventDefault();

        setOptionsState((prevOptions) => [
            ...prevOptions,
            {option: '', value: ''}
        ]);

    }

    const removeOption = (index) => {
        setOptionsState((prevOptions) => {
            const updatedOptions = prevOptions.filter((_, i) => i !== index);

            setData((prevData) => ({
                ...prevData,
                options: updatedOptions,
            }));

            return updatedOptions;
        });
    };

    const submit = (e) => {
        e.preventDefault();

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
                Tambah (Bulk)
            </Button>

            <Dialog open={isAddDialogOpen} onClose={() => null} size={'5xl'}>
                <div className="flex justify-between">
                    <DialogTitle>Tambah Pilihan Jawaban</DialogTitle>

                    <Button
                        className="cursor-pointer"
                        onClick={addOptionItem}
                        aria-label="Tambah Pilihan"
                    >
                        +
                    </Button>
                </div>
                <DialogBody>
                    {options.map((option, index) => (
                        <section key={index} className="grid gap-x-8 gap-y-6 sm:grid-cols-12 mb-5">
                            <div className="sm:col-span-3 space-y-6">
                                <div className="space-y-1">
                                    <Subheading>Pilihan</Subheading>
                                    <Input
                                        aria-label="Pilihan jawaban"
                                        name="option"
                                        value={option.option}
                                        onChange={(e) => handleChange(e, index)}
                                        required
                                    />

                                    {errors?.[`options.${index}.option`] && (
                                        <InputError message={errors[`options.${index}.option`]} className="mt-2" />
                                    )}
                                </div>
                            </div>

                            <div className="sm:col-span-8 space-y-6">
                                <div className="space-y-1">
                                    <Subheading>Jawaban</Subheading>
                                    <Input
                                        aria-label="Jawaban"
                                        name="value"
                                        value={option.value}
                                        onChange={(e) => handleChange(e, index)}
                                        required
                                    />

                                    {errors?.[`options.${index}.option`] && (
                                        <InputError message={errors[`options.${index}.value`]} className="mt-2" />
                                    )}
                                </div>
                            </div>

                            {index > 0 && (
                                <div className="sm:col-span-1 flex items-center justify-end pt-8">
                                    <XCircleIcon className={'size-6 cursor-pointer'} onClick={() => removeOption(index)} />
                                </div>
                            )}
                        </section>
                    ))}
                </DialogBody>
                <DialogActions>
                    {!isAddingOptions && (
                        <Button
                            plain
                            className="cursor-pointer"
                            onClick={closeAddDialog}
                        >
                            Tutup
                        </Button>
                    )}

                    <Button className={'cursor-pointer'} onClick={submit}>
                        {isAddingOptions ? 'Menyimpan...' : 'Simpan'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
