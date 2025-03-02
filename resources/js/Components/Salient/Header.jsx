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
import {NavLink} from "@/Components/Salient/NavLink.jsx";

function MobileNavLink({href, children}) {
    return (
        <PopoverButton as={Link} href={href} className="block w-full p-2">
            {children}
        </PopoverButton>
    )
}

function MobileNavIcon({open}) {
    return (
        <svg
            aria-hidden="true"
            className="h-3.5 w-3.5 overflow-visible stroke-white"
            fill="none"
            strokeWidth={2}
            strokeLinecap="round"
        >
            <path
                d="M0 1H14M0 7H14M0 13H14"
                className={clsx(
                    'origin-center transition',
                    open && 'scale-90 opacity-0',
                )}
            />
            <path
                d="M2 2L12 12M12 2L2 12"
                className={clsx(
                    'origin-center transition',
                    !open && 'scale-90 opacity-0',
                )}
            />
        </svg>
    )
}

function MobileNavigation() {
    return (
        <Popover>
            <PopoverButton
                className="relative z-10 flex h-8 w-8 items-center justify-center focus:outline-none ui-not-focus-visible:outline-none"
                aria-label="Toggle Navigation"
            >
                {({ open }) => <MobileNavIcon open={open} />}
            </PopoverButton>
            <PopoverBackdrop
                transition
                className="fixed inset-0 bg-blue-600/50 duration-150 data-[closed]:opacity-0 data-[enter]:ease-out data-[leave]:ease-in"
            />
            <PopoverPanel
                transition
                className="absolute inset-x-0 top-full mt-4 flex origin-top flex-col rounded-2xl bg-blue-800 p-4 text-lg tracking-tight text-white shadow-xl ring-1 ring-white/10 data-[closed]:scale-95 data-[closed]:opacity-0 data-[enter]:duration-150 data-[leave]:duration-100 data-[enter]:ease-out data-[leave]:ease-in"
            >
                <MobileNavLink href="#keunggulan">Keunggulan</MobileNavLink>
                <MobileNavLink href="#paket-belajar">Paket Belajar</MobileNavLink>
                <MobileNavLink href="#testimonial">Testimoni</MobileNavLink>
                <hr className="m-2 border-blue-500/40"/>
                <MobileNavLink href="/login">Login</MobileNavLink>
                <MobileNavLink href="/register">Daftar</MobileNavLink>
            </PopoverPanel>
        </Popover>
    );
}

export function Header() {
    return (
        <header className="py-10 bg-[#004aad]">
            <Container>
                <nav className="relative z-50 flex justify-between">
                    <div className="flex items-center md:gap-x-12">
                        <Link href="/" aria-label="Home">
                            <img
                                src={'/assets/images/karir.png'}
                                alt={'Logo'}
                                className="h-10 w-auto bg-white p-2 px-10 rounded"
                            />
                        </Link>
                        <div className="hidden md:flex md:gap-x-6">
                            <NavLink href="#keunggulan">Keunggulan</NavLink>
                            <NavLink href="#paket-belajar">Paket Belajar</NavLink>
                            <NavLink href="#testimonial">Testimoni</NavLink>
                        </div>
                    </div>
                    <div className="flex items-center gap-x-2 md:gap-x-2">
                        <div className="hidden md:block">
                            <a href={route('register')}
                               className={'group inline-flex items-center justify-center rounded py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-white text-blue-600 hover:text-blue-800 hover:bg-gray-100 active:bg-gray-200 active:text-blue-100 focus-visible:outline-blue-600'}>
                                <span>Daftar</span>
                            </a>
                        </div>
                        <div className="hidden md:block">
                            <a href={route('login')}
                               className={'group inline-flex items-center justify-center rounded py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600'}>
                                <span>Login</span>
                            </a>
                        </div>

                        <div className="-mr-1 md:hidden">
                            <MobileNavigation/>
                        </div>
                    </div>
                </nav>
            </Container>
        </header>
    )
}
