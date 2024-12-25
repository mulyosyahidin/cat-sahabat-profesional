import {Container} from "@/Components/Salient/Container.jsx";
import {Button} from "@/Components/Salient/Buttons.jsx";
import {ArrowRightIcon} from "@heroicons/react/24/outline/index.js";

export function Hero() {
    return (
        <div className={'bg-[#004aad]'}>
            <img
                className="absolute left-1/2 top-1/2 max-w-none translate-x-[-44%] translate-y-[-42%] z-0"
                src={'/assets/images/background-features.jpg'}
                alt=""
                width={2245}
                height={1636}
            />
            <Container className="pb-16 pt-10 lg:pt-20 relative z-10">
                <div className="lg:grid lg:grid-cols-2 lg:gap-16">
                    <div className="text-center lg:text-left">
                        <h1 className="text-3xl font-medium text-white sm:text-5xl">
                            Wujudkan Mimpimu Bersama Bimbel Sahabat Karir
                        </h1>
                        <p className="mt-6 text-lg text-white">
                            Belajar seru bersama tutor bintang dan sobat karir!
                        </p>

                        <div className="mt-10 flex justify-center lg:justify-start relative">
                            <a
                                href={route('register')}
                                className="group inline-flex items-center justify-center py-2 px-4 text-sm font-semibold text-white bg-[#ccb104] hover:bg-yellow-400 shadow-[10px_10px_0px_0px_#ffffff]"
                            >
                                Daftar Sekarang <ArrowRightIcon className="w-5 h-5 ml-2"/>
                            </a>
                        </div>
                    </div>

                    <div className="mt-10 lg:mt-0">
                        <div className="relative max-w-xs px-2.5 lg:max-w-none">
                            <img
                                src="/assets/images/hero-image-white.jpg"
                                alt="Hero Image"
                                className="relative z-10 aspect-square rotate-3 rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800 lg:hidden"
                            />
                            <img
                                src="/assets/images/hero-image.jpg"
                                alt="Hero Image"
                                className="relative z-10 aspect-square rotate-3 rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800 hidden lg:block"
                            />

                            <div
                                className="absolute hidden md:block inset-0 z-0 rotate-6 rounded-2xl bg-zinc-200 dark:bg-zinc-700 -translate-x-2 translate-y-2"></div>
                            <div
                                className="absolute hidden md:block inset-0 z-0 rotate-12 rounded-2xl bg-zinc-300 dark:bg-zinc-600 -translate-x-4 translate-y-4"></div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}

