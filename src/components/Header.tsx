import { Link } from 'wouter'

export const Header = () => {
  return (
    <h1 className="text-md font-bold uppercase tracking-wider md:text-lg">
      <Link to="/">
        <span className="">Drip</span>
        <span className="text-primary">Wave</span>
      </Link>
    </h1>
  )
}
