import { useRef, useState } from "react";
import bookIcon from '../assets/book-icon.svg';

interface Props {
    onImageChange?: (file: File) => void;
    initialImage?: string | null;
}

export default function ImageUploader({ onImageChange, initialImage = null }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string>(initialImage || bookIcon);

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            if (onImageChange) {
                onImageChange(file);
            }
        }
    };

    return (
        <div>
            <img
                className="w-[15vw] rounded-xl mt-3 mb-3 cursor-pointer"
                alt="Upload"
                src={preview}
                onClick={handleImageClick}
            />
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
            />
        </div>
    );
}
