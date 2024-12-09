import {useState} from "react";
import {useForm} from "@inertiajs/react";
import {Button} from "@/Components/Catalyst/button";
import {Dialog, DialogActions, DialogBody, DialogTitle} from "@/Components/Catalyst/dialog";
import {Subheading} from "@/Components/Catalyst/heading";
import {Input} from "@/Components/Catalyst/input";
import InputError from "@/Components/InputError";

export default function FiveToOneAddSingle({question, setOptions}) {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    const {data, setData, post, processing, errors, reset} = useForm({
        option: '',
        value: '',
        score: '',
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

        errors.option = null;
        errors.value = null;

        post(route('admin.answer-options.store', question.id), {
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
                        is_correct: data.score == 5,
                        score: data.score,
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
                            <Subheading>Nilai</Subheading>
                        </div>

                        <div className="sm:col-span-8">
                            <Input type={'number'} min={'1'} max={'5'} aria-label="Nilai" name="score" value={data.score} onChange={handleChange}
                                   required/>
                            <InputError message={errors.score} className="mt-2"/>
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
