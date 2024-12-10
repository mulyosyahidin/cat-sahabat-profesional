import BknLayout from "@/Layouts/BknLayout";
import {Link, usePage} from "@inertiajs/react";
import {useEffect} from "react";

export default function UserExamResult({exam, examSession, examParticipant}) {
    const user = usePage().props.auth.user;

    useEffect(() => {
        console.log(examSession.type_scores)
    }, []);

    return (
        <BknLayout title={'HASIL SIMULASI'}>
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
                        <div className="flex mb-5">
                            <div className="w-1/4 font-small">Email</div>
                            <div className="w-3/4">: {user.email}</div>
                        </div>
                        {examSession.type_scores.map((typeScore, index) => (
                            <div className="flex" key={index}>
                                <div className="w-1/4 font-small">Nilai {typeScore.question_type.name}</div>
                                <div className="w-3/4">: {typeScore.score}</div>
                            </div>
                        ))}
                        <div className="flex mt-5">
                            <div className="w-1/4 font-small">Total Skor</div>
                            <div className="w-3/4">: {examSession.total_score}</div>
                        </div>
                    </div>
                    <p className="mt-2 p-4 text-center">
                        Terima kasih atas partisipasi Anda.

                        <div className="mt-2">
                            <Link type="button" href={route('logout')} as={'button'} method={'post'}
                                  className="btn btn-primary py-2 px-4 bg-red-500 text-white hover:bg-red-600">
                                Keluar
                            </Link>
                        </div>
                    </p>
                </div>
            </div>
        </BknLayout>
    );
}
