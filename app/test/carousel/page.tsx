import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/Carousel/Carousel";
import { Card, CardContent } from "@/components/ui/Card/Card";
import { Text } from "@/components/ui/Text/Text";

export default function CarouselTestPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <Text variant="h1" className="mb-2">
        Carousel Component Demo
      </Text>
      <Text variant="body" color="muted" className="mb-12">
        Test page for the Builder.io integrated Carousel component
      </Text>

      {/* Basic Carousel */}
      <section className="mb-16">
        <Text variant="h2" className="mb-4">
          Basic Carousel
        </Text>
        <div className="px-12">
          <Carousel opts={{ align: "start" }} className="w-full">
            <CarouselContent>
              {[
                { label: "Slide 1", desc: "This is the first slide with some content", color: "from-blue-500 to-blue-600" },
                { label: "Slide 2", desc: "This is the second slide with different content", color: "from-purple-500 to-purple-600" },
                { label: "Slide 3", desc: "This is the third slide", color: "from-pink-500 to-pink-600" },
              ].map((slide, i) => (
                <CarouselItem key={i}>
                  <Card className={`bg-gradient-to-br ${slide.color} p-6 gap-2`}>
                    <Text variant="h3" className="text-white mb-2">{slide.label}</Text>
                    <Text variant="body" className="text-white/90">{slide.desc}</Text>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>

      {/* Multiple Slides Per View */}
      <section className="mb-16">
        <Text variant="h2" className="mb-4">
          Multiple Slides Per View
        </Text>
        <div className="px-12">
          <Carousel opts={{ align: "start" }} className="w-full">
            <CarouselContent>
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <CarouselItem key={num} className="md:basis-1/3">
                  <Card className="text-center p-0 gap-0">
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <Text variant="h4" className="mb-2">Item {num}</Text>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>

      <div className="mt-16 p-6 bg-muted rounded-lg">
        <Text variant="h3" className="mb-2">
          How to Use in Builder.io
        </Text>
        <Text variant="body" className="mb-4">
          The <code className="bg-background px-2 py-1 rounded">DS Carousel</code>{" "}
          component is now available in the Builder.io visual editor:
        </Text>
        <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
          <li>Open Builder.io and create or edit a page</li>
          <li>Find "DS Carousel" in the components panel</li>
          <li>Drag it onto your page</li>
          <li>Drop any content (images, cards, text, etc.) inside to create slides</li>
          <li>Configure options like navigation, autoplay in the right panel</li>
        </ul>
      </div>
    </div>
  );
}
