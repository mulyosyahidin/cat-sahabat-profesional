import ApplicationLayout from "@/Layouts/ApplicationLayout";
import {Head, useForm} from "@inertiajs/react";
import BackButton from "@/Components/BackButton";
import {Button} from "@/Components/Catalyst/button";
import {Heading, Subheading} from "@/Components/Catalyst/heading";
import {Divider} from "@/Components/Catalyst/divider";
import {Textarea} from "@/Components/Catalyst/textarea";
import InputError from "@/Components/InputError";

export default function AdminQuestionEdit({question, success}) {
    const {data, setData, put, processing, errors, reset} = useForm({
        question: question.question || '',
        discussion: question.discussion || '',
    })

    const handleChange = (e) => {
        const {name, value} = e.target;

        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    const submit = (e) => {
        e.preventDefault();

        put(route('admin.questions.update', question.id));
    };

    return (
        <>
            <Head title={'Edit Soal'} />
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

                    <section>
                        <Subheading>Pertanyaan <span
                            className={'text-red-500 font-bold'}>*</span></Subheading>
                        <Textarea
                            aria-label="Pertanyaan"
                            name={'question'}
                            value={data.question}
                            onChange={handleChange}
                            className="w-full mt-5"
                        />
                        <InputError message={errors.question} className="mt-2"/>
                    </section>

                    <Divider className="my-10" soft/>

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
