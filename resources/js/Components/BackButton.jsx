import { ChevronLeftIcon } from "@heroicons/react/16/solid";
import {Link, usePage} from "@inertiajs/react";
import './BackButton.css';

export default function BackButton({ link, text = 'Kembali', tooltip = 'Klik untuk kembali', ...props }) {
    return (
        <div className="tooltip-container relative inline-block">
            <Link
                // href={usePage().props.previous_url === 'empty' ? link : usePage().props.previous_url}
                href={link}
                {...props}
                className="inline-flex items-center gap-2 text-sm/6 text-zinc-500 dark:text-zinc-400"
            >
                <ChevronLeftIcon className="size-4 fill-zinc-400 dark:fill-zinc-500" />
                {text}
            </Link>
            {/*<span className="tooltip-text absolute invisible opacity-0 bg-black text-white text-xs py-1 px-2 rounded transition-opacity duration-300">*/}
            {/*    Kembali ke {usePage().props.previous_url === 'empty' ? link : usePage().props.previous_url}*/}
            {/*</span>*/}
        </div>
    );
}
