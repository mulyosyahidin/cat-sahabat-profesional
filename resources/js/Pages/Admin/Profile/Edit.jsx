import {Head, router, useForm} from "@inertiajs/react";
import ApplicationLayout from "@/Layouts/ApplicationLayout";
import {Heading, Subheading} from "@/Components/Catalyst/heading";
import {Divider} from "@/Components/Catalyst/divider";
import {Input} from "@/Components/Catalyst/input";
import {Text} from "@/Components/Catalyst/text";
import {Button} from "@/Components/Catalyst/button";
import InputError from "@/Components/InputError";
import {Dialog, DialogActions, DialogBody, DialogTitle} from "@/Components/Catalyst/dialog";
import {Field, Label} from "@/Components/Catalyst/fieldset";
import {useState} from "react";
import {Avatar} from "@/Components/Catalyst/avatar";

export default function AdminProfileEdit({user, success}) {
    const [isUpdateProfilePictureDialogOpen, setIsUpdateProfilePictureDialogOpen] = useState(false);
    const [isUploadingProfilePicture, setIsUploadingProfilePicture] = useState(false);

    const [profilePicture, setProfilePicture] = useState(null);
    const [profilePictureError, setProfilePictureError] = useState(null);

    const {data, setData, patch, processing, errors, reset} = useForm({
        name: user.name,
        email: user.email,
        password: '',
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

        patch(route('admin.profile.update'));
    };

    const handleProfilePictureChange = (e) => {
        setProfilePicture(e.target.files[0]);
    };

    const closeUpdateProfilePictureDialog = () => {
        setIsUpdateProfilePictureDialogOpen(false);
        setProfilePicture(null);

        setProfilePictureError(null);
    }

    const uploadProfilePicture = (e) => {
        e.preventDefault();

        setIsUploadingProfilePicture(true);

        const formData = new FormData();
        formData.append('profile_picture', profilePicture);
        formData.append('_method', 'PATCH');

        router.post(route('admin.profile.profile-picture'), formData, {
            onSuccess: () => {
                setIsUploadingProfilePicture(false);
                setIsUpdateProfilePictureDialogOpen(false);
            },
            onError: (errors) => {
                setProfilePictureError(errors.profile_picture)
                setIsUploadingProfilePicture(false);
            },
        });
    };

    return (
        <>
            <Head title={'Akun Saya'}/>

            <ApplicationLayout>
                <form method="post" className="mx-auto max-w-4xl" onSubmit={submit}>
                    <Heading>Akun Saya</Heading>
                    {success && (
                        <div className="mb-4 mt-2 text-sm font-medium text-green-600">
                            {success}
                        </div>
                    )}
                    <Divider className="my-10 mt-6"/>

                    <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                        <div className="space-y-1">
                            <Subheading>Foto Profil</Subheading>
                        </div>
                        <div className="relative flex items-center space-x-4 w-20">
                            <Avatar
                                src={user.profile_picture_url}
                                className="size-16"
                                square
                                alt="Profile Picture"
                            />
                            <button type={'button'} onClick={() => setIsUpdateProfilePictureDialogOpen(true)}
                                    className="absolute top-0 right-1 bg-gray-800 p-1 rounded-full text-white hover:bg-gray-700"
                                    aria-label="Edit Picture"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="2"
                                    stroke="currentColor"
                                    className="h-4 w-4"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15.232 5.232l3.536 3.536m-2.036-4.036a2.5 2.5 0 113.536 3.536L8.5 20.5l-4 1 1-4L16.732 3.732z"
                                    />
                                </svg>
                            </button>
                        </div>

                    </section>

                    <Divider className="my-10" soft/>

                    <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                        <div className="space-y-1">
                            <Subheading>Nama</Subheading>
                        </div>
                        <div>
                            <Input aria-label="Nama anda" name="name" defaultValue={data.name} onChange={handleChange}/>
                            <InputError message={errors.name} className="mt-2"/>
                        </div>
                    </section>

                    <Divider className="my-10" soft/>

                    <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                        <div className="space-y-1">
                            <Subheading>Email</Subheading>
                        </div>
                        <div>
                            <Input aria-label="Email" name="email" defaultValue={data.email} onChange={handleChange}/>
                            <InputError message={errors.email} className="mt-2"/>
                        </div>
                    </section>

                    <Divider className="my-10" soft/>

                    <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                        <div className="space-y-1">
                            <Subheading>Password</Subheading>
                            <Text>Masukkan password baru jika ingin mengganti password lama</Text>
                        </div>
                        <div>
                            <Input type={'password'} aria-label="Password" name="password" onChange={handleChange}/>
                            <InputError message={errors.password} className="mt-2"/>
                        </div>
                    </section>

                    <Divider className="my-10" soft/>

                    <div className="flex justify-end gap-4">
                        <Button type="submit" className={'cursor-pointer'}>Simpan</Button>
                    </div>
                </form>
            </ApplicationLayout>

            <Dialog open={isUpdateProfilePictureDialogOpen} onClose={setIsUpdateProfilePictureDialogOpen}>
                <DialogTitle>Upload Foto Profil Baru</DialogTitle>

                <DialogBody>
                    <Field>
                        <Label>Pilih foto</Label>
                        <Input type={'file'} name="file" onChange={handleProfilePictureChange}/>

                        {
                            profilePictureError ? (
                                <InputError message={profilePictureError} className="mt-2"/>
                            ) : (
                                <small>Pilih foto JPG atau PNG dengan ukuran maksimal 1MB</small>
                            )
                        }
                    </Field>
                </DialogBody>
                <DialogActions>
                    {!isUploadingProfilePicture && (
                        <Button plain className={'cursor-pointer'}
                                onClick={closeUpdateProfilePictureDialog}>
                            Batal
                        </Button>
                    )}
                    <Button className={'cursor-pointer'} onClick={uploadProfilePicture}>
                        {isUploadingProfilePicture ? 'Tunggu...' : 'Upload'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
