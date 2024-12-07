import ApplicationLayout from "@/Layouts/ApplicationLayout.jsx";
import {Head, useForm} from "@inertiajs/react";
import BackButton from "@/Components/BackButton.jsx";
import {Heading, Subheading} from "@/Components/Catalyst/heading.jsx";
import {Button} from "@/Components/Catalyst/button.jsx";
import {Divider} from "@/Components/Catalyst/divider.jsx";
import {Input} from "@/Components/Catalyst/input.jsx";
import InputError from "@/Components/InputError.jsx";
import {convertToMinutes, validateTimeFormat} from "@/utils/utils.js";
import {useEffect} from "react";

export default function AdminFormationPositionEdit({formation, position, success}) {
    const {data, setData, put, processing, errors, reset} = useForm({
        id: position.id,
        name: position.name || '',
        maximum_test_duration: position.maximum_test_duration || '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'maximum_test_duration') {
            if (!validateTimeFormat(value) && value !== '') {
                errors.maximum_test_duration = "Format tidak valid. Gunakan format jam:menit:detik.";
            } else {
                errors.maximum_test_duration = "";
            }
        }

        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const submit = (e) => {
        e.preventDefault();

        put(route('admin.formation.positions.update', [formation.id, position.id]), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
            },
        });
    }

    return (
        <>
            <Head title={'Edit Jabatan'}/>
            <ApplicationLayout>
                <div className="max-lg:hidden">
                    <BackButton link={route('admin.formations.show', formation.id)}/>
                </div>

                <form method="post" className="mx-auto mt-10" onSubmit={submit}>
                    <Heading>Edit Jabatan</Heading>

                    {success && (
                        <div className="mb-4 mt-2 text-sm font-medium text-green-600">
                            {success}
                        </div>
                    )}
                    <Divider className="my-10 mt-6"/>

                    <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                        <div className="space-y-1">
                            <Subheading>Formasi</Subheading>
                        </div>
                        <div>
                            <Input aria-label="Nama formasi" value={formation.name} disabled/>
                        </div>
                    </section>

                    <Divider className="my-10" soft/>

                    <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                        <div className="space-y-1">
                            <Subheading>Nama</Subheading>
                        </div>
                        <div>
                            <Input aria-label="Nama formasi" name="name" defaultValue={position.name} onChange={handleChange}
                                   required/>
                            <InputError message={errors.name} className="mt-2"/>
                        </div>
                    </section>

                    <Divider className="my-10" soft/>

                    <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                        <div className="space-y-1">
                            <Subheading>Maksimum Durasi Ujian</Subheading>
                        </div>
                        <div>
                            <Input
                                aria-label="Maksimum durasi ujian"
                                name="maximum_test_duration"
                                defaultValue={position.maximum_test_duration}
                                onChange={handleChange}
                                required
                            />

                            {errors.maximum_test_duration ? (
                                <small className="text-red-500">{errors.maximum_test_duration}</small>
                            ) : (
                                !data.maximum_test_duration && (
                                    <small className="text-gray-500">Isi dalam format: <strong>jam:menit:detik</strong></small>
                                )
                            )}

                            {data.maximum_test_duration && !errors.maximum_test_duration && validateTimeFormat(data.maximum_test_duration) && (
                                <small className="mt-2 text-gray-500">
                                    {convertToMinutes(data.maximum_test_duration)} menit
                                </small>
                            )}
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
