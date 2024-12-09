import {Head, useForm} from "@inertiajs/react";
import ApplicationLayout from "@/Layouts/ApplicationLayout";
import BackButton from "@/Components/BackButton";
import {InformationCircleIcon} from "@heroicons/react/24/outline/index.js";
import {Heading, Subheading} from "@/Components/Catalyst/heading";
import {useState} from "react";
import {Dialog, DialogActions, DialogBody, DialogTitle} from "@/Components/Catalyst/dialog";
import {Table, TableBody, TableCell, TableRow} from "@/Components/Catalyst/table";
import {Button} from "@/Components/Catalyst/button";
import {Divider} from "@/Components/Catalyst/divider";
import {Input} from "@/Components/Catalyst/input";
import InputError from "@/Components/InputError";

export default function AdminAnswerOptionsEdit({question, answerOption, success}) {
    const {data, setData, put, processing, errors, reset} = useForm({
        option: answerOption.option || '',
        value: answerOption.value || '',
        score: answerOption.score || 0,
    });

    const handleChange = (e) => {
        const {name, type, value, checked} = e.target;

        setData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    }

    const submit = (e) => {
        e.preventDefault();

        put(route('admin.answer-options.update', [question.id, answerOption.id]));
    }

    return (
        <>
            <Head title={'Edit Pilihan Jawaban'}/>
            <ApplicationLayout>
                <BackButton
                    link={route('admin.answer-options.index', [question.id])}/>

                <form method="post" className="mx-auto mt-10" onSubmit={submit}>
                    <Heading>Edit Pilihan Jawaban</Heading>

                    {success && (
                        <div className="mb-4 mt-2 text-sm font-medium text-green-600">
                            {success}
                        </div>
                    )}
                    <Divider className="my-10 mt-6"/>

                    <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                        <div className="space-y-1">
                            <Subheading>Pilihan</Subheading>
                        </div>
                        <div>
                            <Input aria-label="Pilihan jawaban" name="option" value={data.option}
                                   onChange={handleChange}
                                   required/>
                            <InputError message={errors.option} className="mt-2"/>
                        </div>
                    </section>

                    <Divider className="my-10" soft/>

                    <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                        <div className="space-y-1">
                            <Subheading>Jawaban</Subheading>
                        </div>
                        <div>
                            <Input aria-label="Isi jawaban" name="value" value={data.value} onChange={handleChange}
                                   required/>
                            <InputError message={errors.value} className="mt-2"/>
                        </div>
                    </section>

                    <Divider className="my-10" soft/>

                    {
                        question.question_type.weighting_type === 'FIVE_TO_ONE' && (
                            <>
                                <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                                    <div className="space-y-1">
                                        <Subheading>Nilai</Subheading>
                                    </div>
                                    <div>
                                        <Input aria-label="Nilai" name="score" value={data.score}
                                               onChange={handleChange}
                                               required/>
                                        <InputError message={errors.score} className="mt-2"/>
                                    </div>
                                </section>

                                <Divider className="my-10" soft/>
                            </>
                        )
                    }

                    <div className="flex justify-end gap-4">
                        {
                            processing ? (
                                <Button type="submit" className={'cursor-not-allowed'} disabled>Simpan</Button>
                            ) : (
                                <Button type="submit" className={'cursor-pointer'}>Simpan</Button>
                            )
                        }
                    </div>
                </form>
            </ApplicationLayout>
        </>
    )
}
