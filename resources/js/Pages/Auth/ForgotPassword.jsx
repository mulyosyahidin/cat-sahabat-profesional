import {Head, Link, useForm} from '@inertiajs/react';
import {SlimLayout} from "@/Layouts/SlimLayout.jsx";
import {TextField} from "@/Components/Salient/Fields.jsx";
import Logo from "@/Components/Logo.jsx";
import {Button} from "@/Components/Salient/Buttons.jsx";
import InputError from "@/Components/InputError.jsx";

export default function Login({status}) {
    const {data, setData, post, processing, errors, reset} = useForm({
        email: '',
    });

    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;

        setData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <SlimLayout>
            <Head title="Lupa Password?"/>

            <div className="flex">
                <Link href="/" aria-label="Home">
                    <Logo className="h-10 w-auto"/>
                </Link>
            </div>
            <h2 className="mt-20 text-lg font-semibold text-gray-900">
                Lupa Password?
            </h2>
            {status ? (
                <div className="mb-4 mt-2 text-sm font-medium text-green-600">
                    {status}
                </div>
            ) : (
                <p className="mt-2 text-sm text-gray-700">
                    Masukkan email akun Anda dan kami akan mengirimkan tautan untuk mereset password anda.
                </p>
            )}

            <form onSubmit={submit} className="mt-10 grid grid-cols-1">
                <TextField
                    label="Email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    onChange={handleChange}
                    required
                />
                <InputError message={errors.email} className="mt-2"/>

                <div className={'mt-8'}>
                    <Button type="submit" variant="solid" color="blue" className="w-full">
                        <span>
                            Reset Password
                        </span>
                    </Button>
                </div>
            </form>
        </SlimLayout>
    );
}
