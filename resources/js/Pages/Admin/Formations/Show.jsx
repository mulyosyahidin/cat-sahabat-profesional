import {Head, useForm} from "@inertiajs/react";
import ApplicationLayout from "@/Layouts/ApplicationLayout";
import BackButton from "@/Components/BackButton";
import {Heading} from "@/Components/Catalyst/heading";
import {Button} from "@/Components/Catalyst/button";
import {Table, TableBody, TableCell, TableRow} from "@/Components/Catalyst/table";
import {Dialog, DialogTitle, DialogBody, DialogActions} from "@/Components/Catalyst/dialog";
import {useState} from "react";

export default function AdminPositionShow({formation, success}) {
    const {delete: destroy, processing} = useForm();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const handleDelete = () => {
        destroy(route('admin.formations.destroy', formation.id), {
            onSuccess: () => {
                setIsDeleteDialogOpen(false);
            },
        });
    };

    return (
        <>
            <Head title={formation.name}/>
            <ApplicationLayout>
                <div className="max-lg:hidden">
                    <BackButton link={route('admin.formations.index')}/>
                </div>

                <Heading className={'mt-8'}>Data Formasi</Heading>

                <Table className="mt-8 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
                    <TableBody>
                        <TableRow key={1}>
                            <TableCell>Nama</TableCell>
                            <TableCell>
                                <strong>{formation.name}</strong>
                            </TableCell>
                        </TableRow>

                        <TableRow key={2}>
                            <TableCell>Jumlah Jabatan</TableCell>
                            <TableCell>
                                <strong>0</strong>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                <div className="flex justify-end gap-1 mt-5">
                    <Button
                        href={route('admin.formations.edit', formation.id)}
                        size="small"
                        outline
                        className={'cursor-pointer'}
                    >
                        Edit
                    </Button>
                    <Button
                        color="rose"
                        size="small"
                        outline
                        className={'cursor-pointer'}
                        onClick={() => setIsDeleteDialogOpen(true)}
                    >
                        Hapus
                    </Button>
                </div>

                <Heading className={'mt-20'} level={3}>Jabatan</Heading>
            </ApplicationLayout>

            <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
                <DialogTitle>Hapus Formasi</DialogTitle>
                <DialogBody>
                    <p>
                        Apakah Anda yakin ingin menghapus formasi ini? Menghapus formasi juga akan menghapus data lain
                        yang terkait.
                    </p>
                </DialogBody>
                <DialogActions>
                    <Button
                        plain
                        className="cursor-pointer"
                        onClick={() => setIsDeleteDialogOpen(false)} // Tutup dialog jika batal
                    >
                        Batal
                    </Button>
                    <Button
                        color="rose"
                        className="cursor-pointer text-red-500"
                        onClick={handleDelete}
                        disabled={processing} // Disable tombol saat sedang memproses
                    >
                        {processing ? 'Menghapus...' : 'Hapus'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
