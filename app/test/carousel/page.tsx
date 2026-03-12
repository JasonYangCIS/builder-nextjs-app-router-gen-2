import { Carousel } from "@/components/design-system";
import { Card } from "@/components/design-system";
import { Typography } from "@/components/design-system";

export default function CarouselTestPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <Typography variant="h1" className="mb-2">
        Carousel Component Demo
      </Typography>
      <Typography variant="body" color="muted" className="mb-12">
        Test page for the Builder.io integrated Carousel component
      </Typography>

      {/* Basic Carousel */}
      <section className="mb-16">
        <Typography variant="h2" className="mb-4">
          Basic Carousel
        </Typography>
        <Carousel navigation pagination>
          <Card padding="lg" className="bg-gradient-to-br from-blue-500 to-blue-600">
            <Typography variant="h3" className="text-white mb-2">
              Slide 1
            </Typography>
            <Typography variant="body" className="text-white/90">
              This is the first slide with some content
            </Typography>
          </Card>
          <Card padding="lg" className="bg-gradient-to-br from-purple-500 to-purple-600">
            <Typography variant="h3" className="text-white mb-2">
              Slide 2
            </Typography>
            <Typography variant="body" className="text-white/90">
              This is the second slide with different content
            </Typography>
          </Card>
          <Card padding="lg" className="bg-gradient-to-br from-pink-500 to-pink-600">
            <Typography variant="h3" className="text-white mb-2">
              Slide 3
            </Typography>
            <Typography variant="body" className="text-white/90">
              This is the third slide
            </Typography>
          </Card>
        </Carousel>
      </section>

      {/* Autoplay Carousel */}
      <section className="mb-16">
        <Typography variant="h2" className="mb-4">
          Autoplay Carousel
        </Typography>
        <Carousel autoplay autoplayDelay={2000} loop navigation pagination>
          <div className="bg-gradient-to-r from-orange-400 to-red-500 p-12 rounded-lg text-center">
            <Typography variant="h3" className="text-white mb-2">
              Auto Slide 1
            </Typography>
            <Typography variant="body" className="text-white/90">
              This carousel auto-plays every 2 seconds
            </Typography>
          </div>
          <div className="bg-gradient-to-r from-green-400 to-teal-500 p-12 rounded-lg text-center">
            <Typography variant="h3" className="text-white mb-2">
              Auto Slide 2
            </Typography>
            <Typography variant="body" className="text-white/90">
              Hover to pause autoplay
            </Typography>
          </div>
          <div className="bg-gradient-to-r from-indigo-400 to-purple-500 p-12 rounded-lg text-center">
            <Typography variant="h3" className="text-white mb-2">
              Auto Slide 3
            </Typography>
            <Typography variant="body" className="text-white/90">
              Loops continuously
            </Typography>
          </div>
        </Carousel>
      </section>

      {/* Multiple Slides Per View */}
      <section className="mb-16">
        <Typography variant="h2" className="mb-4">
          Multiple Slides Per View
        </Typography>
        <Carousel slidesPerView={3} spaceBetween={20} navigation pagination>
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <Card key={num} padding="md" shadow="md" className="text-center">
              <Typography variant="h4" className="mb-2">
                Item {num}
              </Typography>
              <Typography variant="body-sm" color="muted">
                Slide content
              </Typography>
            </Card>
          ))}
        </Carousel>
      </section>

      {/* Fade Effect */}
      <section className="mb-16">
        <Typography variant="h2" className="mb-4">
          Fade Effect Carousel
        </Typography>
        <Carousel effect="fade" navigation pagination minHeight={400}>
          <div className="h-full bg-gradient-to-br from-yellow-300 to-orange-400 p-16 flex items-center justify-center rounded-lg">
            <div className="text-center">
              <Typography variant="display" className="text-white mb-4">
                Fade 1
              </Typography>
              <Typography variant="body-lg" className="text-white/90">
                Smooth fade transition
              </Typography>
            </div>
          </div>
          <div className="h-full bg-gradient-to-br from-cyan-400 to-blue-500 p-16 flex items-center justify-center rounded-lg">
            <div className="text-center">
              <Typography variant="display" className="text-white mb-4">
                Fade 2
              </Typography>
              <Typography variant="body-lg" className="text-white/90">
                Between slides
              </Typography>
            </div>
          </div>
          <div className="h-full bg-gradient-to-br from-rose-400 to-red-500 p-16 flex items-center justify-center rounded-lg">
            <div className="text-center">
              <Typography variant="display" className="text-white mb-4">
                Fade 3
              </Typography>
              <Typography variant="body-lg" className="text-white/90">
                Elegant effect
              </Typography>
            </div>
          </div>
        </Carousel>
      </section>

      {/* Centered Slides */}
      <section className="mb-16">
        <Typography variant="h2" className="mb-4">
          Centered Slides
        </Typography>
        <Carousel
          slidesPerView={2.5}
          spaceBetween={30}
          centeredSlides
          loop
          navigation
          pagination
        >
          {["A", "B", "C", "D", "E", "F"].map((letter) => (
            <Card
              key={letter}
              padding="lg"
              shadow="lg"
              className="bg-gradient-to-br from-indigo-500 to-purple-600 text-center"
            >
              <Typography variant="display" className="text-white">
                {letter}
              </Typography>
            </Card>
          ))}
        </Carousel>
      </section>

      <div className="mt-16 p-6 bg-zinc-100 rounded-lg">
        <Typography variant="h3" className="mb-2">
          How to Use in Builder.io
        </Typography>
        <Typography variant="body" className="mb-4">
          The <code className="bg-white px-2 py-1 rounded">DS Carousel</code>{" "}
          component is now available in the Builder.io visual editor:
        </Typography>
        <ul className="list-disc list-inside space-y-2 text-sm text-zinc-700">
          <li>Open Builder.io and create or edit a page</li>
          <li>Find "DS Carousel" in the components panel</li>
          <li>Drag it onto your page</li>
          <li>Drop any content (images, cards, text, etc.) inside to create slides</li>
          <li>Configure options like navigation, pagination, autoplay in the right panel</li>
          <li>Adjust slidesPerView, spaceBetween, effect, and other settings</li>
        </ul>
      </div>
    </div>
  );
}
