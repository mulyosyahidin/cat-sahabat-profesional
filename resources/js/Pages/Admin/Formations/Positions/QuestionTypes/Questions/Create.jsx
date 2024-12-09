import {Head, useForm} from "@inertiajs/react";
import ApplicationLayout from "@/Layouts/ApplicationLayout";
import BackButton from "@/Components/BackButton";
import {InformationCircleIcon} from "@heroicons/react/24/outline/index.js";
import {useState} from "react";
import {Dialog, DialogActions, DialogBody, DialogTitle} from "@/Components/Catalyst/dialog";
import {Table, TableBody, TableCell, TableRow} from "@/Components/Catalyst/table";
import {Button} from "@/Components/Catalyst/button";
import {Heading, Subheading} from "@/Components/Catalyst/heading";
import {Divider} from "@/Components/Catalyst/divider";
import {Input} from "@/Components/Catalyst/input";
import InputError from "@/Components/InputError";
import {Textarea} from "@/Components/Catalyst/textarea";

export default function AdminFormationPositionQuestionTypeQuestionIndex({
                                                                            formation,
                                                                            position,
                                                                            questionType,
                                                                            questionCount,
                                                                            success
                                                                        }) {
    const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false);

    const {data, setData, post, processing, errors, reset} = useForm({
        question: '',
        discussion: '',
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

        post(route('admin.formation.position.question-type.questions.store', [formation.id, position.id, questionType.id]));
    };

    return (
        <>
            <Head title={'Tambah Soal Baru'}/>
            <ApplicationLayout>
                <div className="max-lg:hidden flex justify-between">
                    <BackButton
                        link={route('admin.formation.position.question-type.questions.index', [formation.id, position.id, questionType.id])}/>

                    <InformationCircleIcon className={'size-4 cursor-pointer'}
                                           onClick={() => setIsInfoDialogOpen(true)}/>
                </div>

                <form method="post" className="mx-auto mt-10" onSubmit={submit}>
                    <Heading>Tambah Soal Baru</Heading>

                    {success && (
                        <div className="mb-4 mt-2 text-sm font-medium text-green-600">
                            {success}
                        </div>
                    )}
                    <Divider className="my-10 mt-6"/>

                    <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                        <div className="space-y-1">
                            <Subheading>No. Soal</Subheading>
                        </div>
                        <div>
                            <Input aria-label="Nomor Soal" value={questionCount + 1} disabled/>
                        </div>
                    </section>

                    <Divider className="my-10" soft/>

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
    );
}
