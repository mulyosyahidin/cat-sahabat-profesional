import { Head, Link } from '@inertiajs/react';
import {Header} from "@/Components/Salient/Header";
import {Hero} from "@/Components/Salient/LandingPage/Hero";
import Keunggulan from "@/Components/Salient/LandingPage/Keunggulan.jsx";
import PaketBelajar from "@/Components/Salient/LandingPage/PaketBelajar.jsx";
import Testimonial from "@/Components/Salient/LandingPage/Testimonial.jsx";
import Footer from "@/Components/Salient/LandingPage/Footer.jsx";
import {Container} from "@/Components/Salient/Container.jsx";

export default function Welcome({ auth }) {
    // return (
    //     <>
    //         <Header />
    //
    //         <main>
    //             <Hero />
    //             <Keunggulan />
    //             <PaketBelajar />
    //             <Testimonial />
    //         </main>
    //
    //         <Footer />
    //     </>
    // )

    return (
        <>
            <Head title={'Web CAT'} />
            <header className="py-10">
                <Container>
                    <nav className="relative z-50 flex justify-between">
                        <div className="flex items-center md:gap-x-12">
                            <Link href="#" aria-label="Home">
                                <img src={'/assets/images/profesional2.png'} alt={'Logo'} className="h-10 w-auto"/>
                            </Link>
                        </div>
                        <div className="flex items-center gap-x-5 md:gap-x-8">
                            <div className="hidden md:block">
                                <a href={route('register')}>Daftar</a>
                            </div>
                            <a href={route('login')}
                               className={'group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600'}>
                                <span>Login</span>
                            </a>
                        </div>
                    </nav>
                </Container>
            </header>

            <main>
                <Container className="pb-16 pt-20 text-center lg:pt-32">
                    <h1 className="mx-auto max-w-4xl font-display text-5xl font-medium tracking-tight text-slate-900 sm:text-7xl">
                <span className="relative whitespace-nowrap text-blue-600">
          <svg
              aria-hidden="true"
              viewBox="0 0 418 42"
              className="absolute left-0 top-2/3 h-[0.58em] w-full fill-blue-300/70"
              preserveAspectRatio="none"
          >
            <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
          </svg>
          <span className="relative">CAT SAHABAT KARIR</span>
        </span>
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-700">
                        Sistem Informasi <i>Computer Assisted Test</i> Sahabat Karir
                    </p>
                    <div className="mt-10 flex justify-center gap-x-6">
                        <a href={route('register')}
                           className={'group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-slate-900 text-white hover:bg-slate-700 hover:text-slate-100 active:bg-slate-800 active:text-slate-300 focus-visible:outline-slate-900'}>Daftar</a>
                    </div>
                </Container>
            </main>
        </>
    )
}
