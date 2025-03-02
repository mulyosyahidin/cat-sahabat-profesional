import {Container} from "@/Components/Salient/Container.jsx";

export default function PaketBelajar() {
    return (
        <section
            id="paket-belajar"
            className="relative overflow-hidden bg-[#1863c7] pb-28 pt-20 sm:py-32"
        >
            <Container className="relative">
                <div className="max-w-2xl md:mx-auto text-center xl:max-w-none">
                    <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl md:text-5xl">
                        #CuriStart
                    </h2>
                    <p className="mt-2 md:mt-6 text-lg tracking-tight text-white">
                        ayo belajar dari sekarang!
                    </p>
                </div>

                <div className="mt-16 grid gap-8 md:gap-12 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
                    <div className="flex flex-col items-center px-4">
                        <div className="bg-[#fae9a6] rounded-full p-6">
                            <img
                                className="h-24 w-24 object-contain rounded-full"
                                src="/assets/images/f-1.png"
                                alt="Keunggulan 1"
                            />
                        </div>
                        <h3 className="mt-2 md:mt-5 text-xl font-semibold text-white">
                            SNBT
                        </h3>
                    </div>

                    <div className="flex flex-col items-center px-4">
                        <div className="bg-[#fae9a6] rounded-full p-6">
                            <img
                                className="h-24 w-24 object-contain rounded-full"
                                src="/assets/images/f-2.png"
                                alt="Keunggulan 1"
                            />
                        </div>
                        <h3 className="mt-2 md:mt-5 text-xl font-semibold text-white">
                            CPNS
                        </h3>
                    </div>

                    <div className="flex flex-col items-center px-4">
                        <div className="bg-[#fae9a6] rounded-full p-6">
                            <img
                                className="h-24 w-24 object-contain rounded-full"
                                src="/assets/images/f-3.png"
                                alt="Keunggulan 1"
                            />
                        </div>
                        <h3 className="mt-2 md:mt-5 text-xl font-semibold text-white">
                            PPPK
                        </h3>
                    </div>

                    <div className="flex flex-col items-center px-4">
                        <div className="bg-[#fae9a6] rounded-full p-6">
                            <img
                                className="h-24 w-24 object-contain rounded-full"
                                src="/assets/images/f-4.png"
                                alt="Keunggulan 1"
                            />
                        </div>
                        <h3 className="mt-2 md:mt-5 text-xl font-semibold text-white">
                            IKADIN
                        </h3>
                    </div>

                    <div className="flex flex-col items-center px-4">
                        <div className="bg-[#fae9a6] rounded-full p-6">
                            <img
                                className="h-24 w-24 object-contain rounded-full"
                                src="/assets/images/f-5.png"
                                alt="Keunggulan 1"
                            />
                        </div>
                        <h3 className="mt-2 md:mt-5 text-xl font-semibold text-white">
                            POLISI
                        </h3>
                    </div>
                </div>
            </Container>
        </section>

    )
}
