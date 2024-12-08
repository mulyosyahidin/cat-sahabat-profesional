import {Button} from "@/Components/Catalyst/button";
import {Dialog, DialogActions, DialogBody, DialogTitle} from "@/Components/Catalyst/dialog";
import {Subheading} from "@/Components/Catalyst/heading";
import {Input} from "@/Components/Catalyst/input";
import InputError from "@/Components/InputError";
import {useState} from "react";
import {useForm} from "@inertiajs/react";

export default function FiveAndZeroTypeAddSingle({formation, position, questionType, question, setOptions}) {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    const {data, setData, post, processing, errors, reset} = useForm({
        option: '',
        value: '',
        is_correct: false,
        weight: 0,
    });

    const handleChange = (e) => {
        const {name, type, value, checked} = e.target;

        setData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    }

    const addOption = (e) => {
        e.preventDefault();

        console.log(data)

        errors.option = null;
        errors.value = null;

        post(route('admin.formation.position.question-type.question.answer-options.store', [formation.id, position.id, questionType.id, question.id]), {
            preserveScroll: true,
            onSuccess: (response) => {
                setOptions((prevOptions) => {
                    const updatedOptions = prevOptions.map(option => ({
                        ...option,
                        is_correct: option.is_correct && !data.is_correct ? option.is_correct : false,
                    }));

                    updatedOptions.push({
                        option: data.option,
                        value: data.value,
                        is_correct: data.is_correct,
                        weight: data.weight,
                        id: response.props.newOptionId,
                    });

                    return updatedOptions;
                });

                setIsAddDialogOpen(false);
                reset();
            },
        });
    }

    return (
        <>
            <Button className={'cursor-pointer'} onClick={() => setIsAddDialogOpen(true)}>
                Tambah
            </Button>

            <Dialog open={isAddDialogOpen} onClose={() => null} size={'2xl'}>
                <DialogTitle>Tambah Pilihan Jawaban</DialogTitle>
                <DialogBody>

                    <section className="grid gap-x-8 gap-y-6 sm:grid-cols-12">
                        <div className="sm:col-span-4 space-y-1">
                            <Subheading>Pilihan</Subheading>
                        </div>

                        <div className="sm:col-span-8">
                            <Input aria-label="Pilihan jawaban" name="option" value={data.option}
                                   onChange={handleChange} required/>
                            <InputError message={errors.option} className="mt-2"/>
                        </div>
                    </section>

                    <section className="grid gap-x-8 gap-y-6 sm:grid-cols-12 mt-4">
                        <div className="sm:col-span-4 space-y-1">
                            <Subheading>Jawaban</Subheading>
                        </div>

                        <div className="sm:col-span-8">
                            <Input aria-label="Jawaban" name="value" value={data.value} onChange={handleChange}
                                   required/>
                            <InputError message={errors.value} className="mt-2"/>
                        </div>
                    </section>

                    <section className="grid gap-x-8 gap-y-6 sm:grid-cols-12 mt-4">
                        <div className="sm:col-span-4 space-y-1">
                            <Subheading>Jawaban Benar?</Subheading>
                        </div>

                        <div className="sm:col-span-8">
                            <input
                                id="is_correct"
                                name="is_correct"
                                type="checkbox"
                                onChange={handleChange}
                                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                            />
                            <InputError message={errors.is_correct} className="mt-2"/>
                        </div>

                    </section>
                </DialogBody>
                <DialogActions>
                    {!processing && (
                        <Button
                            plain
                            className="cursor-pointer"
                            onClick={() => setIsAddDialogOpen(false)}
                        >
                            Tutup
                        </Button>
                    )}

                    <Button className={'cursor-pointer'} onClick={addOption} disabled={processing}>
                        {processing ? 'Menambah...' : 'Tambah'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
