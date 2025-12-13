import { Link, useLocation } from 'react-router-dom'
import { connectWallet } from '../Blockchain.Services'
import { useGlobalState, truncate } from '../store'
import { ROUTES } from '../constants'

const Header = () => {
  const [connectedAccount] = useGlobalState('connectedAccount')
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path ? 'text-[#e32970] font-bold border-b-2 border-[#e32970]' : 'text-white hover:text-[#e32970]'
  }

  return (
    <nav className="w-4/5 flex md:justify-center justify-between items-center py-4 mx-auto">
      <div className="md:flex-[0.5] flex-initial justify-center items-center">
        <Link to={ROUTES.HOME}>
          <h1 className="text-3xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            ObsidianVerse
          </h1>
        </Link>
      </div>

      <ul className="md:flex-[0.5] text-white md:flex hidden list-none flex-row justify-between items-center">
        <li className={`mx-4 cursor-pointer ${isActive(ROUTES.HOME)}`}>
          <Link to={ROUTES.HOME}>Home</Link>
        </li>
        <li className={`mx-4 cursor-pointer ${isActive(ROUTES.MARKETPLACE)}`}>
          <Link to={ROUTES.MARKETPLACE}>Market</Link>
        </li>
        <li className={`mx-4 cursor-pointer ${isActive(ROUTES.AUCTIONS)}`}>
          <Link to={ROUTES.AUCTIONS}>Auctions</Link>
        </li>
        <li className={`mx-4 cursor-pointer ${isActive(ROUTES.MYSTERY_BOX)}`}>
          <Link to={ROUTES.MYSTERY_BOX}>Mystery Box</Link>
        </li>
      </ul>

      {connectedAccount ? (
        <Link
          to={ROUTES.PROFILE}
          className="flex items-center gap-2 shadow-xl shadow-black 
               bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-full cursor-pointer"
        >
          <img
            src={`https://api.dicebear.com/9.x/identicon/svg?seed=${connectedAccount}`}
            alt="avatar"
            className="w-8 h-8 rounded-full"
          />
          <span className="text-white md:text-xs">
            {truncate(connectedAccount, 4, 4, 11)}
          </span>
        </Link>
      ) : (
        <button
          className="shadow-xl shadow-black text-white bg-[#e32970] hover:bg-[#bd255f] md:text-xs p-2 rounded-full cursor-pointer"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      )}
    </nav>
  )
}

export default Header
