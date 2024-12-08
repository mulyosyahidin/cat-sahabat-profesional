import {Head, useForm} from "@inertiajs/react";
import ApplicationLayout from "@/Layouts/ApplicationLayout.jsx";
import BackButton from "@/Components/BackButton.jsx";
import {Heading, Subheading} from "@/Components/Catalyst/heading.jsx";
import {Divider} from "@/Components/Catalyst/divider.jsx";
import {Input} from "@/Components/Catalyst/input.jsx";
import InputError from "@/Components/InputError.jsx";
import {Textarea} from "@/Components/Catalyst/textarea.jsx";
import {Button} from "@/Components/Catalyst/button.jsx";
import {Select} from "@/Components/Catalyst/select.jsx";

export default function AdminExamEdit({exam, formations, success}) {
    const {data, setData, put, processing, errors} = useForm({
        name: exam.name || '',
        token: exam.token || '',
        description: exam.description || '',
    });

    const handleChange = (e) => {
        const {name, value} = e.target;

        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const submit = (e) => {
        e.preventDefault();

        put(route('admin.exams.update', exam.id), {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title={`${exam.name} - Edit Ujian`}/>
            <ApplicationLayout>
                <div className="max-lg:hidden">
                    <BackButton link={route('admin.exams.index')}/>
                </div>

                <form method="post" className="mx-auto mt-10" onSubmit={submit}>
                    <Heading>Edit Ujian</Heading>

                    {success && (
                        <div className="mb-4 mt-2 text-sm font-medium text-green-600">
                            {success}
                        </div>
                    )}
                    <Divider className="my-10 mt-6"/>

                    <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                        <div className="space-y-1">
                            <Subheading>Nama</Subheading>
                        </div>
                        <div>
                            <Input
                                aria-label="Nama ujian"
                                name="name"
                                value={data.name}
                                onChange={handleChange}
                                required
                            />
                            <InputError message={errors.name} className="mt-2"/>
                        </div>
                    </section>

                    <Divider className="my-10" soft/>

                    <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                        <div className="space-y-1">
                            <Subheading>Formasi</Subheading>
                        </div>
                        <div>
                            <Select aria-label="Formasi diujikan" name="formation_id" onChange={handleChange} value={exam.formation_id}>
                                <option value="">Pilih formasi</option>
                                {formations.map(formation => (
                                    <option key={formation.id} value={formation.id}>{formation.name}</option>
                                ))}
                            </Select>
                            <InputError message={errors.formation_id} className="mt-2"/>
                        </div>
                    </section>

                    <Divider className="my-10" soft/>

                    <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                        <div className="space-y-1">
                            <Subheading>Token</Subheading>
                        </div>
                        <div>
                            <Input
                                aria-label="Token ujian"
                                name="token"
                                value={data.token}
                                onChange={handleChange}
                                required
                            />
                            <InputError message={errors.token} className="mt-2"/>
                        </div>
                    </section>

                    <Divider className="my-10" soft/>

                    <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                        <div className="space-y-1">
                            <Subheading>Deskripsi</Subheading>
                        </div>
                        <div>
                            <Textarea
                                aria-label="Deskripsi ujian"
                                name="description"
                                value={data.description}
                                onChange={handleChange}
                            />
                            <InputError message={errors.description} className="mt-2"/>
                        </div>
                    </section>

                    <Divider className="my-10" soft/>

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
    );
}
