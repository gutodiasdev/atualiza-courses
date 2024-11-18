import { useMutation } from "@tanstack/react-query";
import axios from "axios";

type UploadImageInput = {
  userId: number;
  image: string | File;
};

export const useAWSUploadImage = () => {
  return useMutation({
    mutationFn: async (input: UploadImageInput) => {
      const bodyFormData = new FormData();
      bodyFormData.append("image", input.image);
      bodyFormData.append("userId", String(input.userId));
      const result = await axios.post("/api/s3-upload", bodyFormData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      return { imageAwsURL: result.data.url };
    }
  });
};