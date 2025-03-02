import {ChevronRightIcon} from "@heroicons/react/16/solid";
import {Link} from "@inertiajs/react";

export default function NextButton({link, text = 'Selanjutnya', ...props}) {
    return (
        <Link href={link} {...props}
              className="inline-flex items-center gap-2 text-sm/6 text-zinc-500 dark:text-zinc-400">
            {text}
            <ChevronRightIcon className="size-4 fill-zinc-400 dark:fill-zinc-500"/>
        </Link>
    )
}
