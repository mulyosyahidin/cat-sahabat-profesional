import {Head, useForm} from "@inertiajs/react";
import ApplicationLayout from "@/Layouts/ApplicationLayout";
import BackButton from "@/Components/BackButton";
import {Heading, Subheading} from "@/Components/Catalyst/heading";
import {Divider} from "@/Components/Catalyst/divider";
import {Input} from "@/Components/Catalyst/input";
import InputError from "@/Components/InputError";
import {Textarea} from "@/Components/Catalyst/textarea";
import {Button} from "@/Components/Catalyst/button";
import {Select} from "@/Components/Catalyst/select";
import {Label} from "@/Components/Catalyst/fieldset.jsx";

export default function AdminExamCreate({token, formations, success}) {
    const {data, setData, post, processing, errors, reset} = useForm({
        name: '',
        formation_id: '',
        date: '',
        token: token || '',
        description: '',
        is_open: true,
    })

    const handleChange = (e) => {
        const {name, value} = e.target;

        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    const handleCheckboxChange = (e) => {
        const {name, checked} = e.target;

        setData((prevData) => ({
            ...prevData,
            [name]: checked,
        }));
    }

    const submit = (e) => {
        e.preventDefault();

        post(route('admin.exams.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
            },
        });
    }

    return (
        <>
            <Head title={'Tambah Ujian'}/>
            <ApplicationLayout>
                <div>
                    <BackButton link={route('admin.exams.index')}/>
                </div>

                <form method="post" className="mx-auto mt-10" onSubmit={submit}>
                    <Heading>Tambah Ujian Baru</Heading>

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
                            <Input aria-label="Nama ujian" name="name" value={data.name} onChange={handleChange}/>
                            <InputError message={errors.name} className="mt-2"/>
                        </div>
                    </section>

                    <Divider className="my-10" soft/>

                    <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                        <div className="space-y-1">
                            <Subheading>Formasi</Subheading>
                        </div>
                        <div>
                            <Select aria-label="Formasi diujikan" name="formation_id" onChange={handleChange}>
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
                            <Subheading>Tanggal</Subheading>
                        </div>
                        <div>
                            <Input type={'date'} aria-label="Tanggal ujian" name="date" value={data.date}
                                   onChange={handleChange}/>
                            <InputError message={errors.date} className="mt-2"/>
                        </div>
                    </section>

                    <Divider className="my-10" soft/>

                    <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                        <div className="space-y-1">
                            <Subheading>Token</Subheading>
                        </div>
                        <div>
                            <Input aria-label="Token ujian" name="token" value={data.token} onChange={handleChange}/>
                            <InputError message={errors.token} className="mt-2"/>
                        </div>
                    </section>

                    <Divider className="my-10" soft/>

                    <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                        <div className="space-y-1">
                            <Subheading>Deskripsi</Subheading>
                        </div>
                        <div>
                            <Textarea aria-label="Deskripsi ujian" name="description" value={data.description}
                                      onChange={handleChange}/>
                            <InputError message={errors.description} className="mt-2"/>
                        </div>
                    </section>

                    <Divider className="my-10" soft/>

                    <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                        <div className="space-y-1">
                            <Subheading>Buka Ujian</Subheading>
                        </div>
                        <div>
                            <label>
                                <input type={'checkbox'} aria-label="Buka ujian" name="is_open" checked={data.is_open}
                                       onChange={handleCheckboxChange}
                                       className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 rounded"/>
                                <span className="ml-2 text-sm text-gray-900">Buka ujian</span>
                            </label>

                            <InputError message={errors.token} className="mt-2"/>
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
    )
}
