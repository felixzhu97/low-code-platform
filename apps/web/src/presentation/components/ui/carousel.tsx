"use client"

import * as React from "react"
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react"
import styled from "@emotion/styled"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "./button"

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
} & CarouselProps

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)
  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }
  return context
}

const CarouselRoot = styled.div`
  position: relative;
`

const VisuallyHidden = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
`

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      orientation = "horizontal",
      opts,
      setApi,
      plugins,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
      },
      plugins
    )
    const [canScrollPrev, setCanScrollPrev] = React.useState(false)
    const [canScrollNext, setCanScrollNext] = React.useState(false)

    const onSelect = React.useCallback((api: CarouselApi) => {
      if (!api) return
      setCanScrollPrev(api.canScrollPrev())
      setCanScrollNext(api.canScrollNext())
    }, [])

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev()
    }, [api])

    const scrollNext = React.useCallback(() => {
      api?.scrollNext()
    }, [api])

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault()
          scrollPrev()
        } else if (event.key === "ArrowRight") {
          event.preventDefault()
          scrollNext()
        }
      },
      [scrollPrev, scrollNext]
    )

    React.useEffect(() => {
      if (!api || !setApi) return
      setApi(api)
    }, [api, setApi])

    React.useEffect(() => {
      if (!api) return
      onSelect(api)
      api.on("reInit", onSelect)
      api.on("select", onSelect)
      return () => { api?.off("select", onSelect) }
    }, [api, onSelect])

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api: api,
          opts,
          orientation: orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <CarouselRoot
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={className}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </CarouselRoot>
      </CarouselContext.Provider>
    )
  }
)
Carousel.displayName = "Carousel"

const StyledViewport = styled.div`
  overflow: hidden;
`

const StyledTrack = styled.div<{ orientation?: string }>`
  display: flex;
  height: 100%;
  ${(p) => p.orientation === "vertical"
    ? "flex-direction: column; padding-top: 1rem;"
    : "flex-direction: row; padding-left: 1rem;"}
`

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel()
  return (
    <StyledViewport ref={carouselRef}>
      <StyledTrack
        ref={ref}
        orientation={orientation}
        className={className}
        {...props}
      />
    </StyledViewport>
  )
})
CarouselContent.displayName = "CarouselContent"

const StyledItem = styled.div<{ orientation?: string }>`
  min-width: 0;
  flex-shrink: 0;
  flex-grow: 0;
  flex-basis: 100%;
  ${(p) => p.orientation === "vertical"
    ? "padding-top: 1rem;"
    : "padding-left: 1rem;"}
`

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel()
  return (
    <StyledItem
      ref={ref}
      orientation={orientation}
      role="group"
      aria-roledescription="slide"
      className={className}
      {...props}
    />
  )
})
CarouselItem.displayName = "CarouselItem"

const StyledPrevButton = styled(Button)<{ orientation?: string }>`
  position: absolute;
  height: 2rem;
  width: 2rem;
  border-radius: 9999px;
  ${(p) =>
    p.orientation === "horizontal"
      ? "left: -2.5rem; top: 50%; transform: translateY(-50%);"
      : "top: -2.5rem; left: 50%; transform: translateX(-50%) rotate(90deg);"}
`

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()
  return (
    <StyledPrevButton
      ref={ref}
      orientation={orientation}
      variant={variant}
      size={size}
      className={className}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft size={16} />
      <VisuallyHidden>Previous slide</VisuallyHidden>
    </StyledPrevButton>
  )
})
CarouselPrevious.displayName = "CarouselPrevious"

const StyledNextButton = styled(Button)<{ orientation?: string }>`
  position: absolute;
  height: 2rem;
  width: 2rem;
  border-radius: 9999px;
  ${(p) =>
    p.orientation === "horizontal"
      ? "right: -2.5rem; top: 50%; transform: translateY(-50%);"
      : "bottom: -2.5rem; left: 50%; transform: translateX(-50%) rotate(90deg);"}
`

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel()
  return (
    <StyledNextButton
      ref={ref}
      orientation={orientation}
      variant={variant}
      size={size}
      className={className}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight size={16} />
      <VisuallyHidden>Next slide</VisuallyHidden>
    </StyledNextButton>
  )
})
CarouselNext.displayName = "CarouselNext"

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
}