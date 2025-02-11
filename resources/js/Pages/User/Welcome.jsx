import {Link, useForm, usePage} from "@inertiajs/react";
import BknLayout from "@/Layouts/BknLayout";
import {Dialog, DialogActions, DialogBody, DialogTitle} from "@/Components/Catalyst/dialog";
import {Button} from "@/Components/Catalyst/button";
import {useEffect, useState} from "react";
import {Subheading} from "@/Components/Catalyst/heading";
import {Input} from "@/Components/Catalyst/input";
import InputError from "@/Components/InputError";

export default function UserWelcome({
                                        status,
                                        exam_positions: InitialExamPositions,
                                        has_active_exam_session,
                                        active_exam,
                                        active_exam_position,
                                        active_exam_session,
                                    }) {
    const user = usePage().props.auth.user;

    const [isTakeExamDialogOpen, setIsTakeExamDialogOpen] = useState(false);
    const [examPositions, setExamPositions] = useState(InitialExamPositions);
    const [takeExamStep, setTakeExamStep] = useState(0);
    const [timeLeftInMinute, setTimeLeftInMinute] = useState(0);

    const {data, setData, post, processing, errors, reset} = useForm({
        token: '',
        position_id: '',
    });

    useEffect(() => {
        const activeExamSessionEndAt = active_exam_session?.maximum_duration_end_at;

        if (activeExamSessionEndAt) {
            const updateTimeLeft = () => {
                const endAt = new Date(activeExamSessionEndAt);
                const now = new Date();
                const diff = endAt - now;
                const diffInMinute = Math.max(Math.floor(diff / 1000 / 60), 0);
                setTimeLeftInMinute(diffInMinute);
            };

            updateTimeLeft();

            const intervalId = setInterval(updateTimeLeft, 60000);

            return () => clearInterval(intervalId);
        }
    }, [active_exam_session]);

    const handleChange = (e) => {
        const {name, value} = e.target;

        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    const cancelTakeExam = () => {
        setExamPositions(null);

        reset();
        setIsTakeExamDialogOpen(false);
        setTakeExamStep(0);

        // set errors token to null
        if (errors.token) {
            errors.token = null;
        }
    };

    const submit = () => {
        if (takeExamStep === 0) {
            post(route('user.validate-token'), {
                onSuccess: (page) => {
                    const {exam_positions} = page.props;

                    setTakeExamStep(1);
                    setExamPositions(exam_positions);
                }
            });
        } else if (takeExamStep === 1) {
            post(route('user.take-exam'));
        }
    };

    return (
        <>
            <BknLayout>
                <div className="container pt-5 mb-20 mx-auto max-w-7xl">
                    {
                        status && (
                            <div className="bg-green-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative"
                                 role="alert">
                                <strong className="font-bold">Informasi!</strong>
                                <span className="block sm:inline">{status}</span>
                            </div>
                        )
                    }
                    <div className="bg-white border border-gray-300 rounded-lg shadow-md mb-6">
                        <div className="bg-gray-100 p-4">
                            <h3 className="text-lg font-semibold">Informasi Peserta</h3>
                        </div>
                        <div className="p-4">
                            <div className="flex">
                                <div className="w-1/4 font-small">Nama Lengkap</div>
                                <div className="w-3/4">: {user.name}</div>
                            </div>
                            {user.participant_profile && (
                                <>
                                    <div className="flex">
                                        <div className="w-1/4 font-small">No. HP</div>
                                        <div className="w-3/4">: {user.participant_profile.phone_number}</div>
                                    </div>
                                    <div className="flex">
                                        <div className="w-1/4 font-small">Alamat</div>
                                        <div className="w-3/4">: {user.participant_profile.address}</div>
                                    </div>

                                </>
                            )}
                        </div>
                    </div>

                    {
                        has_active_exam_session && (
                            <div className="bg-white border border-gray-300 rounded-lg shadow-md mb-6">
                                <div className="bg-gray-100 p-4">
                                    <h3 className="text-lg font-semibold">Ujian Sedang Diikuti</h3>
                                </div>
                                <div className="p-4">
                                    <div className="flex">
                                        <div className="w-1/4 font-small">Nama Ujian</div>
                                        <div className="w-3/4">: {active_exam.name}</div>
                                    </div>
                                    <div className="flex">
                                        <div className="w-1/4 font-small">Kode Ujian</div>
                                        <div className="w-3/4">: {active_exam.token}</div>
                                    </div>
                                    <div className="flex">
                                        <div className="w-1/4 font-small">Jabatan Dilamar</div>
                                        <div className="w-3/4">: {active_exam_position.name}</div>
                                    </div>
                                    <div className="flex">
                                        <div className="w-1/4 font-small">Sisa Waktu</div>
                                        <div className="w-3/4">: {timeLeftInMinute} menit</div>
                                    </div>
                                </div>
                            </div>
                        )
                    }

                    <div className="flex gap-1">
                        {
                            has_active_exam_session ? (
                                <Link href={route('user.exams.take', active_exam_session.id)}
                                        className="btn btn-primary py-2 px-4 bg-blue-500 text-white hover:bg-blue-600">
                                    Lanjutkan Ujian
                                </Link>
                            ) : (
                                <button onClick={() => setIsTakeExamDialogOpen(true)}
                                        className="btn btn-primary py-2 px-4 bg-blue-500 text-white hover:bg-blue-600">
                                    Ikuti Ujian
                                </button>
                            )
                        }

                        <Link type="button" href={route('logout')} as={'button'} method={'post'}
                              className="btn btn-primary py-2 px-4 bg-blue-500 text-white hover:bg-blue-600">
                            Keluar
                        </Link>
                    </div>
                </div>
            </BknLayout>

            <Dialog open={isTakeExamDialogOpen} onClose={() => setIsTakeExamDialogOpen(false)}>
                <DialogTitle>Ikuti Ujian</DialogTitle>
                <DialogBody>
                    <section className="grid gap-x-8 gap-y-6 sm:grid-cols-12">
                        <div className="sm:col-span-4 space-y-1">
                            <Subheading>Token</Subheading>
                        </div>
                        <div className="sm:col-span-8">
                            <Input aria-label="Token ujian" name="token" value={data.token} onChange={handleChange}/>
                            <InputError message={errors.token} className="mt-2"/>
                        </div>
                    </section>

                    {examPositions && (
                        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-12 mt-3">
                            <div className="sm:col-span-4 space-y-1">
                                <Subheading>Posisi</Subheading>
                            </div>
                            <div className="sm:col-span-8">
                                <select
                                    name="position_id"
                                    value={data.position_id}
                                    onChange={handleChange}
                                    className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    <option value="">Pilih Posisi Ujian</option>
                                    {examPositions.map((examPosition) => (
                                        <option key={examPosition.id} value={examPosition.id}>
                                            {examPosition.name}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.position_id} className="mt-2"/>
                            </div>
                        </section>
                    )}
                </DialogBody>
                <DialogActions>
                    <Button plain className="cursor-pointer" onClick={cancelTakeExam}>
                        Batal
                    </Button>
                    <Button className="cursor-pointer" onClick={submit} disabled={processing}>
                        {processing ? 'Tunggu...' : 'Ikuti'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

