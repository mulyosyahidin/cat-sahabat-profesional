import {Button} from "@/Components/Catalyst/button";
import {Dialog, DialogActions, DialogBody, DialogTitle} from "@/Components/Catalyst/dialog";
import {Subheading} from "@/Components/Catalyst/heading";
import {Input} from "@/Components/Catalyst/input";
import InputError from "@/Components/InputError";
import {useState} from "react";
import {useForm} from "@inertiajs/react";
import {Select} from "@/Components/Catalyst/select.jsx";
import TinyMCEEditor from "@/Components/TinyMCEEditor.jsx";

export default function FiveAndZeroTypeAddSingle({question, setOptions}) {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    const {data, setData, post, processing, errors, reset} = useForm({
        option: '',
        type: 'text',
        value: '',
        value_image: '',
        is_correct: false,
        score: 0,
    });

    const handleChange = (e) => {
        const { name, type, value, checked, files } = e.target;

        setData((prevData) => ({
            ...prevData,
            [name]: type === "file" ? files[0] : type === "checkbox" ? checked : value,
        }));
    };

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
                        type: data.type,
                        is_correct: data.is_correct,
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

            <Dialog open={isAddDialogOpen} onClose={() => null} size={'5xl'}>
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
                            <Subheading>Tipe Jawaban</Subheading>
                        </div>
                        <div className="sm:col-span-8">
                            <Select aria-label="Tipe jawaban" name="type" value={data.type} onChange={handleChange}>
                                <option selected disabled>Pilih tipe</option>
                                <option value="text">Text</option>
                                <option value="image">Gambar</option>
                            </Select>
                            <InputError message={errors.type} className="mt-2"/>
                        </div>
                    </section>

                    {
                        data.type === 'text' && (
                            <section className="flex flex-col sm:flex-row sm:items-start gap-6 mt-4">
                                <div className="w-full space-y-1">
                                    <Subheading>Jawaban</Subheading>
                                    <TinyMCEEditor value={data.value} onChange={(content) => setData("value", content)} />
                                    <InputError message={errors.value} className="mt-2"/>
                                </div>
                            </section>
                        )
                    }

                    {
                        data.type === 'image' && (
                            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-12 mt-4">
                                <div className="sm:col-span-4 space-y-1">
                                    <Subheading>Jawaban</Subheading>
                                </div>

                                <div className="sm:col-span-8">
                                    <Input type="file" aria-label="Jawaban" name="value_image" onChange={handleChange}/>
                                    <InputError message={errors.value_image} className="mt-2"/>
                                </div>
                            </section>
                        )
                    }

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
