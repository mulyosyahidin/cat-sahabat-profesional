import {
    Popover,
    PopoverButton,
    PopoverBackdrop,
    PopoverPanel,
} from '@headlessui/react'
import clsx from 'clsx'

import {Link, router} from "@inertiajs/react";
import {Container} from "@/Components/Salient/Container.jsx";
import Logo from "@/Components/Logo.jsx";

export function Header() {
    return (
        <header className="py-10">
            <Container>
                <nav className="relative z-50 flex justify-between">
                    <div className="flex items-center md:gap-x-12">
                        <Link href="#" aria-label="Home">
                            <img src={'/assets/images/profesional2.png'} alt={'Logo'} className="h-10 w-auto" />
                        </Link>
                    </div>
                    <div className="flex items-center gap-x-5 md:gap-x-8">
                        <div className="hidden md:block">
                            <a href={route('register')}>Daftar</a>
                        </div>
                        <a href={route('login')} className={'group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600'}>
                            <span>Login</span>
                        </a>
                    </div>
                </nav>
            </Container>
        </header>
    )
}
