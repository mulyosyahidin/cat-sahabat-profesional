import ApplicationLayout from "@/Layouts/ApplicationLayout";
import {Head} from "@inertiajs/react";
import BackButton from "@/Components/BackButton";;
import {Heading, Subheading} from "@/Components/Catalyst/heading";
import FiveAndZeroType from "@/Pages/Admin/AnswerOptions/partials/FiveAndZeroType/FiveAndZeroType";
import FiveToOneType from "@/Pages/Admin/AnswerOptions/partials/FiveToOneType/FiveToOneType";

export default function AdminAnswerOptionsIndex({question, newOptionId, success}) {
    return (
        <>
            <Head title={'Kelola Pilihan Jawaban'}/>
            <ApplicationLayout>
                <BackButton
                    link={route('admin.questions.index', {question_type_id: question.question_type_id})}/>

                <Heading className={'mt-8'}>Pilihan Jawaban</Heading>
                {success && (
                    <div className="mb-4 mt-2 text-sm font-medium text-green-600">
                        {success}
                    </div>
                )}

                <div className="mt-8 shadow p-5 rounded-lg">
                    <Subheading level={4}>Pertanyaan</Subheading>
                    <div className="mt-2">
                        {question.question}
                    </div>
                </div>

                {
                    question.question_type.weighting_type === 'FIVE_AND_ZERO' ?
                        <FiveAndZeroType question={question} newOptionId={newOptionId}/>
                        : <FiveToOneType question={question} newOptionId={newOptionId}/>
                }

            </ApplicationLayout>
        </>
    )
}
