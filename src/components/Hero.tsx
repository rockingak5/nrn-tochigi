import heroImage from '../assets/hero-mountain.svg'

export default function Hero() {
  return (
    <div className="h-[260px] w-full overflow-hidden sm:h-[400px] lg:h-[600px]">
      <img
        src={heroImage}
        alt="Himalayan mountain at sunset"
        className="h-full w-full object-cover"
      />
    </div>
  )
}
