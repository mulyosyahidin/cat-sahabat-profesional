import { Editor } from '@tinymce/tinymce-react';
import {useEffect, useRef} from 'react';
import axios from 'axios';
import {usePage} from "@inertiajs/react";

const TinyMCEEditor = ({ value, onChange }) => {
    const {app_url} = usePage().props;
    const editorRef = useRef(null);

    const BASE_URL = app_url;
    const UPLOAD_URL = route('api.file-upload');

    useEffect(() => {
        console.log(BASE_URL)
    }, []);

    return (
        <Editor
            apiKey="mpjiz8kyrbnm9czwyjijsw9aah32immx0d614flkjzxci9c8"
            onInit={(_evt, editor) => (editorRef.current = editor)}
            value={value}
            onEditorChange={onChange}
            init={{
                height: 500,
                menubar: false,
                plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                ],
                toolbar: 'undo redo | blocks | bold italic forecolor | ' +
                    'alignleft aligncenter alignright alignjustify | ' +
                    'bullist numlist outdent indent | image | removeformat | help',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',

                document_base_url: BASE_URL,
                relative_urls: true,
                remove_script_host: true,
                convert_urls: false,

                file_picker_callback: (cb, value, meta) => {
                    const input = document.createElement('input');
                    input.setAttribute('type', 'file');
                    input.setAttribute('accept', 'image/*');

                    input.addEventListener('change', async (e) => {
                        const file = e.target.files[0];
                        const formData = new FormData();
                        formData.append('file', file);

                        try {
                            const response = await axios.post(UPLOAD_URL, formData, {
                                headers: { 'Content-Type': 'multipart/form-data' },
                            });

                            const relativeUrl = response.data.location;

                            cb(relativeUrl, { title: file.name });
                        } catch (error) {
                            console.error("Upload gagal:", error);
                        }
                    });

                    input.click();
                },
            }}
        />
    );
};

export default TinyMCEEditor;
