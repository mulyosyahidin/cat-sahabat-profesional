import ApplicationLayout from "@/Layouts/ApplicationLayout.jsx";
import {Head, useForm} from "@inertiajs/react";
import BackButton from "@/Components/BackButton.jsx";
import {Heading, Subheading} from "@/Components/Catalyst/heading.jsx";
import {Divider} from "@/Components/Catalyst/divider.jsx";
import {Input} from "@/Components/Catalyst/input.jsx";
import InputError from "@/Components/InputError.jsx";
import {Select} from "@/Components/Catalyst/select.jsx";
import {Button} from "@/Components/Catalyst/button.jsx";

export default function AdminFormationPositionQuestionTypeEdit({formation, position, weighting_types, success, questionType}) {
    const {data, setData, put, processing, errors, reset} = useForm({
        name: questionType.name || '',
        display_order: questionType.display_order || '',
        weighting_type: questionType.weighting_type || '',
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

        put(route('admin.formation.position.question-types.update', [formation.id, position.id, questionType.id]));
    };

    return (
        <>
            <Head title={'Edit Jenis Soal'} />
            <ApplicationLayout>
                <div className="max-lg:hidden">
                    <BackButton link={route('admin.formation.positions.show', [formation.id, position.id])}/>
                </div>

                <form method="post" className="mx-auto mt-10" onSubmit={submit}>
                    <Heading>Edit Jenis Soal</Heading>

                    {success && (
                        <div className="mb-4 mt-2 text-sm font-medium text-green-600">
                            {success}
                        </div>
                    )}
                    <Divider className="my-10 mt-6" />

                    <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                        <div className="space-y-1">
                            <Subheading>Formasi</Subheading>
                        </div>
                        <div>
                            <Input aria-label="Nama formasi" value={formation.name} disabled />
                        </div>
                    </section>

                    <Divider className="my-10" soft />

                    <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                        <div className="space-y-1">
                            <Subheading>Jabatan</Subheading>
                        </div>
                        <div>
                            <Input aria-label="Nama jabatan" value={position.name} disabled />
                        </div>
                    </section>

                    <Divider className="my-10" soft />

                    <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                        <div className="space-y-1">
                            <Subheading>Jenis Soal</Subheading>
                        </div>
                        <div>
                            <Input
                                aria-label="Nama jenis soal"
                                name="name"
                                value={data.name}
                                onChange={handleChange}
                                required
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>
                    </section>

                    <Divider className="my-10" soft />

                    <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                        <div className="space-y-1">
                            <Subheading>Urutan Jenis Soal</Subheading>
                        </div>
                        <div>
                            <Input
                                type={'number'}
                                min={'1'}
                                aria-label="Urutan tampilan jenis soal"
                                name="display_order"
                                value={data.display_order}
                                onChange={handleChange}
                                required
                            />
                            <InputError message={errors.display_order} className="mt-2" />
                        </div>
                    </section>

                    <Divider className="my-10" soft />

                    <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                        <div className="space-y-1">
                            <Subheading>Jenis Pembobotan Soal</Subheading>
                        </div>
                        <div>
                            <Select
                                aria-label="Jenis pembobotan soal"
                                name="weighting_type"
                                value={data.weighting_type}
                                onChange={handleChange}
                            >
                                <option value="">Pilih jenis pembobotan soal</option>
                                {Object.entries(weighting_types).map(([key, value]) => (
                                    <option key={key} value={key}>
                                        {value}
                                    </option>
                                ))}
                            </Select>
                            <InputError message={errors.weighting_type} className="mt-2" />
                        </div>
                    </section>

                    <Divider className="my-10" soft />

                    <div className="flex justify-end gap-4">
                        {processing ? (
                            <Button type="submit" className={'cursor-not-allowed'} disabled>
                                Simpan
                            </Button>
                        ) : (
                            <Button type="submit" className={'cursor-pointer'}>
                                Simpan
                            </Button>
                        )}
                    </div>
                </form>
            </ApplicationLayout>
        </>
    );
}
