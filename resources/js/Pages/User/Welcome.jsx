import {Head, Link, usePage} from "@inertiajs/react";
import BknLayout from "@/Layouts/BknLayout.jsx";

export default function UserWelcome({exam, examParticipant}) {
    const user = usePage().props.auth.user;

    return (
        <>
            <BknLayout>
                <div className="container pt-5 mb-20 mx-auto max-w-7xl">
                    <div className="bg-white border border-gray-300 rounded-lg shadow-md mb-6">
                        <div className="bg-gray-100 p-4">
                            <h3 className="text-lg font-semibold">Informasi Ujian</h3>
                        </div>
                        <div className="p-4">
                            <div className="flex">
                                <div className="w-1/4 font-small">Nama Ujian</div>
                                <div className="w-3/4">: {exam.name}</div>
                            </div>
                            <div className="flex">
                                <div className="w-1/4 font-small">Kode Ujian</div>
                                <div className="w-3/4">: {exam.token}</div>
                            </div>
                            <div className="flex">
                                <div className="w-1/4 font-small">Jabatan Dilamar</div>
                                <div className="w-3/4">: {examParticipant.position.name}</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-300 rounded-lg shadow-md mb-6">
                        <div className="bg-gray-100 p-4">
                            <h3 className="text-lg font-semibold">Informasi Peserta</h3>
                        </div>
                        <div className="p-4">
                            <div className="flex">
                                <div className="w-1/4 font-small">Nama Lengkap</div>
                                <div className="w-3/4">: {user.name}</div>
                            </div>
                            <div className="flex">
                                <div className="w-1/4 font-small">Email</div>
                                <div className="w-3/4">: {user.email}</div>
                            </div>
                            <div className="flex">
                                <div className="w-1/4 font-small">No. HP</div>
                                <div className="w-3/4">: {user.participant_profile.phone_number}</div>
                            </div>
                            <div className="flex">
                                <div className="w-1/4 font-small">Alamat</div>
                                <div className="w-3/4">: {user.participant_profile.address}</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-1">
                        <Link href={route('user.exams.index')}
                                className="btn btn-primary py-2 px-4 bg-blue-500 text-white hover:bg-blue-600">
                            Mulai Ujian
                        </Link>

                        <Link type="button" href={route('logout')} as={'button'} method={'post'}
                                className="btn btn-primary py-2 px-4 bg-blue-500 text-white hover:bg-blue-600">
                            Batal Ujian
                        </Link>
                    </div>
                </div>

            </BknLayout>
        </>
    );
}
