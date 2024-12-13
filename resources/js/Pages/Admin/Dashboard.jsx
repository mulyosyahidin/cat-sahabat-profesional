import {Head} from "@inertiajs/react";
import ApplicationLayout from "@/Layouts/ApplicationLayout";
import {Heading} from "@/Components/Catalyst/heading.jsx";

export default function AdminDashboard({count}) {
    return (
        <>
            <Head title={'Admin Dashboard'} />

            <ApplicationLayout>
                <Heading>
                    CAT Sahabat Profesional
                </Heading>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
                    <div className="bg-white border rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold text-gray-700 mb-2">Formasi</h2>
                        <p className="text-green-500 text-2xl font-bold">{count.formation}</p>
                    </div>

                    <div className="bg-white border rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Ujian</h2>
                        <p className="text-green-500 text-2xl font-bold">{count.exam}</p>
                    </div>

                    <div className="bg-white border rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Peserta Ujian</h2>
                        <p className="text-green-500 text-2xl font-bold">{count.exam_participant}</p>
                    </div>
                </div>
            </ApplicationLayout>
        </>
    )
}
