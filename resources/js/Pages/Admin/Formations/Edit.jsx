import ApplicationLayout from "@/Layouts/ApplicationLayout.jsx";
import {Head, useForm} from "@inertiajs/react";
import BackButton from "@/Components/BackButton.jsx";
import {Heading, Subheading} from "@/Components/Catalyst/heading.jsx";
import {Button} from "@/Components/Catalyst/button.jsx";
import {Divider} from "@/Components/Catalyst/divider.jsx";
import {Input} from "@/Components/Catalyst/input.jsx";
import InputError from "@/Components/InputError.jsx";

export default function AdminFormationEdit({formation, success}) {
    const {data, setData, put, processing, errors, reset} = useForm({
        name: formation.name || '',
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

        put(route('admin.formations.update', formation.id));
    };

    return (
        <>
            <Head title={`Edit Formasi - ${formation.name}`}/>
            <ApplicationLayout>
                <div className="max-lg:hidden">
                    <BackButton link={route('admin.formations.index')}/>
                </div>

                <form method="post" className="mx-auto mt-10" onSubmit={submit}>
                    <Heading>Tambah Formasi Baru</Heading>

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
                                aria-label="Nama formasi"
                                name="name"
                                value={data.name}
                                onChange={handleChange}
                            />
                            <InputError message={errors.name} className="mt-2"/>
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
