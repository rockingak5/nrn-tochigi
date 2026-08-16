import logo from '../assets/logo.svg'

type BrandProps = {
  logoClassName?: string
  textClassName?: string
}

export default function Brand({
  logoClassName = 'h-14 w-14 sm:h-16 sm:w-16',
  textClassName = 'text-xl font-extrabold tracking-wide text-white sm:text-3xl',
}: BrandProps) {
  return (
    <div className="flex items-center gap-3 sm:gap-4">
      <img src={logo} alt="NRNA Tochigi logo" className={`shrink-0 ${logoClassName}`} />
      <span className={textClassName}>NRNA TOCHIGI</span>
    </div>
  )
}
