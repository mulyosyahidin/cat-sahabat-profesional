import {Head, Link} from "@inertiajs/react";
import BknLayout from "@/Layouts/BknLayout.jsx";

export default function UserWelcome() {
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
                                <div className="w-1/4 font-medium">Nama Ujian</div>
                                <div className="w-3/4">: SIMULASI</div>
                            </div>
                            <div className="flex">
                                <div className="w-1/4 font-medium">Kode Ujian</div>
                                <div className="w-3/4">: SIMULASI</div>
                            </div>
                            <div className="flex">
                                <div className="w-1/4 font-medium">Lokasi</div>
                                <div className="w-3/4">: -</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-300 rounded-lg shadow-md mb-6">
                        <div className="bg-gray-100 p-4">
                            <h3 className="text-lg font-semibold">Informasi Peserta</h3>
                        </div>
                        <div className="p-4">
                            <div className="flex">
                                <div className="w-1/4 font-medium">Nama Lengkap</div>
                                <div className="w-3/4">: Martin Mulyo Syahidin</div>
                            </div>
                            <div className="flex">
                                <div className="w-1/4 font-medium">Email</div>
                                <div className="w-3/4">: martinms.za@gmail.com</div>
                            </div>
                            <div className="flex">
                                <div className="w-1/4 font-medium">Jenis Kelamin</div>
                                <div className="w-3/4">: Laki-Laki</div>
                            </div>
                            <div className="flex">
                                <div className="w-1/4 font-medium">Tempat Lahir</div>
                                <div className="w-3/4">: Muko muko</div>
                            </div>
                            <div className="flex">
                                <div className="w-1/4 font-medium">Tanggal Lahir</div>
                                <div className="w-3/4">: 12 July 2000</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-1">
                        <button type="button"
                                className="btn btn-primary py-2 px-4 bg-blue-500 text-white hover:bg-blue-600">
                            Mulai Ujian
                        </button>

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
