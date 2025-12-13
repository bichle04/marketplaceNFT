import timelessLogo from '../assets/timeless.png'
import { Link } from 'react-router-dom'

const Footer = () => (
  <div className="w-full flex flex-col justify-between md:justify-center items-center gradient-bg-footer p-4">
    <div className="w-full flex sm:flex-row flex-col justify-between items-center my-4">
      <div className="flex flex-[0.25] justify-center items-center">
        <img src={timelessLogo} alt="logo" className="w-32" />
      </div>

      <div className="flex flex-1 justify-evenly items-center flex-wrap sm:mt-0 mt-5 w-full text-white text-base text-center">
        <Link to="/market" className="cursor-pointer hover:text-[#e32970]">Market</Link>
        <Link to="/auctions" className="cursor-pointer hover:text-[#e32970]">Auctions</Link>
        <Link to="/mystery-box" className="cursor-pointer hover:text-[#e32970]">Mystery Box</Link>
        <Link to="/profile" className="cursor-pointer hover:text-[#e32970]">My Profile</Link>
      </div>

      <div className="flex flex-[0.25] justify-center items-center">
        <p className="text-white text-right text-xs">
          &copy; 2025 Timeless NFTs
        </p>
      </div>
    </div>
  </div>
)

export default Footer
