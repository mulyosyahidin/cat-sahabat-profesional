import ApplicationLayout from "@/Layouts/ApplicationLayout";
import {Head, useForm} from "@inertiajs/react";
import BackButton from "@/Components/BackButton";
import {Button} from "@/Components/Catalyst/button";
import {Heading, Subheading} from "@/Components/Catalyst/heading";
import {Divider} from "@/Components/Catalyst/divider";
import {Textarea} from "@/Components/Catalyst/textarea";
import InputError from "@/Components/InputError";
import {Select} from "@/Components/Catalyst/select.jsx";
import {Input} from "@/Components/Catalyst/input.jsx";
import TinyMCEEditor from "@/Components/TinyMCEEditor.jsx";

export default function AdminQuestionEdit({question, success}) {
    const {data, setData, post, processing, errors, reset} = useForm({
        question: question.type === 'text' ? question.question : '',
        type: question.type || '',
        discussion: question.discussion || '',
        question_image: '',
        _method: 'PUT',
    })

    const handleChange = (e) => {
        const { name, type, value, files } = e.target;

        setData((prevData) => ({
            ...prevData,
            [name]: type === "file" ? files[0] : value,
        }));
    };

    const submit = (e) => {
        e.preventDefault();

        post(route('admin.questions.update', question.id));
    };

    return (
        <>
            <Head title={'Edit Soal'}/>
            <ApplicationLayout>
                <BackButton
                    link={route('admin.questions.show', question.id)}/>

                <form method="post" className="mx-auto mt-10" onSubmit={submit}>
                    <Heading>Edit Soal</Heading>

                    {success && (
                        <div className="mb-4 mt-2 text-sm font-medium text-green-600">
                            {success}
                        </div>
                    )}
                    <Divider className="my-10 mt-6"/>

                    <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                        <div className="space-y-1">
                            <Subheading>Tipe Pertanyaan</Subheading>
                        </div>
                        <div>
                            <Select aria-label="Tipe pertanyaan" name="type" value={data.type} onChange={handleChange}>
                                <option selected disabled>Pilih tipe</option>
                                <option value="text">Text</option>
                                <option value="image">Gambar</option>
                            </Select>
                            <InputError message={errors.type} className="mt-2"/>
                        </div>
                    </section>

                    <Divider className="my-10" soft/>

                    {
                        data.type === 'text' && (
                            <>
                                <section>
                                    <Subheading>Pertanyaan <span
                                        className={'text-red-500 font-bold'}>*</span></Subheading>
                                    <TinyMCEEditor
                                        value={data.question}
                                        onChange={(content) => setData("question", content)}
                                    />
                                    <InputError message={errors.question} className="mt-2"/>
                                </section>

                                <Divider className="my-10" soft/>
                            </>
                        )
                    }

                    {
                        data.type === 'image' && (
                            <>
                                <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                                    <div className="space-y-1">
                                        <Subheading>Pertanyaan <span
                                            className={'text-red-500 font-bold'}>*</span></Subheading>
                                    </div>
                                    <div>
                                        <Input type="file" aria-label="Pertanyaan" name={'question_image'}
                                               onChange={handleChange}
                                               className="w-full"/>
                                        <InputError message={errors.question_image} className="mt-2"/>
                                    </div>
                                </section>

                                <Divider className="my-10" soft/>
                            </>
                        )
                    }

                    <section>
                        <Subheading>Pembahasan Soal</Subheading>

                        <Textarea
                            aria-label="Pembahasan Soal"
                            name={'discussion'}
                            value={data.discussion}
                            onChange={handleChange}
                            className="w-full mt-5"
                        />
                        <InputError message={errors.discussion} className="mt-2"/>
                    </section>

                    <Divider className="my-10" soft/>

                    <div className="flex justify-end gap-4">
                        {processing ? (
                            <Button type="submit" className={'cursor-not-allowed'} disabled>Simpan</Button>
                        ) : (
                            <Button type="submit" className={'cursor-pointer'}>Simpan</Button>
                        )}
                    </div>
                </form>
            </ApplicationLayout>
        </>
    )
}
