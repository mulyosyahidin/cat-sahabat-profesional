import {ChevronLeftIcon} from "@heroicons/react/16/solid";
import {Link} from "@inertiajs/react";

export default function BackButton({link, text = 'Kembali', ...props}) {
    return (
        <Link href={link} {...props}
              className="inline-flex items-center gap-2 text-sm/6 text-zinc-500 dark:text-zinc-400">
            <ChevronLeftIcon className="size-4 fill-zinc-400 dark:fill-zinc-500"/>
            {text}
        </Link>
    )
}
