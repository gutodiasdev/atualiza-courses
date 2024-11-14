import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { Course } from "@/lib/@types";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import Image from "next/image";
import Link from "next/link";

type Props = {
  courses: Course[];
};

export function CoursesCarousel(props: Props) {
  const [carouselRef] = useEmblaCarousel({
    dragFree: false
  }, [WheelGesturesPlugin()]);

  return (
    <div className="relative w-full " ref={carouselRef}>
      <Carousel
        className="w-full"
        opts={{
          containScroll: "trimSnaps",
          align: "start",
          startIndex: 1
        }}
      >
        <CarouselContent className="-ml-4">
          {props.courses.map((course, index) => (
            <CarouselItem key={index} className="pl-4 basis-[80%] md:basis-1/2 lg:basis-[18%]">
              <Link key={course.id} href={`/dashboard/aulas/curso/${course.id}`}>
                <div className="rounded-sm overflow-hidden h-[400px] relative hover:scale-105 transition-all ease-linear">
                  <div className="p-4 space-y-4 absolute z-20 w-full bottom-0 text-center bg-gradient-to-t from-black via-black to-transparent min-h-20">
                    <h2 className="text-lg font-semibold">
                      {course.name}
                    </h2>
                  </div>
                  <div className="relative w-auto h-[100%]">
                    <Image src={course.image} alt={course.name} fill style={{ objectFit: "cover" }} />
                  </div>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute top-1/2 left-8 -translate-y-1/2">
          <CarouselPrevious variant="outline" size="icon" className="h-8 w-8 rounded-full " />
        </div>
        <div className="absolute top-1/2 right-8 -translate-y-1/2">
          <CarouselNext variant="outline" size="icon" className="h-8 w-8 rounded-full" />
        </div>
      </Carousel>
    </div>
  );
}