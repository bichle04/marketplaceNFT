import { Link } from 'react-router-dom'
import { ROUTES } from '../constants'

const Footer = () => (
  <div className="w-full flex flex-col justify-between md:justify-center items-center gradient-bg-footer p-4">
    <div className="w-full flex sm:flex-row flex-col justify-between items-center my-4">
      <div className="flex flex-[0.25] justify-center items-center">
        <h2 className="text-xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500" style={{ fontFamily: "'Orbitron', sans-serif" }}>
          ObsidianVerse
        </h2>
      </div>

      <div className="flex flex-1 justify-evenly items-center flex-wrap sm:mt-0 mt-5 w-full text-white text-base text-center">
        <Link to={ROUTES.MARKETPLACE} className="cursor-pointer hover:text-[#e32970]">Market</Link>
        <Link to={ROUTES.AUCTIONS} className="cursor-pointer hover:text-[#e32970]">Auctions</Link>
        <Link to={ROUTES.MYSTERY_BOX} className="cursor-pointer hover:text-[#e32970]">Mystery Box</Link>
        <Link to={ROUTES.PROFILE} className="cursor-pointer hover:text-[#e32970]">My Profile</Link>
      </div>

      <div className="flex flex-[0.25] justify-center items-center">
        <p className="text-white text-right text-xs">
          &copy; 2025 ObsidianVerse
        </p>
      </div>
    </div>
  </div>
)

export default Footer
