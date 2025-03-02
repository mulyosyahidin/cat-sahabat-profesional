import {Dialog, DialogActions, DialogBody, DialogTitle} from "@/Components/Catalyst/dialog";
import {Table, TableBody, TableCell, TableRow} from "@/Components/Catalyst/table";
import {Button} from "@/Components/Catalyst/button";
import {WEIGHTING_TYPES} from "@/utils/utils.js";

export default function QuestionTypeOverviewDialog({isInfoDialogOpen, setIsInfoDialogOpen, questionType}) {
    return (
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
                                <strong>{WEIGHTING_TYPES[questionType.weighting_type]}</strong>
                            </TableCell>
                        </TableRow>

                        <TableRow key={3}>
                            <TableCell>Jabatan</TableCell>
                            <TableCell>
                                <strong>{questionType.position.name}</strong>
                            </TableCell>
                        </TableRow>

                        <TableRow key={4}>
                            <TableCell>Formasi</TableCell>
                            <TableCell>
                                <strong>{questionType.position.formation.name}</strong>
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
    )
}
