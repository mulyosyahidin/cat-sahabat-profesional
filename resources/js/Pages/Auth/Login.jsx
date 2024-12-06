import {Head, Link, useForm} from '@inertiajs/react';
import {SlimLayout} from "@/Layouts/SlimLayout.jsx";
import {TextField} from "@/Components/Salient/Fields.jsx";
import Logo from "@/Components/Logo.jsx";
import {Button} from "@/Components/Salient/Buttons.jsx";
import InputError from "@/Components/InputError.jsx";
import Checkbox from "@/Components/Checkbox.jsx";

export default function Login({status, canResetPassword}) {
    const {data, setData, post, processing, errors, reset} = useForm({
        email: '',
        password: '',
        remember: false,
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

        post(route('login'));
    };

    return (
        <SlimLayout>
            <Head title="Login"/>

            <div className="flex">
                <Link href="/" aria-label="Home">
                    <Logo className="h-10 w-auto"/>
                </Link>
            </div>
            <h2 className="mt-20 text-lg font-semibold text-gray-900">
                Login dengan email dan password
            </h2>

            {status ? (
                <div className="mb-4 mt-2 text-sm font-medium text-green-600">
                    {status}
                </div>
            ) : (
                <p className="mt-2 text-sm text-gray-700">
                    Belum punya akun?{' '}
                    <Link
                        href="/register"
                        className="font-medium text-blue-600 hover:underline"
                    >
                        Daftar disini
                    </Link>{' '}
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

                <TextField
                    label="Password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    className={'mt-8'}
                    onChange={handleChange}
                    required
                />
                <InputError message={errors.password} className="mt-2"/>

                <div className="mt-4 flex justify-between items-center">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={handleChange}
                        />
                        <span className="ms-2 text-sm text-gray-600 dark:text-gray-400">
                            Ingat Saya
                        </span>
                    </label>
                    {/* Link untuk Lupa Password */}
                    {canResetPassword && (
                        <div>
                            <Link
                                href="/forgot-password"
                                className="text-sm text-blue-600 hover:underline"
                            >
                                Lupa password?
                            </Link>
                        </div>
                    )}
                </div>

                <div className={'mt-8'}>
                    <Button type="submit" variant="solid" color="blue" className="w-full">
                        <span>
                            Login
                        </span>
                    </Button>
                </div>
            </form>
        </SlimLayout>
    );
}
