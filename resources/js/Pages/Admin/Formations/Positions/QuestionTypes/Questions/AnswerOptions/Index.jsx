import ApplicationLayout from "@/Layouts/ApplicationLayout";
import {Head} from "@inertiajs/react";
import BackButton from "@/Components/BackButton";
import {
    InformationCircleIcon,
} from "@heroicons/react/24/outline/index.js";
import {useEffect, useState} from "react";
import {Dialog, DialogActions, DialogBody, DialogTitle} from "@/Components/Catalyst/dialog";
import {Table, TableBody, TableCell, TableRow} from "@/Components/Catalyst/table";
import {Button} from "@/Components/Catalyst/button";
import {Heading, Subheading} from "@/Components/Catalyst/heading";
import FiveAndZeroType
    from "@/Pages/Admin/Formations/Positions/QuestionTypes/Questions/AnswerOptions/partials/FiveAndZeroType/FiveAndZeroType";
import FiveToOneType
    from "@/Pages/Admin/Formations/Positions/QuestionTypes/Questions/AnswerOptions/partials/FiveToOneType/FiveToOneType";

export default function AdminFormationPositionQuestionAnswerOptionsIndex({
                                                                             formation,
                                                                             position,
                                                                             questionType,
                                                                             question,
                                                                             meta,
                                                                             newOptionId,
                                                                             success
                                                                         }) {
    const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false);

    return (
        <>
            <Head title={'Kelola Pilihan Jawaban'}/>
            <ApplicationLayout>
                <div className="max-lg:hidden flex justify-between">
                    <BackButton
                        link={route('admin.formation.position.question-type.questions.index', [formation.id, position.id, questionType.id])}/>

                    <InformationCircleIcon className={'size-4 cursor-pointer'}
                                           onClick={() => setIsInfoDialogOpen(true)}/>
                </div>

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
                    questionType.weighting_type === 'FIVE_AND_ZERO' ?
                        <FiveAndZeroType formation={formation} position={position} question={question} questionType={questionType} newOptionId={newOptionId} />
                        : <FiveToOneType formation={formation} position={position} question={question} questionType={questionType} newOptionId={newOptionId}  />
                }

            </ApplicationLayout>

            <Dialog open={isInfoDialogOpen} onClose={() => setIsInfoDialogOpen(false)} size={'xl'}>
                <DialogTitle>Jenis Soal</DialogTitle>
                <DialogBody>
                    <Table className="[--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
                        <TableBody>
                            <TableRow key={1}>
                                <TableCell>Jenis Soal</TableCell>
                                <TableCell>
                                    <strong>{questionType.name}</strong>
                                </TableCell>
                            </TableRow>

                            <TableRow key={2}>
                                <TableCell>Jenis Pembobotan</TableCell>
                                <TableCell>
                                    <strong>{questionType.weighting_type}</strong>
                                </TableCell>
                            </TableRow>

                            <TableRow key={3}>
                                <TableCell>Jabatan</TableCell>
                                <TableCell>
                                    <strong>{position.name}</strong>
                                </TableCell>
                            </TableRow>

                            <TableRow key={4}>
                                <TableCell>Formasi</TableCell>
                                <TableCell>
                                    <strong>{formation.name}</strong>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </DialogBody>
                <DialogActions>
                    <Button
                        className="cursor-pointer"
                        onClick={() => setIsInfoDialogOpen(false)}
                    >
                        Tutup
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
