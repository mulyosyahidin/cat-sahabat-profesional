import {Head} from "@inertiajs/react";
import ApplicationLayout from "@/Layouts/ApplicationLayout.jsx";
import BackButton from "@/Components/BackButton.jsx";
import {Heading} from "@/Components/Catalyst/heading.jsx";

export default function AdminFormationPositionShow({formation, position, success}) {
    return (
        <>
            <Head title={position.name} />
            <ApplicationLayout>
                <div className="max-lg:hidden">
                    <BackButton link={route('admin.formations.show', formation.id)}/>
                </div>

                <Heading className={'mt-8'}>{position.name}</Heading>
                {success && (
                    <div className="mb-4 mt-2 text-sm font-medium text-green-600">
                        {success}
                    </div>
                )}

            </ApplicationLayout>
        </>
    )
}
