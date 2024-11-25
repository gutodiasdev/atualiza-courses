"use client";
import {
  ChangeEvent,
  useEffect,
  useState
} from "react";
import {
  toast
} from "sonner";
import {
  useForm
} from "react-hook-form";
import {
  zodResolver
} from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Button
} from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Input
} from "@/components/ui/input";
import {
  Textarea
} from "@/components/ui/textarea";
import { ContentLayout } from "@/components/dashboard/content-layout";
import { useUser } from "@/lib/auth";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAWSUploadImage } from "@/components/dashboard/courses/forms/upload-course-image";
import Image from "next/image";

const formSchema = z.object({
  image: z.string().optional(),
  name: z.string().optional(),
  uniqueIdentifier: z.string().optional(),
  bio: z.string().optional().optional()
});

export default function MyForm() {
  const { user } = useUser();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name,
      image: user?.avatar || "",
      bio: user?.bio || "",
      uniqueIdentifier: user?.uniqueIdentifier || "",
    }
  });

  useEffect(() => {
    if (user?.avatar) setImagePreview(user.avatar);
  }, [user]);

  const upload = useAWSUploadImage();

  const mutation = useMutation({
    mutationKey: ["add_student", user?.id],
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const { imageAwsURL } = await upload.mutateAsync({ image: imageFile as File, userId: user?.id as number });
      await api.put(`/user/${user?.id}`, { ...values, image: imageAwsURL }, { authorization: true });
    },
    onSuccess: () => {
      toast.success("Perfil atualizado com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  async function onSubmit() {
    try {
      await mutation.mutateAsync(form.getValues());
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageFile(file);
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <ContentLayout>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto py-10">
          <div className="flex flex-col justify-center align-middle items-center gap-y-4">
            <FormField
              control={form.control}
              name="image"
              render={({ }) => (
                <FormItem>
                  <FormLabel>Imagem do perfil</FormLabel>
                  <FormControl>
                    <div className="flex flex-col w-full max-w-sm gap-4 y-4 mb-4">
                      {
                        imagePreview ? (
                          <div className="relative mt-4">
                            <div className="relative w-64 h-64 rounded-full overflow-hidden border-2 border-gray-800">
                              <Image src={imagePreview as string} alt="preview" fill objectFit="contain" />
                            </div>
                          </div>
                        ) : null
                      }
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Input type="file" onChange={handleImageChange} className="w-96" />
          </div>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input
                    placeholder="ex.: Jhon Doe"
                    type=""
                    {...field}
                  />
                </FormControl>
                <FormDescription>Insira seu nome, todos na plataforma verão.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="uniqueIdentifier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Identificador único</FormLabel>
                <FormControl>
                  <Input
                    placeholder="ex.: jhondoe"
                    type=""
                    {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder=""
                    className="resize-none min-h-32"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Será mostrado em sua página pessoal</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            variant="outline"
          >
            Atualizar perfil
          </Button>
        </form>
      </Form>
    </ContentLayout>
  );
}