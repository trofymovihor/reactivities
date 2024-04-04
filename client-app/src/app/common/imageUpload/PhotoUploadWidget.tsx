import { Button, Grid, Header } from "semantic-ui-react";
import PhotoUploadWidgetDropzone from "./PhotoUploadWidgetDropzone";
import { useEffect, useState } from "react";
import PhotoWidgetCropper from "./PhotoWidgetCropper";

interface Props{
    uploadPhoto: (file: Blob)=>void;
    loading: boolean;
}

export default function PhotoUploadWidget({uploadPhoto, loading}: Props) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [files, setFiles] = useState<any>([]);
    const [cropper, setCropper] = useState<Cropper>();

    function onCrop() {
        if (cropper) {
            cropper.getCroppedCanvas().toBlob(blob => uploadPhoto(blob!));
        }
    }

    useEffect(() => {
        return () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            files.forEach((file: any) => URL.revokeObjectURL(file.preview))
        }
    }, [files])

    return (
        <Grid>
            <Grid.Column width={4}>
                <Header sub color="teal" content='Step 1 - Add Photo' />
                <PhotoUploadWidgetDropzone setFiles={setFiles} />
            </Grid.Column>
            <Grid.Column width={1} />
            <Grid.Column width={4}>
                <Header sub color="teal" content='Step 2 - Resize Image' />
                {files && files.length > 0 && (
                    <PhotoWidgetCropper setCropper={setCropper} imagePreview={files[0].preview} />
                )}
            </Grid.Column>
            <Grid.Column width={1} />
            <Grid.Column width={4}>
                    <Header sub color='teal' content='Step 3 - Preview & Upload' />
                    <div className="img-preview" style={{ minHeight: 200, overflow: 'hidden' }} />
                    <Button.Group widths={2}>
                        <Button loading={loading} onClick={onCrop} positive icon='check' />
                        <Button disabled={loading} onClick={() => setFiles([])} icon='close' />
                    </Button.Group>
                </Grid.Column>
        </Grid>
    )
}