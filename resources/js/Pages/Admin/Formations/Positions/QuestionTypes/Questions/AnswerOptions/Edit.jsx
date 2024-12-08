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

export default function AdminFormationPositionQuestionAnswerOptionsEdit({
                                                                             formation,
                                                                             position,
                                                                             questionType,
                                                                             question,
                                                                            answerOption,
                                                                             success
                                                                         }) {
    const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false);

    const { data, setData, put, processing, errors, reset } = useForm({
        option: answerOption.option || '',
        value: answerOption.value || '',
        weight: answerOption.weight || 0,
    });

    const handleChange = (e) => {
        const { name, type, value, checked } = e.target;

        setData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    }

    const submit = (e) => {
        e.preventDefault();

        put(route('admin.formation.position.question-type.question.answer-options.update', [formation.id, position.id, questionType.id, question.id, answerOption.id]));
    }

    return (
        <>
            <Head title={'Edit Pilihan Jawaban'}/>
            <ApplicationLayout>
                <div className="max-lg:hidden flex justify-between">
                    <BackButton
                        link={route('admin.formation.position.question-type.question.answer-options.index', [formation.id, position.id, questionType.id, question.id])}/>

                    <InformationCircleIcon className={'size-4 cursor-pointer'}
                                           onClick={() => setIsInfoDialogOpen(true)}/>
                </div>

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
                        questionType.weighting_type == 'FIVE_TO_ONE' && (
                            <>
                                <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                                    <div className="space-y-1">
                                        <Subheading>Nilai</Subheading>
                                    </div>
                                    <div>
                                        <Input aria-label="Nilai" name="weight" value={data.weight}
                                               onChange={handleChange}
                                               required/>
                                        <InputError message={errors.weight} className="mt-2"/>
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

            <Dialog open={isInfoDialogOpen} onClose={() => setIsInfoDialogOpen(false)} size={'xl'}>
                <DialogTitle>Jenis Soal</DialogTitle>
                <DialogBody>
                    <Table className="[--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
                        <TableBody>
                            <TableRow key={1}>
                                <TableCell>Jenis Soal</TableCell>
                                <TableCell>
                                    <strong>{questionType.name}</strong>
                                </TableCell>
                            </TableRow>

                            <TableRow key={2}>
                                <TableCell>Jenis Pembobotan</TableCell>
                                <TableCell>
                                    <strong>{questionType.weighting_type}</strong>
                                </TableCell>
                            </TableRow>

                            <TableRow key={3}>
                                <TableCell>Jabatan</TableCell>
                                <TableCell>
                                    <strong>{position.name}</strong>
                                </TableCell>
                            </TableRow>

                            <TableRow key={4}>
                                <TableCell>Formasi</TableCell>
                                <TableCell>
                                    <strong>{formation.name}</strong>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </DialogBody>
                <DialogActions>
                    <Button
                        className="cursor-pointer"
                        onClick={() => setIsInfoDialogOpen(false)}
                    >
                        Tutup
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
