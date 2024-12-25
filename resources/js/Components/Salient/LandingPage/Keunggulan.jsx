import {Container} from "@/Components/Salient/Container.jsx";

export default function Keunggulan() {
    return (
        <section
            id="keunggulan"
            className="relative overflow-hidden bg-white pb-28 pt-20 sm:py-32"
        >
            <Container className="relative">
                <div className="max-w-2xl md:mx-auto text-center xl:max-w-none">
                    <h2 className="font-display text-3xl tracking-tight text-black sm:text-4xl md:text-5xl">
                        Bersama Sahabat Karir
                    </h2>
                    <p className="mt-2 md:mt-6 text-lg tracking-tight text-gray-700">
                        bikin belajar kamu jadi lebih seru dan menyenangkan
                    </p>
                </div>

                <div className="mt-16 grid gap-8 md:gap-12 grid-cols-1 lg:grid-cols-4">
                    <div className="flex flex-col items-center px-4">
                        <div className="bg-[#fae9a6] rounded-full p-6">
                            <img
                                className="h-24 w-24 object-contain rounded-full"
                                src="/assets/images/k-1.png"
                                alt="Keunggulan 1"
                            />
                        </div>
                        <h3 className="mt-6 text-xl font-semibold text-black">
                            Tutor Bintang
                        </h3>
                        <p className="mt-2 text-gray-700 text-center">
                            Belajar jadi lebih menyenangkan & mudah dimengerti bersama tutor bintang
                        </p>
                    </div>

                    <div className="flex flex-col items-center px-4">
                        <div className="bg-[#fae9a6] rounded-full p-6">
                            <img
                                className="h-24 w-24 object-contain rounded-full"
                                src="/assets/images/k-2.png"
                                alt="Keunggulan 1"
                            />
                        </div>
                        <h3 className="mt-6 text-xl font-semibold text-black">
                            Materi Terupdate
                        </h3>
                        <p className="mt-2 text-gray-700 text-center">
                            Jangan sia-siakan waktumu dengan belajar materi yang tidak sesuai kisi-kisi
                        </p>
                    </div>

                    <div className="flex flex-col items-center px-4">
                        <div className="bg-[#fae9a6] rounded-full p-6">
                            <img
                                className="h-24 w-24 object-contain rounded-full"
                                src="/assets/images/k-3.png"
                                alt="Keunggulan 1"
                            />
                        </div>
                        <h3 className="mt-6 text-xl font-semibold text-black">
                            Try Out
                        </h3>
                        <p className="mt-2 text-gray-700 text-center">
                            Soal Try Out terupdate dan berstandar Menpan RB
                        </p>
                    </div>

                    <div className="flex flex-col items-center px-4">
                        <div className="bg-[#fae9a6] rounded-full p-6">
                            <img
                                className="h-24 w-24 object-contain rounded-full"
                                src="/assets/images/k-4.png"
                                alt="Keunggulan 1"
                            />
                        </div>
                        <h3 className="mt-6 text-xl font-semibold text-black">
                            Sobat Karir
                        </h3>
                        <p className="mt-2 text-gray-700 text-center">
                            Sharing is caring bersama sobat karir
                        </p>
                    </div>

                </div>

            </Container>
        </section>
    )
}
