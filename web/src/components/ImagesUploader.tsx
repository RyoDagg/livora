import { api } from "../lib/api";
import { ListingInput } from "../types/Listing";

function ImagesUploader({
  form,
  setForm,
}: {
  form: ListingInput;
  setForm: (form: ListingInput) => void;
}) {
  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    formData.append("file", files[0]);

    try {
      const { url } = await api("/files/upload", {
        method: "POST",
        body: formData,
        headers: {},
      });

      setForm({ ...form, imageURL: url });
    } catch (error) {
      console.error("Upload failed:", error);
    }
  }

  return (
    <div>
      <input
        onChange={handleUpload}
        type="file"
        name=""
        id="image"
        accept="image/*"
        hidden
      />
      <label
        htmlFor="image"
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
      >
        Upload Image
      </label>
      {form.imageURL && (
        <div className="mt-4">
          <img
            src={form.imageURL}
            alt="Uploaded"
            className="max-w-full h-auto rounded"
          />
        </div>
      )}
    </div>
  );
}

export default ImagesUploader;
