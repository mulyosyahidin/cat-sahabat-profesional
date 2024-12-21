import ApplicationLayout from "@/Layouts/ApplicationLayout";
import {Head, useForm} from "@inertiajs/react";
import BackButton from "@/Components/BackButton";
import {Heading, Subheading} from "@/Components/Catalyst/heading";
import {Button} from "@/Components/Catalyst/button";
import {Divider} from "@/Components/Catalyst/divider";
import {Input} from "@/Components/Catalyst/input";
import InputError from "@/Components/InputError";

export default function AdminUserEdit({user, success}) {
    const {data, setData, put, processing, errors, reset} = useForm({
        name: user.name || '',
        email: user.email || '',
        nik: user.nik || '',
        password: '',
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

        put(route('admin.users.update', user.id));
    };

    return (
        <>
            <Head title={`Edit User - ${user.name}`}/>
            <ApplicationLayout>
                <div>
                    <BackButton link={route('admin.users.index')}/>
                </div>

                <form method="post" className="mx-auto mt-10" onSubmit={submit}>
                    <Heading>Tambah User Baru</Heading>

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
                                aria-label="Nama user"
                                name="name"
                                value={data.name}
                                onChange={handleChange}
                            />
                            <InputError message={errors.name} className="mt-2"/>
                        </div>
                    </section>

                    <Divider className="my-10" soft/>

                    <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                        <div className="space-y-1">
                            <Subheading>Email</Subheading>
                        </div>
                        <div>
                            <Input
                                aria-label="Email user"
                                name="email"
                                value={data.email}
                                onChange={handleChange}
                            />
                            <InputError message={errors.email} className="mt-2"/>
                        </div>
                    </section>

                    <Divider className="my-10" soft/>

                    <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                        <div className="space-y-1">
                            <Subheading>NIK</Subheading>
                        </div>
                        <div>
                            <Input
                                aria-label="NIK user"
                                name="nik"
                                value={data.nik}
                                onChange={handleChange}
                            />
                            <InputError message={errors.nik} className="mt-2"/>
                        </div>
                    </section>

                    <Divider className="my-10" soft/>

                    <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                        <div className="space-y-1">
                            <Subheading>Password</Subheading>
                        </div>
                        <div>
                            <Input type="password"
                                aria-label="Password user"
                                name="password"
                                onChange={handleChange}
                            />
                            <InputError message={errors.password} className="mt-2"/>
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
